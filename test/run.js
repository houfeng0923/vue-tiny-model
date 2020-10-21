// eslint-disable-next-line @typescript-eslint/no-var-requires
require('ts-node').register({
  compilerOptions: {
    module: 'commonjs',
    target: 'es6',
    inlineSourceMap: true,
    sourceMap: true,
    allowJs: true,
  },
  files: ['../tsconfig.json'],
});

