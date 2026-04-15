import { useAppStore } from '../useAppStore';
import type { Exercise } from '../../../shared/types';

const mockExercises: Exercise[] = [
  {
    id: 'ex-1',
    type: 'fill_blank',
    difficulty: 'B1',
    topic: 'daily life',
    prompt_da: 'Jeg __ i København.',
    prompt_en: 'I __ in Copenhagen.',
    answer: 'bor',
    blanks: ['bor'],
  } as any,
  {
    id: 'ex-2',
    type: 'fill_blank',
    difficulty: 'B1',
    topic: 'daily life',
    prompt_da: 'Vi __ kaffe.',
    prompt_en: 'We __ coffee.',
    answer: 'drikker',
    blanks: ['drikker'],
  } as any,
];

function resetStore() {
  useAppStore.setState({
    currentPage: 'dashboard',
    sessionType: null,
    sessionExercises: [],
    currentIndex: 0,
    sessionStats: { completed: 0, correct: 0, startedAt: '' },
    lastResult: null,
    awaitingRating: false,
    sessionComplete: false,
    pausedSession: null,
  });
}

describe('pause/resume session', () => {
  beforeEach(() => {
    resetStore();
    jest.clearAllMocks();
  });

  it('pauses an active practice session and persists the snapshot', async () => {
    useAppStore.setState({
      sessionType: 'exercise',
      sessionExercises: mockExercises,
      currentIndex: 1,
      sessionStats: { completed: 1, correct: 1, startedAt: '2026-04-15T10:00:00.000Z' },
      currentPage: 'exercise',
    });

    await useAppStore.getState().pauseSession();

    expect(window.api.saveSetting).toHaveBeenCalledWith(
      'paused_session',
      expect.stringContaining('"sessionType":"exercise"'),
    );
    const state = useAppStore.getState();
    expect(state.pausedSession).not.toBeNull();
    expect(state.pausedSession?.currentIndex).toBe(1);
    expect(state.sessionExercises).toEqual([]);
    expect(state.sessionType).toBeNull();
    expect(state.currentPage).toBe('dashboard');
  });

  it('does nothing when pauseSession is called with no active session', async () => {
    await useAppStore.getState().pauseSession();
    expect(window.api.saveSetting).not.toHaveBeenCalledWith('paused_session', expect.anything());
    expect(useAppStore.getState().pausedSession).toBeNull();
  });

  it('resumes a paused practice session when startPractice is called', async () => {
    useAppStore.setState({
      pausedSession: {
        sessionType: 'exercise',
        sessionExercises: mockExercises,
        currentIndex: 1,
        sessionStats: { completed: 1, correct: 1, startedAt: '2026-04-15T10:00:00.000Z' },
        lastResult: null,
        awaitingRating: false,
      },
    });

    await useAppStore.getState().startPractice();

    const state = useAppStore.getState();
    expect(state.sessionType).toBe('exercise');
    expect(state.sessionExercises).toHaveLength(2);
    expect(state.currentIndex).toBe(1);
    expect(state.currentPage).toBe('exercise');
    expect(state.pausedSession).toBeNull();
    expect(window.api.getExercises).not.toHaveBeenCalled();
  });

  it('resumes a paused review session when startReview is called', async () => {
    useAppStore.setState({
      pausedSession: {
        sessionType: 'review',
        sessionExercises: mockExercises,
        currentIndex: 0,
        sessionStats: { completed: 0, correct: 0, startedAt: '2026-04-15T10:00:00.000Z' },
        lastResult: null,
        awaitingRating: false,
      },
    });

    await useAppStore.getState().startReview();

    const state = useAppStore.getState();
    expect(state.sessionType).toBe('review');
    expect(state.currentPage).toBe('review');
    expect(state.pausedSession).toBeNull();
    expect(window.api.getDueExercises).not.toHaveBeenCalled();
  });

  it('does not resume a paused exercise session when startReview is called', async () => {
    (window.api.getDueExercises as jest.Mock).mockResolvedValueOnce([]);
    useAppStore.setState({
      pausedSession: {
        sessionType: 'exercise',
        sessionExercises: mockExercises,
        currentIndex: 1,
        sessionStats: { completed: 1, correct: 0, startedAt: '2026-04-15T10:00:00.000Z' },
        lastResult: null,
        awaitingRating: false,
      },
    });

    await useAppStore.getState().startReview();

    expect(window.api.getDueExercises).toHaveBeenCalled();
    expect(useAppStore.getState().pausedSession).not.toBeNull();
    expect(useAppStore.getState().pausedSession?.sessionType).toBe('exercise');
  });

  it('loadPausedSession restores a persisted snapshot', async () => {
    const snapshot = {
      sessionType: 'exercise',
      sessionExercises: mockExercises,
      currentIndex: 0,
      sessionStats: { completed: 0, correct: 0, startedAt: '2026-04-15T10:00:00.000Z' },
      lastResult: null,
      awaitingRating: false,
    };
    (window.api.getSetting as jest.Mock).mockResolvedValueOnce(JSON.stringify(snapshot));

    await useAppStore.getState().loadPausedSession();

    expect(useAppStore.getState().pausedSession).toEqual(snapshot);
  });

  it('endSession clears the paused state', async () => {
    useAppStore.setState({
      sessionType: 'exercise',
      sessionStats: { completed: 10, correct: 8, startedAt: '2026-04-15T10:00:00.000Z' },
      pausedSession: {
        sessionType: 'exercise',
        sessionExercises: mockExercises,
        currentIndex: 9,
        sessionStats: { completed: 9, correct: 7, startedAt: '2026-04-15T10:00:00.000Z' },
        lastResult: null,
        awaitingRating: false,
      },
    });

    await useAppStore.getState().endSession();

    expect(window.api.saveSetting).toHaveBeenCalledWith('paused_session', '');
    expect(useAppStore.getState().pausedSession).toBeNull();
  });
});
