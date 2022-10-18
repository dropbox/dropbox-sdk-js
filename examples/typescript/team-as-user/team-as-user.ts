import { Dropbox, Error, files } from 'dropbox'; // eslint-disable-line no-unused-vars

const prompt = require('prompt');

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
}, (error: any, result: any) => {
  const dbx = new Dropbox({ accessToken: result.accessToken, selectUser: result.userId });
  dbx.filesListFolder({ path: '' })
    .then((response: any) => {
      console.log(response);
    })
    .catch((err: Error<files.ListFolderError>) => {
      console.log(err);
    });
});
