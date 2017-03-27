function listFiles() {
  var ACCESS_TOKEN = (<HTMLInputElement> document.getElementById('access-token')).value;
  var dbx = new Dropbox({ accessToken: ACCESS_TOKEN });
  dbx.filesListFolder({path: ''})
    .then(function(response) {
      displayFiles(response.entries);
      console.log(response);
    })
    .catch(function(error: DropboxTypes.Error<DropboxTypes.files.ListFolderError>) {
      console.error(error);
    });
  return false;
}

function displayFiles(files: DropboxTypes.files.MetadataReference[]) {
  var filesList = document.getElementById('files');
  var li: HTMLLIElement;
  for (var i = 0; i < files.length; i++) {
    li = document.createElement('li');
    li.appendChild(document.createTextNode(files[i].name));
    filesList.appendChild(li);
  }
}
