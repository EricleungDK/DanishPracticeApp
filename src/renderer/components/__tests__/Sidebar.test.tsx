import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Sidebar from '../Sidebar';
import { useAppStore } from '../../store/useAppStore';

beforeEach(() => {
  useAppStore.setState({
    currentPage: 'dashboard',
    stats: { totalReviewed: 0, accuracy: 0, streak: 0, dueCount: 5 },
    sessionExercises: [],
    sessionComplete: false,
  });
});

describe('Sidebar', () => {
  it('renders navigation with aria-label', () => {
    render(<Sidebar />);
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveAttribute('aria-label', expect.stringMatching(/main/i));
  });

  it('renders all nav items as buttons', () => {
    render(<Sidebar />);
    expect(screen.getByRole('button', { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /practice/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /review/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /settings/i })).toBeInTheDocument();
  });

  it('marks active page with aria-current="page"', () => {
    render(<Sidebar />);
    const dashBtn = screen.getByRole('button', { name: /dashboard/i });
    expect(dashBtn).toHaveAttribute('aria-current', 'page');

    const settingsBtn = screen.getByRole('button', { name: /settings/i });
    expect(settingsBtn).not.toHaveAttribute('aria-current');
  });

  it('shows due count badge with accessible label', () => {
    render(<Sidebar />);
    const badge = screen.getByLabelText(/5 reviews due/i);
    expect(badge).toBeInTheDocument();
  });

  it('renders theme toggle', () => {
    render(<Sidebar />);
    const toggle = screen.getByRole('switch', { name: /dark mode/i });
    expect(toggle).toBeInTheDocument();
  });
});
