import express = require('express');
const rewrite = require('express-urlrewrite');
import fs = require('fs');
import path = require('path');
import webpack = require('webpack');
const webpackConfig = require('../../webpack-umd.config');
const webpackDevMiddleware = require('webpack-dev-middleware');

const app = express();

// Adds built dropbox-api to __build__
app.use(webpackDevMiddleware(webpack(webpackConfig), {
  publicPath: '/__build__/'
}));

fs.readdirSync(__dirname).forEach(function (file) {
  if (fs.statSync(path.join(__dirname, file)).isDirectory()) {
    app.use(<any> rewrite('/' + file + '/*', '/' + file + '/index.html'));
  }
});

app.use(express.static(__dirname));

const port = process.env.PORT || 8080;
app.listen(port);
console.log("Express server listening on port " + port );
