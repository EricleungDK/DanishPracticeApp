import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface ResultDisplayProps {
  correct: boolean;
  expected: string;
  explanation: string;
  onRate: (quality: number) => void;
}

const qualityLabels = [
  { value: 0, label: 'Complete blackout' },
  { value: 1, label: 'Wrong, but recognized' },
  { value: 2, label: 'Wrong, but easy to recall' },
  { value: 3, label: 'Correct, hard recall' },
  { value: 4, label: 'Correct, some hesitation' },
  { value: 5, label: 'Perfect, instant recall' },
];

function ratingColor(v: number): string {
  if (v <= 1) return 'bg-[var(--color-error)]';
  if (v === 2) return 'bg-[var(--color-accent-secondary)]';
  if (v === 3) return 'bg-[var(--color-warning)]';
  return 'bg-[var(--color-success)]';
}

export default function ResultDisplay({ correct, expected, explanation, onRate }: ResultDisplayProps) {
  const [showExplanation, setShowExplanation] = useState(true);

  return (
    <div className="mt-6 space-y-4">
      <div
        role="alert"
        className={`p-4 rounded-[var(--radius-card)] border ${
          correct
            ? 'bg-[var(--color-success-bg)] border-[var(--color-success-30)]'
            : 'bg-[var(--color-error-bg)] border-[var(--color-error-30)]'
        }`}
      >
        <p className={`font-bold ${correct ? 'text-[var(--color-success)]' : 'text-[var(--color-error)]'}`}>
          {correct ? 'Correct!' : 'Incorrect'}
        </p>
        {!correct && (
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Expected: <span className="font-semibold">{expected}</span>
          </p>
        )}
      </div>

      {explanation && (
        <div className="bg-[var(--color-info-bg)] border border-[var(--color-info-30)] rounded-[var(--radius-card)] overflow-hidden">
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            aria-expanded={showExplanation}
            className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium text-[var(--color-info)] hover:opacity-80 transition-opacity"
          >
            <span>Explanation</span>
            {showExplanation ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {showExplanation && (
            <div className="px-4 pb-3 space-y-1.5">
              {explanation.split('\n').map((line, i) => (
                <p key={i} className="text-sm text-[var(--color-text-primary)]">
                  {line.startsWith('Tip:') || line.startsWith('Grammar:') || line.startsWith('Note:') ? (
                    <>
                      <span className="font-semibold">{line.split(':')[0]}:</span>
                      {line.substring(line.indexOf(':') + 1)}
                    </>
                  ) : line.startsWith('Differences:') || line.startsWith('Position') ? (
                    <span className="text-[var(--color-error)]">{line}</span>
                  ) : (
                    line
                  )}
                </p>
              ))}
            </div>
          )}
        </div>
      )}

      <div>
        <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-2">Rate your recall:</p>
        <div className="grid grid-cols-3 gap-2">
          {qualityLabels.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => onRate(value)}
              className={`${ratingColor(value)} text-white text-xs px-3 py-2 rounded-[var(--radius-button)] hover:opacity-90 transition-opacity btn-hover`}
            >
              <span className="font-bold">{value}</span>
              <span className="block mt-0.5 opacity-90">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
