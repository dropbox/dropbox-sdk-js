var express = require('express');
var rewrite = require('express-urlrewrite');
var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var webpackConfig = require('../webpack-umd.config');
var webpackDevMiddleware = require('webpack-dev-middleware');

var app = express();

// Adds built dropbox-api to __build__
app.use(webpackDevMiddleware(webpack(webpackConfig), {
  publicPath: '/__build__/'
}));

fs.readdirSync(__dirname).forEach(function (file) {
  if (fs.statSync(path.join(__dirname, file)).isDirectory()) {
    app.use(rewrite('/' + file + '/*', '/' + file + '/index.html'));
  }
});

app.use(express.static(__dirname));

var port = process.env.PORT || 8080;
app.listen(port);
console.log("Express server listening on port " + port );
