# Debug Report: No Window on Launch After Squirrel Install

## Issue Description

Running `Danish Practice Generator-1.0.0 Setup.exe` (built with `npm run make`) shows nothing — no window, no error dialog. The app works fine in dev mode (`npm run dev`).

## Root Cause

There are **two distinct causes** that together explain the symptom. The primary cause (Squirrel) explains why no window appears on first run of the Setup.exe. The secondary cause (missing WASM) explains why the app silently crashes when launched from the installed shortcut.

---

### Cause 1 (Primary): Squirrel install event causes immediate quit — this is expected behavior

When you run `Danish Practice Generator-1.0.0 Setup.exe`, Squirrel does NOT launch the app directly. It installs the app, then re-launches the app executable with a `--squirrel-install` argument to let the app create desktop/start menu shortcuts.

In `src/main/index.ts` (line 7–9):
```ts
if (started) {
  app.quit();
}
```

`electron-squirrel-startup` checks `process.argv[1]` for `--squirrel-install` (and `--squirrel-updated`, `--squirrel-uninstall`, `--squirrel-obsolete`). On the first-run invocation with `--squirrel-install`, it:
1. Spawns `Update.exe --createShortcut=<exe>` (asynchronously, detached)
2. Returns `true`, causing `app.quit()` to fire immediately

So the Setup.exe running and showing nothing is **completely normal Squirrel behavior**. The app is installing and creating shortcuts in the background. After the Setup.exe completes, the user must launch the app from the newly created desktop/Start Menu shortcut. The symptom description "no window pops up" when running Setup.exe is normal.

**However**, if the user launched from the installed shortcut and still saw nothing, Cause 2 explains that.

---

### Cause 2 (Secondary, Critical): `sql-wasm.wasm` is missing from the packaged build

When Vite bundles `src/main/index.ts` into `.vite/build/index.js`, it inlines the entire `sql.js` JavaScript (`node_modules/sql.js/dist/sql-wasm.js`) into the bundle. However, **it does NOT copy `sql-wasm.wasm`** (the WebAssembly binary) alongside `index.js`.

Confirmed by inspection:
- `.vite/build/` contains only `index.js` and `preload.js` — **no `.wasm` file**
- The bundled sql.js code resolves the WASM path as: `D + "sql-wasm.wasm"` where `D = __dirname + "/"`
- At runtime inside the asar, `__dirname` for `.vite/build/index.js` resolves to the `build/` directory
- The WASM file is not there, so `initSqlJs()` fails with a WASM load error

The `initDatabase()` is called inside `app.on('ready', async () => { await initDatabase(); ... createWindow(); })`. If `initSqlJs()` throws (or its promise rejects), the unhandled rejection crashes the main process before `createWindow()` is ever reached.

In the packaged app:
- The `app.asar` contains only `.vite/build/index.js`, `.vite/build/preload.js`, `.vite/renderer/main_window/index.html`, and `.vite/renderer/main_window/assets/`
- `sql-wasm.wasm` is **not** present in the asar (confirmed — `out/Danish Practice Generator-win32-x64/resources/` has only `app.asar`, no `app.asar.unpacked/`)
- WASM files cannot be loaded from inside an asar — they must be unpacked

The asar also has `OnlyLoadAppFromAsar: true` fuse enabled, which means the app cannot fall back to loading resources from outside the asar.

---

### Why it works in dev

In dev mode (`npm run dev`), the Vite plugin serves the renderer via a dev server and the main process runs directly from source via `ts-node` / Vite. The `sql-wasm.wasm` file is loaded from `node_modules/sql.js/dist/` which is accessible on the filesystem — no asar involved.

---

## Solution Overview

Two fixes are required:

1. **Understand/communicate that Setup.exe showing no window is normal** — the user needs to launch from the installed shortcut.

2. **Fix the WASM packaging** — `sql-wasm.wasm` must be available to the main process at runtime. The correct approach is to:
   - Pass `locateFile` to `initSqlJs()` so it can find the WASM at the correct path at runtime
   - Ensure the WASM file is copied into `.vite/build/` during the build (via a Vite plugin or `assetsInclude`)
   - Configure `asar.unpack` to unpack the WASM file so it ends up in `app.asar.unpacked/` (WASM cannot be `instantiate`-streamed from inside an asar)

---

## Detailed Implementation Plan

### File 1: `src/main/db/connection.ts`

Change the `initSqlJs()` call to pass a `locateFile` config that resolves `sql-wasm.wasm` relative to `__dirname` at runtime:

