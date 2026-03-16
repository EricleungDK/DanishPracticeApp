import type { Database } from 'sql.js';
import { getExerciseCount, insertExercise } from './queries/exercises';
import { insertWord } from './queries/wordlists';
import type { Exercise, WordEntry } from '../../shared/types';

// Import seed data — these will be bundled by Vite
import fillBlankData from '../../content/templates/fill-blank.json';
import sentenceData from '../../content/templates/sentence-construction.json';
import readingData from '../../content/templates/reading.json';
import listeningData from '../../content/templates/listening.json';
import vocabularyData from '../../content/wordlists/vocabulary.json';

export function seedDatabase(db: Database): void {
  const count = getExerciseCount(db);
  if (count > 0) return; // Already seeded

  const allExercises = [
    ...fillBlankData,
    ...sentenceData,
    ...readingData,
    ...listeningData,
  ] as Exercise[];

  for (const exercise of allExercises) {
    insertExercise(db, exercise);
  }

  for (const word of vocabularyData as WordEntry[]) {
    insertWord(db, word);
  }

  console.log(
    `Seeded database: ${allExercises.length} exercises, ${vocabularyData.length} words`,
  );
}
