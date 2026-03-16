# Project Architecture — Danish Practice Generator

**Last Updated**: 2026-03-16

## Quick Overview

Desktop application for practicing Danish at B1-B2 (CEFR) level. Generates exercises from pre-built templates and wordlists. Tracks progress using SM-2 spaced repetition. Fully offline.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Electron (Chromium + Node.js) |
| UI | React 18 + TypeScript |
| Build | electron-forge or electron-builder + Vite |
| State | Zustand (or React Context for simple cases) |
| Database | better-sqlite3 (main process) |
| TTS | Web Speech API / system TTS via Electron |
| Styling | Tailwind CSS |
| Testing | Jest + React Testing Library + Playwright |

## Project Structure

```
src/
├── main/                  # Electron main process
│   ├── index.ts           # App entry, window creation
│   ├── ipc/               # IPC handler registrations
│   ├── db/                # SQLite operations & migrations
│   │   ├── connection.ts  # Database connection
│   │   ├── migrations/    # Versioned SQL migrations
│   │   └── queries/       # Query functions by domain
│   └── tts/               # Text-to-speech bridge
│
├── renderer/              # React app (renderer process)
│   ├── App.tsx            # Root component + router
│   ├── components/        # Reusable UI components
│   ├── pages/             # Page-level components
│   │   ├── Dashboard.tsx  # Progress overview
│   │   ├── Exercise.tsx   # Exercise session
│   │   ├── Review.tsx     # Spaced repetition review
│   │   └── Settings.tsx   # User preferences
│   ├── hooks/             # Custom React hooks
│   └── store/             # Zustand stores
│
├── content/               # Exercise content
│   ├── templates/         # Exercise templates (JSON)
│   ├── wordlists/         # Danish vocabulary (JSON)
│   └── generators/        # Exercise generation logic
│
├── shared/                # Shared between processes
│   ├── types/             # TypeScript interfaces
│   └── constants/         # IPC channel names, etc.
│
└── preload/               # Electron preload scripts
    └── index.ts           # Expose safe APIs to renderer
```

## Exercise Types

| Type | Description | Input | Output |
|------|------------|-------|--------|
| Fill-in-blank | Complete sentence with missing word | Sentence template + wordlist | User fills gap |
| Sentence construction | Build sentence from given words | Word set + grammar rule | User arranges words |
| Reading comprehension | Read passage, answer questions | Passage + question set | Multiple choice / free text |
| Listening | Listen to TTS, transcribe or answer | Danish text (spoken via TTS) | User types/selects answer |

## IPC Architecture

```
Renderer (React)  ←→  Preload (contextBridge)  ←→  Main (Node.js + SQLite)
```

- Renderer calls exposed API functions via `window.api.*`
- Preload exposes safe subset via `contextBridge.exposeInMainWorld`
- Main handles IPC with `ipcMain.handle()` for async request/response
- All SQLite access happens in main process only

## Spaced Repetition (SM-2)

Algorithm fields per exercise:
- `ease_factor`: starts at 2.5, adjusts based on performance
- `interval`: days until next review
- `repetitions`: count of successful reviews
- `next_review`: date of next scheduled review
- `last_review`: date of last review

Quality ratings: 0-5 (0=complete fail, 5=perfect recall)

## Security Model

- `nodeIntegration: false` in renderer
- `contextIsolation: true`
- Preload script is the only bridge
- No remote module
- CSP headers configured
- No external network calls for core functionality

## Performance Targets

- App launch: < 2s
- Exercise load: < 200ms
- SQLite query: < 50ms
- TTS start: < 500ms
