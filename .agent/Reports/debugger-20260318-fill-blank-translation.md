# Debug Report: Fill-Blank Translation Shows Danish Answer Word in English Explanation

## Issue Description

When a fill-in-the-blank exercise is answered and the explanation panel is shown, the
"Translation:" line displays the Danish answer word inside the English sentence instead of
its English equivalent. For example, exercise fb-001 produces:

```
Translation: "I always står up early in the morning."
```

when it should read something like:

```
Translation: "I always get/stand up early in the morning."
```

## Root Cause

**File**: `/c/Users/ericl/Documents/Danish-practice-generator/src/content/generators/explanation-generator.ts`
**Function**: `explainFillBlank` (line 23–62)
**Offending line**: line 39

```ts
parts.push(`Translation: "${exercise.english_text.replace('___', key.correct[0])}"`);
```

`key.correct[0]` is always the Danish answer word (e.g. `"står"`, `"fra"`, `"koster"`).
The code substitutes this Danish word into `exercise.english_text`, which is an English
sentence template that also uses `___` as its blank placeholder. The result is an English
sentence with an untranslated Danish word in the blank position.

### Why there is no easy drop-in fix from the existing data model

The `FillBlankAnswerKey` type only stores Danish answer words:

```ts
export interface FillBlankAnswerKey {
  correct: string[];     // Danish words only
  accept_also: string[]; // Danish alternate spellings only
}
```

The `english_text` field on every fill-blank template also uses `___` for its blank
(confirmed across all 30 entries in `fill-blank.json`). There is no `english_answer`,
`answer_en`, or equivalent field anywhere in the data model or template files that would
supply the English word for the blank.

## Solution Overview

There are two viable approaches, in order of recommendation:

**Option A (preferred — minimal data change)**: Add an `answer_en` field to
`FillBlankAnswerKey` (and to each template entry), then use it in `explainFillBlank`.

**Option B (no data change)**: Leave the Translation line as a fully pre-filled English
sentence in `english_text` (i.e. remove `___` from `english_text` and store the complete
translated sentence), and display it as-is without substitution.

Option A keeps the exercising mechanic intact (user still sees `___` in the English hint
during exercise) and only adds a small piece of data per exercise. Option B is a larger
template change and breaks the hint sentence shown in `FillBlankExercise.tsx` line 45:
```tsx
<p className="text-sm text-gray-500 italic">{exercise.english_text}</p>
```
That line intentionally shows the English sentence with `___` as a translation hint during
the exercise. Filling that in would remove the blank hint.

## Detailed Implementation Plan — Option A (recommended)

### Step 1: Update the TypeScript type

**File**: `/c/Users/ericl/Documents/Danish-practice-generator/src/shared/types/index.ts`
**Line 4–7** — add `answer_en` field:

```ts
export interface FillBlankAnswerKey {
  correct: string[];
  accept_also: string[];
  answer_en?: string;   // English translation of the blank word/phrase
}
```

Making it optional (`?`) means existing exercises without the field continue to work
without a runtime error.

### Step 2: Update explanation-generator.ts

**File**: `/c/Users/ericl/Documents/Danish-practice-generator/src/content/generators/explanation-generator.ts`
**Line 39** — replace the substitution line:

Current (broken):
```ts
parts.push(`Translation: "${exercise.english_text.replace('___', key.correct[0])}"`);
```

Replacement:
```ts
const englishAnswer = key.answer_en ?? key.correct[0];
parts.push(`Translation: "${exercise.english_text.replace('___', englishAnswer)}"`);
```

This uses `key.answer_en` when available, and falls back to the Danish word when it is
absent (preserving existing behaviour for any exercise that hasn't been updated yet, so
the app does not regress to a blank translation line).

### Step 3: Add `answer_en` to every fill-blank template entry

**File**: `/c/Users/ericl/Documents/Danish-practice-generator/src/content/templates/fill-blank.json`

