import { UPLOAD, DOWNLOAD, RPC } from './constants';
import { downloadRequest } from './download-request';
import { uploadRequest } from './upload-request';
import { rpcRequest } from './rpc-request';

let crypto;
try {
  crypto = require('crypto'); // eslint-disable-line global-require
} catch (Exception) {
  crypto = window.crypto;
}

// Expiration is 300 seconds but needs to be in milliseconds for Date object
const TokenExpirationBuffer = 300 * 1000;
const PKCELength = 128;
const TokenAccessTypes = ['legacy', 'offline', 'online'];
const GrantTypes = ['code', 'token'];
const IncludeGrantedScopes = ['none', 'user', 'team'];
const BaseAuthorizeUrl = 'https://www.dropbox.com/oauth2/authorize';
const BaseTokenUrl = 'https://api.dropboxapi.com/oauth2/token';

/* eslint-disable */
// Polyfill object.assign for legacy browsers
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
if (typeof Object.assign !== 'function') {
  (function () {
    Object.assign = function (target) {
      'use strict';
      var output;
      var index;
      var source;
      var nextKey;
      if (target === undefined || target === null) {
        throw new TypeError('Cannot convert undefined or null to object');
      }

      output = Object(target);
      for (index = 1; index < arguments.length; index++) {
        source = arguments[index];
        if (source !== undefined && source !== null) {
          for (nextKey in source) {
            if (source.hasOwnProperty(nextKey)) {
              output[nextKey] = source[nextKey];
            }
          }
        }
      }
      return output;
    };
  }());
}

// Polyfill Array.includes for legacy browsers
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes
// https://tc39.github.io/ecma262/#sec-array.prototype.includes
if (!Array.prototype.includes) {
  Object.defineProperty(Array.prototype, 'includes', {
    value: function(searchElement, fromIndex) {

      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      // 1. Let O be ? ToObject(this value).
      var o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0;

      // 3. If len is 0, return false.
      if (len === 0) {
        return false;
      }

      // 4. Let n be ? ToInteger(fromIndex).
      //    (If fromIndex is undefined, this step produces the value 0.)
      var n = fromIndex | 0;

      // 5. If n ≥ 0, then
      //  a. Let k be n.
      // 6. Else n < 0,
      //  a. Let k be len + n.
      //  b. If k < 0, let k be 0.
      var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

      function sameValueZero(x, y) {
        return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
      }

      // 7. Repeat, while k < len
      while (k < len) {
        // a. Let elementK be the result of ? Get(O, ! ToString(k)).
        // b. If SameValueZero(searchElement, elementK) is true, return true.
        if (sameValueZero(o[k], searchElement)) {
          return true;
        }
        // c. Increase k by 1.
        k++;
      }

      // 8. Return false
      return false;
    }
  });
}
/* eslint-enable */

/**
 * @private
 * @class DropboxBase
 * @classdesc The main Dropbox SDK class. This contains the methods that are
 * shared between Dropbox and DropboxTeam classes. It is marked as private so
 * that it doesn't show up in the docs because it is never used directly.
 * @arg {Object} options
 * @arg {Function} [options.fetch] - fetch library for making requests.
 * @arg {String} [options.accessToken] - An access token for making authenticated
 * requests.
 * @arg {String} [options.clientId] - The client id for your app. Used to create
 * authentication URL.
 * @arg {String} [options.clientSecret] - The client secret for your app.
 * @arg {Number} [options.selectUser] - User that the team access token would like
 * to act as.
 * @arg {String} [options.selectAdmin] - Team admin that the team access token would like
 * to act as.
 * @arg {String} [options.pathRoot] - root pass to access other namespaces
 * Use to access team folders for example
 */

function parseBodyToType(res) {
  const clone = res.clone();
  return new Promise((resolve) => {
    res.json()
      .then(data => resolve(data))
      .catch(() => clone.text().then(data => resolve(data)));
  }).then(data => [res, data]);
}

/**
 *
 * @param expiresIn
 */
function getTokenExpiresAt(expiresIn) {
  return new Date(Date.now() + (expiresIn * 1000));
}

