import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/main.ts'],
  format: ['cjs'],
  target: 'node16',
  sourcemap: true,
  dts: true,
  outDir: 'dist',
  clean: true,
});
