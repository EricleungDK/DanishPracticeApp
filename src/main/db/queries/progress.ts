import type { Database } from 'sql.js';
import type { UserProgress, Exercise, OverallStats, StatsByType, ExerciseType } from '../../../shared/types';

export function getProgress(db: Database, exerciseId: string): UserProgress | undefined {
  const rows = queryAll(db, 'SELECT * FROM user_progress WHERE exercise_id = ?', [exerciseId]);
  return rows.length > 0 ? parseProgressRow(rows[0]) : undefined;
}

export function upsertProgress(db: Database, data: UserProgress): void {
  db.run(
    `INSERT INTO user_progress (id, exercise_id, ease_factor, interval, repetitions, next_review, last_review, quality_history)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(exercise_id) DO UPDATE SET
       ease_factor = excluded.ease_factor,
       interval = excluded.interval,
       repetitions = excluded.repetitions,
       next_review = excluded.next_review,
       last_review = excluded.last_review,
       quality_history = excluded.quality_history`,
    [
      data.id,
      data.exercise_id,
      data.ease_factor,
      data.interval,
      data.repetitions,
      data.next_review,
      data.last_review || null,
      data.quality_history ? JSON.stringify(data.quality_history) : null,
    ],
  );
}

export function getDueExercises(db: Database): Exercise[] {
  const today = new Date().toISOString().split('T')[0];

  const rows = queryAll(
    db,
    `SELECT e.* FROM exercises e
     INNER JOIN user_progress p ON e.id = p.exercise_id
     WHERE p.next_review <= ?
     UNION
     SELECT e.* FROM exercises e
     WHERE e.id NOT IN (SELECT exercise_id FROM user_progress)`,
    [today],
  );

  return rows.map((row: any) => ({
    ...row,
    answer_key: JSON.parse(row.answer_key),
    metadata: row.metadata ? JSON.parse(row.metadata) : {},
  }));
}

export function getStats(db: Database): OverallStats {
  const today = new Date().toISOString().split('T')[0];

  const totalRows = queryAll(
    db,
    'SELECT COUNT(*) as count FROM user_progress WHERE last_review IS NOT NULL',
    [],
  );
  const totalReviewed = totalRows[0]?.count || 0;

  const historyRows = queryAll(
    db,
    'SELECT quality_history FROM user_progress WHERE quality_history IS NOT NULL',
    [],
  );

  let totalAnswers = 0;
  let correctAnswers = 0;
  for (const row of historyRows) {
    const history: number[] = JSON.parse(row.quality_history);
    totalAnswers += history.length;
    correctAnswers += history.filter((q: number) => q >= 3).length;
  }

  const dueRows = queryAll(
    db,
    `SELECT COUNT(*) as count FROM (
      SELECT e.id FROM exercises e
      INNER JOIN user_progress p ON e.id = p.exercise_id
      WHERE p.next_review <= ?
      UNION
      SELECT e.id FROM exercises e
      WHERE e.id NOT IN (SELECT exercise_id FROM user_progress)
    )`,
    [today],
  );
  const dueCount = dueRows[0]?.count || 0;

  const sessions = queryAll(
    db,
    `SELECT DISTINCT date(started_at) as day FROM session_history
     ORDER BY day DESC LIMIT 30`,
    [],
  );

  let streak = 0;
  const now = new Date();
  for (let i = 0; i < sessions.length; i++) {
    const expected = new Date(now);
    expected.setDate(expected.getDate() - i);
    const expectedStr = expected.toISOString().split('T')[0];
    if (sessions[i].day === expectedStr) {
      streak++;
    } else {
      break;
    }
  }

  return {
    totalReviewed,
    accuracy: totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0,
    dueCount,
    streak,
  };
}

export function getStatsByType(db: Database): StatsByType[] {
  const rows = queryAll(
    db,
    `SELECT e.type,
       COUNT(*) as total,
       SUM(CASE WHEN p.quality_history IS NOT NULL THEN
         (SELECT COUNT(*) FROM json_each(p.quality_history) WHERE json_each.value >= 3)
       ELSE 0 END) as correct
     FROM user_progress p
     JOIN exercises e ON e.id = p.exercise_id
     WHERE p.last_review IS NOT NULL
     GROUP BY e.type`,
    [],
  );

  return rows.map((row: any) => ({
    type: row.type as ExerciseType,
    total: row.total || 0,
    correct: row.correct || 0,
  }));
}

export function resetProgress(db: Database): void {
  db.run('DELETE FROM user_progress');
  db.run('DELETE FROM session_history');
}

function parseProgressRow(row: any): UserProgress {
  return {
    ...row,
    quality_history: row.quality_history ? JSON.parse(row.quality_history) : [],
  };
}

function queryAll(db: Database, sql: string, params: any[]): any[] {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const results: any[] = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();
  return results;
}
