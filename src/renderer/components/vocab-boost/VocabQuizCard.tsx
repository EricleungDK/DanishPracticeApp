import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import type { VocabRound } from '../../../shared/types';

interface Props {
  round: VocabRound;
  answered: boolean;
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  onNext: () => void;
}

export default function VocabQuizCard({ round, answered, selectedIndex, onSelect, onNext }: Props) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (answered) {
      timerRef.current = setTimeout(onNext, 10000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [answered]);

  const getChoiceStyle = (index: number) => {
    if (!answered) {
      return {
        backgroundColor: 'var(--color-bg-secondary)',
        borderColor: 'var(--color-border)',
      };
    }
    if (index === round.correctIndex) {
      return { backgroundColor: '#16A34A20', borderColor: '#16A34A' };
    }
    if (index === selectedIndex && index !== round.correctIndex) {
      return { backgroundColor: '#DC262620', borderColor: '#DC2626' };
    }
    return {
      backgroundColor: 'var(--color-bg-secondary)',
      borderColor: 'var(--color-border)',
      opacity: 0.5,
    };
  };

  return (
    <div className="flex flex-col items-center">
      {/* Prompt word */}
      <div className="text-center mb-2">
        <span
          className="inline-block text-xs px-2 py-0.5 rounded-full mb-3"
          style={{ backgroundColor: 'var(--color-bg-tertiary)', color: 'var(--color-text-secondary)' }}
        >
          {round.entry.part_of_speech}
        </span>
        <h2
          className="text-3xl font-bold font-[family-name:var(--font-serif)]"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {round.prompt}
        </h2>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-tertiary)' }}>
          Vælg synonymet
        </p>
      </div>

      {/* Choices grid */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-md mt-6">
        {round.choices.map((choice, i) => (
          <motion.button
            key={i}
            onClick={() => !answered && onSelect(i)}
            disabled={answered}
            className="px-4 py-3 rounded-lg border-2 text-sm font-medium transition-colors"
            style={getChoiceStyle(i)}
            whileHover={!answered ? { scale: 1.03 } : undefined}
            whileTap={!answered ? { scale: 0.97 } : undefined}
          >
            <span style={{ color: 'var(--color-text-primary)' }}>{choice}</span>
          </motion.button>
        ))}
      </div>

      {/* Feedback after answering */}
      {answered && (
        <motion.div
          className="mt-5 text-center"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {round.entry.hint_en && (
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              {round.entry.hint_en}
            </p>
          )}
          {round.entry.example_synonym_da && (
            <p className="text-xs mt-1 italic" style={{ color: 'var(--color-text-tertiary)' }}>
              "{round.entry.example_synonym_da}"
            </p>
          )}
          <button
            onClick={onNext}
            className="mt-3 text-xs underline"
            style={{ color: '#8B5CF6' }}
          >
            Next
          </button>
        </motion.div>
      )}
    </div>
  );
}
