# Dansk Praksis - Danish Practice Generator

Desktop app for practicing Danish at CEFR B1-B2 level. Offline-first, with spaced repetition tracking.

Built with Electron + React + TypeScript.

## Features

- **Fill-in-the-blank** - Complete sentences with missing Danish words
- **Sentence construction** - Build grammatically correct sentences from word sets
- **Reading comprehension** - Read Danish passages and answer questions
- **Listening exercises** - Transcribe spoken Danish via TTS
- **Spaced repetition (SM-2)** - Review due items on an optimized schedule
- **Dashboard analytics** - Streak calendar, skill radar, session history charts
- **Dark / Light theme** - Scandinavian-minimal design with warm earth tones

## Screenshots

<!-- TODO: add screenshots -->

## Quick Start

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run tests
npm test

# Type-check
npm run typecheck
```

## Build

```bash
# Package (no installer)
npm run package

# Create Windows installer
npm run make:win

# Create platform-specific installer
npm run make
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Electron 41 |
| UI | React 18 + TypeScript |
| State | Zustand |
| Database | SQLite (sql.js, in-memory persisted to disk) |
| Styling | Tailwind CSS 4 + CSS custom properties |
| Charts | Recharts |
| Animations | Framer Motion |
| Icons | lucide-react |
| Testing | Jest + Testing Library |
| Build | Electron Forge + Vite |

## Architecture

```
Renderer (React)  <-->  Preload (contextBridge)  <-->  Main (Node.js + SQLite)
```

- **Main process**: Electron window management, SQLite via sql.js, IPC handlers
- **Preload**: Secure bridge exposing `window.api.*` to renderer
- **Renderer**: React SPA with Zustand store, page-based routing
- **Content**: JSON exercise templates + wordlists, no external API needed

All data stays local. No network calls for core functionality.

## Project Structure

```
src/
  main/         Electron main process, IPC, database
  renderer/     React UI, components, pages, store
  content/      Exercise templates, wordlists, generators
  shared/       Types and constants shared across processes
  preload/      Context bridge (secure API exposure)
```
