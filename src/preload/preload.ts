import { contextBridge, ipcRenderer } from 'electron';
import { IPC_CHANNELS } from '../shared/constants';
import type {
  Exercise,
  ExerciseFilters,
  WordEntry,
  WordlistFilters,
  UserProgress,
  SessionHistory,
  OverallStats,
  StatsByType,
  SynonymEntry,
  SynonymFilters,
} from '../shared/types';

const api = {
  getExercises: (filters?: ExerciseFilters): Promise<Exercise[]> =>
    ipcRenderer.invoke(IPC_CHANNELS.GET_EXERCISES, filters),

  getExerciseById: (id: string): Promise<Exercise | undefined> =>
    ipcRenderer.invoke(IPC_CHANNELS.GET_EXERCISE_BY_ID, id),

  getWordlist: (filters?: WordlistFilters): Promise<WordEntry[]> =>
    ipcRenderer.invoke(IPC_CHANNELS.GET_WORDLIST, filters),

  saveProgress: (data: UserProgress): Promise<{ success: boolean }> =>
    ipcRenderer.invoke(IPC_CHANNELS.SAVE_PROGRESS, data),

  getProgress: (exerciseId: string): Promise<UserProgress | undefined> =>
    ipcRenderer.invoke(IPC_CHANNELS.GET_PROGRESS, exerciseId),

  getDueExercises: (): Promise<Exercise[]> =>
    ipcRenderer.invoke(IPC_CHANNELS.GET_DUE_EXERCISES),

  getSessionHistory: (limit?: number): Promise<SessionHistory[]> =>
    ipcRenderer.invoke(IPC_CHANNELS.GET_SESSION_HISTORY, limit),

  saveSession: (session: SessionHistory): Promise<{ success: boolean }> =>
    ipcRenderer.invoke(IPC_CHANNELS.SAVE_SESSION, session),

  saveSetting: (key: string, value: string): Promise<{ success: boolean }> =>
    ipcRenderer.invoke(IPC_CHANNELS.SAVE_SETTING, key, value),

  getSetting: (key: string): Promise<string | undefined> =>
    ipcRenderer.invoke(IPC_CHANNELS.GET_SETTING, key),

  getStats: (): Promise<OverallStats> =>
    ipcRenderer.invoke(IPC_CHANNELS.GET_STATS),

  getStatsByType: (): Promise<StatsByType[]> =>
    ipcRenderer.invoke(IPC_CHANNELS.GET_STATS_BY_TYPE),

  getSynonyms: (filters?: SynonymFilters): Promise<SynonymEntry[]> =>
    ipcRenderer.invoke(IPC_CHANNELS.GET_SYNONYMS, filters),

  resetProgress: (): Promise<{ success: boolean }> =>
    ipcRenderer.invoke(IPC_CHANNELS.RESET_PROGRESS),
};

contextBridge.exposeInMainWorld('api', api);
