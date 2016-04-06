var rpcRequest = require('./rpc-request');

var DropboxApi = function (options) {
  this.accessToken = options && options.accessToken || '';
};

DropboxApi.prototype.setAccessToken = function (accessToken) {
  this.accessToken = accessToken;
};

DropboxApi.prototype.getAccessToken = function () {
  return this.accessToken;
};

DropboxApi.prototype.listFolder = function (path) {
  return rpcRequest('files/list_folder', { path: path }, this.getAccessToken());
};

module.exports = DropboxApi;
