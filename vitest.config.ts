import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: 'node',
    globals: true,
  },
  resolve: {
    alias: {
      // `server-only` throws when imported outside an RSC server bundle;
      // stub it so we can unit-test the pure repo logic directly.
      'server-only': new URL('./test/stubs/server-only.ts', import.meta.url)
        .pathname,
    },
  },
});
