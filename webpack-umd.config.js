var webpack = require('webpack');

module.exports = {

  entry: {
    dropbox: __dirname + '/src/index.js',
    dropboxTeam: __dirname + '/src/team/index.js'
  },

  output: {
    filename: '[name]-sdk.min.js',
    library: '[name]',
    libraryTarget: 'umd',
    path: __dirname + '/dist'
  },

  plugins: [
    new webpack.optimize.OccurenceOrderPlugin()
  ]

};
