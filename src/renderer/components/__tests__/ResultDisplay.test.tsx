import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ResultDisplay from '../ResultDisplay';

const defaultProps = {
  correct: true,
  expected: 'står',
  explanation: 'Full sentence: "Jeg står altid tidligt op"',
  onRate: jest.fn(),
};

describe('ResultDisplay', () => {
  it('renders result banner with role="alert"', () => {
    render(<ResultDisplay {...defaultProps} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('shows "Correct!" for correct answers', () => {
    render(<ResultDisplay {...defaultProps} correct={true} />);
    expect(screen.getByText('Correct!')).toBeInTheDocument();
  });

  it('shows "Incorrect" and expected answer for wrong answers', () => {
    render(<ResultDisplay {...defaultProps} correct={false} />);
    expect(screen.getByText('Incorrect')).toBeInTheDocument();
    expect(screen.getByText('står')).toBeInTheDocument();
  });

  it('renders quality rating buttons', () => {
    render(<ResultDisplay {...defaultProps} />);
    const buttons = screen.getAllByRole('button').filter(b => b.textContent?.match(/^\d/));
    expect(buttons.length).toBe(6);
  });

  it('calls onRate when quality button clicked', async () => {
    const onRate = jest.fn();
    const user = userEvent.setup();
    render(<ResultDisplay {...defaultProps} onRate={onRate} />);
    const btn5 = screen.getByText('5');
    await user.click(btn5.closest('button')!);
    expect(onRate).toHaveBeenCalledWith(5);
  });
});
