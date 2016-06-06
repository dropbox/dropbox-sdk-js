var routes = require('./routes');
var rpcRequest = require('./rpc-request');
var REQUEST_CONSTANTS = require('./request-constants');
var Dropbox;

var AUTH_BASE_URL = 'https://www.dropbox.com/oauth2/authorize';

// Polyfill Object.assign() for older browsers
require('./object-assign-polyfill');

/**
 * @class Dropbox
 * @classdesc The main Dropbox SDK class. Contains methods for authenticating
 * users and making requests.
 * @arg {Object} options
 * @arg {String} [options.accessToken] - An access token for making authenticated
 * requests.
 * @arg {String} [options.clientId] - The client id fo ryour app. Used to create
 * authentication url.
 */
Dropbox = function (options) {
  this.accessToken = options && options.accessToken || '';
  this.clientId = options && options.clientId || '';
};

/**
 * Set the access token used to authenticate requests to the API.
 * @arg {String} accessToken - An access token
 * @returns {undefined}
 */
Dropbox.prototype.setAccessToken = function (accessToken) {
  this.accessToken = accessToken;
};

/**
 * Get the access token
 * @returns {String} Access token
 */
Dropbox.prototype.getAccessToken = function () {
  return this.accessToken;
};

/**
 * Set the client id, which is used to help gain an access token.
 * @arg {String} clientId - Your apps client id
 * @returns {undefined}
 */
Dropbox.prototype.setClientId = function (clientId) {
  this.clientId = clientId;
};

/**
 * Get the client id
 * @returns {String} Client id
 */
Dropbox.prototype.getClientId = function () {
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
