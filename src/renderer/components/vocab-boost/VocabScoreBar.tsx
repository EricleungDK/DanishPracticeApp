import React from 'react';
import { Flame } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  currentRound: number;
  totalRounds: number;
  score: number;
  streak: number;
}

export default function VocabScoreBar({ currentRound, totalRounds, score, streak }: Props) {
  const progress = totalRounds > 0 ? ((currentRound + 1) / totalRounds) * 100 : 0;

  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="flex-1">
        <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--color-text-secondary)' }}>
          <span>Round {currentRound + 1} / {totalRounds}</span>
          <span>Score: {score}</span>
        </div>
        <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: 'var(--color-bg-tertiary)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: '#8B5CF6' }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
      {streak > 0 && (
        <motion.div
          className="flex items-center gap-1 text-sm font-bold"
          style={{ color: '#F59E0B' }}
          initial={{ scale: 0.8 }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.3 }}
          key={streak}
        >
          <Flame size={16} />
          {streak}x
        </motion.div>
      )}
    </div>
  );
}
