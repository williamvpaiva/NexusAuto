import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    fileParallelism: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'tests/'],
      thresholds: {
        lines: 60,
        branches: 60,
        functions: 55,
        statements: 60
      }
    }
  },
  server: {
    watch: {
      ignored: ['**/data/**']
    }
  }
});