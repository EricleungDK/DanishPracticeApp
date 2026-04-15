import type { OverallStats } from '../../shared/types';

const defaultStats: OverallStats = {
  totalReviewed: 0,
  accuracy: 0,
  streak: 0,
  dueCount: 0,
};

export function mockWindowApi() {
  return {
    getExercises: jest.fn().mockResolvedValue([]),
    getExerciseById: jest.fn().mockResolvedValue(undefined),
    getWordlist: jest.fn().mockResolvedValue([]),
    saveProgress: jest.fn().mockResolvedValue({ success: true }),
    getProgress: jest.fn().mockResolvedValue(undefined),
    getDueExercises: jest.fn().mockResolvedValue([]),
    getSessionHistory: jest.fn().mockResolvedValue([]),
    saveSession: jest.fn().mockResolvedValue({ success: true }),
    saveSetting: jest.fn().mockResolvedValue({ success: true }),
    getSetting: jest.fn().mockResolvedValue(undefined),
    getStats: jest.fn().mockResolvedValue(defaultStats),
    getSynonyms: jest.fn().mockResolvedValue([]),
    resetProgress: jest.fn().mockResolvedValue({ success: true }),
  };
}
