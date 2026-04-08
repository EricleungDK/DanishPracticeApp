import React from 'react';
import { render, screen } from '@testing-library/react';
import ReadingExercise from '../ReadingExercise';
import type { Exercise } from '../../../../shared/types';

const exercise: Exercise = {
  id: '1',
  type: 'reading',
  difficulty: 'B1',
  topic: 'culture',
  danish_text: 'Hygge er en vigtig del af dansk kultur.',
  english_text: 'Hygge is an important part of Danish culture.',
  answer_key: {
    questions: [
      {
        question_da: 'Hvad er hygge?',
        question_en: 'What is hygge?',
        type: 'multiple_choice',
        options: ['A feeling', 'A food', 'A city', 'A song'],
        correct_index: 0,
      },
    ],
  },
  metadata: {},
};

describe('ReadingExercise', () => {
  it('MC options wrapped in role="radiogroup"', () => {
    render(<ReadingExercise exercise={exercise} onSubmit={jest.fn()} disabled={false} />);
    expect(screen.getByRole('radiogroup')).toBeInTheDocument();
  });

  it('individual MC options have role="radio"', () => {
    render(<ReadingExercise exercise={exercise} onSubmit={jest.fn()} disabled={false} />);
    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(4);
  });

  it('passage is wrapped in article', () => {
    render(<ReadingExercise exercise={exercise} onSubmit={jest.fn()} disabled={false} />);
    expect(screen.getByRole('article')).toBeInTheDocument();
  });
});
