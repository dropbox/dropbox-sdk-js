const fs = require('fs');
const path = require('path');
const express = require('express');
const rewrite = require('express-urlrewrite');
const rollup = require('rollup-endpoint');

const app = express();
const port = process.env.PORT || 8080;

app.get(
  '/__build__/Dropbox-sdk.min.js',
  rollup.serve({
    entry: path.resolve(__dirname, '../../dist/Dropbox-sdk.js'),
  }),
);

fs.readdirSync(__dirname).forEach((file) => {
  if (fs.statSync(path.join(__dirname, file)).isDirectory()) {
    console.log(`Adding Route: /${file}/* from file /${file}/index.html`);
    app.use(rewrite(`/${file}/*`, `/${file}/index.html`));
  }
});

app.use(express.static(__dirname));
app.use('/__dist__', express.static(path.resolve(__dirname, '../../dist')));

app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});
