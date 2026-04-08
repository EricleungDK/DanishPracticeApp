import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FillBlankExercise from '../FillBlankExercise';
import type { Exercise } from '../../../../shared/types';

const exercise: Exercise = {
  id: '1',
  type: 'fill_blank',
  difficulty: 'B1',
  topic: 'daily life',
  danish_text: 'Jeg ___ altid tidligt op.',
  english_text: 'I always ___ up early.',
  answer_key: { correct: ['står'], accept_also: [], answer_en: 'get' },
  metadata: { hint: 'Present tense of at stå', grammar_point: 'present tense' },
};

describe('FillBlankExercise', () => {
  it('renders input with aria-label and aria-required', () => {
    render(<FillBlankExercise exercise={exercise} onSubmit={jest.fn()} disabled={false} />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-label', 'Fill in the blank');
    expect(input).toHaveAttribute('aria-required', 'true');
  });

  it('hint toggle sets aria-expanded', async () => {
    const user = userEvent.setup();
    render(<FillBlankExercise exercise={exercise} onSubmit={jest.fn()} disabled={false} />);
    const hintBtn = screen.getByRole('button', { name: /show hint/i });
    expect(hintBtn).toHaveAttribute('aria-expanded', 'false');

    await user.click(hintBtn);
    expect(hintBtn).toHaveAttribute('aria-expanded', 'true');
  });

  it('calls onSubmit with input value', async () => {
    const onSubmit = jest.fn();
    const user = userEvent.setup();
    render(<FillBlankExercise exercise={exercise} onSubmit={onSubmit} disabled={false} />);
    const input = screen.getByRole('textbox');
    await user.type(input, 'står');
    await user.click(screen.getByRole('button', { name: /check/i }));
    expect(onSubmit).toHaveBeenCalledWith('står');
  });
});