Each object needs `"answer_en"` added inside `answer_key`. Full mapping of the 30 entries
(Danish correct → English answer_en to store):

| id     | correct[0]    | answer_en (to add)          |
|--------|---------------|-----------------------------|
| fb-001 | står          | get                         |
| fb-002 | en            | a                           |
| fb-003 | fra           | from                        |
| fb-004 | var           | was                         |
| fb-005 | koster        | cost                        |
| fb-006 | ældre         | older                       |
| fb-007 | arbejder      | works                       |
| fb-008 | vil           | would                       |
| fb-009 | i             | in                          |
| fb-010 | en            | a                           |
| fb-011 | går           | go                          |
| fb-012 | altid         | always                      |
| fb-013 | rejste        | travelled                   |
| fb-014 | skal          | need                        |
| fb-015 | rigtig        | really                      |
| fb-016 | havde         | had                         |
| fb-017 | som           | that                        |
| fb-018 | skulle        | should                      |
| fb-019 | som           | as                          |
| fb-020 | desto         | the                         |
| fb-021 | tager         | head                        |
| fb-022 | tilberedt     | prepared                    |
| fb-023 | der           | who                         |
| fb-024 | skal          | must                        |
| fb-025 | regnede       | rained                      |
| fb-026 | returneres    | returned                    |
| fb-027 | beskæftiger   | familiarise                 |
| fb-028 | vidst         | known                       |
| fb-029 | ville         | would                       |
| fb-030 | hvis          | whose                       |

Example of updated entry for fb-001:
```json
{
  "id": "fb-001",
  ...
  "answer_key": { "correct": ["står"], "accept_also": ["staar"], "answer_en": "get" },
  ...
}
```

### Step 4: Update the DB seed / queries if answer_key is stored in SQLite

**File**: `/c/Users/ericl/Documents/Danish-practice-generator/src/main/db/seed.ts`

Check whether `answer_key` is stored as serialised JSON in the DB. If yes, re-seeding
(or running a migration that updates the JSON blob) will pick up `answer_en` automatically
since `answer_key` is stored and retrieved as an opaque JSON column (confirmed by looking
at types — no separate DB column for answer fields). No schema migration is needed.

**File**: `/c/Users/ericl/Documents/Danish-practice-generator/src/main/db/queries/exercises.ts`

Verify `answer_key` is retrieved as JSON.parse output and not re-mapped in a way that
would strip the new field.

## Files That Need Changes

| File | Change |
|------|--------|
| `src/shared/types/index.ts` | Add `answer_en?: string` to `FillBlankAnswerKey` |
| `src/content/generators/explanation-generator.ts` | Line 39 — use `key.answer_en` with fallback |
| `src/content/templates/fill-blank.json` | Add `answer_en` to all 30 `answer_key` objects |
| `src/main/db/seed.ts` | Verify (no change likely needed) |
| `src/main/db/queries/exercises.ts` | Verify (no change likely needed) |

## Verification

- [ ] After fix, submit a correct answer on fb-001 — Translation line reads "I always get up early in the morning."
- [ ] Submit an incorrect answer on fb-001 — Translation line still uses English word
- [ ] Exercise fb-003 (preposition "fra") — Translation reads "The train departs from Copenhagen at ten o'clock."
- [ ] Exercise fb-006 ("ældre") — Translation reads "My brother is older than me."
- [ ] Exercises without `answer_en` (if any left temporarily) do not crash — falls back to Danish word gracefully
- [ ] FillBlankExercise hint line (`exercise.english_text` with `___`) is unchanged during answering phase

## Risks

- No breaking changes — `answer_en` is optional; existing behaviour is preserved by the fallback.
- No database schema migration required — `answer_key` is a JSON blob column.
- The 30 English answer words in the table above should be reviewed for idiomatic accuracy.
  Some blanks are grammatical function words (articles, prepositions, relative pronouns) where
  a single English equivalent does not exist; for those, using a contextually appropriate word is
  fine since the full translated sentence will read naturally.
