var routes = require('./routes');
var rpcRequest = require('./rpc-request');
var REQUEST_CONSTANTS = require('./request-constants');
require('./polyfills');

var BASE_URLS = {
  cookieAuth: 'https://www.dropbox.com/2/',
  tokenAuth: 'https://api.dropboxapi.com/2/'
};

var DropboxApi = function (options) {
  this.accessToken = options && options.accessToken || '';
  this.csrfToken = options && options.csrfToken;
  this.subjectUid = options && options.subjectUid;
  this.useCookieAuth = options && options.useCookieAuth || false;
  this.baseUrls = options && options.baseUrls || BASE_URLS;
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

DropboxApi.prototype.setBaseUrls = function (baseUrls) {
  this.baseUrls = baseUrls;
};

DropboxApi.prototype.getBaseUrls = function () {
  return this.baseUrls;
};

DropboxApi.prototype.request = function (path, body, type) {
  // The null type check here is to work around a problem with the generator.
  // Once the generator and output rpc type, it should be removed.
  if (type === REQUEST_CONSTANTS.RPC || type === null) {
    return this.rpcRequest(path, body, {
      baseUrls: this.getBaseUrls(),
      accessToken: this.getAccessToken(),
      csrfToken: this.getCsrfToken(),
      subjectUid: this.getSubjectUid(),
      useCookieAuth: this.useCookieAuth
    });
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
