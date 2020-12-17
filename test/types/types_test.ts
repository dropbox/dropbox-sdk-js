/**
 * This file does not exist to be executed, just compiled,
 * so that we can ensure that the definition files
 * only reference names that exist,
 * and to perform a basic sanity check that types are exported as intended.
 */

import { Headers } from 'node-fetch';
import * as Dropbox from '../../types/index'; // eslint-disable-line

// Check DropboxAuth Constructor and Methods
// Test default constructor
let dropboxAuth = new Dropbox.DropboxAuth();

// Test config constructor
dropboxAuth = new Dropbox.DropboxAuth({
  accessToken: 'myToken',
  accessTokenExpiresAt: new Date(Date.now()),
  refreshToken: 'myToken',
  clientId: 'myClientId',
  clientSecret: 'myClientSecret',
});

// Test getters/setters
dropboxAuth.setAccessToken('myToken');
dropboxAuth.getAccessToken();
dropboxAuth.setAccessTokenExpiresAt(new Date(Date.now()));
dropboxAuth.getAccessTokenExpiresAt();
dropboxAuth.setRefreshToken('myToken');
dropboxAuth.getRefreshToken();
dropboxAuth.setClientId('myClientId');
dropboxAuth.getClientId();
dropboxAuth.setClientSecret('myClientSecret');

// Test other methods
dropboxAuth.getAuthenticationUrl('myRedirect');
dropboxAuth.getAuthenticationUrl('myRedirect', 'myState');
dropboxAuth.getAuthenticationUrl('myRedirect', 'myState', 'code');
dropboxAuth.getAuthenticationUrl('myRedirect', 'mystate', 'code', 'offline', ['scope', 'scope'], 'none', false);
dropboxAuth.getAccessTokenFromCode('myRedirect', 'myCode');
dropboxAuth.checkAndRefreshAccessToken();
dropboxAuth.refreshAccessToken();
dropboxAuth.refreshAccessToken(['files.metadata.read', 'files.metadata.write']);

// Check Dropbox Constructor or Methods
// Test config constructor
const dropbox = new Dropbox.Dropbox({
  auth: dropboxAuth,
  selectUser: '',
  selectAdmin: '',
  pathRoot: '',
});

const dropbox2 = new Dropbox.Dropbox({
  accessToken: 'myToken',
  accessTokenExpiresAt: new Date(Date.now()),
  refreshToken: 'myToken',
  clientId: 'myClientId',
  clientSecret: 'myClientSecret',
  selectUser: '',
  selectAdmin: '',
  pathRoot: '',
});

dropbox.usersGetCurrentAccount()
  .then((response: Dropbox.DropboxResponse<Dropbox.users.FullAccount>) => {
    const { status } = response;
    const { result } = response;
    const { headers } = response;
  })
  .catch((error: Dropbox.DropboxResponseError<Dropbox.users.GetAccountError>) => {
    const { status } = error;
    const { headers } = error;
    const errorObject: Dropbox.users.GetAccountError = error.error;
  });
dropbox2.usersGetCurrentAccount();
