import React, { useState } from 'react';
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

  // Try using Web Speech API for TTS
  const speak = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(exercise.danish_text);
      utterance.lang = 'da-DK';
      utterance.rate = exercise.metadata?.tts_speed === 'slow' ? 0.7 : 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">Listen and type what you hear in Danish.</p>

      <div className="flex gap-3">
        <button
          onClick={speak}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
        >
          <span className="text-lg">🔊</span> Play
        </button>
        <button
          onClick={() => {
            if ('speechSynthesis' in window) {
              const utterance = new SpeechSynthesisUtterance(exercise.danish_text);
              utterance.lang = 'da-DK';
              utterance.rate = 0.6;
              window.speechSynthesis.speak(utterance);
            }
          }}
          className="bg-purple-400 text-white px-4 py-3 rounded-lg hover:bg-purple-500 transition-colors"
        >
          🐢 Slow
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={disabled}
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:opacity-50"
          placeholder="Type what you hear..."
          autoFocus
        />
        <button
          type="submit"
          disabled={disabled || !answer.trim()}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          Check
        </button>
      </form>

      <button
        onClick={() => setRevealed(!revealed)}
        className="text-xs text-gray-400 hover:text-gray-600"
      >
        {revealed ? 'Hide text' : 'Reveal text (gives up)'}
      </button>

      {revealed && (
        <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-sm">
          <p className="font-medium">{exercise.danish_text}</p>
          <p className="text-gray-500 italic mt-1">{exercise.english_text}</p>
        </div>
      )}
    </div>
  );
}
