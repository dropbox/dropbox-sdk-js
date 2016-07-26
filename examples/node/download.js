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
      description: 'Please enter a shared link to a png'
    }
  }
}, function (error, result) {
  var dbx = new Dropbox({ accessToken: result.accessToken });
  dbx.sharingGetSharedLinkFile({ url: result.sharedLink })
    .then(function (response) {
      var file = fs.createWriteStream('foo.png');
      response.on('data', function (chunk) {
        file.write(chunk);
      }).on('close', function () {
        file.end();
      });
    })
    .catch(function (err) {
      console.log(err);
    });
});
