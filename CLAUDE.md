# CLAUDE.md

Danish Practice Generator — Electron + React + TypeScript desktop app for Danish B1-B2 practice.

---

## Documentation

All architecture, schema, SOPs, and task tracking live in `.agent/`. Start there:

**Read `.agent/README.md` before implementing anything.**

---

## Rules for Claude

- All Danish content must include English translations (for debugging)
- Exercise templates must validate against schema before use
- TDD: write failing tests first, implement to pass, refactor
- Update `.agent/` docs after implementing features
- Keep commits concise
- Sub-agents are **researchers/planners only** — parent agent implements
- whenever we make a change on the existing feature or building new feature, help me build a new version of desktop app .exe file

---

**Last Updated**: 2026-04-08
