function listFilesTeam() {
    var ACCESS_TOKEN = document.getElementById('access-token').value;
    var USER_ID = document.getElementById('user-id').value;
    var dbxTeam = new DropboxTeam({ accessToken: ACCESS_TOKEN });
    var dbx = dbxTeam.actAsUser(USER_ID);
    dbx.filesListFolder({ path: '' })
        .then(function (response) {
        displayFilesTeam(response.entries);
        console.log(response);
    })
        .catch(function (error) {
        console.error(error);
    });
    return false;
}
function displayFilesTeam(files) {
    var filesList = document.getElementById('files');
    var li;
    for (var i = 0; i < files.length; i++) {
        li = document.createElement('li');
        li.appendChild(document.createTextNode(files[i].name));
        filesList.appendChild(li);
    }
}
//# sourceMappingURL=team-as-user.js.map