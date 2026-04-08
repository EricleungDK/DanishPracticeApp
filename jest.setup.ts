import '@testing-library/jest-dom';
import { mockWindowApi } from './src/renderer/__mocks__/window-api';
import { setApiInstance } from './src/renderer/lib/api-instance';

// Mock window.api (Electron preload bridge)
const mockApi = mockWindowApi();
Object.defineProperty(window, 'api', {
  value: mockApi,
  writable: true,
});

// Set api instance for stores that use getApiInstance()
setApiInstance(mockApi as any);

// Mock window.matchMedia for theme tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock Web Speech API
Object.defineProperty(window, 'speechSynthesis', {
  value: {
    speak: jest.fn(),
    cancel: jest.fn(),
    getVoices: jest.fn().mockReturnValue([]),
  },
  writable: true,
});

window.SpeechSynthesisUtterance = jest.fn().mockImplementation(() => ({
  lang: '',
  rate: 1,
  text: '',
})) as any;

// Suppress noisy warnings in tests
const originalError = console.error;
console.error = (...args: any[]) => {
  if (typeof args[0] === 'string' && (
    args[0].includes('act(') ||
    args[0].includes('is unrecognized in this browser') ||
    args[0].includes('is using incorrect casing')
  )) return;
  originalError.call(console, ...args);
};
