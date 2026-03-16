# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

---

## Project Overview

**Danish Practice Generator** is a desktop application for practicing Danish at B1-B2 level.

**Features**:
- Fill-in-the-blank exercises
- Sentence construction with new vocabulary
- Reading comprehension passages with questions
- Listening exercises via TTS
- Spaced repetition (SM-2) for progress tracking
- Offline-first — no network required for core functionality

**Stack**: Electron + React + TypeScript
**Database**: SQLite (local, via better-sqlite3)
**Platform**: Windows / macOS / Linux

---

## Agent Orchestration System

Claude Code uses a specialized agent orchestration system with file-based context management to handle different types of tasks efficiently.

### Sub-Agent System Architecture

**Core Principle**: Sub-agents are **researchers and planners**, NOT implementers. The parent agent (Claude Code) does the actual implementation based on sub-agent reports.

**File-Based Context Management**:
- **Central Context**: `.agent/Tasks/context.md` - Single source of truth for project state
- **Sub-Agent Reports**: `.agent/Reports/<agent>-YYYYMMDD-<task>.md` - Detailed findings
- **Workflow**:
  1. Parent agent updates context.md before consulting
  2. Sub-agent reads context.md to understand project state
  3. Sub-agent creates detailed report in Reports/
  4. Sub-agent updates context.md with activity log
  5. Parent agent reads report and implements recommendations

### Available Specialized Agents

**1. systematic-debugger** - Root cause investigation and debug planning
- **Deliverable**: `.agent/Reports/debugger-YYYYMMDD-<issue>.md`
- **When**: Fixing bugs, investigating errors, debugging Electron/React/IPC issues
- **Trigger**: "Fix [something]", "There's an issue/error/bug", "Debug this"

**2. comprehensive-test-executor** - Testing and validation
- **Deliverable**: `.agent/Reports/test-executor-YYYYMMDD-<feature>.md`
- **When**: After implementing features or bug fixes
- **Trigger**: "Test this", "Validate this feature", "Run tests"

**3. exercise-content-validator** - Exercise template and content validation
- **Deliverable**: `.agent/Reports/content-validator-YYYYMMDD-<change>.md`
- **When**: Adding/modifying exercise templates, wordlists, or SQLite schema
- **Trigger**: "Validate exercises", "Check templates", "Review content"

**4. eod-commit-summarizer** - End-of-day workflow
- **Deliverable**: Git commits + daily summary
- **When**: End of work session
- **Trigger**: "eod now", "end of day", "wrap up today"

### Parent Agent Responsibilities

1. **Before consulting**: Update `.agent/Tasks/context.md`, check Active Delegations
2. **After completion**: Read report, implement changes, update context.md, mark COMPLETED
3. **Context maintenance**: Keep Active Tasks current, log completed steps

### Active Delegations Tracking

**REQUIRED in `.agent/Tasks/context.md`**:

```markdown
## Active Delegations

| Sub-Agent | Task ID | Status | Started | Expected Completion |
|-----------|---------|--------|---------|-------------------|
```

---

## Directory Router

| Your Task | Read This File | When |
|-----------|----------------|------|
| Main project guidance | `CLAUDE.md` (this file) | General questions, agent system |
| Electron main process | `src/main/` | Main process, IPC, window mgmt |
| React renderer | `src/renderer/` | UI components, exercises, state |
| Exercise content | `src/content/` | Templates, wordlists, generators |
| Agent system | `CLAUDE.md` (this file) | Debugging, testing, validation |

---

## Reference Documentation

- `.agent/System/project_architecture.md` - Electron + React architecture, project structure
- `.agent/System/database_schema.md` - SQLite tables & relationships
- `.agent/System/exercise_schema.md` - Exercise template formats, wordlist structure

See `.agent/SOP/` for procedures:
- Development workflow
- Database migrations (SQLite)
- Packaging & distribution

---

## Documentation Policy

```
.agent/
├── Tasks/           - Roadmap & implementation plans
├── System/          - Architecture, schema, exercise formats
├── SOP/             - Standard operating procedures
└── Reports/         - Agent research findings
```

**Before implementing**: Always read `.agent/README.md` first to get context

---

## Key Constraints

- Electron security: context isolation ON, no nodeIntegration in renderer
- Offline-first: all core features work without network
- SQLite ops async via IPC — never block main process
- All Danish content must include English translations (for debugging)
- Exercise templates must validate against schema before use
- TDD cycle: write tests alongside code
- Update documentation after implementing features
- Keep commits concise

---

**Last Updated**: 2026-03-16
