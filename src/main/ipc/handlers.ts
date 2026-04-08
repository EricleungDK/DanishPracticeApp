import { ipcMain } from 'electron';
import { IPC_CHANNELS } from '../../shared/constants';
import { getDb, saveDb } from '../db/connection';
import { getAllExercises, getExerciseById } from '../db/queries/exercises';
import { getWordlist } from '../db/queries/wordlists';
import {
  getProgress,
  upsertProgress,
  getDueExercises,
  getStats,
  getStatsByType,
  resetProgress,
} from '../db/queries/progress';
import { saveSession, getSessionHistory } from '../db/queries/sessions';
import { getSetting, saveSetting } from '../db/queries/settings';

export function registerIpcHandlers(): void {
  ipcMain.handle(IPC_CHANNELS.GET_EXERCISES, (_, filters) => {
    try {
      return getAllExercises(getDb(), filters);
    } catch (e: any) {
      return { error: e.message };
    }
  });

  ipcMain.handle(IPC_CHANNELS.GET_EXERCISE_BY_ID, (_, id) => {
    try {
      return getExerciseById(getDb(), id);
    } catch (e: any) {
      return { error: e.message };
    }
  });

  ipcMain.handle(IPC_CHANNELS.GET_WORDLIST, (_, filters) => {
    try {
      return getWordlist(getDb(), filters);
    } catch (e: any) {
      return { error: e.message };
    }
  });

  ipcMain.handle(IPC_CHANNELS.SAVE_PROGRESS, (_, data) => {
    try {
      upsertProgress(getDb(), data);
      saveDb();
      return { success: true };
    } catch (e: any) {
      return { error: e.message };
    }
  });

  ipcMain.handle(IPC_CHANNELS.GET_PROGRESS, (_, exerciseId) => {
    try {
      return getProgress(getDb(), exerciseId);
    } catch (e: any) {
      return { error: e.message };
    }
  });

  ipcMain.handle(IPC_CHANNELS.GET_DUE_EXERCISES, () => {
    try {
      return getDueExercises(getDb());
    } catch (e: any) {
      return { error: e.message };
    }
  });

  ipcMain.handle(IPC_CHANNELS.GET_SESSION_HISTORY, (_, limit) => {
    try {
      return getSessionHistory(getDb(), limit);
    } catch (e: any) {
      return { error: e.message };
    }
  });

  ipcMain.handle(IPC_CHANNELS.SAVE_SESSION, (_, session) => {
    try {
      saveSession(getDb(), session);
      saveDb();
      return { success: true };
    } catch (e: any) {
      return { error: e.message };
    }
  });

  ipcMain.handle(IPC_CHANNELS.SAVE_SETTING, (_, key, value) => {
    try {
      saveSetting(getDb(), key, value);
      saveDb();
      return { success: true };
    } catch (e: any) {
      return { error: e.message };
    }
  });

  ipcMain.handle(IPC_CHANNELS.GET_SETTING, (_, key) => {
    try {
      return getSetting(getDb(), key);
    } catch (e: any) {
      return { error: e.message };
    }
  });

  ipcMain.handle(IPC_CHANNELS.GET_STATS, () => {
    try {
      return getStats(getDb());
    } catch (e: any) {
      return { error: e.message };
    }
  });

  ipcMain.handle(IPC_CHANNELS.GET_STATS_BY_TYPE, () => {
    try {
      return getStatsByType(getDb());
    } catch (e: any) {
      return { error: e.message };
    }
  });

  ipcMain.handle(IPC_CHANNELS.RESET_PROGRESS, () => {
    try {
      resetProgress(getDb());
      saveDb();
      return { success: true };
    } catch (e: any) {
      return { error: e.message };
    }
  });
}
