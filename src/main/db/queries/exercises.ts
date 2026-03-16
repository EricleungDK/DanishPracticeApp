import type { Database } from 'sql.js';
import type { Exercise, ExerciseFilters } from '../../../shared/types';

export function getAllExercises(db: Database, filters?: ExerciseFilters): Exercise[] {
  let sql = 'SELECT * FROM exercises';
  const conditions: string[] = [];
  const params: any[] = [];

  if (filters?.type) {
    conditions.push('type = ?');
    params.push(filters.type);
  }
  if (filters?.difficulty) {
    conditions.push('difficulty = ?');
    params.push(filters.difficulty);
  }
  if (filters?.topic) {
    conditions.push('topic = ?');
    params.push(filters.topic);
  }

  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }

  return queryAll(db, sql, params).map(parseExerciseRow);
}

export function getExerciseById(db: Database, id: string): Exercise | undefined {
  const rows = queryAll(db, 'SELECT * FROM exercises WHERE id = ?', [id]);
  return rows.length > 0 ? parseExerciseRow(rows[0]) : undefined;
}

export function insertExercise(db: Database, exercise: Exercise): void {
  db.run(
    `INSERT OR IGNORE INTO exercises (id, type, difficulty, topic, danish_text, english_text, answer_key, metadata)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      exercise.id,
      exercise.type,
      exercise.difficulty,
      exercise.topic,
      exercise.danish_text,
      exercise.english_text,
      JSON.stringify(exercise.answer_key),
      JSON.stringify(exercise.metadata),
    ],
  );
}

export function getExerciseCount(db: Database): number {
  const rows = queryAll(db, 'SELECT COUNT(*) as count FROM exercises', []);
  return rows[0]?.count || 0;
}

function parseExerciseRow(row: any): Exercise {
  return {
    ...row,
    answer_key: JSON.parse(row.answer_key),
    metadata: row.metadata ? JSON.parse(row.metadata) : {},
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
