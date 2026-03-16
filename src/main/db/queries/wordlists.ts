import type { Database } from 'sql.js';
import type { WordEntry, WordlistFilters } from '../../../shared/types';

export function getWordlist(db: Database, filters?: WordlistFilters): WordEntry[] {
  let sql = 'SELECT * FROM wordlists';
  const conditions: string[] = [];
  const params: any[] = [];

  if (filters?.cefr_level) {
    conditions.push('cefr_level = ?');
    params.push(filters.cefr_level);
  }
  if (filters?.topic) {
    conditions.push('topic = ?');
    params.push(filters.topic);
  }
  if (filters?.part_of_speech) {
    conditions.push('part_of_speech = ?');
    params.push(filters.part_of_speech);
  }

  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }

  return queryAll(db, sql, params).map(parseWordRow);
}

export function insertWord(db: Database, word: WordEntry): void {
  db.run(
    `INSERT OR IGNORE INTO wordlists (id, danish, english, part_of_speech, gender, cefr_level, topic, example_sentence, irregular_forms)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      word.id,
      word.danish,
      word.english,
      word.part_of_speech,
      word.gender || null,
      word.cefr_level,
      word.topic,
      word.example_sentence || null,
      word.irregular_forms ? JSON.stringify(word.irregular_forms) : null,
    ],
  );
}

function parseWordRow(row: any): WordEntry {
  return {
    ...row,
    irregular_forms: row.irregular_forms ? JSON.parse(row.irregular_forms) : undefined,
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
