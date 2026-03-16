import { create } from 'zustand';
import type { Exercise, ExerciseType, Difficulty, OverallStats, UserProgress } from '../../shared/types';
import { sm2 } from '../../shared/sm2';
import { DEFAULT_EASE_FACTOR } from '../../shared/constants';
import { checkAnswer } from '../../content/generators/answer-checker';
import { generateExplanation } from '../../content/generators/explanation-generator';
import { shuffleArray } from '../../content/generators/exercise-picker';

export type Page = 'dashboard' | 'exercise' | 'review' | 'settings';

interface SessionStats {
  completed: number;
  correct: number;
  startedAt: string;
}

interface AppState {
  // Navigation
  currentPage: Page;
  navigate: (page: Page) => void;

  // Dashboard
  stats: OverallStats;
  loadDashboardData: () => Promise<void>;

  // Exercise session
  sessionExercises: Exercise[];
  currentIndex: number;
  sessionStats: SessionStats;
  lastResult: { correct: boolean; expected: string; explanation: string } | null;
  awaitingRating: boolean;
  sessionComplete: boolean;

  startPractice: (type?: ExerciseType, difficulty?: Difficulty) => Promise<void>;
  startReview: () => Promise<void>;
  submitAnswer: (answer: any) => void;
  rateAndNext: (quality: number) => Promise<void>;
  endSession: () => Promise<void>;
  resetSession: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  currentPage: 'dashboard',
  navigate: (page) => {
    set({ currentPage: page });
    if (page === 'dashboard') get().loadDashboardData();
  },

  stats: { totalReviewed: 0, accuracy: 0, streak: 0, dueCount: 0 },

  loadDashboardData: async () => {
    try {
      const stats = await window.api.getStats();
      set({ stats });
    } catch (e) {
      console.error('Failed to load dashboard data:', e);
    }
  },

  sessionExercises: [],
  currentIndex: 0,
  sessionStats: { completed: 0, correct: 0, startedAt: '' },
  lastResult: null,
  awaitingRating: false,
  sessionComplete: false,

  startPractice: async (type, difficulty) => {
    try {
      const all = await window.api.getExercises({ type, difficulty });
      const shuffled = shuffleArray(all).slice(0, 10);
      set({
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
    try {
      const due = await window.api.getDueExercises();
      const exercises = due.slice(0, 10);
      set({
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

  submitAnswer: (answer) => {
    const { sessionExercises, currentIndex } = get();
    const exercise = sessionExercises[currentIndex];
    if (!exercise) return;

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

      const existing = await window.api.getProgress(exercise.id);

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
      await window.api.saveProgress(progress);

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
      await window.api.saveSession(session);
      set({ currentPage: 'dashboard' });
      get().loadDashboardData();
    } catch (e) {
      console.error('Failed to end session:', e);
    }
  },

  resetSession: () => {
    set({
      sessionExercises: [],
      currentIndex: 0,
      sessionStats: { completed: 0, correct: 0, startedAt: '' },
      lastResult: null,
      awaitingRating: false,
      sessionComplete: false,
    });
  },
}));
