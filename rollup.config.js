import json from 'rollup-plugin-json';
import { string } from 'rollup-plugin-string';
import typescript from 'rollup-plugin-typescript2';

const config = {
  input: 'src/index.ts',
  output: [
    {
      dir: 'dist/cjs',
      format: 'cjs',
    },
    {
      dir: 'dist/esm',
      format: 'esm',
    },
  ],
  external: ['tslib'],
  plugins: [
    json({ namedExports: false }),
    string({
      include: '**/*.md',
    }),
    typescript(),
  ],
};

export default config;
