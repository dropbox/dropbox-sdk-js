import { readFileSync } from 'fs';
import json from 'rollup-plugin-json';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify';

const env = process.env.NODE_ENV;
const babelEnv = process.env.BABEL_ENV;

const pkg = JSON.parse(readFileSync('./package.json', 'utf8'))

var config = {
  format: 'umd',
  external: Object.keys(pkg.dependencies),
  moduleName: 'Dropbox',
  plugins: [
    nodeResolve({
      jsnext: true
    }),
    babel({
      exclude: 'node_modules/**'
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(env)
    }),
    commonjs({
      namedExports: {
        // exclude: [ 'node_modules/**' ],
        // left-hand side can be an absolute path, a path
        // relative to the current directory, or the name
        // of a module in node_modules
        'superagent': [ 'superagent' ]
      }
    }),
    json({
      // for tree-shaking, properties will be declared as
      // variables, using either `var` or `const`
      preferConst: true, // Default: false
    })
  ]
}

if (env === 'es') {
  config.plugins.push(
    ignore(['formidable'])
  );
}

if (env === 'production') {
  config.plugins.push(
    uglify({
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
