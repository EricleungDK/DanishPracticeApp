import React, { useState } from 'react';
import type { Exercise, FillBlankAnswerKey } from '../../../shared/types';

interface Props {
  exercise: Exercise;
  onSubmit: (answer: string) => void;
  disabled: boolean;
}

export default function FillBlankExercise({ exercise, onSubmit, disabled }: Props) {
  const [answer, setAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const metadata = exercise.metadata;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer.trim()) onSubmit(answer);
  };

  const parts = exercise.danish_text.split('___');

  return (
    <div className="space-y-4">
      <div className="text-lg leading-relaxed font-[family-name:var(--font-serif)] text-[var(--color-text-primary)]">
        {parts.map((part, i) => (
          <React.Fragment key={i}>
            <span>{part}</span>
            {i < parts.length - 1 && (
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && answer.trim() && onSubmit(answer)}
                disabled={disabled}
                aria-label="Fill in the blank"
                aria-required="true"
                className="inline-block w-40 mx-1 px-3 py-1 border-b-2 border-[var(--color-accent-primary)] bg-[var(--color-bg-tertiary)] text-center focus:outline-none focus:border-[var(--color-accent-primary-hover)] disabled:opacity-50 rounded-sm"
                autoFocus
                placeholder="..."
              />
            )}
          </React.Fragment>
        ))}
      </div>

      <p className="text-sm text-[var(--color-text-secondary)] italic">{exercise.english_text}</p>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSubmit}
          disabled={disabled || !answer.trim()}
          className="bg-[var(--color-accent-primary)] text-white px-6 py-2 rounded-[var(--radius-button)] hover:bg-[var(--color-accent-primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors btn-hover"
        >
          Check
        </button>

        {metadata?.hint && (
          <button
            onClick={() => setShowHint(!showHint)}
            aria-expanded={showHint}
            className="text-sm text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] transition-colors"
          >
            {showHint ? 'Hide hint' : 'Show hint'}
          </button>
        )}
      </div>

      {showHint && metadata?.hint && (
        <p className="text-sm text-[var(--color-warning)] bg-[var(--color-warning-bg)] p-3 rounded-[var(--radius-button)]">
          Hint: {metadata.hint}
        </p>
      )}
    </div>
  );
}
