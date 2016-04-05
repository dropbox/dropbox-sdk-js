// This file sets up and exports the base class for the Dropbox Api sdk.
// It is extended in browse and node with the environment appropriate request
// and error handling.

var DropboxApi = function () {
  this.accessToken = '';
  this.BASE_URI = 'https://api.dropboxapi.com/2/';
};

DropboxApi.prototype.setAccessToken = function (accessToken) {
  this.accessToken = accessToken;
};

DropboxApi.prototype.listFolder = function (path) {
  var url = this.BASE_URI + 'files/list_folder';
  return this.genericPostRequest(url, { path: path });
};

module.exports = DropboxApi;
