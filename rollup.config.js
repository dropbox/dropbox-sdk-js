import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import replace from 'rollup-plugin-replace';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';

const env = process.env.NODE_ENV;

var config = {
  format: 'umd',
  sourceMap: (env !== 'production'),
  plugins: [
    nodeResolve({
      jsnext: true
    }),
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      plugins: ["external-helpers"],
      presets: [
        ["latest", {
          "es2015": {
            "modules": false
          },
          "es2016": false,
          "es2017": false
        }]
      ],
      env: {
        "commonjs": {
          "plugins": [
            ["transform-es2015-modules-commonjs", { "loose": true }]
          ]
        }
      }
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(env)
    }),
    commonjs({
      // if false then skip sourceMap generation for CommonJS modules
      sourceMap: (env !== 'production')  // Default: true
    })
  ]
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
