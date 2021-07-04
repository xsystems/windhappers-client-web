import resolve from '@rollup/plugin-node-resolve';
import { copy } from '@web/rollup-plugin-copy';
import html from '@web/rollup-plugin-html';
import minifyHTML from 'rollup-plugin-minify-html-literals';
import summary from 'rollup-plugin-summary';
import { terser } from 'rollup-plugin-terser';
import { generateSW } from 'rollup-plugin-workbox';

const BUILD_DIRECTORY = 'build/es-bundled';

export default {
  input: 'index.html',
  output: {
    dir: `${BUILD_DIRECTORY}`,
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
    generateSW({
      swDest: `${BUILD_DIRECTORY}/service-worker.js`,
      globDirectory: `${BUILD_DIRECTORY}`,
    }),
  ],
  preserveEntrySignatures: 'strict',
};