```ts
// Change this:
const SQL = await initSqlJs();

// To this:
import path from 'node:path';
const SQL = await initSqlJs({
  locateFile: (file: string) => path.join(__dirname, file),
});
```

This ensures sql.js looks for `sql-wasm.wasm` at `__dirname/sql-wasm.wasm` — the same directory as the built `index.js`. This is already what the internal default does (`D = __dirname + "/"`), but making it explicit and correct is important. The WASM must also be physically present there.

### File 2: `vite.main.config.ts`

Add asset copying so Vite copies `sql-wasm.wasm` into `.vite/build/` alongside `index.js`. The cleanest approach is a custom Vite plugin:

```ts
import { defineConfig } from 'vite';
import path from 'node:path';
import fs from 'node:fs';

export default defineConfig({
  build: {},
  plugins: [
    {
      name: 'copy-sql-wasm',
      closeBundle() {
        const src = path.resolve(
          __dirname,
          'node_modules/sql.js/dist/sql-wasm.wasm'
        );
        const dest = path.resolve(__dirname, '.vite/build/sql-wasm.wasm');
        fs.copyFileSync(src, dest);
      },
    },
  ],
  resolve: {
    alias: {
      '@shared': '/src/shared',
      '@main': '/src/main',
      '@content': '/src/content',
    },
  },
});
```

### File 3: `forge.config.ts`

Change `asar` config to unpack the WASM file. WASM binaries cannot be loaded from within an asar archive (Node.js `fs.readFileSync` works, but `WebAssembly.instantiateStreaming` via `fetch` does not, and even sync reads from asar may have issues with binary files depending on Electron version).

The safe approach: unpack WASM to `app.asar.unpacked/`:

```ts
packagerConfig: {
  asar: {
    unpack: '**/*.wasm',
  },
},
```

This creates `app.asar.unpacked/` with the WASM file alongside `app.asar`. Electron automatically remaps `__dirname` paths that point inside the asar to the unpacked directory when a file exists there.

**Important**: With `OnlyLoadAppFromAsar: true` fuse enabled, any file referenced from inside the asar but physically unpacked to `app.asar.unpacked/` still works — Electron handles this transparently. But files completely outside the asar and not in the unpacked folder are blocked.

---

### Error handling improvement (optional but recommended)

Wrap `initDatabase()` in a try/catch so a crash doesn't silently kill the app without any user feedback:

```ts
// In src/main/index.ts
app.on('ready', async () => {
  try {
    await initDatabase();
  } catch (err) {
    console.error('Database init failed:', err);
    dialog.showErrorBox('Startup Error', `Failed to initialize database: ${err}`);
    app.quit();
    return;
  }
  registerIpcHandlers();
  createWindow();
});
```

Add `import { dialog } from 'electron';` at the top.

---

## Verification Plan

- [ ] After fix: `npm run make` should produce `.vite/build/sql-wasm.wasm`
- [ ] After fix: `out/.../resources/app.asar.unpacked/` should contain `sql-wasm.wasm`
- [ ] Run Setup.exe — expect no window (this is still normal; it installs and creates shortcuts)
- [ ] Launch from desktop shortcut — expect app window to appear
- [ ] App window loads exercises correctly (sql.js is working)
- [ ] Run `npm run dev` — confirm dev mode still works unchanged

---

## Risks and Considerations

1. **`asar.unpack` glob pattern**: Using `'**/*.wasm'` will unpack all WASM files, which is correct. If there are other WASM files from other deps added in the future, they'll also be unpacked — generally desirable behavior.

2. **`closeBundle` vs `generateBundle`**: The `closeBundle` hook runs after Vite finishes writing files, making it reliable for the copy. Using `generateBundle` to emit the asset as a Vite asset is also possible but more complex.

3. **Alternative: use `assetsInclude` in vite.main.config.ts**: Vite has `assetsInclude` but this is for the renderer pipeline. For the main process build (CJS target), the custom plugin copy approach is more reliable.

4. **`OnlyLoadAppFromAsar` fuse**: This fuse is set to `true`. With the WASM in `app.asar.unpacked/`, Electron remaps the path automatically and `OnlyLoadAppFromAsar` does not block it (unpacked files are considered part of the asar package). No change needed to the fuse config.

5. **The `locateFile` fix in connection.ts**: Even if the WASM is copied correctly and Vite uses `__dirname` paths, making `locateFile` explicit is a defensive coding practice that ensures predictable behavior across environments.
