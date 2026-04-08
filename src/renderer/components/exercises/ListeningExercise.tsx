import React, { useState } from 'react';
import { Volume2, Snail } from 'lucide-react';
import type { Exercise } from '../../../shared/types';

interface Props {
  exercise: Exercise;
  onSubmit: (answer: string) => void;
  disabled: boolean;
}

export default function ListeningExercise({ exercise, onSubmit, disabled }: Props) {
  const [answer, setAnswer] = useState('');
  const [revealed, setRevealed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer.trim()) onSubmit(answer);
  };

  const speak = (rate = 1) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(exercise.danish_text);
      utterance.lang = 'da-DK';
      utterance.rate = rate;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-[var(--color-text-secondary)]">Listen and type what you hear in Danish.</p>

      <div className="flex gap-3">
        <button
          onClick={() => speak(exercise.metadata?.tts_speed === 'slow' ? 0.7 : 1)}
          aria-label="Play Danish audio"
          className="bg-[var(--color-accent-primary)] text-white px-6 py-3 rounded-[var(--radius-button)] hover:bg-[var(--color-accent-primary-hover)] transition-colors btn-hover flex items-center gap-2"
        >
          <Volume2 size={20} /> Play
        </button>
        <button
          onClick={() => speak(0.6)}
          aria-label="Play Danish audio slowly"
          className="bg-[var(--color-accent-primary-70)] text-white px-4 py-3 rounded-[var(--radius-button)] hover:bg-[var(--color-accent-primary)] transition-colors btn-hover flex items-center gap-2"
        >
          <Snail size={18} /> Slow
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={disabled}
          aria-label="Type what you hear"
          className="flex-1 px-4 py-2 border border-[var(--color-border-primary)] rounded-[var(--radius-input)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)] disabled:opacity-50"
          placeholder="Type what you hear..."
          autoFocus
        />
        <button
          type="submit"
          disabled={disabled || !answer.trim()}
          className="bg-[var(--color-accent-primary)] text-white px-6 py-2 rounded-[var(--radius-button)] hover:bg-[var(--color-accent-primary-hover)] disabled:opacity-50 transition-colors btn-hover"
        >
          Check
        </button>
      </form>

      <button
        onClick={() => setRevealed(!revealed)}
        className="text-xs text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] transition-colors"
      >
        {revealed ? 'Hide text' : 'Reveal text (gives up)'}
      </button>

      {revealed && (
        <div className="bg-[var(--color-warning-bg)] border border-[var(--color-warning-30)] p-3 rounded-[var(--radius-button)] text-sm">
          <p className="font-medium font-[family-name:var(--font-serif)] text-[var(--color-text-primary)]">{exercise.danish_text}</p>
          <p className="text-[var(--color-text-secondary)] italic mt-1">{exercise.english_text}</p>
        </div>
      )}
    </div>
  );
}
