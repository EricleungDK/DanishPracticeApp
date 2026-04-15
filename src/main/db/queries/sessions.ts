import type { Database } from 'sql.js';
import type { SessionHistory } from '../../../shared/types';

export function saveSession(db: Database, session: SessionHistory): void {
  db.run(
    `INSERT INTO session_history (id, started_at, ended_at, exercise_type, exercises_completed, correct_count, total_score)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      session.id,
      session.started_at,
      session.ended_at || null,
      session.exercise_type || null,
      session.exercises_completed,
      session.correct_count,
      session.total_score || null,
    ],
  );
}

export function getSessionHistory(db: Database, limit: number = 20): SessionHistory[] {
  const stmt = db.prepare('SELECT * FROM session_history ORDER BY started_at DESC LIMIT ?');
  stmt.bind([limit]);
  const results: SessionHistory[] = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject() as any);
  }
  stmt.free();
  return results.reverse();
}
