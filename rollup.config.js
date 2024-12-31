import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/main.ts', // エントリーポイント
  output: {
    file: 'dist/main.js', // 出力ファイル
    format: 'cjs', // CommonJS フォーマット
    sourcemap: true, // ソースマップを生成
  },
  external: [
    // '@actions/core',
    // '@actions/github',
    'util',
    'events',
    'http',
    'https',
    'url',
  ], // バンドルから除外するモジュール
  plugins: [
    resolve(), // Node.js モジュールの解決
    commonjs(), // CommonJS モジュールを変換
    typescript(), // TypeScript をコンパイル
  ],
};
