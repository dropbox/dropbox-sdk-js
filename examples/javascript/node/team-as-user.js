const prompt = require('prompt');

// This dependency exposes the `fetch` function globally which dropbox-sdk-js depends on.
// Make sure to require it before requiring the dropbox lib otherwise an error will be
// thrown immediately.
require('isomorphic-fetch');

const { DropboxTeam } = require('dropbox');

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
