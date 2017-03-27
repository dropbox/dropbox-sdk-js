function listFilesTeam() {
  var ACCESS_TOKEN = (<HTMLInputElement> document.getElementById('access-token')).value;
  var USER_ID = (<HTMLInputElement> document.getElementById('user-id')).value;
  var dbxTeam = new DropboxTeam({ accessToken: ACCESS_TOKEN });
  var dbx = dbxTeam.actAsUser(USER_ID);
  dbx.filesListFolder({path: ''})
    .then(function(response) {
      displayFilesTeam(response.entries);
      console.log(response);
    })
    .catch(function(error) {
      console.error(error);
    });
  return false;
}

function displayFilesTeam(files: DropboxTypes.files.Metadata[]) {
  var filesList = document.getElementById('files');
  var li: HTMLLIElement;
  for (var i = 0; i < files.length; i++) {
    li = document.createElement('li');
    li.appendChild(document.createTextNode(files[i].name));
    filesList.appendChild(li);
  }
}
