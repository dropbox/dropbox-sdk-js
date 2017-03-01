function listDevices() {
  var ACCESS_TOKEN = (<HTMLInputElement> document.getElementById('access-token')).value;
  var dbx = new DropboxTeam({ accessToken: ACCESS_TOKEN });
  dbx.teamDevicesListTeamDevices({})
    .then(function (response) {
      displayDevices(response.devices)
    })
    .catch(function (error: DropboxTypes.Error<DropboxTypes.team.ListTeamDevicesError>) {
      console.error(error);
    });
  return false;
}

function displayDevices(devices: DropboxTypes.team.MemberDevices[]) {
  var deviceList = document.getElementById('devices');
  var li: HTMLLIElement;
  for (var i = 0; i < devices.length; i++) {
    li = document.createElement('li');
    li.appendChild(document.createTextNode(devices[i].name));
    deviceList.appendChild(li);
  }
}