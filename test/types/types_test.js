"use strict";
/**
 * This file does not exist to be executed, just compiled,
 * so that we can ensure that the definition files
 * only reference names that exist,
 * and to perform a basic sanity check that types are exported as intended.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var Dropbox = require("../../types/index"); // eslint-disable-line
// Check DropboxAuth Constructor and Methods
// Test default constructor
var dropboxAuth = new Dropbox.DropboxAuth();
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
var dropbox = new Dropbox.Dropbox({
    auth: dropboxAuth,
    selectUser: '',
    selectAdmin: '',
    pathRoot: '',
});
var dropbox2 = new Dropbox.Dropbox({
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
    .then(function (response) {
    var status = response.status;
    var result = response.result;
    var headers = response.headers;
})
    .catch(function (error) {
    var status = error.status;
    var headers = error.headers;
    var errorObject = error.error;
});
dropbox2.usersGetCurrentAccount();
