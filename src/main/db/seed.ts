import type { Database } from 'sql.js';
import { getExerciseCount, insertExercise } from './queries/exercises';
import { insertWord } from './queries/wordlists';
import { getSynonymCount, insertSynonym } from './queries/synonyms';
import type { Exercise, WordEntry, SynonymEntry } from '../../shared/types';

// Import seed data — these will be bundled by Vite
import fillBlankData from '../../content/templates/fill-blank.json';
import sentenceData from '../../content/templates/sentence-construction.json';
import readingData from '../../content/templates/reading.json';
import listeningData from '../../content/templates/listening.json';
import vocabularyData from '../../content/wordlists/vocabulary.json';
import synonymsData from '../../content/wordlists/synonyms.json';

export function seedDatabase(db: Database): void {
  const exerciseCount = getExerciseCount(db);
  if (exerciseCount === 0) {
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

  const synonymCount = getSynonymCount(db);
  if (synonymCount === 0) {
    for (const entry of synonymsData as SynonymEntry[]) {
      insertSynonym(db, entry);
    }
    console.log(`Seeded database: ${synonymsData.length} synonyms`);
  }
}
