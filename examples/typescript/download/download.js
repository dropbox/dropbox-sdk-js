function downloadFile() {
    var ACCESS_TOKEN = document.getElementById('access-token').value;
    var SHARED_LINK = document.getElementById('shared-link').value;
    var dbx = new Dropbox.Dropbox({ accessToken: ACCESS_TOKEN });
    dbx.sharingGetSharedLinkFile({ url: SHARED_LINK })
        .then(function (data) {
        // NOTE: The Dropbox SDK specification does not include a fileBlob
        // field on the FileLinkMetadataReference type, so it is missing from
        // the TypeScript type. This field is injected by the Dropbox SDK.
        var downloadUrl = URL.createObjectURL(data.fileBlob);
        var downloadButton = document.createElement('a');
        downloadButton.setAttribute('href', downloadUrl);
        downloadButton.setAttribute('download', data.name);
        downloadButton.setAttribute('class', 'button');
        downloadButton.innerText = 'Download: ' + data.name;
        document.getElementById('results').appendChild(downloadButton);
    })
        .catch(function (error) {
        console.error(error);
    });
    return false;
}
//# sourceMappingURL=download.js.map