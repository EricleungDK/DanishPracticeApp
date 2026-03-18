export type ExerciseType = 'fill_blank' | 'sentence_construction' | 'reading' | 'listening';
export type Difficulty = 'B1' | 'B2';

export interface FillBlankAnswerKey {
  correct: string[];
  accept_also: string[];
  answer_en?: string;
}

export interface SentenceConstructionAnswerKey {
  correct_order: string[];
  words_given: string[];
  accept_also: string[];
}

export interface ReadingQuestion {
  question_da: string;
  question_en: string;
  type: 'multiple_choice' | 'free_text';
  options?: string[];
  correct_index?: number;
  correct?: string[];
}

export interface ReadingAnswerKey {
  questions: ReadingQuestion[];
}

export interface ListeningAnswerKey {
  mode: 'transcribe' | 'multiple_choice' | 'fill_blank';
  correct: string[];
  accept_also: string[];
}

export type AnswerKey =
  | FillBlankAnswerKey
  | SentenceConstructionAnswerKey
  | ReadingAnswerKey
  | ListeningAnswerKey;

export interface ExerciseMetadata {
  hint?: string;
  grammar_point?: string;
  blank_position?: number;
  focus_word?: string;
  word_count?: number;
  topic?: string;
  tts_speed?: 'normal' | 'slow';
  repeat_allowed?: boolean;
  focus?: string;
  tts_required?: boolean;
}

export interface Exercise {
  id: string;
  type: ExerciseType;
  difficulty: Difficulty;
  topic: string;
  danish_text: string;
  english_text: string;
  answer_key: AnswerKey;
  metadata: ExerciseMetadata;
  created_at?: string;
}

export interface WordEntry {
  id: string;
  danish: string;
  english: string;
  part_of_speech: string;
  gender?: string;
  cefr_level: Difficulty;
  topic: string;
  example_sentence?: string;
  irregular_forms?: Record<string, string>;
  created_at?: string;
}

export interface UserProgress {
  id: string;
  exercise_id: string;
  ease_factor: number;
  interval: number;
  repetitions: number;
  next_review: string;
  last_review?: string;
  quality_history?: number[];
}

export interface SessionHistory {
  id: string;
  started_at: string;
  ended_at?: string;
  exercise_type?: ExerciseType;
  exercises_completed: number;
  correct_count: number;
  total_score?: number;
}

export interface SM2Result {
  ease_factor: number;
  interval: number;
  repetitions: number;
  next_review: string;
}

export interface OverallStats {
  totalReviewed: number;
  accuracy: number;
  streak: number;
  dueCount: number;
}

export interface ExerciseFilters {
  type?: ExerciseType;
  difficulty?: Difficulty;
  topic?: string;
}

export interface WordlistFilters {
  cefr_level?: Difficulty;
  topic?: string;
  part_of_speech?: string;
}

export interface AnswerResult {
  correct: boolean;
  expected: string;
  userAnswer: string;
}
