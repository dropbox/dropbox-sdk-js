var routes = require('./routes');
var rpcRequest = require('./rpc-request');
var REQUEST_CONSTANTS = require('./request-constants');
var Dropbox;

var AUTH_BASE_URL = 'https://www.dropbox.com/oauth2/authorize';

// Polyfill Object.assign() for older browsers
require('./object-assign-polyfill');

Dropbox = function (options) {
  this.accessToken = options && options.accessToken || '';
  this.clientId = options && options.clientId || '';
};

Dropbox.prototype.setAccessToken = function (accessToken) {
  this.accessToken = accessToken;
};

Dropbox.prototype.getAccessToken = function () {
  return this.accessToken;
};

Dropbox.prototype.setClientId = function (clientId) {
  this.clientId = clientId;
};

Dropbox.prototype.getClientId = function () {
  return this.clientId;
};

Dropbox.prototype.getAuthenticationUrl = function (redirectUri, state) {
  var clientId = this.getClientId();
  var authUrl;
  if (!clientId) {
    throw new Error('A client id is required. You can set the client id using .setClientId().');
  }
  if (!redirectUri) {
    throw new Error('A redirect uri is required.');
  }

  authUrl = AUTH_BASE_URL + '?response_type=token&client_id=' + clientId;
  if (redirectUri) {
    authUrl = authUrl + '&redirect_uri=' + redirectUri;
  }
  if (state) {
    authUrl = authUrl + '&state=' + state;
  }
  return authUrl;
};

Dropbox.prototype.request = function (path, body, host, style) {
  if (style === REQUEST_CONSTANTS.RPC) {
    return this.rpcRequest(path, body, this.getAccessToken());
  } else if (style === REQUEST_CONSTANTS.DOWNLOAD) {
    throw new Error('Download endpoints are not yet implemented');
  } else if (style === REQUEST_CONSTANTS.UPLOAD) {
    throw new Error('Upload endpoints are not yet implemented');
  } else {
    throw new Error('Invalid request type');
  }
};

Dropbox.prototype.rpcRequest = rpcRequest;

Dropbox.prototype.setRpcRequest = function (newRpcRequest) {
  Dropbox.prototype.rpcRequest = newRpcRequest;
};

Dropbox.prototype.getRpcRequest = function () {
  return Dropbox.prototype.rpcRequest;
};

Dropbox.prototype = Object.assign(Dropbox.prototype, routes);

module.exports = Dropbox;
