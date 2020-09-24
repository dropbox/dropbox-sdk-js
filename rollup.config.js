import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';

/**
 * We use rollup for the UMD build.
 * Rollup is only needed for this because UMD is the
 * only build configuration that requires us to bundle
 * all assets into a single file.
 *
 * We also only publish a minified bundle for UMD.
 * We use a flag of BUNDLE_TYPE set by cross-env to control
 * whether or not we minify the bundle.  We use terser to
 * do the actual minification and it is only added when the
 * BUNDLE_TYPE = minified (BUNDLE_TYPE=normal for basic UMD)
 */

const config = {
  output: {
    format: 'umd',
    sourcemap: (process.env.BUNDLE_TYPE !== 'minified'),
    globals: {
      crypto: 'crypto',
    },
  },
  external: ['es6-promise/auto', 'crypto'],
  plugins: [
    babel(),
  ],
};

if (process.env.BUNDLE_TYPE === 'minified') {
  config.plugins.push(
    terser({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false,
      },
    }),
  );
}

export default config;
