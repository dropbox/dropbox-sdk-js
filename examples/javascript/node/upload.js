const fs = require('fs');
const path = require('path');
const prompt = require('prompt');

// This dependency exposes the `fetch` function globally which dropbox-sdk-js depends on.
// Make sure to require it before requiring the dropbox lib otherwise an error will be
// thrown immediately.
require('isomorphic-fetch');

const { Dropbox } = require('dropbox');

prompt.start();

prompt.get({
  properties: {
    accessToken: {
      description: 'Please enter an API V2 access token',
    },
  },
}, (error, result) => {
  const dbx = new Dropbox({ accessToken: result.accessToken });

  fs.readFile(path.join(__dirname, '/basic.js'), 'utf8', (fsErr, contents) => {
    if (fsErr) {
      console.log('Error: ', fsErr);
    }

    // This uploads basic.js to the root of your dropbox
    dbx.filesUpload({ path: '/basic.js', contents })
      .then((response) => {
        console.log(response);
      })
      .catch((dbxErr) => {
        console.log(dbxErr);
      });
  });
});
