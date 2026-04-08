import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Flame, RotateCcw, Home } from 'lucide-react';

interface Props {
  score: number;
  total: number;
  bestStreak: number;
  onPlayAgain: () => void;
  onBackToDashboard: () => void;
}

export default function VocabSessionSummary({ score, total, bestStreak, onPlayAgain, onBackToDashboard }: Props) {
  const accuracy = total > 0 ? Math.round((score / total) * 100) : 0;

  return (
    <motion.div
      className="flex flex-col items-center gap-6 p-8"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Trophy size={48} style={{ color: '#8B5CF6' }} />
      <h2
        className="text-2xl font-bold"
        style={{ color: 'var(--color-text-primary)' }}
      >
        Session Complete!
      </h2>

      <div className="grid grid-cols-3 gap-6 text-center">
        <div>
          <div className="text-3xl font-bold" style={{ color: '#8B5CF6' }}>
            {score}/{total}
          </div>
          <div className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            Correct
          </div>
        </div>
        <div>
          <div className="text-3xl font-bold" style={{ color: '#16A34A' }}>
            {accuracy}%
          </div>
          <div className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            Accuracy
          </div>
        </div>
        <div>
          <div className="text-3xl font-bold flex items-center justify-center gap-1" style={{ color: '#F59E0B' }}>
            <Flame size={20} />
            {bestStreak}
          </div>
          <div className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            Best Streak
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-4">
        <button
          onClick={onPlayAgain}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white"
          style={{ backgroundColor: '#8B5CF6' }}
        >
          <RotateCcw size={16} />
          Play Again
        </button>
        <button
          onClick={onBackToDashboard}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium border"
          style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
        >
          <Home size={16} />
          Dashboard
        </button>
      </div>
    </motion.div>
  );
}
