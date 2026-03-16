# sql.js initDatabase crash - root cause analysis

**Error**: `TypeError: Cannot set properties of undefined (setting 'exports')` at `.vite/build/index.js:1025`

## Root cause

sql.js (compiled from SQLite via Emscripten) contains an internal pattern where it **intentionally nullifies `module`** mid-execution, then later tries to use `module.exports`. When Vite bundles it, this self-nullification breaks the CJS shim wrapper.

### Detailed chain of events

1. Vite wraps sql.js in a CJS-compatibility IIFE (`.vite/build/index.js:481-482`):
   ```js
   var sqlWasm = { exports: {} };
   (function(module2, exports$1) {
   ```
   `module2` is Vite's synthetic CJS `module` object, passed to the IIFE.

2. Inside the sql.js Emscripten code, `initSqlJs2()` creates a Promise. Inside that Promise callback, the Emscripten runtime **nullifies the module reference** (`.vite/build/index.js:502`):
   ```js
   module2 = void 0;
   ```
   In the original sql.js source, this is `module = void 0` -- Emscripten does this to avoid polluting the module scope during WASM init. It works in real CJS because `module` is a local binding in Node's module wrapper that can be reassigned without consequence to the *outer* `module` reference used later.

3. But Vite renamed `module` to `module2` throughout the IIFE. The nullification at line 502 kills the **same** `module2` variable that lines 1025, 2623-2624 later reference.

4. The Emscripten runtime detects it's running in Node.js (`ca = globalThis.process?.versions?.node`) and reaches line 1025:
   ```js
   module2.exports = k;   // module2 is undefined here -> CRASH
   ```

5. This line runs **synchronously** during the Promise constructor, before `postRun` or any WASM initialization completes. The crash is immediate.

### Why it works outside Vite

In a real Node.js CJS environment, `module` inside the IIFE is a **function parameter** shadowing the outer `module`. The `module = void 0` only affects the parameter, not the actual `module` object. The final `module.exports = initSqlJs` at line 176 of the original file is **outside** the IIFE/Promise and uses the outer (real) `module` -- so it works fine.

But Vite's CJS shim renames all `module` references to `module2`, flattening the scoping. The nullification and the final export both hit the same `module2`.

## Recommended fix

**Mark `sql.js` as external in `vite.main.config.ts`** so Vite does not bundle it and instead emits a `require('sql.js')` call at runtime.

Current `vite.main.config.ts`:
```ts
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      '@shared': '/src/shared',
      '@main': '/src/main',
      '@content': '/src/content',
    },
  },
});
```

Change to:
```ts
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      '@shared': '/src/shared',
      '@main': '/src/main',
      '@content': '/src/content',
    },
  },
  build: {
    rollupOptions: {
      external: ['sql.js'],
    },
  },
});
```

This tells Rollup (used by Vite internally) to leave `sql.js` as a runtime `require()` rather than inlining it. Since `electron-forge` already externalizes `electron` and all Node builtins (see `vite.base.config.js`), adding `sql.js` follows the same pattern.

### Additional consideration: WASM file location

sql.js loads `sql-wasm.wasm` from a path relative to itself. When externalized, it will resolve from `node_modules/sql.js/dist/`. This works in dev mode. For production packaging (`asar: true` in `forge.config.ts`), you may need to either:

- Use `sql.js/dist/sql-asm.js` instead (no WASM file needed, pure JS, slightly slower)
- Or configure `initSqlJs({ locateFile: ... })` to point to the `.wasm` file and ensure it's included in the packaged app via `extraResource` in `packagerConfig`

### Alternative fix (less recommended)

Use `build.commonjsOptions` to prevent the `module = void 0` transform:
```ts
build: {
  commonjsOptions: {
    ignoreTryCatch: false,
  },
},
```
This is fragile and doesn't address the fundamental incompatibility. Externalizing is cleaner.

## Files examined

- `src/main/db/connection.ts` -- calls `initSqlJs()` (line 19)
- `src/main/index.ts` -- calls `initDatabase()` on app ready (line 34)
- `vite.main.config.ts` -- no externals configured (the bug)
- `.vite/build/index.js:481-502` -- Vite's CJS wrapper + `module2 = void 0`
- `.vite/build/index.js:1025` -- crash site: `module2.exports = k`
- `.vite/build/index.js:2623-2624` -- outer CJS export (also would crash)
- `node_modules/sql.js/dist/sql-wasm.js:72,96,175-178` -- original source patterns
- `node_modules/@electron-forge/plugin-vite/dist/config/vite.base.config.js` -- base externals (electron, builtins only)
- `forge.config.ts` -- build entry points, asar config
