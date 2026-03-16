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

  // Split danish text around the blank
  const parts = exercise.danish_text.split('___');

  return (
    <div className="space-y-4">
      <div className="text-lg leading-relaxed">
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
                className="inline-block w-40 mx-1 px-3 py-1 border-b-2 border-blue-400 bg-blue-50 text-center focus:outline-none focus:border-blue-600 disabled:opacity-50"
                autoFocus
                placeholder="..."
              />
            )}
          </React.Fragment>
        ))}
      </div>

      <p className="text-sm text-gray-500 italic">{exercise.english_text}</p>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSubmit}
          disabled={disabled || !answer.trim()}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Check
        </button>

        {metadata?.hint && (
          <button
            onClick={() => setShowHint(!showHint)}
            className="text-sm text-gray-400 hover:text-gray-600"
          >
            {showHint ? 'Hide hint' : 'Show hint'}
          </button>
        )}
      </div>

      {showHint && metadata?.hint && (
        <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded">
          Hint: {metadata.hint}
        </p>
      )}
    </div>
  );
}
