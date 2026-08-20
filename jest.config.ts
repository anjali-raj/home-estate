import type { Config } from 'jest';
import nextJest from 'next/jest.js';

// next/jest wires up SWC transform, tsconfig paths, CSS/asset mocks, and env.
const createJestConfig = nextJest({ dir: './' });

const config: Config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    // `server-only` throws outside an RSC bundle — stub it so the pure repo
    // logic can be unit-tested directly.
    '^server-only$': '<rootDir>/test/stubs/server-only.ts',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: ['<rootDir>/test/**/*.test.ts?(x)'],
};

export default createJestConfig(config);
