import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite'
import { getMigrations } from './migrations'
import type { AppAPI } from '../../../src/shared/types/api'
import type {
  Exercise, ExerciseFilters, WordEntry, WordlistFilters,
  UserProgress, SessionHistory, OverallStats, StatsByType,
  SynonymEntry, SynonymFilters, ExerciseType,
} from '../../../src/shared/types'

// Seed data imports — bundled by Vite
import fillBlankData from '../../../src/content/templates/fill-blank.json'
import sentenceData from '../../../src/content/templates/sentence-construction.json'
import readingData from '../../../src/content/templates/reading.json'
import listeningData from '../../../src/content/templates/listening.json'
import vocabularyData from '../../../src/content/wordlists/vocabulary.json'
import synonymsData from '../../../src/content/wordlists/synonyms.json'

const DB_NAME = 'danish-practice'

let dbPromise: Promise<SQLiteDBConnection> | null = null

async function initDb(): Promise<SQLiteDBConnection> {
  const sqlite = new SQLiteConnection(CapacitorSQLite)
  const ret = await sqlite.checkConnectionsConsistency()
  const isConn = (await sqlite.isConnection(DB_NAME, false)).result
  let conn: SQLiteDBConnection
  if (ret.result && isConn) {
    conn = await sqlite.retrieveConnection(DB_NAME, false)
  } else {
    conn = await sqlite.createConnection(DB_NAME, false, 'no-encryption', 1, false)
  }
  await conn.open()
  await conn.query('PRAGMA journal_mode = WAL')
  await conn.query('PRAGMA foreign_keys = ON')
  await runMigrations(conn)
  await seedIfEmpty(conn)
  return conn
}

function getDb(): Promise<SQLiteDBConnection> {
  if (!dbPromise) {
    dbPromise = initDb().catch((err) => {
      dbPromise = null
      throw err
    })
  }
  return dbPromise
}

function isDDL(stmt: string): boolean {
  const first = stmt.trim().split(/\s+/)[0].toUpperCase()
  return ['CREATE', 'ALTER', 'DROP', 'PRAGMA'].includes(first)
}

async function runMigrations(conn: SQLiteDBConnection): Promise<void> {
  await conn.execute(
    'CREATE TABLE IF NOT EXISTS _migrations (version INTEGER PRIMARY KEY, name TEXT NOT NULL, applied_at TEXT DEFAULT (datetime(\'now\')))',
    false,
  )
  for (const migration of getMigrations()) {
    const res = await conn.query('SELECT version FROM _migrations WHERE version = ?', [migration.version])
    if (!res.values || res.values.length === 0) {
      const statements = migration.up.split(';').map(s => s.trim()).filter(s => s.length > 0)
      for (const stmt of statements) {
        try {
          if (isDDL(stmt)) {
            await conn.execute(stmt, false)
          } else {
            await conn.run(stmt, [], false)
          }
        } catch (err: any) {
          const msg = err?.message ?? String(err)
          if (msg.includes('already exists') || msg.includes('duplicate')) continue
          throw err
        }
      }
      await conn.run('INSERT INTO _migrations (version, name) VALUES (?, ?)', [migration.version, migration.name], false)
    }
  }
}

async function seedIfEmpty(conn: SQLiteDBConnection): Promise<void> {
  const exRes = await conn.query('SELECT COUNT(*) as count FROM exercises')
  if ((exRes.values?.[0]?.count ?? 0) === 0) {
    const allExercises = [...fillBlankData, ...sentenceData, ...readingData, ...listeningData] as Exercise[]
    for (const e of allExercises) {
      await conn.run(
        'INSERT OR IGNORE INTO exercises (id, type, difficulty, topic, danish_text, english_text, answer_key, metadata) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [e.id, e.type, e.difficulty, e.topic, e.danish_text, e.english_text, JSON.stringify(e.answer_key), JSON.stringify(e.metadata)],
        false,
      )
    }
    for (const w of vocabularyData as WordEntry[]) {
      await conn.run(
        'INSERT OR IGNORE INTO wordlists (id, danish, english, part_of_speech, gender, cefr_level, topic, example_sentence, irregular_forms) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [w.id, w.danish, w.english, w.part_of_speech, w.gender || null, w.cefr_level, w.topic, w.example_sentence || null, w.irregular_forms ? JSON.stringify(w.irregular_forms) : null],
        false,
      )
    }
  }

  const synRes = await conn.query('SELECT COUNT(*) as count FROM synonyms')
  if ((synRes.values?.[0]?.count ?? 0) === 0) {
    for (const s of synonymsData as SynonymEntry[]) {
      await conn.run(
        'INSERT OR IGNORE INTO synonyms (id, word, synonym, part_of_speech, topic, cefr_level, example_da, example_synonym_da, hint_en) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [s.id, s.word, s.synonym, s.part_of_speech, s.topic || null, s.cefr_level || 'B1', s.example_da || null, s.example_synonym_da || null, s.hint_en || null],
        false,
      )
    }
  }
}

