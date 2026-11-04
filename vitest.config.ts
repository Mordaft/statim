import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    include: ['src/**/*.test.ts'],
    setupFiles: ['src/test/setup.ts'],
    reporters: ['default', ['html', { outputDir: 'reports/unit' }], ['junit', { outputFile: 'reports/unit/junit.xml' }]],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.test.ts', 'src/test/**', 'src/types/**', 'src/main.ts'],
      reporter: ['text-summary', 'html', 'cobertura'],
      reportsDirectory: 'reports/coverage',
    },
  },
});
