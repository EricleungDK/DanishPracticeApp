# Debug Report: sql.js Module Not Found in Packaged App

## Issue Description

The packaged Electron app (Setup.exe / installed version) crashes on startup with:

```
Uncaught Exception:
Error: Cannot find module 'sql.js'
Require stack:
C:\Users\ericl\AppData\Local\DanishPracticeGenerator\app-1.0.0\resources\app.asar\...\index.js
```

The crash happens at `resources\app.asar\...\index.js` line 182. The app works fine in dev mode.

## Root Cause

There are two interconnected problems that form a chain. The current config attempts to solve the first but creates the second.

### Problem 1 (solved): Vite bundles sql.js and crashes in dev mode

The previous debug report (`debugger-20260316-sqljs-init.md`) correctly identified that Vite cannot bundle sql.js because of how Emscripten's generated code nullifies the CJS `module` reference inside a Promise, causing `module.exports = k` to crash with `TypeError: Cannot set properties of undefined`.

The fix was to add `external: ['sql.js']` to `vite.main.config.ts`. This is correctly in place now.

### Problem 2 (active bug): `require('sql.js')` cannot resolve inside asar

When `external: ['sql.js']` is set, Vite/Rollup emits a bare `require('sql.js')` in the built `index.js`. In production, `index.js` lives inside `app.asar` (at `resources/app.asar/.vite/build/index.js`).

Node's module resolution from inside an asar file works by intercepting `require()` calls via Electron's patched `Module._load`. It can resolve modules in `app.asar/node_modules/` but **cannot cross from `app.asar` into `app.asar.unpacked`**.

The `forge.config.ts` has:
```ts
packagerConfig: {
  asar: {
    unpack: '**/node_modules/sql.js/**',
  },
},
```

This correctly extracts the `sql.js` package from the asar into `app.asar.unpacked/node_modules/sql.js/`. However, when `require('sql.js')` is called from code running inside `app.asar`, Electron's asar module resolver checks `app.asar/node_modules/` — and since sql.js was unpacked, **it is not there**. The resolver does not automatically fall through to `app.asar.unpacked/`.

This is the fundamental asar resolution gap: code inside `app.asar` cannot find modules that were extracted to `app.asar.unpacked` via `require('package-name')`.

### Why It Works in Dev Mode

In dev mode (`npm run dev`), Electron loads from the project directory directly — there is no asar. The compiled `index.js` is at `.vite/build/index.js` and Node resolves `require('sql.js')` through the normal `node_modules/` walk from the project root. No asar boundary exists, so resolution succeeds.

### The WASM Sub-Problem

