var DropboxTeam = require('../../src/team/dropbox-team');
var prompt = require('prompt');

prompt.start();

prompt.get({
  properties: {
    accessToken: {
      description: 'Please enter an API V2 team access token'
    }
  }
}, function (error, result) {
  var dbx = new DropboxTeam({ accessToken: result.accessToken });
  dbx.teamDevicesListTeamDevices({})
    .then(function (response) {
      console.log('Devices', response);
    })
    .catch(function (err) {
      console.log(err);
    });
});
