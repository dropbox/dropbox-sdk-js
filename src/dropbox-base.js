import { UPLOAD, DOWNLOAD, RPC } from './constants';
import { downloadRequest } from './download-request';
import { uploadRequest } from './upload-request';
import { rpcRequest } from './rpc-request';
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
 * authentication URL.
 * @arg {Number} [options.selectUser] - User is the team access token would like
 * to act as.
 */

function parseBodyToType(res) {
  const clone = res.clone();
  return new Promise((resolve) => {
    res.json()
      .then(data => resolve(data))
      .catch(() => clone.text().then(data => resolve(data)));
  }).then(data => [res, data]);
}

export class DropboxBase {
  constructor(options) {
    options = options || {};
    this.accessToken = options.accessToken;
    this.clientId = options.clientId;
    this.selectUser = options.selectUser;
    this.selectAdmin = options.selectAdmin;
  }

  /**
   * Set the access token used to authenticate requests to the API.
   * @arg {String} accessToken - An access token
   * @returns {undefined}
   */
  setAccessToken(accessToken) {
    this.accessToken = accessToken;
  }

  /**
   * Get the access token
   * @returns {String} Access token
   */
  getAccessToken() {
    return this.accessToken;
  }

  /**
   * Set the client id, which is used to help gain an access token.
   * @arg {String} clientId - Your apps client id
   * @returns {undefined}
   */
  setClientId(clientId) {
    this.clientId = clientId;
  }

  /**
   * Get the client id
   * @returns {String} Client id
   */
  getClientId() {
    return this.clientId;
  }

  /**
   * Get a URL that can be used to authenticate users for the Dropbox API.
   * @arg {String} redirectUri - A URL to redirect the user to after
   * authenticating. This must be added to your app through the admin interface.
   * @arg {String} [state] - State that will be returned in the redirect URL to help
   * prevent cross site scripting attacks.
   * @returns {String} Url to send user to for Dropbox API authentication
   */
  getAuthenticationUrl(redirectUri, state, auth_type) {
    const clientId = this.getClientId();
    const baseUrl = 'https://www.dropbox.com/oauth2/authorize';

    if (!clientId) {
      throw new Error('A client id is required. You can set the client id using .setClientId().');
    }
    if (!redirectUri) {
      throw new Error('A redirect uri is required.');
    }
    if (!['code', 'token'].includes(auth_type)) {
      throw new Error('Authorization type must be code or token');
    }

    let authUrl;
    if (auth_type === 'code') {
      authUrl = `${baseUrl}?response_type=code&client_id=${clientId}`;
    } else {
      authUrl = `${baseUrl}?response_type=token&client_id=${clientId}`;
    }

    if (redirectUri) {
      authUrl += `&redirect_uri=${redirectUri}`;
    }
    if (state) {
      authUrl += `&state=${state}`;
    }
    return authUrl;
  }

  /*
    Some explanation goes here.
  */

  getAccessTokenFromCode(options) {
    let path = `https://api.dropboxapi.com/oauth2/token?code=${options.code}&grant_type=authorization_code&redirect_uri=${options.redirectUri}&client_id=${options.clientId}&client_secret=${options.secret}`;
    var fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    };

    return fetch(path, fetchOptions)
      .then(res => parseBodyToType(res))
      .then(([res, data]) => {
        // maintaining existing API for error codes not equal to 200 range
        if (!res.ok) {
          // eslint-disable-next-line no-throw-literal
          throw {
            error: data,
            response: res,
            status: res.status,
          };
        }
        return data.access_token;
      });
  }

  /**
   * Called when the authentication succeed
   * @callback successCallback
   * @param {string} access_token The application's access token
   */

  /**
   * Called when the authentication failed.
   * @callback errorCallback
   */


 /**
  * An authentication process that works with cordova applications.
  * @param {successCallback} successCallback
  * @param {errorCallback} errorCallback
  */
  authenticateWithCordova(successCallback, errorCallback) {
    const redirectUrl = 'https://www.dropbox.com/1/oauth2/redirect_receiver';
    const url = this.getAuthenticationUrl(redirectUrl);

    let removed = false;
    const browser = window.open(url, '_blank');

    function onLoadError() {
      // Try to avoid a browser crash on browser.close().
      window.setTimeout(() => { browser.close(); }, 10);
      errorCallback();
    }

    function onLoadStop(event) {
      const errorLabel = '&error=';
      const errorIndex = event.url.indexOf(errorLabel);

      if (errorIndex > -1) {
        // Try to avoid a browser crash on browser.close().
        window.setTimeout(() => { browser.close(); }, 10);
        errorCallback();
      } else {
        const tokenLabel = '#access_token=';
        let tokenIndex = event.url.indexOf(tokenLabel);
        const tokenTypeIndex = event.url.indexOf('&token_type=');
        if (tokenIndex > -1) {
          tokenIndex += tokenLabel.length;
          // Try to avoid a browser crash on browser.close().
          window.setTimeout(() => { browser.close(); }, 10);

          const accessToken = event.url.substring(tokenIndex, tokenTypeIndex);
          successCallback(accessToken);
        }
      }
    }

    function onExit() {
      if (removed) {
        return;
      }
      browser.removeEventListener('loaderror', onLoadError);
      browser.removeEventListener('loadstop', onLoadStop);
      browser.removeEventListener('exit', onExit);
      removed = true;
    }

    browser.addEventListener('loaderror', onLoadError);
    browser.addEventListener('loadstop', onLoadStop);
    browser.addEventListener('exit', onExit);
  }

  request(path, args, auth, host, style) {
    let request = null;
    switch (style) {
      case RPC:
        request = this.getRpcRequest();
        break;
      case DOWNLOAD:
        request = this.getDownloadRequest();
        break;
      case UPLOAD:
        request = this.getUploadRequest();
        break;
      default:
        throw new Error(`Invalid request style: ${style}`);
    }
    const options = {
      selectUser: this.selectUser,
      selectAdmin: this.selectAdmin,
    };
    return request(path, args, auth, host, this.getAccessToken(), options);
  }

  setRpcRequest(newRpcRequest) {
    this.rpcRequest = newRpcRequest;
  }

  getRpcRequest() {
    if (this.rpcRequest === undefined) {
      this.rpcRequest = rpcRequest;
    }
    return this.rpcRequest;
  }

  setDownloadRequest(newDownloadRequest) {
    this.downloadRequest = newDownloadRequest;
  }

  getDownloadRequest() {
    if (this.downloadRequest === undefined) {
      this.downloadRequest = downloadRequest;
    }
    return this.downloadRequest;
  }

  setUploadRequest(newUploadRequest) {
    this.uploadRequest = newUploadRequest;
  }

  getUploadRequest() {
    if (this.uploadRequest === undefined) {
      this.uploadRequest = uploadRequest;
    }
    return this.uploadRequest;
  }

}
