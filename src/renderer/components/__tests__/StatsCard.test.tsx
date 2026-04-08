import React from 'react';
import { render, screen } from '@testing-library/react';
import StatsCard from '../StatsCard';

describe('StatsCard', () => {
  it('renders with role="status"', () => {
    render(<StatsCard label="Reviewed" value={42} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('has aria-label combining label and value', () => {
    render(<StatsCard label="Accuracy" value="85%" />);
    const card = screen.getByRole('status');
    expect(card).toHaveAttribute('aria-label', 'Accuracy: 85%');
  });

  it('renders label and value text', () => {
    render(<StatsCard label="Streak" value="5d" />);
    expect(screen.getByText('Streak')).toBeInTheDocument();
    expect(screen.getByText('5d')).toBeInTheDocument();
  });
});
