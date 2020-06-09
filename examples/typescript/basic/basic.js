function listFiles() {
    var ACCESS_TOKEN = document.getElementById('access-token').value;
    var dbx = new Dropbox.Dropbox({ accessToken: ACCESS_TOKEN, clientId: '47175sfupi67jo3', clientSecret: '4dw7mdk5xb0dxyu' });
    dbx.checkApp({ query: "this works" }).then(function (response) {
        console.log(response);
    }).catch(function (error) {
        console.error(error);
    });
    dbx.filesListFolder({ path: '' })
        .then(function (response) {
        displayFiles(response.entries);
        console.log(response);
    })
        .catch(function (error) {
        console.error(error);
    });
    return false;
}
function displayFiles(files) {
    var filesList = document.getElementById('files');
    var li;
    for (var i = 0; i < files.length; i++) {
        li = document.createElement('li');
        li.appendChild(document.createTextNode(files[i].name));
        filesList.appendChild(li);
    }
}
//# sourceMappingURL=basic.js.map