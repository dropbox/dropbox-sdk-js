var DropboxApi = require('../index');
var prompt = require('prompt');

prompt.start();

prompt.get({
  properties: {
    accessToken: {
      description: 'Please enter an API V2 access token'
    }
  }
}, function(error, result) {
  var dbx = new DropboxApi({ accessToken: result.accessToken });
  dbx.filesListFolder({ path: '/Screenshots' })
    .then(function(response) {
      console.log(response);
    })
    .catch(function(error) {
      console.log(error);
    });
});
