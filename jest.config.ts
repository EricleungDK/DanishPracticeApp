import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  moduleNameMapper: {
    '@shared/(.*)': '<rootDir>/src/shared/$1',
    '@renderer/(.*)': '<rootDir>/src/renderer/$1',
    '@main/(.*)': '<rootDir>/src/main/$1',
    '@content/(.*)': '<rootDir>/src/content/$1',
    'framer-motion': '<rootDir>/src/renderer/__mocks__/framer-motion.tsx',
    'recharts': '<rootDir>/src/renderer/__mocks__/recharts.tsx',
    '\\.(css|less|scss)$': 'identity-obj-proxy',
    '\\.(woff2?|ttf|eot|svg|png|jpg)$': '<rootDir>/src/renderer/__mocks__/fileMock.ts',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
  },
  testMatch: ['**/__tests__/**/*.test.ts?(x)'],
};

export default config;
