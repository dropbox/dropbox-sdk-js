import { Dropbox, Error, sharing } from 'dropbox'; // eslint-disable-line no-unused-vars
import fs = require('fs');

const prompt = require('prompt');

prompt.start();

prompt.get({
  properties: {
    accessToken: {
      description: 'Please enter an API V2 access token',
    },
    sharedLink: {
      description: 'Please enter a shared link to a file',
    },
  },
}, (error: any, result: any) => {
  const dbx = new Dropbox({ accessToken: result.accessToken });
  dbx.sharingGetSharedLinkFile({ url: result.sharedLink })
    .then((data) => {
      if (!data.result.fileBinary) {
        throw new Error('Expected fileBinary in a Node.js environment.');
      }
      fs.writeFile(data.result.name, data.result.fileBinary, { encoding: 'binary' }, (err) => {
        if (err) { throw err; }
        console.log(`File: ${data.result.name} saved.`);
      });
    })
    .catch((err: Error<sharing.GetSharedLinkFileError>) => {
      throw err;
    });
});
