import { MIN_EASE_FACTOR, DEFAULT_EASE_FACTOR } from './constants';
import type { SM2Result } from './types';

/**
 * SM-2 spaced repetition algorithm.
 * @param quality - Rating 0-5 (0=complete blackout, 5=perfect recall)
 * @param prevEase - Previous ease factor (starts at 2.5)
 * @param prevInterval - Previous interval in days
 * @param prevReps - Previous successful repetition count
 * @returns New SM2 parameters
 */
export function sm2(
  quality: number,
  prevEase: number = DEFAULT_EASE_FACTOR,
  prevInterval: number = 0,
  prevReps: number = 0,
): SM2Result {
  let easeFactor = prevEase;
  let interval: number;
  let repetitions: number;

  if (quality >= 3) {
    // Correct response
    if (prevReps === 0) {
      interval = 1;
    } else if (prevReps === 1) {
      interval = 6;
    } else {
      interval = Math.round(prevInterval * prevEase);
    }
    repetitions = prevReps + 1;
  } else {
    // Incorrect response — reset
    interval = 1;
    repetitions = 0;
  }

  // Update ease factor
  easeFactor = prevEase + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  easeFactor = Math.max(MIN_EASE_FACTOR, easeFactor);

  // Calculate next review date
  const now = new Date();
  now.setDate(now.getDate() + interval);
  const nextReview = now.toISOString().split('T')[0];

  return {
    ease_factor: Math.round(easeFactor * 100) / 100,
    interval,
    repetitions,
    next_review: nextReview,
  };
}
