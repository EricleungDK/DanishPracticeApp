import type { Database } from 'sql.js';
import type { SynonymEntry, SynonymFilters } from '../../../shared/types';

export function getSynonymCount(db: Database): number {
  const stmt = db.prepare('SELECT COUNT(*) as count FROM synonyms');
  stmt.step();
  const count = (stmt.getAsObject() as any).count || 0;
  stmt.free();
  return count;
}

export function insertSynonym(db: Database, entry: SynonymEntry): void {
  db.run(
    `INSERT OR IGNORE INTO synonyms (id, word, synonym, part_of_speech, topic, cefr_level, example_da, example_synonym_da, hint_en)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      entry.id,
      entry.word,
      entry.synonym,
      entry.part_of_speech,
      entry.topic || null,
      entry.cefr_level || 'B1',
      entry.example_da || null,
      entry.example_synonym_da || null,
      entry.hint_en || null,
    ],
  );
}

export function getSynonyms(db: Database, filters?: SynonymFilters): SynonymEntry[] {
  let sql = 'SELECT * FROM synonyms WHERE 1=1';
  const params: any[] = [];

  if (filters?.topic) {
    sql += ' AND topic = ?';
    params.push(filters.topic);
  }
  if (filters?.cefr_level) {
    sql += ' AND cefr_level = ?';
    params.push(filters.cefr_level);
  }
  if (filters?.part_of_speech) {
    sql += ' AND part_of_speech = ?';
    params.push(filters.part_of_speech);
  }

  const stmt = db.prepare(sql);
  stmt.bind(params);
  const results: SynonymEntry[] = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject() as unknown as SynonymEntry);
  }
  stmt.free();
  return results;
}
