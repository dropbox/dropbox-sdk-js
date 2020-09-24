const fs = require('fs');
const path = require('path');
const prompt = require('prompt');
const { Dropbox } = require('dropbox'); // eslint-disable-line import/no-unresolved

prompt.start();

prompt.get({
  properties: {
    accessToken: {
      description: 'Please enter an API V2 access token',
    },
  },
}, (error, result) => {
  const dbx = new Dropbox({ accessToken: result.accessToken });

  fs.readFile(path.join(__dirname, '/basic.js'), (err, contents) => {
    if (err) {
      console.log('Error: ', err);
    }

    // This uploads basic.js to the root of your dropbox
    dbx.filesUpload({ path: '/basic.js', contents })
      .then((response) => {
        console.log(response);
      })
      .catch((uploadErr) => {
        console.log(uploadErr);
      });
  });
});
