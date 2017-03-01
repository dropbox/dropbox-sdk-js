import DropboxTeam = require('dropbox/team');
const prompt = require('prompt');

prompt.start();

prompt.get({
  properties: {
    accessToken: {
      description: 'Please enter an API V2 team access token'
    },
    userId: {
      description: 'Please enter the id of the user you would like to act as'
    }
  }
}, function (error: any, result: any) {
  var dbx = new DropboxTeam({ accessToken: result.accessToken });
  var dbxUser = dbx.actAsUser(result.userId);
  dbxUser.filesListFolder({ path: '' })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (err: DropboxTypes.Error<DropboxTypes.files.ListFolderError>) {
      console.log(err);
    });
});
