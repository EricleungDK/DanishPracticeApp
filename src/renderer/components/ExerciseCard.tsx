import React from 'react';
import type { Exercise } from '../../shared/types';

interface ExerciseCardProps {
  exercise: Exercise;
  index: number;
  total: number;
  children: React.ReactNode;
}

const typeLabels: Record<string, string> = {
  fill_blank: 'Fill in the Blank',
  sentence_construction: 'Sentence Construction',
  reading: 'Reading Comprehension',
  listening: 'Listening',
};

export default function ExerciseCard({ exercise, index, total, children }: ExerciseCardProps) {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xs font-medium bg-[var(--color-accent-primary-10)] text-[var(--color-accent-primary)] px-2 py-1 rounded-[var(--radius-button)]">
          {typeLabels[exercise.type] || exercise.type}
        </span>
        <span className="text-xs font-medium bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] px-2 py-1 rounded-[var(--radius-button)]">
          {exercise.difficulty}
        </span>
        {exercise.topic && (
          <span className="text-xs text-[var(--color-text-tertiary)]">{exercise.topic}</span>
        )}
        <span
          className="ml-auto text-sm text-[var(--color-text-tertiary)]"
          aria-label={`Exercise ${index + 1} of ${total}`}
        >
          {index + 1} / {total}
        </span>
      </div>

      <div
        className="bg-[var(--color-bg-secondary)] rounded-[var(--radius-card)] border border-[var(--color-border-primary)] p-6"
        style={{ boxShadow: 'var(--shadow-card)' }}
      >
        {children}
      </div>
    </div>
  );
}
