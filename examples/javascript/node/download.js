const fs = require('fs');
const prompt = require('prompt');
const { Dropbox } = require('dropbox'); // eslint-disable-line import/no-unresolved

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
      fs.writeFile(data.result.name, data.result.fileBinary, 'binary', (err) => {
        if (err) { throw err; }
        console.log(`File: ${data.result.name} saved.`);
      });
    })
    .catch((err) => {
      throw err;
    });
});
