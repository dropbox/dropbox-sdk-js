import Dropbox = require('dropbox');
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
  dbx.filesListFolder({ path: '/Screenshots' })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (err) {
      console.log(err);
    });
});
