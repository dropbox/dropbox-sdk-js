import { Dropbox, Error, team } from 'dropbox'; // eslint-disable-line no-unused-vars

const prompt = require('prompt');

prompt.start();

prompt.get({
  properties: {
    accessToken: {
      description: 'Please enter an API V2 team access token',
    },
  },
}, (error: any, result: any) => {
  const dbx = new Dropbox({ accessToken: result.accessToken });
  dbx.teamDevicesListTeamDevices({})
    .then((response) => {
      console.log('Devices', response);
    })
    .catch((err: Error<team.ListTeamDevicesError>) => {
      console.log(err);
    });
});
