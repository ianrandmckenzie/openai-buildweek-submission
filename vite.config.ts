import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  base: './',
  build: {
    outDir: 'docs',
    emptyOutDir: true,
  },
  test: {
    environment: 'node',
    setupFiles: ['./tests/setup.ts'],
    restoreMocks: true,
    exclude: ['tests/e2e/**', 'node_modules/**'],
  },
});
