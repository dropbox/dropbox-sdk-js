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
  },
}, (error, result) => {
  const dbx = new DropboxTeam({ accessToken: result.accessToken });
  dbx.teamDevicesListTeamDevices({})
    .then((response) => {
      console.log('Devices', response);
    })
    .catch((err) => {
      console.log(err);
    });
});
