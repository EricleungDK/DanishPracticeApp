import type { Exercise, ExerciseType, Difficulty } from '../../shared/types';

export function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export interface PickOptions {
  type?: ExerciseType;
  difficulty?: Difficulty;
  count: number;
  mode: 'random' | 'due';
}

export async function pickExercises(options: PickOptions): Promise<Exercise[]> {
  const { count, mode } = options;

  let exercises: Exercise[];

  if (mode === 'due') {
    exercises = await window.api.getDueExercises();
  } else {
    exercises = await window.api.getExercises({
      type: options.type,
      difficulty: options.difficulty,
    });
  }

  const shuffled = shuffleArray(exercises);
  return shuffled.slice(0, count);
}
