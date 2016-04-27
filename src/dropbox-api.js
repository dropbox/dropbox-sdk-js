var endpoints = require('./endpoints');
var rpcRequest = require('./rpc-request');
var REQUEST_CONSTANTS = require('./request-constants');
require('./polyfills');

var DropboxApi = function (options) {
  this.accessToken = options && options.accessToken || '';
  this.csrfToken = options && options.csrfToken;
  this.subjectUid = options && options.subjectUid;
  this.useCookieAuth = options && options.useCookieAuth || false;
};

DropboxApi.prototype.setAccessToken = function (accessToken) {
  this.accessToken = accessToken;
};

DropboxApi.prototype.getAccessToken = function () {
  return this.accessToken;
};

DropboxApi.prototype.setCsrfToken = function (csrfToken) {
  this.csrfToken = csrfToken;
};

DropboxApi.prototype.getCsrfToken = function () {
  return this.csrfToken;
};

DropboxApi.prototype.setSubjectUid = function (subjectUid) {
  this.subjectUid = subjectUid;
};

DropboxApi.prototype.getSubjectUid = function () {
  return this.subjectUid;
};

DropboxApi.prototype.request = function (path, body, type) {
  if (type === REQUEST_CONSTANTS.RPC) {
    return this.rpcRequest(path, body);
  }
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
