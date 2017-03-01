import DropboxTeam = require('dropbox/team');
const prompt = require('prompt');

prompt.start();

prompt.get({
  properties: {
    accessToken: {
      description: 'Please enter an API V2 team access token'
    }
  }
}, function (error: any, result: any) {
  var dbx = new DropboxTeam({ accessToken: result.accessToken });
  dbx.teamDevicesListTeamDevices({})
    .then(function (response) {
      console.log('Devices', response);
    })
    .catch(function (err: DropboxTypes.Error<DropboxTypes.team.ListTeamDevicesError>) {
      console.log(err);
    });
});
