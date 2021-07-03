import resolve from '@rollup/plugin-node-resolve';
import { copy } from '@web/rollup-plugin-copy';
import html from '@web/rollup-plugin-html';
import minifyHTML from 'rollup-plugin-minify-html-literals';
import summary from 'rollup-plugin-summary';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'index.html',
  output: {
    dir: 'build/es-bundled',
    format: 'es',
  },
  plugins: [
    html({
      extractAssets: false,
    }),
    resolve(),
    minifyHTML(),
    terser({
      ecma: 2020,
      module: true,
      warnings: true,
    }),
    summary(),
    copy({
      patterns: [
        'configuration/**/*',
        'fonts/**/*',
        'images/**/*',
        'node_modules/@webcomponents/**/*',
        'node_modules/@fortawesome/fontawesome-free/**/*',
        'environment',
        'LICENSE',
        'manifest.json',
        'package.json',
        'robots.txt',
      ],
    }),
  ],
  preserveEntrySignatures: 'strict',
};
