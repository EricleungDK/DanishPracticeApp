import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ThemeToggle from '../ui/ThemeToggle';
import { useAppStore } from '../../store/useAppStore';

beforeEach(() => {
  useAppStore.setState({ theme: 'light' });
  document.documentElement.className = 'light';
  jest.clearAllMocks();
});

describe('ThemeToggle', () => {
  it('renders with role="switch" and aria-label', () => {
    render(<ThemeToggle />);
    const toggle = screen.getByRole('switch', { name: /dark mode/i });
    expect(toggle).toBeInTheDocument();
  });

  it('shows aria-checked=false when light', () => {
    render(<ThemeToggle />);
    const toggle = screen.getByRole('switch');
    expect(toggle).toHaveAttribute('aria-checked', 'false');
  });

  it('shows aria-checked=true when dark', () => {
    useAppStore.setState({ theme: 'dark' });
    render(<ThemeToggle />);
    const toggle = screen.getByRole('switch');
    expect(toggle).toHaveAttribute('aria-checked', 'true');
  });

  it('toggles theme on click', async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);
    const toggle = screen.getByRole('switch');
    await user.click(toggle);
    expect(useAppStore.getState().theme).toBe('dark');
  });
});
