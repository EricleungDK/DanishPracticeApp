export const IPC_CHANNELS = {
  GET_EXERCISES: 'db:get-exercises',
  GET_EXERCISE_BY_ID: 'db:get-exercise-by-id',
  GET_WORDLIST: 'db:get-wordlist',
  SAVE_PROGRESS: 'db:save-progress',
  GET_PROGRESS: 'db:get-progress',
  GET_DUE_EXERCISES: 'db:get-due-exercises',
  GET_SESSION_HISTORY: 'db:get-session-history',
  SAVE_SESSION: 'db:save-session',
  SAVE_SETTING: 'db:save-setting',
  GET_SETTING: 'db:get-setting',
  GET_STATS: 'db:get-stats',
  RESET_PROGRESS: 'db:reset-progress',
  GET_STATS_BY_TYPE: 'db:get-stats-by-type',
  GET_SYNONYMS: 'db:get-synonyms',
} as const;

export const DEFAULT_EASE_FACTOR = 2.5;
export const MIN_EASE_FACTOR = 1.3;

export const EXERCISE_TYPES = [
  'fill_blank',
  'sentence_construction',
  'reading',
  'listening',
] as const;

export const TOPICS = [
  'daily life',
  'work',
  'travel',
  'food',
  'socializing',
  'weather',
  'family',
  'health',
  'shopping',
  'culture',
] as const;

export const EXERCISES_PER_SESSION = 10;
export const VOCAB_BOOST_ROUNDS = 10;
