const prompt = require('prompt');
const { Dropbox } = require('dropbox'); // eslint-disable-line import/no-unresolved

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
  const dbx = new Dropbox({ accessToken: result.accessToken, selectUser: result.userId });
  dbx.filesListFolder({ path: '' })
    .then((response) => {
      console.log(response);
    })
    .catch((err) => {
      console.log(err);
    });
});
