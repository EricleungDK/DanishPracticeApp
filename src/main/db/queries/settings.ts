import type { Database } from 'sql.js';

export function getSetting(db: Database, key: string): string | undefined {
  const stmt = db.prepare('SELECT value FROM settings WHERE key = ?');
  stmt.bind([key]);
  let result: string | undefined;
  if (stmt.step()) {
    result = stmt.getAsObject().value as string;
  }
  stmt.free();
  return result;
}

export function saveSetting(db: Database, key: string, value: string): void {
  db.run(
    'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
    [key, value],
  );
}