Even if module resolution were fixed, there is a secondary problem: `sql-wasm.js` (sql.js's main entry, `node_modules/sql.js/dist/sql-wasm.js`) loads a WebAssembly binary file. On line 163 of that file:

```js
Na??=k.locateFile?k.locateFile("sql-wasm.wasm",za):za+"sql-wasm.wasm";
```

Where `za` is set on line 96 to `__dirname + "/"` in a Node context. This means the `.wasm` file is resolved relative to `__dirname` of `sql-wasm.js`. If the module is in `app.asar.unpacked/node_modules/sql.js/dist/`, then `__dirname` would point there and the `.wasm` file (which is also in `dist/`) would be found. This part would work correctly IF the module resolution issue is fixed first.

## Solution Overview

There are three viable fixes, ordered by recommendation:

1. **Bundle sql.js differently** - Use `sql-asm.js` (pure JS, no WASM) as the import target, and bundle it with a custom Vite plugin that prevents the `module = undefined` crash
2. **Use a require path alias** - In `connection.ts`, change the import to use an absolute path computed at runtime to point directly into `app.asar.unpacked`
3. **Use `@electron/rebuild` + `better-sqlite3`** - Replace sql.js entirely with better-sqlite3 (native module, Electron handles native module unpacking natively via `@electron-forge/plugin-auto-unpack-natives` which is already in devDependencies)

**Recommended fix: Option 2** — runtime path resolution to `app.asar.unpacked`. This is the minimal change that keeps sql.js as-is.

**Strongly consider: Option 3** — the devDependencies already include `@electron-forge/plugin-auto-unpack-natives`, which was designed exactly for native modules like better-sqlite3. This is the idiomatic Electron Forge solution for SQLite.

## Detailed Implementation Plan

### Option 2 (Minimal Fix): Runtime path resolution

This requires changing how sql.js is loaded in `src/main/db/connection.ts` to bypass Node's module resolution when running in a packaged app.

#### File: `src/main/db/connection.ts`

Replace:
```ts
import initSqlJs, { type Database } from 'sql.js';
```

With a dynamic require that resolves to the unpacked location when packaged:

```ts
import { type Database } from 'sql.js';
import { app } from 'electron';
import path from 'node:path';

function loadSqlJs(): Promise<any> {
  // In packaged app, sql.js is unpacked from asar to app.asar.unpacked
  // require('sql.js') from inside asar cannot find it there, so we must
  // construct the absolute path manually.
  if (app.isPackaged) {
    // __dirname is .vite/build inside app.asar
    // app.asar.unpacked is a sibling of app.asar in resources/
    const asarUnpackedPath = path.join(
      __dirname,                    // resources/app.asar/.vite/build
      '..', '..', '..',             // up to resources/
      'app.asar.unpacked',
      'node_modules', 'sql.js', 'dist', 'sql-wasm.js'
    );
    return require(asarUnpackedPath);
  }
  // In dev mode, normal resolution works
  return require('sql.js');
}
```

Then in `initDatabase()`:
```ts
export async function initDatabase(): Promise<void> {
  const initSqlJs = await loadSqlJs();
  const SQL = await initSqlJs({
    locateFile: (filename: string) => {
      if (app.isPackaged) {
        return path.join(
          __dirname,
          '..', '..', '..',
          'app.asar.unpacked',
          'node_modules', 'sql.js', 'dist',
          filename
        );
      }
      return path.join(__dirname, '..', '..', 'node_modules', 'sql.js', 'dist', filename);
    }
  });
  // ... rest of initDatabase unchanged
}
```

The `locateFile` callback is needed because `sql-wasm.js` uses `__dirname` to locate `sql-wasm.wasm`, and once we load via absolute path, `__dirname` inside `sql-wasm.js` would be the unpacked directory — but being explicit is safer.

Note: The top-level `import initSqlJs` must be removed and the type import kept. The `vite.main.config.ts` `external: ['sql.js']` stays as-is.

#### File: `vite.main.config.ts`

No change needed — `external: ['sql.js']` must remain so Vite doesn't try to bundle the Emscripten code.

#### File: `forge.config.ts`

No change needed — `unpack: '**/node_modules/sql.js/**'` must remain.

---

### Option 3 (Recommended Long-Term): Switch to better-sqlite3

`better-sqlite3` is a native Node addon. Electron Forge's `@electron-forge/plugin-auto-unpack-natives` (already in devDependencies) handles it automatically.

#### Steps:

1. `npm install better-sqlite3`
2. `npm install --save-dev @types/better-sqlite3`
3. Add `@electron-forge/plugin-auto-unpack-natives` to `forge.config.ts` plugins array
4. Rewrite `src/main/db/connection.ts` to use better-sqlite3's synchronous API

#### File: `forge.config.ts`

```ts
import { AutoUnpackNativesPlugin } from '@electron-forge/plugin-auto-unpack-natives';

// In plugins array, add:
new AutoUnpackNativesPlugin({}),
```

#### File: `vite.main.config.ts`

Remove `external: ['sql.js']` (sql.js no longer used).
Add `external: ['better-sqlite3']` (native module, cannot be bundled).

```ts
export default defineConfig({
  build: {
    rollupOptions: {
      external: ['better-sqlite3'],
    },
  },
  resolve: {
    alias: {
      '@shared': '/src/shared',
      '@main': '/src/main',
      '@content': '/src/content',
    },
  },
});
```

#### File: `src/main/db/connection.ts` (full rewrite)

```ts
import Database from 'better-sqlite3';
import { app } from 'electron';
import path from 'node:path';
import { runMigrations } from './migrate';
import { seedDatabase } from './seed';

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}

export function initDatabase(): void {
  const dbPath = path.join(app.getPath('userData'), 'danish-practice.db');
  db = new Database(dbPath);
  db.pragma('foreign_keys = ON');
  runMigrations(db);
  seedDatabase(db);
}

export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
  }
}

export type { Database };
```

Note: better-sqlite3 is synchronous, so `initDatabase` becomes synchronous. The caller in `src/main/index.ts` calls `await initDatabase()` — this still works since awaiting a non-Promise value is a no-op. But you should remove the `async/await` for clarity.

#### File: `src/main/index.ts`

Change:
```ts
app.on('ready', async () => {
  await initDatabase();
```
To:
```ts
app.on('ready', () => {
  initDatabase();
```

#### File: `src/main/db/migrate.ts` and `src/main/db/seed.ts`

These files use `db.run()` and `db.exec()`. The better-sqlite3 API differs slightly:
- `db.run(sql)` → `db.exec(sql)` (for DDL/multi-statement) or `db.prepare(sql).run()` (for parameterized)
- `db.exec(sql)` → `db.exec(sql)` (same)
- `new SQL.Database(buffer)` → `new Database(dbPath)` (handles file I/O natively)
- `db.export()` → not needed (better-sqlite3 writes to disk directly)

The `saveDb()` function in connection.ts can be removed entirely since better-sqlite3 writes to disk automatically.

#### Package: Remove sql.js

```
npm uninstall sql.js
```

Also remove `src/main/sql.js.d.ts` (custom type declarations no longer needed).

---

### Option 1 (Not Recommended): Bundle sql-asm.js

`sql-asm.js` is the pure-JS asm.js version without WASM. It has the same `module = undefined` problem when Vite bundles it. This approach would require a custom Vite plugin to rewrite the nullification line before bundling — fragile and non-obvious.

## Verification

For Option 2:
- [ ] `npm run make` produces installer
- [ ] Installed app launches without "Cannot find module" error
- [ ] Database initializes (exercises load in UI)
- [ ] `.wasm` file found (no "both async and sync fetching of the wasm failed" error)

For Option 3:
- [ ] `npm run make` produces installer
- [ ] Installed app launches
- [ ] `app.asar.unpacked/node_modules/better-sqlite3/` exists in packaged output
- [ ] Database initializes synchronously
- [ ] All exercise queries return correct data
- [ ] `npm run dev` still works

## Risks

- **Option 2**: The path `../../../app.asar.unpacked/...` relative to `__dirname` is fragile. If Electron Forge changes the output directory structure, it breaks silently. Needs a comment explaining the path construction.
- **Option 2**: The `module = undefined` bug from the previous report suggests sql.js's Emscripten code still has issues when loaded via absolute path under certain circumstances — though loading it as a plain file (not via npm resolution) sidesteps the Vite bundling issue.
- **Option 3**: better-sqlite3 requires a native rebuild for the target Electron version. `electron-rebuild` handles this, but it must run after `npm install`. Electron Forge's `rebuildConfig` in `forge.config.ts` handles this automatically during `npm run make`.
- **Option 3**: better-sqlite3 API is synchronous — this is simpler for the main process but means all DB calls block the main thread. For this app's query patterns (small local DB, no heavy writes), this is acceptable.
- **Option 3**: `migrate.ts` and `seed.ts` will need API updates (examine both files before implementing).
