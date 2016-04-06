var rpcRequest = require('./rpc-request');

var DropboxApi = function (options) {
  this.accessToken = options && options.accessToken || '';
  this.rpcRequest = options && options.rpcRequest || rpcRequest;
};

DropboxApi.prototype.setAccessToken = function (accessToken) {
  this.accessToken = accessToken;
};

DropboxApi.prototype.getAccessToken = function () {
  return this.accessToken;
};

DropboxApi.prototype.setRpcRequest = function (rpcRequest) {
  this.rpcRequest = rpcRequest;
};

DropboxApi.prototype.listFolder = function (path) {
  return this.rpcRequest('files/list_folder', { path: path }, this.getAccessToken());
};

module.exports = DropboxApi;
