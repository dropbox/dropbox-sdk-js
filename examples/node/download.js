var Dropbox = require('../../src/dropbox');
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
    .then(function (response) {
      var metadata = JSON.parse(response.headers['dropbox-api-result']);
      fs.writeFile(metadata.name, response.res.text, 'binary', function (err) {
        if (err) { throw err; }
        console.log('File: ' + metadata.name + ' saved.');
      });
    })
    .catch(function (err) {
      throw err;
    });
});
