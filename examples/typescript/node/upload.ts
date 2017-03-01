import Dropbox = require('dropbox');
import fs = require('fs');
import path = require('path');
const prompt = require('prompt');

prompt.start();

prompt.get({
  properties: {
    accessToken: {
      description: 'Please enter an API V2 access token'
    }
  }
}, function (error: any, result: any) {
  var dbx = new Dropbox({ accessToken: result.accessToken });

  fs.readFile(path.join(__dirname, '/basic.js'), 'utf8', function (err, contents) {
    if (err) {
      console.log('Error: ', err);
    }

    // This uploads basic.js to the root of your dropbox
    dbx.filesUpload({ path: '/basic.js', contents: contents })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (err: DropboxTypes.Error<DropboxTypes.files.UploadError>) {
        console.log(err);
      });
  });
});
