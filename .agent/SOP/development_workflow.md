# Development Workflow — Danish Practice Generator

**Last Updated**: 2026-03-16

## Setup

1. Install Node.js 20+ and npm/pnpm
2. Clone repo and `npm install`
3. `npm run dev` — starts Electron with HMR for renderer

## Daily Workflow

1. `git checkout -b feat/<feature-name>` or `fix/<bug-name>`
2. Develop with `npm run dev` running
3. Write tests alongside code
4. `npm test` before committing
5. Commit with concise message
6. PR when ready

## Electron Dev Notes

- **Main process**: Restart required on changes (no HMR)
- **Renderer**: Vite HMR — instant updates
- **DevTools**: Ctrl+Shift+I in app window
- **Main process logs**: Terminal where `npm run dev` runs

## Git Conventions

- Branch: `feat/`, `fix/`, `refactor/`, `content/`
- Commits: concise, present tense ("add exercise engine", "fix SM-2 calculation")
- No auto-generated signatures in commits

## Testing

- `npm test` — Jest unit + integration tests
- `npm run test:e2e` — Playwright Electron tests
- `npx tsc --noEmit` — Type checking
