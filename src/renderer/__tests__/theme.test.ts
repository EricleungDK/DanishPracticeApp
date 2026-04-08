import { useAppStore } from '../store/useAppStore';

beforeEach(() => {
  // Reset store between tests
  useAppStore.setState({
    theme: 'light',
  });
  document.documentElement.className = '';
  jest.clearAllMocks();
});

describe('theme system', () => {
  it('defaults to light theme', () => {
    const state = useAppStore.getState();
    expect(state.theme).toBe('light');
  });

  it('loadTheme reads persisted setting and applies to DOM', async () => {
    (window.api.getSetting as jest.Mock).mockResolvedValueOnce('dark');

    await useAppStore.getState().loadTheme();

    expect(window.api.getSetting).toHaveBeenCalledWith('theme');
    expect(useAppStore.getState().theme).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('loadTheme defaults to light when no setting exists', async () => {
    (window.api.getSetting as jest.Mock).mockResolvedValueOnce(undefined);

    await useAppStore.getState().loadTheme();

    expect(useAppStore.getState().theme).toBe('light');
    expect(document.documentElement.classList.contains('light')).toBe(true);
  });

  it('toggleTheme flips light to dark and persists', async () => {
    useAppStore.setState({ theme: 'light' });

    await useAppStore.getState().toggleTheme();

    expect(useAppStore.getState().theme).toBe('dark');
    expect(window.api.saveSetting).toHaveBeenCalledWith('theme', 'dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(document.documentElement.classList.contains('light')).toBe(false);
  });

  it('toggleTheme flips dark to light and persists', async () => {
    useAppStore.setState({ theme: 'dark' });
    document.documentElement.classList.add('dark');

    await useAppStore.getState().toggleTheme();

    expect(useAppStore.getState().theme).toBe('light');
    expect(window.api.saveSetting).toHaveBeenCalledWith('theme', 'light');
    expect(document.documentElement.classList.contains('light')).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});
