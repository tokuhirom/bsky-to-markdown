import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/main.ts'],
  bundle: true,
  format: ['cjs'],
  target: 'node20',
  sourcemap: true,
  dts: true,
  outDir: 'dist',
  clean: true,
});
