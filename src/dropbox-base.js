// @flow

var REQUEST_CONSTANTS = require('./request-constants');

// Polyfill Object.assign() for older browsers
require('./object-assign-polyfill');

class DropboxBase {
  accessToken: string;
  clientId: string;
  selectUser: number;

  constructor(options: { accessToken: string, clientId: string, selectUser: number}) {
    this.accessToken = options.accessToken;
    this.clientId = options.clientId;
    this.selectUser = options.selectUser;
  }

  setAccessToken(accessToken: string) {
    this.accessToken = accessToken;
  }

  getAccessToken() {
    return this.accessToken;
  }

  setClientId(clientId: string) {
    this.clientId = clientId;
  }

  getClientId() {
    return this.clientId;
  }

  getAuthenticationUrl(redirectUri: string, state: string) {
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
  }

  request(path: string, args: Object, host: string, style: string) {
    if (style === REQUEST_CONSTANTS.RPC) {
      return this.getRpcRequest()(path, args, this.getAccessToken(), this.selectUser);
    } else if (style === REQUEST_CONSTANTS.DOWNLOAD) {
      return this.getDownloadRequest()(path, args, this.getAccessToken(), this.selectUser);
    } else if (style === REQUEST_CONSTANTS.UPLOAD) {
      return this.getUploadRequest()(path, args, this.getAccessToken(), this.selectUser);
    }
    throw new Error('Invalid request type');
  }

  setRpcRequest(newRpcRequest) {
    this.rpcRequest = newRpcRequest;
  }

  getRpcRequest() {
    if (this.rpcRequest === undefined) {
      this.rpcRequest = require('./rpc-request');
    }

    return this.rpcRequest;
  }

  setDownloadRequest(newDownloadRequest) {
    this.downloadRequest = newDownloadRequest;
  }

  getDownloadRequest() {
    if (this.downloadRequest === undefined) {
      this.downloadRequest = require('./download-request');
    }

    return this.downloadRequest;
  }

  setUploadRequest(newUploadRequest) {
    this.uploadRequest = newUploadRequest;
  }

  getUploadRequest() {
    if (this.uploadRequest === undefined) {
      this.uploadRequest = require('./upload-request');
    }

    return this.uploadRequest;
  }
}

module.exports = DropboxBase;
