const prompt = require('prompt');
const fs = require('fs');

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
    sharedLink: {
      description: 'Please enter a shared link to a file',
    },
  },
}, (error, result) => {
  const dbx = new Dropbox({ accessToken: result.accessToken });
  dbx.sharingGetSharedLinkFile({ url: result.sharedLink })
    .then((data) => {
      fs.writeFile(data.name, data.fileBinary, 'binary', (err) => {
        if (err) { throw err; }
        console.log(`File: ${data.name} saved.`);
      });
    })
    .catch((err) => {
      throw err;
    });
});
