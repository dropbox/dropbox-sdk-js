var REQUEST_CONSTANTS = require('./request-constants');
var rpcRequest = require('./rpc-request');
var DropboxBase;

// Polyfill Object.assign() for older browsers
require('./object-assign-polyfill');

/**
 * @private
 * @class DropboxBase
 * @classdesc The main Dropbox SDK class. This contains the methods that are
 * shared between Dropbox and DropboxTeam classes. It is marked as private so
 * that it doesn't show up in the docs because it is never used directly.
 * @arg {Object} options
 * @arg {String} [options.accessToken] - An access token for making authenticated
 * requests.
 * @arg {String} [options.clientId] - The client id fo ryour app. Used to create
 * authentication url.
 * @arg {Number} [options.selectUser] - User is the team access token would like
 * to act as.
 */
DropboxBase = function (options) {
  options = options || {};
  this.accessToken = options.accessToken;
  this.clientId = options.clientId;
  this.selectUser = options.selectUser;
};

/**
 * Set the access token used to authenticate requests to the API.
 * @arg {String} accessToken - An access token
 * @returns {undefined}
 */
DropboxBase.prototype.setAccessToken = function (accessToken) {
  this.accessToken = accessToken;
};

/**
 * Get the access token
 * @returns {String} Access token
 */
DropboxBase.prototype.getAccessToken = function () {
  return this.accessToken;
};

/**
 * Set the client id, which is used to help gain an access token.
 * @arg {String} clientId - Your apps client id
 * @returns {undefined}
 */
DropboxBase.prototype.setClientId = function (clientId) {
  this.clientId = clientId;
};

/**
 * Get the client id
 * @returns {String} Client id
 */
DropboxBase.prototype.getClientId = function () {
  return this.clientId;
};

/**
 * Get a url that can be used to authenticate users for the Dropbox API.
 * @arg {String} redirectUri - A url to redirect the user to after
 * authenticating. This must be added to your app through the admin interface.
 * @arg {String} [state] - State that will be returned in the redirect url to help
 * prevent cross site scripting attacks.
 * @returns {String} Url to send user to for Dropbox API authentication
 */
DropboxBase.prototype.getAuthenticationUrl = function (redirectUri, state) {
  var AUTH_BASE_URL = 'https://www.dropbox.com/oauth2/authorize';
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

DropboxBase.prototype.request = function (path, body, host, style) {
  if (style === REQUEST_CONSTANTS.RPC) {
    return this.rpcRequest(path, body, this.getAccessToken(), this.selectUser);
  } else if (style === REQUEST_CONSTANTS.DOWNLOAD) {
    throw new Error('Download endpoints are not yet implemented');
  } else if (style === REQUEST_CONSTANTS.UPLOAD) {
    throw new Error('Upload endpoints are not yet implemented');
  } else {
    throw new Error('Invalid request type');
  }
};

DropboxBase.prototype.rpcRequest = rpcRequest;

DropboxBase.prototype.setRpcRequest = function (newRpcRequest) {
  DropboxBase.prototype.rpcRequest = newRpcRequest;
};

DropboxBase.prototype.getRpcRequest = function () {
  return DropboxBase.prototype.rpcRequest;
};

module.exports = DropboxBase;
