# Database Migrations — Danish Practice Generator

**Last Updated**: 2026-03-16
**Engine**: SQLite via better-sqlite3

## Approach

Versioned SQL migration files in `src/main/db/migrations/`. Each migration has UP and DOWN.

## File Naming

```
001_create_exercises.sql
002_create_wordlists.sql
003_create_user_progress.sql
```

## Creating a Migration

1. Create new SQL file with next version number
2. Write UP migration (CREATE/ALTER)
3. Write DOWN migration (DROP/revert)
4. Test: run migration, verify, run rollback, verify

## Example

```sql
-- UP
CREATE TABLE IF NOT EXISTS exercises (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  danish_text TEXT NOT NULL,
  english_text TEXT NOT NULL,
  answer_key TEXT NOT NULL,
  metadata TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- DOWN
DROP TABLE IF EXISTS exercises;
```

## Best Practices

- Always backup database before migrations
- Test both UP and DOWN
- Never modify existing migrations — create new ones
- Keep migrations small and focused
