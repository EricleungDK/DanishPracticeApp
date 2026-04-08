# Central Context — Danish Practice Generator

**Last Updated**: 2026-03-16

## Project Status: Initial Setup

Setting up project configuration and documentation. Next: scaffold Electron + React + TypeScript app.

## Active Tasks

| Task | Status | Branch |
|------|--------|--------|
| Project config & docs setup | IN_PROGRESS | main |

## Architecture Decisions

| Decision | Rationale | Date |
|----------|-----------|------|
| Electron + React + TypeScript | Portfolio value, cross-platform desktop | 2026-03-16 |
| Template-based exercise generation | Cost-effective, no API dependency | 2026-03-16 |
| SM-2 spaced repetition | Proven algorithm, simple to implement | 2026-03-16 |
| SQLite via better-sqlite3 | Local-only, no server needed, fast | 2026-03-16 |
| B1-B2 focus | User's current Danish level | 2026-03-16 |

## Known Issues

- Fill-blank explanation shows Danish answer word in English translation line (fix planned — see report)

## Active Delegations

| Sub-Agent | Task ID | Status | Started | Expected Completion |
|-----------|---------|--------|---------|-------------------|
| systematic-debugger | fill-blank-translation | COMPLETED | 2026-03-18 | 2026-03-18 |
| systematic-debugger | sqljs-module-not-found | COMPLETED | 2026-03-18 | 2026-03-18 |
| systematic-debugger | no-window-on-launch | COMPLETED | 2026-03-18 | 2026-03-18 |
| systematic-debugger | exports-undefined | COMPLETED | 2026-03-18 | 2026-03-18 |
| systematic-debugger | sidebar-nav | COMPLETED | 2026-04-08 | 2026-04-08 |

## Activity Log

| Date | Agent | Action |
|------|-------|--------|
| 2026-03-16 | parent | Initial project setup — CLAUDE.md, agents, .agent/ docs |
| 2026-03-18 | systematic-debugger | Identified root cause of fill-blank translation bug; report at .agent/Reports/debugger-20260318-fill-blank-translation.md |
| 2026-03-18 | systematic-debugger | Identified root cause of sql.js "Cannot find module" in packaged app; report at .agent/Reports/debugger-20260318-sqljs-module-not-found.md |
| 2026-03-18 | systematic-debugger | Identified two causes of no-window-on-launch: (1) Squirrel first-run is normal, (2) sql-wasm.wasm missing from build output causes silent crash; report at .agent/Reports/debugger-20260318-no-window-on-launch.md |
| 2026-03-18 | systematic-debugger | Identified root cause of exports-undefined crash: sql.js removed from externals causes d=void 0 + d.exports=s crash in bundled Emscripten code; fix: external+renderChunk rewrite+copy sql-wasm.js; report at .agent/Reports/debugger-20260318-exports-undefined.md |
| 2026-04-08 | systematic-debugger | Identified root cause of sidebar nav bug: handleNav guards redirect to dashboard instead of calling startPractice/startReview; report at .agent/Reports/debugger-20260408-sidebar-nav.md |
