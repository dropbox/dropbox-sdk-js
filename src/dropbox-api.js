var routes = require('./routes');
var rpcRequest = require('./rpc-request');
var REQUEST_CONSTANTS = require('./request-constants');
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

DropboxApi.prototype.request = function (path, body, type) {
  // The null type check here is to work around a problem with the generator.
  // Once the generator and output rpc type, it should be removed.
  if (type === REQUEST_CONSTANTS.RPC || type === null) {
    return this.rpcRequest(path, body, this.getAccessToken());
  } else if (type === REQUEST_CONSTANTS.DOWNLOAD) {
    throw new Error('Download endpoints are not yet implemented');
  } else if (type === REQUEST_CONSTANTS.upload) {
    throw new Error('Upload endpoints are not yet implemented');
  } else {
    throw new Error('Invalid request type');
  }
};

DropboxApi.prototype.rpcRequest = rpcRequest;

DropboxApi.prototype.setRpcRequest = function (rpcRequest) {
  DropboxApi.prototype.rpcRequest = rpcRequest;
};

DropboxApi.prototype.getRpcRequest = function (rpcRequest) {
  return DropboxApi.prototype.rpcRequest;
};

DropboxApi.prototype = Object.assign(DropboxApi.prototype, routes);

module.exports = DropboxApi;
