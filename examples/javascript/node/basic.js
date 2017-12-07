var Dropbox = require('../../../lib/dropbox').Dropbox;
var prompt = require('prompt');

prompt.start();

prompt.get({
  properties: {
    accessToken: {
      description: 'Please enter an API V2 access token'
    }
  }
}, function (error, result) {
  var dbx = new Dropbox({ accessToken: result.accessToken });
  dbx.filesListFolder({ path: '/Screenshots' })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (err) {
      console.log(err);
    });
});
