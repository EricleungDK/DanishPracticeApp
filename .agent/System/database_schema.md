# Database Schema — Danish Practice Generator

**Last Updated**: 2026-04-08
**Engine**: SQLite — sql.js (desktop), @capacitor-community/sqlite (mobile)
**Migrations**: 2 versions in `src/main/db/migrate.ts` + `packages/data-layer/src/migrations.ts`

## Tables

### exercises
Exercise template definitions.

| Column | Type | Constraints | Description |
|--------|------|------------|-------------|
| id | TEXT | PRIMARY KEY | UUID |
| type | TEXT | NOT NULL | fill_blank, sentence_construction, reading, listening |
| difficulty | TEXT | NOT NULL | B1, B2 |
| topic | TEXT | | Grammar topic or vocabulary theme |
| danish_text | TEXT | NOT NULL | Danish content (may include blanks) |
| english_text | TEXT | NOT NULL | English translation |
| answer_key | TEXT | NOT NULL | JSON — correct answer(s) |
| metadata | TEXT | | JSON — extra data (word hints, grammar notes) |
| created_at | TEXT | DEFAULT CURRENT_TIMESTAMP | |

### wordlists
Danish vocabulary entries.

| Column | Type | Constraints | Description |
|--------|------|------------|-------------|
| id | TEXT | PRIMARY KEY | UUID |
| danish | TEXT | NOT NULL UNIQUE | Danish word/phrase |
| english | TEXT | NOT NULL | English translation |
| part_of_speech | TEXT | NOT NULL | noun, verb, adjective, adverb, etc. |
| gender | TEXT | | en/et (for nouns only) |
| cefr_level | TEXT | NOT NULL | B1, B2 |
| topic | TEXT | | Category (food, travel, work, etc.) |
| example_sentence | TEXT | | Danish example sentence |
| irregular_forms | TEXT | | JSON — irregular conjugations/declensions |
| created_at | TEXT | DEFAULT CURRENT_TIMESTAMP | |

### user_progress
Spaced repetition tracking per exercise.

| Column | Type | Constraints | Description |
|--------|------|------------|-------------|
| id | TEXT | PRIMARY KEY | UUID |
| exercise_id | TEXT | NOT NULL FK(exercises.id) | |
| ease_factor | REAL | NOT NULL DEFAULT 2.5 | SM-2 ease factor |
| interval | INTEGER | NOT NULL DEFAULT 0 | Days until next review |
| repetitions | INTEGER | NOT NULL DEFAULT 0 | Successful review count |
| next_review | TEXT | NOT NULL | ISO date of next review |
| last_review | TEXT | | ISO date of last review |
| quality_history | TEXT | | JSON array of past quality ratings |

### session_history
Practice session records.

| Column | Type | Constraints | Description |
|--------|------|------------|-------------|
| id | TEXT | PRIMARY KEY | UUID |
| started_at | TEXT | NOT NULL | ISO timestamp |
| ended_at | TEXT | | ISO timestamp |
| exercise_type | TEXT | | Filter: which type was practiced |
| exercises_completed | INTEGER | DEFAULT 0 | |
| correct_count | INTEGER | DEFAULT 0 | |
| total_score | REAL | | Percentage |

### settings
User preferences (key-value store).

| Column | Type | Constraints | Description |
|--------|------|------------|-------------|
| key | TEXT | PRIMARY KEY | Setting name |
| value | TEXT | NOT NULL | Setting value (JSON for complex) |

### synonyms
Danish synonym pairs for Vocabulary Boost quiz. (Migration v2)

| Column | Type | Constraints | Description |
|--------|------|------------|-------------|
| id | TEXT | PRIMARY KEY | syn-001, syn-002, etc. |
| word | TEXT | NOT NULL | Danish word |
| synonym | TEXT | NOT NULL | Danish synonym |
| part_of_speech | TEXT | NOT NULL | noun, verb, adjective, adverb |
| topic | TEXT | | Category (emotions, work, etc.) |
| cefr_level | TEXT | DEFAULT 'B1' | B1 or B2 |
| example_da | TEXT | | Example sentence using word |
| example_synonym_da | TEXT | | Example sentence using synonym |
| hint_en | TEXT | | English gloss (shown after answering) |

## Relationships

```
exercises.id ←── user_progress.exercise_id
```

## Indexes

```sql
CREATE INDEX idx_progress_next_review ON user_progress(next_review);
CREATE INDEX idx_progress_exercise ON user_progress(exercise_id);
CREATE INDEX idx_exercises_type ON exercises(type);
CREATE INDEX idx_exercises_difficulty ON exercises(difficulty);
CREATE INDEX idx_wordlists_cefr ON wordlists(cefr_level);
CREATE INDEX idx_wordlists_topic ON wordlists(topic);
CREATE INDEX idx_session_started ON session_history(started_at);
CREATE INDEX idx_synonyms_pos ON synonyms(part_of_speech);
CREATE INDEX idx_synonyms_topic ON synonyms(topic);
```
