# Button click does nothing - root cause analysis

**Symptom**: Clicking "Start Practice", "Practice" (sidebar), "Review" (sidebar) buttons produces no visible response. No errors in UI.

## Root cause

**The preload script output filename collides with the main process and doesn't match the path the main process expects.**

### The filename collision

Both `src/main/index.ts` and `src/preload/index.ts` are compiled by the Electron Forge Vite plugin into `.vite/build/`. The plugin uses `entryFileNames: '[name].js'` for output naming (see `node_modules/@electron-forge/plugin-vite/dist/config/vite.preload.config.js:19`). Since both source files are named `index.ts`, both produce `index.js` in the same output directory.

With `emptyOutDir: false` in the base config, whichever builds second overwrites the other. Currently only the main process `index.js` survives in `.vite/build/`.

### The path mismatch

The main process loads the preload script at:
```js
preload: path.join(__dirname, 'preload.js')    // src/main/index.ts:18
```

But even if the preload build ran independently, it would output `index.js` (from `[name].js` where name = "index"), not `preload.js`. So the preload script can never be found by the main process under the current configuration.

### The cascade

1. Electron opens `BrowserWindow` with `preload: '.vite/build/preload.js'`
2. File doesn't exist -> preload silently fails to load
3. `contextBridge.exposeInMainWorld('api', api)` never runs
4. `window.api` is `undefined` in the renderer
5. `App.tsx` mounts, calls `loadDashboardData()` -> `window.api.getStats()` -> throws `TypeError: Cannot read properties of undefined (reading 'getStats')`
6. This error is swallowed because `loadDashboardData` is async with no try/catch
7. Dashboard renders with default zero stats (no crash, UI looks normal)
8. User clicks "Start Practice" -> `startPractice()` -> `window.api.getExercises()` -> same TypeError, silently swallowed
9. `set({ currentPage: 'exercise' })` never executes -> no navigation

## Secondary issue: no error handling in store

All async store actions (`startPractice`, `startReview`, `loadDashboardData`, `rateAndNext`, `endSession`) have zero try/catch. Failures are invisible to the user.

## Recommended fixes

### Fix 1: Rename preload entry file (simplest)

Rename `src/preload/index.ts` to `src/preload/preload.ts`. Update `forge.config.ts`:

```ts
{
  entry: 'src/preload/preload.ts',   // was: 'src/preload/index.ts'
  config: 'vite.preload.config.ts',
  target: 'preload',
},
```

Rollup's `[name].js` will now produce `preload.js`, matching `path.join(__dirname, 'preload.js')` in the main process.

### Fix 2: (alternative) Change the main process preload path

Keep filenames as-is and change `src/main/index.ts`:

```ts
preload: path.join(__dirname, 'index.js'),   // was: 'preload.js'
```

This is worse because it creates ambiguity between the main and preload `index.js` outputs. Only works if the build order is preload-after-main so the preload overwrites.

### Fix 3: Add try/catch to store actions

Wrap all `window.api.*` calls so failures are visible:

```ts
startPractice: async (type, difficulty) => {
  try {
    const all = await window.api.getExercises({ type, difficulty });
    const shuffled = shuffleArray(all).slice(0, 10);
    set({ sessionExercises: shuffled, currentIndex: 0, /* ... */ currentPage: 'exercise' });
  } catch (err) {
    console.error('startPractice failed:', err);
    // optionally set an error state for UI display
  }
},
```

Apply same pattern to `startReview`, `loadDashboardData`, `rateAndNext`, `endSession`.

## Files examined

- `src/renderer/components/Sidebar.tsx` - button click handlers (correct)
- `src/renderer/store/useAppStore.ts` - async actions, no error handling
- `src/renderer/pages/Dashboard.tsx` - "Start Practice" button (correct)
- `src/renderer/App.tsx` - calls `loadDashboardData` on mount
- `src/preload/index.ts` - exposes `window.api` via `contextBridge` (correct code, never executes)
- `src/main/index.ts:18` - `preload: path.join(__dirname, 'preload.js')` (expects `preload.js`)
- `src/main/ipc/handlers.ts` - IPC handler registration (correct)
- `src/main/db/connection.ts` - database init (sql.js externalization already applied)
- `forge.config.ts:30` - preload entry is `src/preload/index.ts` -> outputs as `index.js`
- `vite.preload.config.ts` - minimal config, no output overrides
- `vite.main.config.ts` - sql.js external already applied
- `node_modules/@electron-forge/plugin-vite/dist/config/vite.preload.config.js:19` - `entryFileNames: '[name].js'`
- `node_modules/@electron-forge/plugin-vite/dist/config/vite.base.config.js:23` - `outDir: '.vite/build'`
- `.vite/build/` - contains only `index.js` (main process), no `preload.js`
