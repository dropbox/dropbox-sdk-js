import Dropbox = require('../../../');
import fs = require('fs');
const prompt = require('prompt');

prompt.start();

prompt.get({
  properties: {
    accessToken: {
      description: 'Please enter an API V2 access token'
    },
    sharedLink: {
      description: 'Please enter a shared link to a file'
    }
  }
}, function (error: any, result: any) {
  var dbx = new Dropbox.Dropbox({ accessToken: result.accessToken });
  dbx.sharingGetSharedLinkFile({ url: result.sharedLink })
    .then(function (data) {
      // Note: The fileBinary field is not part of the Dropbox SDK
      // specification, so it is not included in the TypeScript type.
      // It is injected by the SDK.
      fs.writeFile(data.name, (<any> data).fileBinary, { encoding: 'binary' }, function (err) {
        if (err) { throw err; }
        console.log('File: ' + data.name + ' saved.');
      });
    })
    .catch(function (err: DropboxTypes.Error<DropboxTypes.sharing.GetSharedLinkFileError>) {
      throw err;
    });
});
