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

---

**Last Updated**: 2026-04-08
