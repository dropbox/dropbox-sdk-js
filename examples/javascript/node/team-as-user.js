const prompt = require('prompt');
const { DropboxTeam } = require('../../../cjs/dropbox'); // eslint-disable-line import/no-unresolved

prompt.start();

prompt.get({
  properties: {
    accessToken: {
      description: 'Please enter an API V2 team access token',
    },
    userId: {
      description: 'Please enter the id of the user you would like to act as',
    },
  },
}, (error, result) => {
  const dbx = new DropboxTeam({ accessToken: result.accessToken });
  const dbxUser = dbx.actAsUser(result.userId);
  dbxUser.filesListFolder({ path: '' })
    .then((response) => {
      console.log(response);
    })
    .catch((err) => {
      console.log(err);
    });
});
