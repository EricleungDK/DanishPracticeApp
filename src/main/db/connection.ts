import initSqlJs, { type Database } from 'sql.js';
import { app } from 'electron';
import path from 'node:path';
import fs from 'node:fs';
import { runMigrations } from './migrate';
import { seedDatabase } from './seed';

let db: Database | null = null;
let dbPath: string = '';
let saveTimer: ReturnType<typeof setTimeout> | null = null;
const SAVE_DEBOUNCE_MS = 2500;

export function getDb(): Database {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}

export async function initDatabase(): Promise<void> {
  const wasmBinary = await fs.promises.readFile(path.join(__dirname, 'sql-wasm.wasm'));
  const SQL = await initSqlJs({ wasmBinary });

  dbPath = path.join(app.getPath('userData'), 'danish-practice.db');

  const isNew = !fs.existsSync(dbPath);

  if (!isNew) {
    const buffer = fs.readFileSync(dbPath);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }

  db.run('PRAGMA foreign_keys = ON;');
  runMigrations(db);
  seedDatabase(db);

  if (isNew) {
    flushDb();
  }
}

/** Write the DB to disk immediately, cancelling any pending debounced write. */
export function flushDb(): void {
  if (saveTimer !== null) {
    clearTimeout(saveTimer);
    saveTimer = null;
  }
  if (db && dbPath) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
  }
}

/** Schedule a debounced write. Multiple rapid calls collapse into one write. */
export function saveDb(): void {
  if (!db || !dbPath) return;
  if (saveTimer !== null) {
    clearTimeout(saveTimer);
  }
  saveTimer = setTimeout(() => {
    saveTimer = null;
    if (db && dbPath) {
      const data = db.export();
      const buffer = Buffer.from(data);
      fs.writeFileSync(dbPath, buffer);
    }
  }, SAVE_DEBOUNCE_MS);
}

export function closeDatabase(): void {
  if (db) {
    flushDb();
    db.close();
    db = null;
  }
}

export type { Database };
