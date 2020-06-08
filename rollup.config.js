import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
import {terser} from "rollup-plugin-terser";


const env = process.env.NODE_ENV;

const config = {
  output: {
    format: 'umd',
    sourcemap: (env !== 'production'),
    globals: {
      crypto: 'crypto'
    },
  },
  external: ['es6-promise/auto', 'crypto'],

  plugins: [
    builtins(),
    globals(),
    resolve({
      main: true,
      jsnext: true,
      browser: true,
      preferBuiltins: true
    }),
    commonjs({
      // if false then skip sourceMap generation for CommonJS modules
      sourceMap: (env !== 'production'),  // Default: true
    }),
    babel({
      exclude: 'node_modules/**',
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(env),
    }),
  ],
};

if (env === 'production') {
  config.plugins.push(
    terser({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false,
      }
    })
  );
}

export default config
