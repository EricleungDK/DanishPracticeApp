import React from 'react';
import { render, screen } from '@testing-library/react';
import Dashboard from '../../pages/Dashboard';
import { useAppStore } from '../../store/useAppStore';

beforeEach(() => {
  useAppStore.setState({
    stats: { totalReviewed: 10, accuracy: 80, streak: 3, dueCount: 0 },
    sessionExercises: [],
    sessionComplete: false,
    currentIndex: 0,
  });
});

describe('Dashboard', () => {
  it('renders exercise type buttons with accessible names', () => {
    render(<Dashboard />);
    expect(screen.getByRole('button', { name: /fill in the blank/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sentence building/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reading/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /listening/i })).toBeInTheDocument();
  });

  it('disables Review Due button when dueCount is 0', () => {
    render(<Dashboard />);
    const reviewBtn = screen.getByRole('button', { name: /review due/i });
    expect(reviewBtn).toBeDisabled();
  });

  it('enables Review Due button when dueCount > 0', () => {
    useAppStore.setState({
      stats: { totalReviewed: 10, accuracy: 80, streak: 3, dueCount: 5 },
    });
    render(<Dashboard />);
    const reviewBtn = screen.getByRole('button', { name: /review due/i });
    expect(reviewBtn).not.toBeDisabled();
  });
});
