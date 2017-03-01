function listDevices() {
    var ACCESS_TOKEN = document.getElementById('access-token').value;
    var dbx = new DropboxTeam({ accessToken: ACCESS_TOKEN });
    dbx.teamDevicesListTeamDevices({})
        .then(function (response) {
        displayDevices(response.devices);
    })
        .catch(function (error) {
        console.error(error);
    });
    return false;
}
function displayDevices(devices) {
    var deviceList = document.getElementById('devices');
    var li;
    for (var i = 0; i < devices.length; i++) {
        li = document.createElement('li');
        li.appendChild(document.createTextNode(devices[i].name));
        deviceList.appendChild(li);
    }
}
//# sourceMappingURL=team.js.map