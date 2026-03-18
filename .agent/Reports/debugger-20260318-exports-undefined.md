# Debug Report: TypeError — Cannot set properties of undefined (setting 'exports')

## Issue Description

The packaged Electron app crashes on launch with:

```
TypeError: Cannot set properties of undefined (setting 'exports')
```

The app shows no window when launched from the Start Menu. Dev mode (`npm run dev`) is unaffected because it was last built/tested while `sql.js` was still marked external — the current `.vite/build/index.js` already includes a bundled copy of sql.js from after the external config was removed.

---

## Root Cause

sql.js is currently being bundled by Vite into `.vite/build/index.js` (no `external` config in `vite.main.config.ts`). This causes a runtime crash inside the sql.js Promise executor.

### Exact Crash Mechanism

**File:** `.vite/build/index.js` (confirmed by code inspection)

The bundled code wraps sql.js in a Rollup CJS IIFE:

```js
var Mt = { exports: {} };
(function(d, a) {
  // d = Mt, a = Mt.exports

  var h = function(moduleConfig) {
    return new Promise(function(resolve, reject) {
      // ...
      d = void 0;              // (1) sql.js wrapper nullifies 'd' (the module proxy)
      // ...
      // Later, Emscripten's Node.js platform detection block runs:
      if (isNode) {
        // ...
        d.exports = s;         // (2) CRASH: d is void 0, cannot set .exports on undefined
      }
    });
  };

  d.exports = h;               // This line (outside Promise) runs fine — d is still Mt
})(Mt);
```

Both `d = void 0` and `d.exports = s` are **inside the Promise executor**. The Promise executor runs **synchronously** when `new Promise(executor)` is constructed — which happens when `initSqlJs()` is first called.

Execution order:

1. `index.js` loads — IIFE runs — `Mt.exports = h` succeeds (d is still Mt at this point)
2. `initDatabase()` is called → `initSqlJs({ wasmBinary })` is called
3. Inside `initSqlJs`: `new Promise(executor)` is created, executor runs synchronously
4. `d = void 0` → d is now undefined
5. `if (isNode) { d.exports = s; }` → **crash**: `Cannot set properties of undefined (setting 'exports')`
6. Promise rejects with the TypeError
7. `await initSqlJs(...)` in `connection.ts` throws
8. `app.on('ready')` catch block calls `dialog.showErrorBox(...)` then `app.quit()`
9. No window is ever created

### Why It Doesn't Crash In Dev Mode

The current `.vite/build/index.js` has sql.js bundled — dev mode would also crash if index.js is rebuilt. The reason dev "works" is that the user tested dev mode before removing `external: ['sql.js']`, so the dev mode was running from a build that still had sql.js external. The packaged app used a fresh `npm run make` build after the config change.

### Why sql-wasm.js Cannot Be Bundled

The sql.js shell-pre.js wrapper intentionally sets `d = void 0` (where d represents the CJS `module` object) to prevent Emscripten from overwriting the wrapper's own `module.exports` assignment. However, the Emscripten-generated Node.js branch **also** tries `d.exports = s` (not guarded by a null check), which crashes because `d` was already nullified. This is a fundamental incompatibility between the sql.js wrapper design and Vite/Rollup's CJS bundling — not a fixable configuration issue.

### Contrast: Why sql-asm.js Would Not Crash

`sql-asm.js` uses the unminified form `module = undefined` (not via a parameter alias `d`). The Emscripten code in sql-asm.js uses a **guarded** check: `typeof module !== 'undefined' && (module.exports = k)`. After `module = undefined`, this check evaluates as false and the assignment is skipped. However, using sql-asm.js would require changing the import path and abandoning WASM for the asm.js backend.

---

## Solution Overview

Mark `sql.js` as external in Vite so it is not bundled. To make `require('sql.js')` resolvable in the packaged app (where asar prevents finding `node_modules` via normal resolution), copy `sql-wasm.js` directly into the build output directory and rewrite the generated `require('sql.js')` to `require('./sql-wasm.js')` using a Rollup `renderChunk` plugin.

`connection.ts` passes `wasmBinary` to `initSqlJs()`, which bypasses sql-wasm.js's internal wasm path resolution entirely — so the wasm file is still loaded correctly from `__dirname` via `fs.readFileSync`.

---

## Detailed Implementation Plan

### File 1: `vite.main.config.ts`

**Replace the entire file** with:

```ts
import { defineConfig, type Plugin } from 'vite';
import fs from 'node:fs';
import path from 'node:path';

function copySqlJs(): Plugin {
  return {
    name: 'copy-sql-js',
    renderChunk(code) {
      // Rewrite the external require to a relative path so it resolves
      // from inside app.asar at runtime without needing node_modules.
      return code.replace(/require\(["']sql\.js["']\)/g, 'require("./sql-wasm.js")');
    },
    closeBundle() {
      const dist = path.resolve(__dirname, 'node_modules/sql.js/dist');
      const out = path.resolve(__dirname, '.vite/build');
      // Copy the sql.js runtime files alongside index.js in the build output.
      // Both end up inside app.asar and are readable via Electron's patched fs.
      fs.copyFileSync(path.join(dist, 'sql-wasm.js'), path.join(out, 'sql-wasm.js'));
      if (fs.existsSync(path.join(dist, 'sql-wasm.wasm'))) {
        fs.copyFileSync(path.join(dist, 'sql-wasm.wasm'), path.join(out, 'sql-wasm.wasm'));
      }
    },
  };
}

export default defineConfig({
  build: {
    rollupOptions: {
      external: ['sql.js'],
    },
  },
  plugins: [copySqlJs()],
  resolve: {
    alias: {
      '@shared': '/src/shared',
      '@main': '/src/main',
      '@content': '/src/content',
    },
  },
});
```

Key changes from current config:
- Added `build.rollupOptions.external: ['sql.js']` — prevents bundling
- `renderChunk` rewrites `require('sql.js')` → `require('./sql-wasm.js')` in the output
- `closeBundle` copies `sql-wasm.js` in addition to `sql-wasm.wasm` into `.vite/build/`
- Plugin renamed from `copySqlWasm` to `copySqlJs` to reflect both files being copied

### File 2: `src/main/db/connection.ts`

**No changes required.** The current implementation already passes `wasmBinary`:

```ts
const wasmBinary = fs.readFileSync(path.join(__dirname, 'sql-wasm.wasm'));
const SQL = await initSqlJs({ wasmBinary });
```

This works correctly because:
- `__dirname` in `index.js` resolves to `.vite/build/` (or `app.asar/.vite/build/`)
- `sql-wasm.wasm` is copied to that same directory by the plugin
- `fs.readFileSync` reads from inside asar correctly via Electron's fs patches
- When `wasmBinary` is passed, sql-wasm.js uses it directly and skips its internal wasm path resolution

### File 3: `forge.config.ts`

**No changes required.** The current `asar: true` config is fine because:
- sql-wasm.js and sql-wasm.wasm are now inside app.asar (in `.vite/build/`)
- The main process is Node.js context (`isNode = true`), so sql-wasm.js uses `fs.readFileSync` not `fetch` to load the wasm
- Electron patches `fs.readFileSync` to support reading from asar archives
- `asar.unpack` for wasm is **not required** for main-process wasm loading

---

## Verification Steps

- [ ] Run `npm run make` — build should complete without errors
- [ ] Confirm `.vite/build/` contains: `index.js`, `preload.js`, `sql-wasm.js`, `sql-wasm.wasm`
- [ ] Confirm `index.js` no longer contains the sql.js code blob (search for `initSqlJsPromise`)
- [ ] Confirm `index.js` contains `require("./sql-wasm.js")` (not `require('sql.js')`)
- [ ] Run Setup.exe (no window expected — Squirrel behavior, see `debugger-20260318-no-window-on-launch.md`)
- [ ] Launch from Start Menu shortcut — app window appears
- [ ] Exercises load in the UI (confirms DB initialized successfully)
- [ ] Run `npm run dev` — confirm dev mode also works with the new config

---

## Risks and Considerations

1. **renderChunk regex**: The replacement `require("sql.js")` → `require("./sql-wasm.js")` uses a regex. If Rollup minifies the require call differently (e.g., single quotes vs double quotes), the regex must match both. The pattern `/require\(["']sql\.js["']\)/g` handles both quote styles.

2. **sql-wasm.js size**: The file is ~380KB minified. It will be copied into app.asar for every build. This is acceptable for a desktop app.

3. **Dev mode rebuild**: After this change, `npm run dev` will also rebuild index.js with the new config (external sql.js + renderChunk rewrite). Dev mode will now load `./sql-wasm.js` from `.vite/build/` — which is present since `closeBundle` copies it. Dev should work correctly.

4. **Preload process**: `vite.preload.config.ts` should NOT have sql.js as external (the preload doesn't use sql.js). Confirm that `vite.preload.config.ts` doesn't reference sql.js.

5. **Alternative: better-sqlite3**: The previous report (`debugger-20260318-sqljs-module-not-found.md`) recommended switching to `better-sqlite3` as the long-term solution. That recommendation still stands. This fix is the minimum required to unblock the packaged app with the existing sql.js/sql-wasm setup.
