import type {
  Exercise,
  ExerciseFilters,
  WordEntry,
  WordlistFilters,
  UserProgress,
  SessionHistory,
  OverallStats,
  SynonymEntry,
  SynonymFilters,
} from './index';

export interface AppAPI {
  getExercises(filters?: ExerciseFilters): Promise<Exercise[]>;
  getExerciseById(id: string): Promise<Exercise | undefined>;
  getWordlist(filters?: WordlistFilters): Promise<WordEntry[]>;
  saveProgress(data: UserProgress): Promise<{ success: boolean }>;
  getProgress(exerciseId: string): Promise<UserProgress | undefined>;
  getDueExercises(): Promise<Exercise[]>;
  getSessionHistory(limit?: number): Promise<SessionHistory[]>;
  saveSession(session: SessionHistory): Promise<{ success: boolean }>;
  saveSetting(key: string, value: string): Promise<{ success: boolean }>;
  getSetting(key: string): Promise<string | undefined>;
  getStats(): Promise<OverallStats>;
  getSynonyms(filters?: SynonymFilters): Promise<SynonymEntry[]>;
  resetProgress(): Promise<{ success: boolean }>;
}
