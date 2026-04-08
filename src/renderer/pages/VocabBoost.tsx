import React from 'react';
import { Zap } from 'lucide-react';
import { useVocabBoostStore } from '../store/useVocabBoostStore';
import { useAppStore } from '../store/useAppStore';
import { TOPICS } from '../../shared/constants';
import VocabQuizCard from '../components/vocab-boost/VocabQuizCard';
import VocabScoreBar from '../components/vocab-boost/VocabScoreBar';
import VocabSessionSummary from '../components/vocab-boost/VocabSessionSummary';

export default function VocabBoost() {
  const {
    topic,
    setTopic,
    rounds,
    currentRound,
    score,
    streak,
    bestStreak,
    answered,
    selectedIndex,
    sessionActive,
    sessionComplete,
    startSession,
    selectAnswer,
    nextRound,
    endSession,
  } = useVocabBoostStore();

  const navigate = useAppStore((s) => s.navigate);

  const handleBackToDashboard = async () => {
    await endSession();
    navigate('dashboard');
  };

  const handlePlayAgain = () => {
    startSession();
  };

  // Pre-session screen
  if (!sessionActive) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="flex items-center gap-2">
          <Zap size={28} style={{ color: '#8B5CF6' }} />
          <h1
            className="text-2xl font-bold"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Vocabulary Boost
          </h1>
        </div>
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          Match Danish words with their synonyms
        </p>

        {/* Topic filter */}
        <div className="w-full max-w-xs">
          <label
            className="block text-xs mb-1"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Topic (optional)
          </label>
          <select
            value={topic || ''}
            onChange={(e) => setTopic(e.target.value || null)}
            className="w-full px-3 py-2 rounded-lg text-sm border"
            style={{
              backgroundColor: 'var(--color-bg-secondary)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-primary)',
            }}
          >
            <option value="">All Topics</option>
            {TOPICS.map((t) => (
              <option key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => startSession()}
          className="px-8 py-3 rounded-lg text-sm font-bold text-white btn-hover"
          style={{ backgroundColor: '#8B5CF6' }}
        >
          Start
        </button>
      </div>
    );
  }

  // Session complete
  if (sessionComplete) {
    return (
      <div className="flex justify-center pt-12">
        <VocabSessionSummary
          score={score}
          total={rounds.length}
          bestStreak={bestStreak}
          onPlayAgain={handlePlayAgain}
          onBackToDashboard={handleBackToDashboard}
        />
      </div>
    );
  }

  // Active quiz
  const round = rounds[currentRound];
  if (!round) return null;

  return (
    <div className="max-w-lg mx-auto pt-8 px-4">
      <VocabScoreBar
        currentRound={currentRound}
        totalRounds={rounds.length}
        score={score}
        streak={streak}
      />
      <div
        className="rounded-xl p-8 card-hover"
        style={{
          backgroundColor: 'var(--color-bg-card)',
          border: '1px solid var(--color-border)',
        }}
      >
        <VocabQuizCard
          round={round}
          answered={answered}
          selectedIndex={selectedIndex}
          onSelect={selectAnswer}
          onNext={nextRound}
        />
      </div>
    </div>
  );
}
