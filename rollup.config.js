import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import pkg from './package.json';
import typescript from 'typescript';
import ts_plugin2 from 'rollup-plugin-typescript2';

const BASE = {
  external: [
    'vue',
  ],
  plugins: [
    resolve(),
    commonjs(),
    ts_plugin2({
      typescript,
      useTsconfigDeclarationDir: true,
    }),
  ],
};

const MAIN = Object.assign({}, BASE, {
  input: 'src/index.ts',
  output: [
    { file: pkg.main, format: 'cjs' },
    { file: pkg.module, format: 'es' },
  ],
});

export default [
  MAIN,
];
