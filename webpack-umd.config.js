const path = require('path');
var webpack = require('webpack');

module.exports = {

  entry: {
    Dropbox: __dirname + '/src/index.js',
    DropboxTeam: __dirname + '/src/team/index.js'
  },

  // Note that this makes filenames with capitals: Dropbox-sdk.min.js
  // Not sure how to get around this. even webpack examples do this...
  output: {
    filename: '[name]-sdk.min.js',
    library: '[name]',
    libraryTarget: 'umd',
    path: __dirname + '/dist'
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: [path.resolve(__dirname, 'node_modules')],
        query: {
          presets: ['es2015', 'stage-0'],
          plugins: ['transform-flow-strip-types']
        },
      }
    ]
  },

  plugins: [
    new webpack.optimize.OccurenceOrderPlugin()
  ]

};
