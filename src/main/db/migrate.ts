import type { Database } from 'sql.js';

interface Migration {
  version: number;
  name: string;
  up: string;
}

const migrations: Migration[] = [
  {
    version: 1,
    name: 'create_tables',
    up: `
      CREATE TABLE IF NOT EXISTS exercises (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL CHECK(type IN ('fill_blank', 'sentence_construction', 'reading', 'listening')),
        difficulty TEXT NOT NULL CHECK(difficulty IN ('B1', 'B2')),
        topic TEXT,
        danish_text TEXT NOT NULL,
        english_text TEXT NOT NULL,
        answer_key TEXT NOT NULL,
        metadata TEXT,
        created_at TEXT DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS wordlists (
        id TEXT PRIMARY KEY,
        danish TEXT NOT NULL UNIQUE,
        english TEXT NOT NULL,
        part_of_speech TEXT NOT NULL,
        gender TEXT,
        cefr_level TEXT NOT NULL CHECK(cefr_level IN ('B1', 'B2')),
        topic TEXT,
        example_sentence TEXT,
        irregular_forms TEXT,
        created_at TEXT DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS user_progress (
        id TEXT PRIMARY KEY,
        exercise_id TEXT NOT NULL UNIQUE REFERENCES exercises(id) ON DELETE CASCADE,
        ease_factor REAL NOT NULL DEFAULT 2.5,
        interval INTEGER NOT NULL DEFAULT 0,
        repetitions INTEGER NOT NULL DEFAULT 0,
        next_review TEXT NOT NULL,
        last_review TEXT,
        quality_history TEXT
      );

      CREATE TABLE IF NOT EXISTS session_history (
        id TEXT PRIMARY KEY,
        started_at TEXT NOT NULL,
        ended_at TEXT,
        exercise_type TEXT,
        exercises_completed INTEGER DEFAULT 0,
        correct_count INTEGER DEFAULT 0,
        total_score REAL
      );

      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_progress_next_review ON user_progress(next_review);
      CREATE INDEX IF NOT EXISTS idx_progress_exercise ON user_progress(exercise_id);
      CREATE INDEX IF NOT EXISTS idx_exercises_type ON exercises(type);
      CREATE INDEX IF NOT EXISTS idx_exercises_difficulty ON exercises(difficulty);
      CREATE INDEX IF NOT EXISTS idx_wordlists_cefr ON wordlists(cefr_level);
      CREATE INDEX IF NOT EXISTS idx_wordlists_topic ON wordlists(topic);
      CREATE INDEX IF NOT EXISTS idx_session_started ON session_history(started_at);
    `,
  },
];

export function runMigrations(db: Database): void {
  db.run(`
    CREATE TABLE IF NOT EXISTS _migrations (
      version INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      applied_at TEXT DEFAULT (datetime('now'))
    );
  `);

  const stmt = db.prepare('SELECT version FROM _migrations');
  const applied: number[] = [];
  while (stmt.step()) {
    applied.push(stmt.getAsObject().version as number);
  }
  stmt.free();

  for (const migration of migrations) {
    if (!applied.includes(migration.version)) {
      db.exec(migration.up);
      db.run('INSERT INTO _migrations (version, name) VALUES (?, ?)', [
        migration.version,
        migration.name,
      ]);
    }
  }
}
