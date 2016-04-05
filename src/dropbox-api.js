var rpcRequest = require('./rpc-request');

var DropboxApi = function () {
  this.accessToken = '';
};

DropboxApi.prototype.setAccessToken = function (accessToken) {
  this.accessToken = accessToken;
};

DropboxApi.prototype.listFolder = function (path) {
  return rpcRequest('files/list_folder', { path: path }, this.accessToken);
};

module.exports = DropboxApi;
