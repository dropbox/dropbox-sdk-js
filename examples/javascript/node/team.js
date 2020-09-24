const prompt = require('prompt');
const { Dropbox } = require('dropbox'); // eslint-disable-line import/no-unresolved

prompt.start();

prompt.get({
  properties: {
    accessToken: {
      description: 'Please enter an API V2 team access token',
    },
  },
}, (error, result) => {
  const dbx = new Dropbox({ accessToken: result.accessToken });
  dbx.teamDevicesListTeamDevices({})
    .then((response) => {
      console.log('Devices', response);
    })
    .catch((err) => {
      console.log(err);
    });
});
