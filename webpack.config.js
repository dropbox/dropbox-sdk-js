var webpack = require('webpack');

module.exports = {

  entry: __dirname + '/src/index.js',

  output: {
    filename: 'dropbox-sdk.js',
    path: __dirname + '/dist'
  },

  externals: Object.keys(require(__dirname + '/package.json').dependencies),

  plugins: [
    new webpack.optimize.OccurenceOrderPlugin()
  ]

};