export class DropboxBase {
  constructor(options) {
    options = options || {};
    this.accessToken = options.accessToken;
    this.accessTokenExpiresAt = options.accessTokenExpiresAt;
    this.refreshToken = options.refreshToken;
    this.clientId = options.clientId;
    this.clientSecret = options.clientSecret;
    this.selectUser = options.selectUser;
    this.selectAdmin = options.selectAdmin;
    this.fetch = options.fetch || fetch;
    this.pathRoot = options.pathRoot;
    if (!options.fetch) { console.warn('Global fetch is deprecated and will be unsupported in a future version. Please pass fetch function as option when instantiating dropbox instance: new Dropbox({fetch})'); } // eslint-disable-line no-console
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
   * Set the client secret
   * @arg {String} clientSecret - Your app's client secret
   * @returns {undefined}
   */
  setClientSecret(clientSecret) {
    this.clientSecret = clientSecret;
  }

  /**
   * Get the client secret
   * @returns {String} Client secret
   */
  getClientSecret() {
    return this.clientSecret;
  }

  /**
   * Gets the refresh token
   * @returns {String} Refresh token
   */
  getRefreshToken() {
    return this.refreshToken;
  }

  /**
   * Sets the refresh token
   * @param refreshToken - A refresh token
   */
  setRefreshToken(refreshToken) {
    this.refreshToken = refreshToken;
  }

  /**
   * Gets the access token's expiration date
   * @returns {Date} date of token expiration
   */
  getAccessTokenExpiresAt() {
    return this.accessTokenExpiresAt;
  }

  /**
   * Sets the access token's expiration date
   * @param accessTokenExpiresAt - new expiration date
   */
  setAccessTokenExpiresAt(accessTokenExpiresAt) {
    this.accessTokenExpiresAt = accessTokenExpiresAt;
  }

  generatePKCECodes() {
    let codeVerifier = crypto.randomBytes(PKCELength);
    codeVerifier = codeVerifier.toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')
      .substr(0, 128);
    this.codeVerifier = codeVerifier;

    const encoder = new TextEncoder();
    const codeData = encoder.encode(codeVerifier);
    let codeChallenge = crypto.createHash('sha256').update(codeData).digest();
    codeChallenge = codeChallenge.toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
    this.codeChallenge = codeChallenge;
  }
  /**
   * Get a URL that can be used to authenticate users for the Dropbox API.
   * @arg {String} redirectUri - A URL to redirect the user to after
   * authenticating. This must be added to your app through the admin interface.
   * @arg {String} [state] - State that will be returned in the redirect URL to help
   * prevent cross site scripting attacks.
   * @arg {String} [authType] - auth type, defaults to 'token', other option is 'code'
   * @arg {String} [tokenAccessType] - type of token to request.  From the following:
   * legacy - creates one long-lived token with no expiration
   * online - create one short-lived token with an expiration
   * offline - create one short-lived token with an expiration with a refresh token
   * @arg {Array<String>>} [scope] - scopes to request for the grant
   * @arg {String} [includeGrantedScopes] - whether or not to include previously granted scopes.
   * From the following:
   * user - include user scopes in the grant
   * team - include team scopes in the grant
   * Note: if this user has never linked the app, include_granted_scopes must be None
   * @arg {boolean} [usePKCE] - Whether or not to use Sha256 based PKCE. PKCE should be only use on
   * client apps which doesn't call your server. It is less secure than non-PKCE flow but
   * can be used if you are unable to safely retrieve your app secret
   * @returns {String} Url to send user to for Dropbox API authentication
   */
  getAuthenticationUrl(redirectUri, state, authType = 'token', tokenAccessType = 'legacy', scope = null, includeGrantedScopes = 'none', usePKCE = false) {
    const clientId = this.getClientId();
    const baseUrl = BaseAuthorizeUrl;

    if (!clientId) {
      throw new Error('A client id is required. You can set the client id using .setClientId().');
    }
    if (authType !== 'code' && !redirectUri) {
      throw new Error('A redirect uri is required.');
    }
    if (!GrantTypes.includes(authType)) {
      throw new Error('Authorization type must be code or token');
    }
    if (!TokenAccessTypes.includes(tokenAccessType)) {
      throw new Error('Token Access Type must be legacy, offline, or online');
    }
    if (scope && !(scope instanceof Array)) {
      throw new Error('Scope must be an array of strings');
    }
    if (!IncludeGrantedScopes.includes(includeGrantedScopes)) {
      throw new Error('includeGrantedScopes must be none, user, or team');
    }

    let authUrl;
    if (authType === 'code') {
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
    if (tokenAccessType !== 'legacy') {
      authUrl += `&token_access_type=${tokenAccessType}`;
    }
    if (scope) {
      authUrl += `&scope=${scope.join(' ')}`;
    }
    if (includeGrantedScopes !== 'none') {
      authUrl += `&include_granted_scopes=${includeGrantedScopes}`;
    }
    if (usePKCE) {
      this.generatePKCECodes();
      authUrl += '&code_challenge_method=S256';
      authUrl += `&code_challenge=${this.codeChallenge}`;
    }
    return authUrl;
  }

  /**
   * Get an OAuth2 access token from an OAuth2 Code.
   * @arg {String} redirectUri - A URL to redirect the user to after
   * authenticating. This must be added to your app through the admin interface.
   * @arg {String} code - An OAuth2 code.
  */
  getAccessTokenFromCode(redirectUri, code) {
    const clientId = this.getClientId();
    const clientSecret = this.getClientSecret();

    if (!clientId) {
      throw new Error('A client id is required. You can set the client id using .setClientId().');
    }
    let path = BaseTokenUrl;
    path += '?grant_type=authorization_code';
    path += `&code=${code}`;
    path += `&client_id=${clientId}`;

    if (clientSecret) {
      path += `&client_secret=${clientSecret}`;
    } else {
      if (!this.codeChallenge) {
        throw new Error('You must use PKCE when generating the authorization URL to not include a client secret');
      }
      path += `&code_verifier=${this.codeVerifier}`;
    }
    if (redirectUri) {
      path += `&redirect_uri=${redirectUri}`;
    }

    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };

    return this.fetch(path, fetchOptions)
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

        if (data.refresh_token) {
          return {
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            accessTokenExpiresAt: getTokenExpiresAt(data.expires_in),
          };
        }
        return data.access_token;
      });
  }

  /**
   * Checks if a token is needed, can be refreshed and if the token is expired.
   * If so, attempts to refresh access token
   * @returns {Promise<*>}
   */
  checkAndRefreshAccessToken() {
    const canRefresh = this.getRefreshToken() && this.getClientId();
    const needsRefresh = this.getAccessTokenExpiresAt() &&
            (new Date(Date.now() + TokenExpirationBuffer)) >= this.getAccessTokenExpiresAt();
    const needsToken = !this.getAccessToken();
    if ((needsRefresh || needsToken) && canRefresh) {
      return this.refreshAccessToken();
    }
    return Promise.resolve();
  }

  /**
   * Refreshes the access token using the refresh token, if available
   * @arg {List} scope - a subset of scopes from the original
   * refresh to acquire with an access token
   * @returns {Promise<*>}
   */
  refreshAccessToken(scope = null) {
    let refreshUrl = BaseTokenUrl;
    const clientId = this.getClientId();
    const clientSecret = this.getClientSecret();

    if (!clientId) {
      throw new Error('A client id is required. You can set the client id using .setClientId().');
    }
    if (scope && !(scope instanceof Array)) {
      throw new Error('Scope must be an array of strings');
    }

    const headers = {};
    headers['Content-Type'] = 'application/json';
    refreshUrl += `?grant_type=refresh_token&refresh_token=${this.getRefreshToken()}`;
    refreshUrl += `&client_id=${clientId}`;
    if (clientSecret) {
      refreshUrl += `&client_secret=${clientSecret}`;
    }
    if (scope) {
      refreshUrl += `&scope=${scope.join(' ')}`;
    }
    const fetchOptions = {
      method: 'POST',
    };

    fetchOptions.headers = headers;
    return this.fetch(refreshUrl, fetchOptions)
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
        this.setAccessToken(data.access_token);
        this.setAccessTokenExpiresAt(getTokenExpiresAt(data.expires_in));
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

    function onLoadError(event) {
      if (event.code !== -999) { // Workaround to fix wrong behavior on cordova-plugin-inappbrowser
        // Try to avoid a browser crash on browser.close().
        window.setTimeout(() => { browser.close(); }, 10);
        errorCallback();
      }
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
      clientId: this.getClientId(),
      clientSecret: this.getClientSecret(),
      pathRoot: this.pathRoot,
    };
    return request(path, args, auth, host, this, options);
  }

  setRpcRequest(newRpcRequest) {
    this.rpcRequest = newRpcRequest;
  }

  getRpcRequest() {
    if (this.rpcRequest === undefined) {
      this.rpcRequest = rpcRequest(this.fetch);
    }
    return this.rpcRequest;
  }

  setDownloadRequest(newDownloadRequest) {
    this.downloadRequest = newDownloadRequest;
  }

  getDownloadRequest() {
    if (this.downloadRequest === undefined) {
      this.downloadRequest = downloadRequest(this.fetch);
    }
    return this.downloadRequest;
  }

  setUploadRequest(newUploadRequest) {
    this.uploadRequest = newUploadRequest;
  }

  getUploadRequest() {
    if (this.uploadRequest === undefined) {
      this.uploadRequest = uploadRequest(this.fetch);
    }
    return this.uploadRequest;
  }
}
