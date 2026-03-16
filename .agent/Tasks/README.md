# Roadmap — Danish Practice Generator

## Phases

### Phase 1: Project Scaffolding
- [ ] Initialize Electron + React + TypeScript project
- [ ] Configure electron-forge or electron-builder
- [ ] Set up Vite for renderer bundling
- [ ] Configure TypeScript, ESLint, Prettier
- [ ] Basic window creation and dev workflow

### Phase 2: Database & Data Models
- [ ] Set up better-sqlite3 in main process
- [ ] Create migration system
- [ ] Implement tables: exercises, wordlists, user_progress, session_history, settings
- [ ] IPC handlers for CRUD operations

### Phase 3: Exercise Engine
- [ ] Template parser for each exercise type
- [ ] Answer checking logic
- [ ] Exercise generator (picks from templates + wordlists)
- [ ] Scoring system

### Phase 4: Spaced Repetition
- [ ] Implement SM-2 algorithm
- [ ] Review scheduling
- [ ] Due exercise queue
- [ ] Progress statistics

### Phase 5: UI/UX
- [ ] Dashboard (progress overview, due reviews, streaks)
- [ ] Exercise session screen
- [ ] Review mode screen
- [ ] Settings screen
- [ ] Navigation and routing

### Phase 6: TTS Integration
- [ ] Web Speech API or system TTS bridge
- [ ] Speed control (normal/slow)
- [ ] Listening exercise playback

### Phase 7: Content Creation
- [ ] B1 vocabulary wordlist (500+ entries)
- [ ] B2 vocabulary wordlist (500+ entries)
- [ ] Fill-in-blank templates (50+)
- [ ] Sentence construction templates (50+)
- [ ] Reading passages (20+)
- [ ] Listening exercises (20+)

### Phase 8: Packaging & Distribution
- [ ] electron-builder config for Win/Mac/Linux
- [ ] App icons and branding
- [ ] Auto-update setup (electron-updater)
- [ ] Cross-platform testing
