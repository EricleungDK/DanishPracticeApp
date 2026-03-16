# Danish Practice Generator — Project Documentation

**Last Updated**: 2026-03-16
**Status**: Initial Setup

## Quick Start

1. Read [Project Architecture](System/project_architecture.md) — understand the Electron + React stack
2. Follow [Development Workflow](SOP/development_workflow.md) — setup and dev process
3. Review [Database Schema](System/database_schema.md) — SQLite data model
4. Check [Current Tasks](Tasks/context.md) — what we're working on

## Documentation Structure

```
.agent/
├── System/                        # System architecture & design
│   ├── project_architecture.md    # Electron + React architecture
│   ├── database_schema.md         # SQLite tables & relationships
│   └── exercise_schema.md         # Exercise template formats
│
├── Tasks/                         # Roadmap & implementation plans
│   ├── context.md                 # Central context file (CRITICAL)
│   └── README.md                  # Feature roadmap
│
├── SOP/                           # Standard Operating Procedures
│   ├── development_workflow.md    # Dev setup & daily workflow
│   ├── database_migrations.md     # SQLite migration process
│   └── deployment.md              # Packaging & distribution
│
├── Reports/                       # Sub-agent research reports
│
└── README.md                      # This file
```

## How do I...

| Question | Document |
|----------|----------|
| ...understand the system? | [Project Architecture](System/project_architecture.md) |
| ...set up dev environment? | [Development Workflow](SOP/development_workflow.md) |
| ...add an exercise type? | [Exercise Schema](System/exercise_schema.md) |
| ...modify the database? | [Database Migrations](SOP/database_migrations.md) |
| ...package the app? | [Deployment](SOP/deployment.md) |
| ...check current progress? | [Tasks](Tasks/context.md) |

## Central Context File

**Critical**: `.agent/Tasks/context.md` — single source of truth for project state, active tasks, architecture decisions, and agent delegations.
