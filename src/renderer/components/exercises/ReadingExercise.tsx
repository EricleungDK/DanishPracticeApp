import React, { useState } from 'react';
import type { Exercise, ReadingAnswerKey, ReadingQuestion } from '../../../shared/types';

interface Props {
  exercise: Exercise;
  onSubmit: (answer: { questionIndex: number; answer: string | number; question: ReadingQuestion }) => void;
  disabled: boolean;
}

export default function ReadingExercise({ exercise, onSubmit, disabled }: Props) {
  const answerKey = exercise.answer_key as ReadingAnswerKey;
  const [showTranslation, setShowTranslation] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | number>>({});
  const [freeTextInput, setFreeTextInput] = useState('');

  const question = answerKey.questions[currentQuestion];
  if (!question) return null;

  const handleMCSelect = (index: number) => {
    if (disabled) return;
    const newAnswers = { ...answers, [currentQuestion]: index };
    setAnswers(newAnswers);
    onSubmit({ questionIndex: currentQuestion, answer: index, question });
  };

  const handleFreeTextSubmit = () => {
    if (disabled || !freeTextInput.trim()) return;
    const newAnswers = { ...answers, [currentQuestion]: freeTextInput };
    setAnswers(newAnswers);
    onSubmit({ questionIndex: currentQuestion, answer: freeTextInput, question });
    setFreeTextInput('');
  };

  return (
    <div className="space-y-4">
      <article className="bg-[var(--color-bg-tertiary)] p-4 rounded-[var(--radius-card)] border border-[var(--color-border-secondary)] max-h-60 overflow-y-auto">
        <p className="text-base leading-relaxed whitespace-pre-line font-[family-name:var(--font-serif)] text-[var(--color-text-primary)]">
          {exercise.danish_text}
        </p>
        {showTranslation && (
          <p className="text-sm text-[var(--color-text-secondary)] mt-3 pt-3 border-t border-[var(--color-border-secondary)] italic">
            {exercise.english_text}
          </p>
        )}
      </article>

      <button
        onClick={() => setShowTranslation(!showTranslation)}
        className="text-xs text-[var(--color-accent-primary)] hover:text-[var(--color-accent-primary-hover)] transition-colors"
      >
        {showTranslation ? 'Hide translation' : 'Show translation'}
      </button>

      <div className="border-t border-[var(--color-border-secondary)] pt-4">
        <p className="text-sm text-[var(--color-text-tertiary)] mb-1">
          Question {currentQuestion + 1} / {answerKey.questions.length}
        </p>
        <p className="font-medium text-[var(--color-text-primary)]">{question.question_da}</p>
        <p className="text-sm text-[var(--color-text-secondary)] italic">{question.question_en}</p>

        {question.type === 'multiple_choice' && question.options && (
          <div role="radiogroup" aria-label={question.question_en} className="mt-3 space-y-2">
            {question.options.map((option, i) => (
              <button
                key={i}
                role="radio"
                aria-checked={answers[currentQuestion] === i}
                onClick={() => handleMCSelect(i)}
                disabled={disabled}
                className={`w-full text-left px-4 py-2 rounded-[var(--radius-button)] border transition-colors ${
                  answers[currentQuestion] === i
                    ? 'bg-[var(--color-accent-primary-10)] border-[var(--color-accent-primary)]'
                    : 'hover:bg-[var(--color-bg-tertiary)] border-[var(--color-border-primary)]'
                } disabled:opacity-50`}
              >
                <span className="font-medium mr-2 text-[var(--color-text-secondary)]">{String.fromCharCode(65 + i)}.</span>
                <span className="text-[var(--color-text-primary)]">{option}</span>
              </button>
            ))}
          </div>
        )}

        {question.type === 'free_text' && (
          <div className="mt-3 flex gap-2">
            <input
              type="text"
              value={freeTextInput}
              onChange={(e) => setFreeTextInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleFreeTextSubmit()}
              disabled={disabled}
              className="flex-1 px-4 py-2 border border-[var(--color-border-primary)] rounded-[var(--radius-input)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)] disabled:opacity-50"
              placeholder="Type your answer..."
            />
            <button
              onClick={handleFreeTextSubmit}
              disabled={disabled || !freeTextInput.trim()}
              className="bg-[var(--color-accent-primary)] text-white px-4 py-2 rounded-[var(--radius-button)] hover:bg-[var(--color-accent-primary-hover)] disabled:opacity-50 transition-colors btn-hover"
            >
              Check
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
