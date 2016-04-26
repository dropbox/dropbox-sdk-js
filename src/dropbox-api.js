var endpoints = require('./endpoints');
var rpcRequest = require('./rpc-request');
require('./polyfills');

var DropboxApi = function (options) {
  this.accessToken = options && options.accessToken || '';
};

DropboxApi.prototype.setAccessToken = function (accessToken) {
  this.accessToken = accessToken;
};

DropboxApi.prototype.getAccessToken = function () {
  return this.accessToken;
};

DropboxApi.prototype.rpcRequest = rpcRequest;

DropboxApi.prototype.setRpcRequest = function (rpcRequest) {
  DropboxApi.prototype.rpcRequest = rpcRequest;
};

DropboxApi.prototype.getRpcRequest = function (rpcRequest) {
  return DropboxApi.prototype.rpcRequest;
};

DropboxApi.prototype = Object.assign(DropboxApi.prototype, endpoints);

module.exports = DropboxApi;
