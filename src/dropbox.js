import {
  UPLOAD,
  DOWNLOAD,
  RPC,
  APP_AUTH,
  TEAM_AUTH,
  USER_AUTH,
  NO_AUTH,
} from './constants.js';
import { routes } from '../lib/routes.js';
import DropboxAuth from './auth.js';
import { baseApiUrl, httpHeaderSafeJson } from './utils.js';
import { parseDownloadResponse, parseResponse } from './response.js';

let fetch;
if (typeof window !== 'undefined') {
  fetch = window.fetch.bind(window);
} else {
  fetch = require('node-fetch'); // eslint-disable-line global-require
}

const b64 = typeof btoa === 'undefined'
  ? (str) => Buffer.from(str).toString('base64')
  : btoa;

/**
 * @class Dropbox
 * @classdesc The Dropbox SDK class that provides methods to read, write and
 * create files or folders in a user or team's Dropbox.
 * @arg {Object} options
 * @arg {Function} [options.fetch] - fetch library for making requests.
 * @arg {String} [options.selectUser] - Select user is only used for team functionality.
 * It specifies which user the team access token should be acting as.
 * @arg {String} [options.pathRoot] - root path to access other namespaces
 * Use to access team folders for example
 * @arg {String} [options.selectAdmin] - Select admin is only used by team functionality.
 * It specifies which team admin the team access token should be acting as.
 * @arg {DropboxAuth} [options.auth] - The DropboxAuth object used to authenticate requests.
 * If this is set, the remaining parameters will be ignored.
 * @arg {String} [options.accessToken] - An access token for making authenticated
 * requests.
 * @arg {Date} [options.accessTokenExpiresAt] - Date of the current access token's
 * expiration (if available)
 * @arg {String} [options.refreshToken] - A refresh token for retrieving access tokens
 * @arg {String} [options.clientId] - The client id for your app. Used to create
 * authentication URL.
 * @arg {String} [options.clientSecret] - The client secret for your app. Used to create
 * authentication URL and refresh access tokens.
 * @arg {String} [options.domain] - A custom domain to use when making api requests. This
 * should only be used for testing as scaffolding to avoid making network requests.
 * @arg {String} [options.domainDelimiter] - A custom delimiter to use when separating domain from
 * subdomain. This should only be used for testing as scaffolding.
 */
export default class Dropbox {
  constructor(options) {
    options = options || {};

    if (options.auth) {
      this.auth = options.auth;
    } else {
      this.auth = new DropboxAuth(options);
    }

    this.fetch = options.fetch || fetch;
    this.selectUser = options.selectUser;
    this.selectAdmin = options.selectAdmin;
    this.pathRoot = options.pathRoot;

    this.domain = options.domain;
    this.domainDelimiter = options.domainDelimiter;

    Object.assign(this, routes);
  }

  request(path, args, auth, host, style) {
    // checks for multiauth and assigns auth based on priority to create header in switch case
    if (auth.split(',').length > 1) {
      const authTypes = auth.replace(' ', '').split(',');
      if (authTypes.includes(USER_AUTH) && this.auth.getAccessToken()) {
        auth = USER_AUTH;
      } else if (authTypes.includes(TEAM_AUTH) && this.auth.getAccessToken()) {
        auth = TEAM_AUTH;
      } else if (authTypes.includes(APP_AUTH)) {
        auth = APP_AUTH;
      }
    }

    switch (style) {
      case RPC:
        return this.rpcRequest(path, args, auth, host);
      case DOWNLOAD:
        return this.downloadRequest(path, args, auth, host);
      case UPLOAD:
        return this.uploadRequest(path, args, auth, host);
      default:
        throw new Error(`Invalid request style: ${style}`);
    }
  }

  rpcRequest(path, body, auth, host) {
    return this.auth.checkAndRefreshAccessToken()
      .then(() => {
        const fetchOptions = {
          method: 'POST',
          body: (body) ? JSON.stringify(body) : null,
          headers: {},
        };

        if (body) {
          fetchOptions.headers['Content-Type'] = 'application/json';
        }

        let authHeader;
        switch (auth) {
          case APP_AUTH:
            if (!this.auth.clientId || !this.auth.clientSecret) {
              throw new Error('A client id and secret is required for this function');
            }
            authHeader = b64(`${this.auth.clientId}:${this.auth.clientSecret}`);
            fetchOptions.headers.Authorization = `Basic ${authHeader}`;
            break;
          case TEAM_AUTH:
          case USER_AUTH:
            fetchOptions.headers.Authorization = `Bearer ${this.auth.getAccessToken()}`;
            break;
          case NO_AUTH:
            break;
          default:
            throw new Error(`Unhandled auth type: ${auth}`);
        }

        this.setCommonHeaders(fetchOptions);
        return fetchOptions;
      })
      .then((fetchOptions) => this.fetch(
        baseApiUrl(host, this.domain, this.domainDelimiter) + path,
        fetchOptions,
      ))
      .then((res) => parseResponse(res));
  }

  downloadRequest(path, args, auth, host) {
    return this.auth.checkAndRefreshAccessToken()
      .then(() => {
        if (auth !== USER_AUTH) {
          throw new Error(`Unexpected auth type: ${auth}`);
        }

        const fetchOptions = {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.auth.getAccessToken()}`,
            'Dropbox-API-Arg': httpHeaderSafeJson(args),
          },
        };

        this.setCommonHeaders(fetchOptions);

        return fetchOptions;
      })
      .then((fetchOptions) => this.fetch(
        baseApiUrl(host, this.domain, this.domainDelimiter) + path,
        fetchOptions,
      ))
      .then((res) => parseDownloadResponse(res));
  }

  uploadRequest(path, args, auth, host) {
    return this.auth.checkAndRefreshAccessToken()
      .then(() => {
        if (auth !== USER_AUTH) {
          throw new Error(`Unexpected auth type: ${auth}`);
        }

        const { contents } = args;
        delete args.contents;

        const fetchOptions = {
          body: contents,
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.auth.getAccessToken()}`,
            'Content-Type': 'application/octet-stream',
            'Dropbox-API-Arg': httpHeaderSafeJson(args),
          },
        };

        this.setCommonHeaders(fetchOptions);

        return fetchOptions;
      })
      .then((fetchOptions) => this.fetch(
        baseApiUrl(host, this.domain, this.domainDelimiter) + path,
        fetchOptions,
      ))
      .then((res) => parseResponse(res));
  }

  setCommonHeaders(options) {
    if (this.selectUser) {
      options.headers['Dropbox-API-Select-User'] = this.selectUser;
    }
    if (this.selectAdmin) {
      options.headers['Dropbox-API-Select-Admin'] = this.selectAdmin;
    }
    if (this.pathRoot) {
      options.headers['Dropbox-API-Path-Root'] = this.pathRoot;
    }
  }
}
