import { Dropbox } from 'dropbox';

const prompt = require('prompt');

prompt.start();

prompt.get({
  properties: {
    accessToken: {
      description: 'Please enter an API V2 access token',
    },
  },
}, (error: any, result: any) => {
  const dbx = new Dropbox({ accessToken: result.accessToken });
  dbx.filesListFolder({ path: '' })
    .then((response: any) => {
      console.log(response);
    })
    .catch((err: any) => {
      console.log(err);
    });
});
