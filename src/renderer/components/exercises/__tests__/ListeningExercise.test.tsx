import React from 'react';
import { render, screen } from '@testing-library/react';
import ListeningExercise from '../ListeningExercise';
import type { Exercise } from '../../../../shared/types';

const exercise: Exercise = {
  id: '1',
  type: 'listening',
  difficulty: 'B1',
  topic: 'daily life',
  danish_text: 'Jeg står altid tidligt op.',
  english_text: 'I always get up early.',
  answer_key: { correct: ['Jeg står altid tidligt op.'], accept_also: [] },
  metadata: {},
};

describe('ListeningExercise', () => {
  it('play button has aria-label', () => {
    render(<ListeningExercise exercise={exercise} onSubmit={jest.fn()} disabled={false} />);
    expect(screen.getByRole('button', { name: 'Play Danish audio' })).toBeInTheDocument();
  });

  it('slow button has aria-label', () => {
    render(<ListeningExercise exercise={exercise} onSubmit={jest.fn()} disabled={false} />);
    expect(screen.getByRole('button', { name: 'Play Danish audio slowly' })).toBeInTheDocument();
  });

  it('input has aria-label', () => {
    render(<ListeningExercise exercise={exercise} onSubmit={jest.fn()} disabled={false} />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-label', 'Type what you hear');
  });
});
