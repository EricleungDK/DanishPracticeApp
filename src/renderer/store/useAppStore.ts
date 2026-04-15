import { create } from 'zustand';
import type { Exercise, ExerciseAnswer, ExerciseType, Difficulty, OverallStats, UserProgress, ReadingQuestion, SessionHistory } from '../../shared/types';
import { sm2 } from '../../shared/sm2';
import { DEFAULT_EASE_FACTOR } from '../../shared/constants';
import { checkAnswer } from '../../content/generators/answer-checker';
import { generateExplanation } from '../../content/generators/explanation-generator';
import { shuffleArray } from '../../content/generators/exercise-picker';
import { getApiInstance } from '../lib/api-instance';

export type Page = 'dashboard' | 'exercise' | 'review' | 'vocab-boost' | 'settings';
export type Theme = 'light' | 'dark';

interface SessionStats {
  completed: number;
  correct: number;
  startedAt: string;
}

export type SessionMode = 'exercise' | 'review';

interface SessionSnapshot {
  sessionType: SessionMode;
  sessionExercises: Exercise[];
  currentIndex: number;
  sessionStats: SessionStats;
  lastResult: { correct: boolean; expected: string; explanation: string } | null;
  awaitingRating: boolean;
}

const PAUSED_SESSION_KEY = 'paused_session';

interface AppState {
  // Theme
  theme: Theme;
  loadTheme: () => Promise<void>;
  toggleTheme: () => Promise<void>;

  // Navigation
  currentPage: Page;
  navigate: (page: Page) => void;

  // Dashboard
  stats: OverallStats;
  chartData: {
    sessionHistory: { date: string; score: number }[];
    dailyActivity: Record<string, number>;
  };
  loadDashboardData: () => Promise<void>;
  loadChartData: () => Promise<void>;

  // Exercise session
  sessionType: SessionMode | null;
  sessionExercises: Exercise[];
  currentIndex: number;
  sessionStats: SessionStats;
  lastResult: { correct: boolean; expected: string; explanation: string } | null;
  awaitingRating: boolean;
  sessionComplete: boolean;

  // Paused session (persisted across app restarts)
  pausedSession: SessionSnapshot | null;

  startPractice: (type?: ExerciseType, difficulty?: Difficulty) => Promise<void>;
  startReview: () => Promise<void>;
  submitAnswer: (rawAnswer: string | string[] | { questionIndex: number; answer: string | number; question: ReadingQuestion }) => void;
  rateAndNext: (quality: number) => Promise<void>;
  endSession: () => Promise<void>;
  resetSession: () => void;
  pauseSession: () => Promise<void>;
  resumePausedSession: () => void;
  loadPausedSession: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  theme: 'light',
  loadTheme: async () => {
    const saved = await getApiInstance().getSetting('theme');
    const theme: Theme = saved === 'dark' ? 'dark' : 'light';
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    set({ theme });
  },
  toggleTheme: async () => {
    const next: Theme = get().theme === 'light' ? 'dark' : 'light';
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(next);
    set({ theme: next });
    await getApiInstance().saveSetting('theme', next);
  },

  currentPage: 'dashboard',
  navigate: (page) => {
    set({ currentPage: page });
    if (page === 'dashboard') get().loadDashboardData();
  },

  stats: { totalReviewed: 0, accuracy: 0, streak: 0, dueCount: 0 },
  chartData: { sessionHistory: [], dailyActivity: {} },

  loadDashboardData: async () => {
    try {
      const stats = await getApiInstance().getStats();
      set({ stats });
      get().loadChartData();
    } catch (e) {
      console.error('Failed to load dashboard data:', e);
    }
  },

  loadChartData: async () => {
    try {
      const sessions = await getApiInstance().getSessionHistory(20);

      const sessionHistory = sessions.map((s: SessionHistory) => ({
        date: s.started_at.split('T')[0],
        score: s.total_score || 0,
      }));

      const dailyActivity: Record<string, number> = {};
      for (const s of sessions) {
        const day = s.started_at.split('T')[0];
        dailyActivity[day] = (dailyActivity[day] || 0) + s.exercises_completed;
      }

      set({
        chartData: { sessionHistory, dailyActivity },
      });
    } catch (e) {
      console.error('Failed to load chart data:', e);
    }
  },

  sessionType: null,
  sessionExercises: [],
  currentIndex: 0,
  sessionStats: { completed: 0, correct: 0, startedAt: '' },
  lastResult: null,
  awaitingRating: false,
  sessionComplete: false,
  pausedSession: null,

  startPractice: async (type, difficulty) => {
    const { pausedSession } = get();
    if (pausedSession?.sessionType === 'exercise' && !type && !difficulty) {
      get().resumePausedSession();
      return;
    }
    try {
      const all = await getApiInstance().getExercises({ type, difficulty });
      const shuffled = shuffleArray(all).slice(0, 10);
      set({
        sessionType: 'exercise',
        sessionExercises: shuffled,
        currentIndex: 0,
        sessionStats: { completed: 0, correct: 0, startedAt: new Date().toISOString() },
        lastResult: null,
        awaitingRating: false,
        sessionComplete: false,
        currentPage: 'exercise',
      });
    } catch (e) {
      console.error('Failed to start practice:', e);
    }
  },

  startReview: async () => {
    const { pausedSession } = get();
    if (pausedSession?.sessionType === 'review') {
      get().resumePausedSession();
      return;
    }
    try {
      const due = await getApiInstance().getDueExercises();
      const exercises = due.slice(0, 10);
      set({
        sessionType: 'review',
        sessionExercises: exercises,
        currentIndex: 0,
        sessionStats: { completed: 0, correct: 0, startedAt: new Date().toISOString() },
        lastResult: null,
        awaitingRating: false,
        sessionComplete: false,
        currentPage: 'review',
      });
    } catch (e) {
      console.error('Failed to start review:', e);
    }
  },