function parseExerciseRow(row: any): Exercise {
  return { ...row, answer_key: JSON.parse(row.answer_key), metadata: row.metadata ? JSON.parse(row.metadata) : {} }
}

function parseWordRow(row: any): WordEntry {
  return { ...row, irregular_forms: row.irregular_forms ? JSON.parse(row.irregular_forms) : undefined }
}

function parseProgressRow(row: any): UserProgress {
  return { ...row, quality_history: row.quality_history ? JSON.parse(row.quality_history) : [] }
}

export function createCapacitorApi(): AppAPI {
  return {
    async getExercises(filters?: ExerciseFilters): Promise<Exercise[]> {
      const conn = await getDb()
      let sql = 'SELECT * FROM exercises WHERE 1=1'
      const params: any[] = []
      if (filters?.type) { sql += ' AND type = ?'; params.push(filters.type) }
      if (filters?.difficulty) { sql += ' AND difficulty = ?'; params.push(filters.difficulty) }
      if (filters?.topic) { sql += ' AND topic = ?'; params.push(filters.topic) }
      const res = await conn.query(sql, params)
      return (res.values ?? []).map(parseExerciseRow)
    },

    async getExerciseById(id: string): Promise<Exercise | undefined> {
      const conn = await getDb()
      const res = await conn.query('SELECT * FROM exercises WHERE id = ?', [id])
      return res.values?.[0] ? parseExerciseRow(res.values[0]) : undefined
    },

    async getWordlist(filters?: WordlistFilters): Promise<WordEntry[]> {
      const conn = await getDb()
      let sql = 'SELECT * FROM wordlists WHERE 1=1'
      const params: any[] = []
      if (filters?.cefr_level) { sql += ' AND cefr_level = ?'; params.push(filters.cefr_level) }
      if (filters?.topic) { sql += ' AND topic = ?'; params.push(filters.topic) }
      if (filters?.part_of_speech) { sql += ' AND part_of_speech = ?'; params.push(filters.part_of_speech) }
      const res = await conn.query(sql, params)
      return (res.values ?? []).map(parseWordRow)
    },

    async saveProgress(data: UserProgress): Promise<{ success: boolean }> {
      const conn = await getDb()
      await conn.run(
        `INSERT INTO user_progress (id, exercise_id, ease_factor, interval, repetitions, next_review, last_review, quality_history)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(exercise_id) DO UPDATE SET
           ease_factor = excluded.ease_factor, interval = excluded.interval,
           repetitions = excluded.repetitions, next_review = excluded.next_review,
           last_review = excluded.last_review, quality_history = excluded.quality_history`,
        [data.id, data.exercise_id, data.ease_factor, data.interval, data.repetitions, data.next_review, data.last_review || null, data.quality_history ? JSON.stringify(data.quality_history) : null],
        false,
      )
      return { success: true }
    },

    async getProgress(exerciseId: string): Promise<UserProgress | undefined> {
      const conn = await getDb()
      const res = await conn.query('SELECT * FROM user_progress WHERE exercise_id = ?', [exerciseId])
      return res.values?.[0] ? parseProgressRow(res.values[0]) : undefined
    },

    async getDueExercises(): Promise<Exercise[]> {
      const conn = await getDb()
      const today = new Date().toISOString().split('T')[0]
      const res = await conn.query(
        `SELECT e.* FROM exercises e
         INNER JOIN user_progress p ON e.id = p.exercise_id WHERE p.next_review <= ?
         UNION
         SELECT e.* FROM exercises e WHERE e.id NOT IN (SELECT exercise_id FROM user_progress)`,
        [today],
      )
      return (res.values ?? []).map(parseExerciseRow)
    },

    async getSessionHistory(limit?: number): Promise<SessionHistory[]> {
      const conn = await getDb()
      const res = await conn.query('SELECT * FROM session_history ORDER BY started_at DESC LIMIT ?', [limit ?? 20])
      return (res.values ?? []) as SessionHistory[]
    },

    async saveSession(session: SessionHistory): Promise<{ success: boolean }> {
      const conn = await getDb()
      await conn.run(
        'INSERT INTO session_history (id, started_at, ended_at, exercise_type, exercises_completed, correct_count, total_score) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [session.id, session.started_at, session.ended_at || null, session.exercise_type || null, session.exercises_completed, session.correct_count, session.total_score || null],
        false,
      )
      return { success: true }
    },

    async saveSetting(key: string, value: string): Promise<{ success: boolean }> {
      const conn = await getDb()
      await conn.run(
        'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
        [key, value],
        false,
      )
      return { success: true }
    },

    async getSetting(key: string): Promise<string | undefined> {
      const conn = await getDb()
      const res = await conn.query('SELECT value FROM settings WHERE key = ?', [key])
      return res.values?.[0]?.value ?? undefined
    },

    async getStats(): Promise<OverallStats> {
      const conn = await getDb()
      const today = new Date().toISOString().split('T')[0]

      const totalRes = await conn.query('SELECT COUNT(*) as count FROM user_progress WHERE last_review IS NOT NULL')
      const totalReviewed = totalRes.values?.[0]?.count || 0

      const histRes = await conn.query('SELECT quality_history FROM user_progress WHERE quality_history IS NOT NULL')
      let totalAnswers = 0, correctAnswers = 0
      for (const row of histRes.values ?? []) {
        const history: number[] = JSON.parse(row.quality_history)
        totalAnswers += history.length
        correctAnswers += history.filter((q: number) => q >= 3).length
      }

      const dueRes = await conn.query(
        `SELECT COUNT(*) as count FROM (
          SELECT e.id FROM exercises e INNER JOIN user_progress p ON e.id = p.exercise_id WHERE p.next_review <= ?
          UNION
          SELECT e.id FROM exercises e WHERE e.id NOT IN (SELECT exercise_id FROM user_progress)
        )`,
        [today],
      )
      const dueCount = dueRes.values?.[0]?.count || 0

      const sessRes = await conn.query('SELECT DISTINCT date(started_at) as day FROM session_history ORDER BY day DESC LIMIT 30')
      let streak = 0
      const now = new Date()
      for (let i = 0; i < (sessRes.values?.length ?? 0); i++) {
        const expected = new Date(now)
        expected.setDate(expected.getDate() - i)
        const expectedStr = expected.toISOString().split('T')[0]
        if (sessRes.values![i].day === expectedStr) streak++
        else break
      }

      return {
        totalReviewed,
        accuracy: totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0,
        dueCount,
        streak,
      }
    },

    async getStatsByType(): Promise<StatsByType[]> {
      const conn = await getDb()
      const res = await conn.query(
        `SELECT e.type, COUNT(*) as total,
           SUM(CASE WHEN p.quality_history IS NOT NULL THEN
             (SELECT COUNT(*) FROM json_each(p.quality_history) WHERE json_each.value >= 3)
           ELSE 0 END) as correct
         FROM user_progress p JOIN exercises e ON e.id = p.exercise_id
         WHERE p.last_review IS NOT NULL GROUP BY e.type`,
      )
      return (res.values ?? []).map((row: any) => ({
        type: row.type as ExerciseType,
        total: row.total || 0,
        correct: row.correct || 0,
      }))
    },

    async getSynonyms(filters?: SynonymFilters): Promise<SynonymEntry[]> {
      const conn = await getDb()
      let sql = 'SELECT * FROM synonyms WHERE 1=1'
      const params: any[] = []
      if (filters?.topic) { sql += ' AND topic = ?'; params.push(filters.topic) }
      if (filters?.cefr_level) { sql += ' AND cefr_level = ?'; params.push(filters.cefr_level) }
      if (filters?.part_of_speech) { sql += ' AND part_of_speech = ?'; params.push(filters.part_of_speech) }
      const res = await conn.query(sql, params)
      return (res.values ?? []) as SynonymEntry[]
    },

    async resetProgress(): Promise<{ success: boolean }> {
      const conn = await getDb()
      await conn.run('DELETE FROM user_progress', [], false)
      await conn.run('DELETE FROM session_history', [], false)
      return { success: true }
    },
  }
}
