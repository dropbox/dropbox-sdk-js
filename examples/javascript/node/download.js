var Dropbox = require('../../../lib/dropbox').Dropbox;
var fs = require('fs');
var prompt = require('prompt');

prompt.start();

prompt.get({
  properties: {
    accessToken: {
      description: 'Please enter an API V2 access token'
    },
    sharedLink: {
      description: 'Please enter a shared link to a file'
    }
  }
}, function (error, result) {
  var dbx = new Dropbox({ accessToken: result.accessToken });
  dbx.sharingGetSharedLinkFile({ url: result.sharedLink })
    .then(function (data) {
      fs.writeFile(data.name, data.fileBinary, 'binary', function (err) {
        if (err) { throw err; }
        console.log('File: ' + data.name + ' saved.');
      });
    })
    .catch(function (err) {
      throw err;
    });
});