  submitAnswer: (rawAnswer) => {
    const { sessionExercises, currentIndex } = get();
    const exercise = sessionExercises[currentIndex];
    if (!exercise) return;

    let answer: ExerciseAnswer;
    if (exercise.type === 'fill_blank') {
      answer = { type: 'fill_blank', value: rawAnswer as string };
    } else if (exercise.type === 'sentence_construction') {
      answer = { type: 'sentence_construction', value: rawAnswer as string[] };
    } else if (exercise.type === 'reading') {
      const raw = rawAnswer as { questionIndex: number; answer: string | number; question: ReadingQuestion };
      answer = { type: 'reading', value: { answer: raw.answer, question: raw.question } };
    } else {
      answer = { type: 'listening', value: rawAnswer as string };
    }

    const result = checkAnswer(exercise, answer);
    const explanation = generateExplanation(exercise, answer, result.correct);
    set({
      lastResult: { correct: result.correct, expected: result.expected, explanation },
      awaitingRating: true,
    });
  },

  rateAndNext: async (quality) => {
    try {
      const { sessionExercises, currentIndex, sessionStats, lastResult } = get();
      const exercise = sessionExercises[currentIndex];
      if (!exercise) return;

      const existing = await getApiInstance().getProgress(exercise.id);

      const sm2Result = sm2(
        quality,
        existing?.ease_factor || DEFAULT_EASE_FACTOR,
        existing?.interval || 0,
        existing?.repetitions || 0,
      );

      const history = [...(existing?.quality_history || []), quality];

      const progress: UserProgress = {
        id: existing?.id || crypto.randomUUID(),
        exercise_id: exercise.id,
        ease_factor: sm2Result.ease_factor,
        interval: sm2Result.interval,
        repetitions: sm2Result.repetitions,
        next_review: sm2Result.next_review,
        last_review: new Date().toISOString().split('T')[0],
        quality_history: history,
      };
      await getApiInstance().saveProgress(progress);

      const newCompleted = sessionStats.completed + 1;
      const newCorrect = sessionStats.correct + (lastResult?.correct ? 1 : 0);
      const nextIndex = currentIndex + 1;
      const isComplete = nextIndex >= sessionExercises.length;

      set({
        currentIndex: nextIndex,
        sessionStats: { ...sessionStats, completed: newCompleted, correct: newCorrect },
        lastResult: null,
        awaitingRating: false,
        sessionComplete: isComplete,
      });
    } catch (e) {
      console.error('Failed to rate and advance:', e);
    }
  },

  endSession: async () => {
    try {
      const { sessionStats } = get();
      const session = {
        id: crypto.randomUUID(),
        started_at: sessionStats.startedAt,
        ended_at: new Date().toISOString(),
        exercises_completed: sessionStats.completed,
        correct_count: sessionStats.correct,
        total_score:
          sessionStats.completed > 0
            ? Math.round((sessionStats.correct / sessionStats.completed) * 100)
            : 0,
      };
      await getApiInstance().saveSession(session);
      await getApiInstance().saveSetting(PAUSED_SESSION_KEY, '');
      set({ currentPage: 'dashboard', pausedSession: null });
      get().resetSession();
      get().loadDashboardData();
    } catch (e) {
      console.error('Failed to end session:', e);
    }
  },

  resetSession: () => {
    set({
      sessionType: null,
      sessionExercises: [],
      currentIndex: 0,
      sessionStats: { completed: 0, correct: 0, startedAt: '' },
      lastResult: null,
      awaitingRating: false,
      sessionComplete: false,
    });
  },

  pauseSession: async () => {
    const { sessionType, sessionExercises, currentIndex, sessionStats, lastResult, awaitingRating } = get();
    if (!sessionType || sessionExercises.length === 0) return;
    const snapshot: SessionSnapshot = {
      sessionType,
      sessionExercises,
      currentIndex,
      sessionStats,
      lastResult,
      awaitingRating,
    };
    try {
      await getApiInstance().saveSetting(PAUSED_SESSION_KEY, JSON.stringify(snapshot));
    } catch (e) {
      console.error('Failed to persist paused session:', e);
    }
    set({ pausedSession: snapshot, currentPage: 'dashboard' });
    get().resetSession();
    get().loadDashboardData();
  },

  resumePausedSession: () => {
    const { pausedSession } = get();
    if (!pausedSession) return;
    set({
      sessionType: pausedSession.sessionType,
      sessionExercises: pausedSession.sessionExercises,
      currentIndex: pausedSession.currentIndex,
      sessionStats: pausedSession.sessionStats,
      lastResult: pausedSession.lastResult,
      awaitingRating: pausedSession.awaitingRating,
      sessionComplete: false,
      pausedSession: null,
      currentPage: pausedSession.sessionType,
    });
    getApiInstance().saveSetting(PAUSED_SESSION_KEY, '').catch(() => { /* best effort */ });
  },

  loadPausedSession: async () => {
    try {
      const raw = await getApiInstance().getSetting(PAUSED_SESSION_KEY);
      if (raw && raw.length > 2) {
        const snapshot = JSON.parse(raw) as SessionSnapshot;
        if (snapshot && snapshot.sessionType && Array.isArray(snapshot.sessionExercises)) {
          set({ pausedSession: snapshot });
        }
      }
    } catch (e) {
      console.error('Failed to load paused session:', e);
    }
  },
}));
