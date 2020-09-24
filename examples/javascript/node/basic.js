const prompt = require('prompt');
const { Dropbox } = require('dropbox'); // eslint-disable-line import/no-unresolved

prompt.start();

prompt.get({
  properties: {
    accessToken: {
      description: 'Please enter an API V2 access token',
    },
  },
}, (error, result) => {
  const dbx = new Dropbox({ accessToken: result.accessToken });
  dbx.filesListFolder({ path: '/Screenshots' })
    .then((response) => {
      console.log(response);
    })
    .catch((err) => {
      console.log(err);
    });
});
