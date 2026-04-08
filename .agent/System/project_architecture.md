# Project Architecture — Danish Practice Generator

**Last Updated**: 2026-04-08

## Quick Overview

Desktop + Android application for practicing Danish at B1-B2 (CEFR) level. Generates exercises from pre-built templates and wordlists. Tracks progress using SM-2 spaced repetition. Fully offline.

**Platforms**: Electron (Windows/macOS/Linux desktop) + Capacitor (Android, future iOS)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Electron (desktop) + Capacitor (mobile) |
| UI | React 18 + TypeScript |
| Build | electron-forge + Vite (desktop), Vite + Capacitor CLI + Gradle (Android) |
| State | Zustand |
| Database | sql.js via IPC (desktop), @capacitor-community/sqlite (mobile) |
| API Layer | AppAPI interface + ApiProvider context (platform-agnostic) |
| TTS | Web Speech API / system TTS via Electron |
| Styling | Tailwind CSS 4.2 + CSS custom properties (theme system) |
| Fonts | Outfit (sans) + Lora (serif) via @fontsource-variable |
| Testing | Jest + ts-jest + @testing-library/react + jest-dom |
| Animations | Framer Motion |
| Charts | Recharts |
| Icons | lucide-react |

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
├── renderer/              # React app (shared between desktop + mobile)
│   ├── App.tsx            # Root component + router + AnimatePresence
│   ├── main.tsx           # Electron entry point
│   ├── main-mobile.tsx    # Capacitor entry point
│   ├── index.css          # Theme system (CSS vars, fonts, light/dark)
│   ├── lib/               # Platform utilities
│   │   ├── api-instance.ts # API singleton for Zustand stores
│   │   └── safe-area.ts   # Mobile safe area insets
│   ├── components/        # Reusable UI components
│   │   ├── Layout.tsx     # Responsive flex layout + safe area padding
│   │   ├── Sidebar.tsx    # Responsive nav (sidebar/bottom nav)
│   │   ├── ui/            # ThemeToggle, shared UI primitives
│   │   ├── charts/        # StreakCalendar, SkillRadar, SessionHistoryChart
│   │   ├── exercises/     # FillBlank, SentenceConstruction, Reading, Listening
│   │   └── vocab-boost/   # VocabQuizCard, VocabScoreBar, VocabSessionSummary
│   ├── pages/             # Page-level components
│   │   ├── Dashboard.tsx  # Stats + charts + exercise picker
│   │   ├── Exercise.tsx   # Exercise session
│   │   ├── Review.tsx     # Spaced repetition review
│   │   ├── VocabBoost.tsx # Danish synonym quiz (Google Word Coach style)
│   │   └── Settings.tsx   # Theme toggle + reset + about
│   ├── hooks/             # Custom React hooks
│   ├── __mocks__/         # Jest mocks (window-api, framer-motion, recharts)
│   └── store/             # Zustand stores (theme, chartData, session, vocabBoost)
│
├── content/               # Exercise content
│   ├── templates/         # Exercise templates (JSON)
│   ├── wordlists/         # Danish vocabulary (JSON)
│   └── generators/        # Exercise generation logic
│
├── shared/                # Shared between processes
│   ├── types/             # TypeScript interfaces
│   │   ├── index.ts       # Domain types
│   │   └── api.ts         # AppAPI interface (14 methods)
│   └── constants/         # IPC channel names, etc.
│
├── mobile/                # Capacitor mobile entry
│   └── index.html         # Mobile HTML shell (viewport-fit=cover)
│
└── preload/               # Electron preload scripts
    └── preload.ts         # Expose safe APIs to renderer

packages/
└── data-layer/            # Platform-agnostic data access
    └── src/
        ├── api-provider.tsx    # React context + useApi() hook
        ├── electron-api.ts     # Desktop: wraps window.api
        ├── capacitor-api.ts    # Mobile: direct SQLite via @capacitor-community/sqlite
        ├── migrations.ts       # Schema definitions for Capacitor
        └── index.ts

android/                   # Capacitor Android project (Gradle)
scripts/
└── release.js             # Bumps version, builds AAB + exe
```

## Test Infrastructure

- **Config**: `jest.config.ts` (ts-jest preset, jsdom environment)
- **Setup**: `jest.setup.ts` (@testing-library/jest-dom, window.api mock, matchMedia mock, Speech API mock)
- **Mocks**: `src/renderer/__mocks__/window-api.ts` (IPC), `framer-motion.tsx`, `recharts.tsx`
- **Path aliases**: Mapped in jest.config.ts to match tsconfig paths
- **Approach**: TDD — write failing tests first, implement to pass, refactor
- **Test count**: 56 tests across 17 suites

## UI Design System

- **Aesthetic**: Scandinavian minimal — warm earth tones, generous whitespace
- **Theme**: Dark/light toggle via CSS custom properties on `<html>` class
- **Colors**: Sage green (`#5B7F6A`) primary accent, terracotta (`#C17D56`) secondary, warm grays
- **Typography**: Outfit (sans, UI), Lora (serif, Danish passages)
- **Responsive**: 360px+ via `flex-col-reverse md:flex-row`; sidebar becomes bottom nav below 768px
- **Animations**: Framer Motion page transitions, CSS `.btn-hover` (scale 1.03), `.card-hover` (translateY -2px)
- **Accessibility**: ARIA labels/roles on all interactive elements, focus-visible ring, skip-to-content link
- **Persistence**: Theme saved via `window.api.saveSetting('theme', 'dark'|'light')`

## IPC Channels

| Channel | Direction | Purpose |
|---------|-----------|---------|
| `db:get-exercises` | renderer→main | Fetch exercises with filters |
| `db:get-exercise-by-id` | renderer→main | Fetch single exercise |
| `db:get-wordlist` | renderer→main | Fetch vocabulary |
| `db:save-progress` | renderer→main | Save SM-2 progress |
| `db:get-progress` | renderer→main | Get progress for exercise |
| `db:get-due-exercises` | renderer→main | Get exercises due for review |
| `db:get-session-history` | renderer→main | Get past sessions |
| `db:save-session` | renderer→main | Save completed session |
| `db:save-setting` | renderer→main | Persist key-value setting |
| `db:get-setting` | renderer→main | Read persisted setting |
| `db:get-stats` | renderer→main | Get overall stats |
| `db:get-stats-by-type` | renderer→main | Get accuracy per exercise type |
| `db:get-synonyms` | renderer→main | Fetch synonym pairs with filters |
| `db:reset-progress` | renderer→main | Clear all progress |

## Exercise Types

| Type | Description | Input | Output |
|------|------------|-------|--------|
| Fill-in-blank | Complete sentence with missing word | Sentence template + wordlist | User fills gap |
| Sentence construction | Build sentence from given words | Word set + grammar rule | User arranges words |
| Reading comprehension | Read passage, answer questions | Passage + question set | Multiple choice / free text |
| Listening | Listen to TTS, transcribe or answer | Danish text (spoken via TTS) | User types/selects answer |
| Vocab Boost | Danish synonym matching quiz | Synonym pairs + distractors | User picks from 4 choices |

## API Architecture

```
Desktop:  Renderer → getApiInstance() → window.api (preload IPC) → Main (sql.js)
Mobile:   Renderer → getApiInstance() → capacitor-api.ts → @capacitor-community/sqlite
```

- `AppAPI` interface (`src/shared/types/api.ts`) defines 14 methods
- `ApiProvider` React context wraps app, `getApiInstance()` singleton for Zustand stores
- Desktop: preload bridges renderer to main process via IPC
- Mobile: capacitor-api.ts accesses SQLite directly (no IPC needed)

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
