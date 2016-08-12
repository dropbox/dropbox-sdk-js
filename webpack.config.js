const path = require('path');
var webpack = require('webpack')

module.exports = {

  entry: __dirname + '/src/index.js',

  output: {
    filename: 'dropbox-sdk.js',
    path: __dirname + '/dist'
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: [path.resolve(__dirname, 'node_modules')],
        query: {
          presets: ['es2015'],
        },
      }
    ]
  },

  plugins: [
    new webpack.optimize.OccurenceOrderPlugin()
  ]

}
