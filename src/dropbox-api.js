var rpcRequest = require('./rpc-request');
var jqueryRpcRequest = require('./rpc-request-jquery');

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

// Realistically this will be a lib that the client produces and adds, but im
// putting it in here like this to avoid having to build it on my own for this
// example.
DropboxApi.prototype.useJqueryRpc = function () {
  this.setRpcRequest(jqueryRpcRequest);
};

DropboxApi.prototype.listFolder = function (path) {
  return this.rpcRequest('files/list_folder', { path: path }, this.getAccessToken());
};

module.exports = DropboxApi;
