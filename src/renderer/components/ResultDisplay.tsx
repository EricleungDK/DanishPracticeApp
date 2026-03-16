import React, { useState } from 'react';

interface ResultDisplayProps {
  correct: boolean;
  expected: string;
  explanation: string;
  onRate: (quality: number) => void;
}

const qualityLabels = [
  { value: 0, label: 'Complete blackout', color: 'bg-red-600' },
  { value: 1, label: 'Wrong, but recognized', color: 'bg-red-400' },
  { value: 2, label: 'Wrong, but easy to recall', color: 'bg-orange-400' },
  { value: 3, label: 'Correct, hard recall', color: 'bg-yellow-400' },
  { value: 4, label: 'Correct, some hesitation', color: 'bg-green-400' },
  { value: 5, label: 'Perfect, instant recall', color: 'bg-green-600' },
];

export default function ResultDisplay({ correct, expected, explanation, onRate }: ResultDisplayProps) {
  const [showExplanation, setShowExplanation] = useState(true);

  return (
    <div className="mt-6 space-y-4">
      {/* Correct / Incorrect banner */}
      <div
        className={`p-4 rounded-lg ${
          correct ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}
      >
        <p className={`font-bold ${correct ? 'text-green-700' : 'text-red-700'}`}>
          {correct ? 'Correct!' : 'Incorrect'}
        </p>
        {!correct && (
          <p className="text-sm text-gray-600 mt-1">
            Expected: <span className="font-semibold">{expected}</span>
          </p>
        )}
      </div>

      {/* Explanation */}
      {explanation && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg overflow-hidden">
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100 transition-colors"
          >
            <span>Explanation</span>
            <span>{showExplanation ? '▲' : '▼'}</span>
          </button>
          {showExplanation && (
            <div className="px-4 pb-3 space-y-1.5">
              {explanation.split('\n').map((line, i) => (
                <p key={i} className="text-sm text-indigo-900">
                  {line.startsWith('Tip:') || line.startsWith('Grammar:') || line.startsWith('Note:') ? (
                    <>
                      <span className="font-semibold">{line.split(':')[0]}:</span>
                      {line.substring(line.indexOf(':') + 1)}
                    </>
                  ) : line.startsWith('Differences:') || line.startsWith('Position') ? (
                    <span className="text-red-700">{line}</span>
                  ) : (
                    line
                  )}
                </p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Quality rating */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Rate your recall:</p>
        <div className="grid grid-cols-3 gap-2">
          {qualityLabels.map(({ value, label, color }) => (
            <button
              key={value}
              onClick={() => onRate(value)}
              className={`${color} text-white text-xs px-3 py-2 rounded-lg hover:opacity-90 transition-opacity`}
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
