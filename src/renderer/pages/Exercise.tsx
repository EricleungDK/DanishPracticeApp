import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import ExerciseCard from '../components/ExerciseCard';
import FillBlankExercise from '../components/exercises/FillBlankExercise';
import SentenceConstructionExercise from '../components/exercises/SentenceConstructionExercise';
import ReadingExercise from '../components/exercises/ReadingExercise';
import ListeningExercise from '../components/exercises/ListeningExercise';
import ResultDisplay from '../components/ResultDisplay';

export default function Exercise() {
  const {
    sessionExercises,
    currentIndex,
    sessionStats,
    lastResult,
    awaitingRating,
    sessionComplete,
    submitAnswer,
    rateAndNext,
    endSession,
    navigate,
    pauseSession,
  } = useAppStore();

  if (sessionExercises.length === 0) {
    return (
      <div className="w-full max-w-3xl mx-auto text-center py-20">
        <p className="text-[var(--color-text-secondary)] text-lg">No exercises available.</p>
        <button
          onClick={() => navigate('dashboard')}
          className="mt-4 text-[var(--color-accent-primary)] hover:text-[var(--color-accent-primary-hover)]"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (sessionComplete) {
    const pct =
      sessionStats.completed > 0
        ? Math.round((sessionStats.correct / sessionStats.completed) * 100)
        : 0;

    return (
      <div className="w-full max-w-xl mx-auto text-center py-16">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">Session Complete!</h2>
        <div
          className="bg-[var(--color-bg-secondary)] rounded-[var(--radius-card)] border border-[var(--color-border-primary)] p-6 mt-6 space-y-3"
          style={{ boxShadow: 'var(--shadow-card)' }}
        >
          <p className="text-4xl font-bold text-[var(--color-accent-primary)]">{pct}%</p>
          <p className="text-[var(--color-text-secondary)]">
            {sessionStats.correct} / {sessionStats.completed} correct
          </p>
        </div>
        <button
          onClick={endSession}
          className="mt-6 bg-[var(--color-accent-primary)] text-white px-8 py-3 rounded-[var(--radius-card)] hover:bg-[var(--color-accent-primary-hover)] transition-colors btn-hover"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const exercise = sessionExercises[currentIndex];
  if (!exercise) return null;

  const renderExercise = () => {
    const disabled = awaitingRating;
    switch (exercise.type) {
      case 'fill_blank':
        return <FillBlankExercise key={exercise.id} exercise={exercise} onSubmit={submitAnswer} disabled={disabled} />;
      case 'sentence_construction':
        return <SentenceConstructionExercise key={exercise.id} exercise={exercise} onSubmit={submitAnswer} disabled={disabled} />;
      case 'reading':
        return <ReadingExercise key={exercise.id} exercise={exercise} onSubmit={submitAnswer} disabled={disabled} />;
      case 'listening':
        return <ListeningExercise key={exercise.id} exercise={exercise} onSubmit={submitAnswer} disabled={disabled} />;
      default:
        return <p>Unknown exercise type</p>;
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex items-center mb-3">
        <button
          onClick={pauseSession}
          className="flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
          aria-label="Pause session and return to dashboard"
        >
          <ArrowLeft size={16} />
          <span>Pause & go back</span>
        </button>
      </div>
      <ExerciseCard exercise={exercise} index={currentIndex} total={sessionExercises.length}>
        {renderExercise()}
        {lastResult && awaitingRating && (
          <ResultDisplay
            correct={lastResult.correct}
            expected={lastResult.expected}
            explanation={lastResult.explanation}
            onRate={rateAndNext}
          />
        )}
      </ExerciseCard>
    </div>
  );
}
