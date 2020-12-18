import { fail } from 'assert';
import chai from 'chai';
import sinon from 'sinon';

import { Dropbox, DropboxAuth } from '../../index.js';

describe('DropboxAuth', () => {
  describe('accessToken', () => {
    it('can be set in the constructor', () => {
      const dbx = new Dropbox({ accessToken: 'foo' });
      chai.assert.equal(dbx.auth.getAccessToken(), 'foo');
    });

    it('is undefined if not set in constructor', () => {
      const dbx = new Dropbox();
      chai.assert.equal(dbx.auth.getAccessToken(), undefined);
    });

    it('can be set after being instantiated', () => {
      const dbx = new Dropbox();
      dbx.auth.setAccessToken('foo');
      chai.assert.equal(dbx.auth.getAccessToken(), 'foo');
    });
  });

  describe('clientId', () => {
    it('can be set in the constructor', () => {
      const dbx = new Dropbox({ clientId: 'foo' });
      chai.assert.equal(dbx.auth.getClientId(), 'foo');
    });

    it('is undefined if not set in constructor', () => {
      const dbx = new Dropbox();
      chai.assert.equal(dbx.auth.getClientId(), undefined);
    });

    it('can be set after being instantiated', () => {
      const dbx = new Dropbox();
      dbx.auth.setClientId('foo');
      chai.assert.equal(dbx.auth.getClientId(), 'foo');
    });
  });

  describe('getAuthenticationUrl()', () => {
    it('throws an error if the client id isn\'t set', () => {
      const dbx = new Dropbox();
      chai.assert.throws(
        DropboxAuth.prototype.getAuthenticationUrl.bind(dbx.auth, 'https://redirecturl.com'),
        Error,
        'A client id is required. You can set the client id using .setClientId().',
      );
    });

    it('throws an error if the redirect url isn\'t set', () => {
      const dbx = new Dropbox({ clientId: 'CLIENT_ID' });
      chai.assert.throws(
        DropboxAuth.prototype.getAuthenticationUrl.bind(dbx.auth),
        Error,
        'A redirect uri is required.',
      );
    });

    it('throws an error if the redirect url isn\'t set and type is code', () => {
      const dbx = new Dropbox({ clientId: 'CLIENT_ID' });
      chai.assert.equal(
        dbx.auth.getAuthenticationUrl('', null, 'code'),
        'https://www.dropbox.com/oauth2/authorize?response_type=code&client_id=CLIENT_ID',
      );
    });

    it('returns correct auth url with all combinations of valid input', () => {
      const dbx = new Dropbox({ clientId: 'CLIENT_ID' });
      for (const redirectUri of ['', 'localhost']) {
        for (const state of ['', 'state']) {
          for (const tokenAccessType of [null, 'legacy', 'offline', 'online']) {
            for (const scope of [null, ['files.metadata.read', 'files.metadata.write']]) {
              for (const includeGrantedScopes of ['none', 'user', 'team']) {
                const url = dbx.auth.getAuthenticationUrl(redirectUri, state, 'code', tokenAccessType, scope, includeGrantedScopes);

                chai.assert(url.startsWith('https://www.dropbox.com/oauth2/authorize?response_type=code&client_id=CLIENT_ID'));

                if (redirectUri) {
                  chai.assert(url.includes(`&redirect_uri=${redirectUri}`));
                } else {
                  chai.assert(!url.includes('&redirect_uri='));
                }

                if (state) {
                  chai.assert(url.includes(`&state=${state}`));
                } else {
                  chai.assert(!url.includes('&state='));
                }

                if (tokenAccessType) {
                  chai.assert(url.includes(`&token_access_type=${tokenAccessType}`));
                } else {
                  chai.assert(!url.includes('&token_access_type='));
                }

                if (scope) {
                  chai.assert(url.includes(`&scope=${scope.join(' ')}`));
                } else {
                  chai.assert(!url.includes('&scope='));
                }

                if (includeGrantedScopes !== 'none') {
                  chai.assert(url.includes(`&include_granted_scopes=${includeGrantedScopes}`));
                } else {
                  chai.assert(!url.includes('&include_granted_scopes='));
                }
              }
            }
          }
        }
      }
    });
  });

  describe('clientSecret', () => {
    it('can be set in the constructor', () => {
      const dbx = new Dropbox({ clientSecret: 'foo' });
      chai.assert.equal(dbx.auth.getClientSecret(), 'foo');
    });

    it('is undefined if not set in constructor', () => {
      const dbx = new Dropbox();
      chai.assert.equal(dbx.auth.getClientSecret(), undefined);
    });

    it('can be set after being instantiated', () => {
      const dbx = new Dropbox();
      dbx.auth.setClientSecret('foo');
      chai.assert.equal(dbx.auth.getClientSecret(), 'foo');
    });
  });

  describe('refreshToken', () => {
    it('can be set in the constructor', () => {
      const dbxAuth = new DropboxAuth({ refreshToken: 'foo' });
      chai.assert.equal(dbxAuth.getRefreshToken(), 'foo');
    });

    it('is undefined if not set in constructor', () => {
      const dbxAuth = new DropboxAuth();
      chai.assert.equal(dbxAuth.getRefreshToken(), undefined);
    });

    it('can be set after being instantiated', () => {
      const dbxAuth = new DropboxAuth();
      dbxAuth.setRefreshToken('foo');
      chai.assert.equal(dbxAuth.getRefreshToken(), 'foo');
    });
  });

  describe('accessTokenExpiresAt', () => {
    it('can be set in the constructor', () => {
      const date = new Date(2020, 11, 30);
      const dbxAuth = new DropboxAuth({ accessTokenExpiresAt: date });
      chai.assert.equal(dbxAuth.getAccessTokenExpiresAt(), date);
    });

    it('is undefined if not set in constructor', () => {
      const dbxAuth = new DropboxAuth();
      chai.assert.equal(dbxAuth.getAccessTokenExpiresAt(), undefined);
    });

    it('can be set after being instantiated', () => {
      const dbxAuth = new DropboxAuth();
      const date = new Date(2020, 11, 30);
      dbxAuth.setAccessTokenExpiresAt(date);
      chai.assert.equal(dbxAuth.getAccessTokenExpiresAt(), date);
    });
  });

  describe('generatePKCECodes', () => {
    it('saves a new code verifier on Auth obj', () => {
      const dbxAuth = new DropboxAuth();
      chai.assert.equal(dbxAuth.codeVerifier, undefined);
      dbxAuth.generatePKCECodes();
      chai.assert.isTrue(!!dbxAuth.codeVerifier);
    });

    it('creates a code verifier of the correct length', () => {
      const dbxAuth = new DropboxAuth();
      dbxAuth.generatePKCECodes();
      chai.assert.equal(dbxAuth.codeVerifier.length, 128);
    });

    it('saves a new code challenge on Auth obj', () => {
      const dbxAuth = new DropboxAuth();
      chai.assert.equal(dbxAuth.codeChallenge, undefined);
      dbxAuth.generatePKCECodes();
      chai.assert.isTrue(!!dbxAuth.codeChallenge);
    });

    it('gets called when using PKCE flow', () => {
      const dbxAuth = new DropboxAuth({ clientId: 'foo' });
      const pkceSpy = sinon.spy(dbxAuth, 'generatePKCECodes');
      dbxAuth.getAuthenticationUrl('test', null, undefined, undefined, undefined, undefined, true);
      chai.assert.isTrue(pkceSpy.calledOnce);
    });
  });

  describe('getAccessTokenFromCode', () => {
    it('throws an error without a clientID', () => {
      const dbxAuth = new DropboxAuth();
      chai.assert.throws(
        DropboxAuth.prototype.getAccessTokenFromCode.bind(dbxAuth, 'foo', 'bar'),
        Error,
        'A client id is required. You can set the client id using .setClientId().',
      );
    });

    it('throws an error when not provided a client secret or code challenge', () => {
      const dbxAuth = new DropboxAuth({ clientId: 'foo' });
      chai.assert.throws(
        DropboxAuth.prototype.getAccessTokenFromCode.bind(dbxAuth, 'foo', 'bar'),
        Error,
        'You must use PKCE when generating the authorization URL to not include a client secret',
      );
    });

    it('sets the right path for fetch request', () => {
      const dbxAuth = new DropboxAuth({
        clientId: 'foo',
        clientSecret: 'bar',
      });

      const fetchSpy = sinon.spy(dbxAuth, 'fetch');
      dbxAuth.getAccessTokenFromCode('foo', 'bar');
      const path = dbxAuth.fetch.getCall(0).args[0];
      chai.assert.isTrue(fetchSpy.calledOnce);
      chai.assert.equal('https://api.dropboxapi.com/oauth2/token?grant_type=authorization_code&code=bar&client_id=foo&client_secret=bar&redirect_uri=foo', path);
    });

    it('sets the right path without a redirect uri', () => {
      const dbxAuth = new DropboxAuth({
        clientId: 'foo',
        clientSecret: 'bar',
      });

      const fetchSpy = sinon.spy(dbxAuth, 'fetch');
      dbxAuth.getAccessTokenFromCode(undefined, 'bar');
      const path = dbxAuth.fetch.getCall(0).args[0];
      chai.assert.isTrue(fetchSpy.calledOnce);
      chai.assert.equal('https://api.dropboxapi.com/oauth2/token?grant_type=authorization_code&code=bar&client_id=foo&client_secret=bar', path);
    });

    it('sets the correct headers for fetch request', () => {
      const dbxAuth = new DropboxAuth({
        clientId: 'foo',
        clientSecret: 'bar',
      });

      const fetchSpy = sinon.spy(dbxAuth, 'fetch');
      dbxAuth.getAccessTokenFromCode('foo', 'bar');
      const { headers } = dbxAuth.fetch.getCall(0).args[1];
      chai.assert.isTrue(fetchSpy.calledOnce);
      chai.assert.equal(headers['Content-Type'], 'application/x-www-form-urlencoded');
    });
  });

  describe('checkAndRefreshAccessToken', () => {
    it('does not refresh without refresh token or clientId', () => {
      const dbxAuth = new DropboxAuth();
      const refreshSpy = sinon.spy(dbxAuth, 'refreshAccessToken');
      dbxAuth.checkAndRefreshAccessToken();
      chai.assert.isTrue(refreshSpy.notCalled);
    });

    it('doesn\'t refresh token when not past expiration time', () => {
      const currentDate = new Date();
      const dbxAuth = new DropboxAuth({
        accessTokenExpiresAt: currentDate.setHours(currentDate.getHours() + 2),
      });
      const refreshSpy = sinon.spy(dbxAuth, 'refreshAccessToken');
      dbxAuth.checkAndRefreshAccessToken();
      chai.assert.isTrue(refreshSpy.notCalled);
    });

    it('refreshes token when past expiration', () => {
      const dbxAuth = new DropboxAuth({
        accessTokenExpiresAt: new Date(2019, 11, 19),
        clientId: '123',
        refreshToken: 'foo',
      });

      const refreshSpy = sinon.spy(dbxAuth, 'refreshAccessToken');
      dbxAuth.checkAndRefreshAccessToken();
      chai.assert.isTrue(refreshSpy.calledOnce);
    });
  });

  describe('refreshAccessToken', () => {
    it('throws an error when not provided with a clientId', () => {
      const dbxAuth = new DropboxAuth();
      chai.assert.throws(
        DropboxAuth.prototype.refreshAccessToken.bind(dbxAuth),
        Error,
        'A client id is required. You can set the client id using .setClientId().',
      );
    });

    it('throws an error when provided an argument that is not a list', () => {
      const dbxAuth = new DropboxAuth({ clientId: 'foo' });
      chai.assert.throws(
        DropboxAuth.prototype.refreshAccessToken.bind(dbxAuth, 'not a list'),
        Error,
        'Scope must be an array of strings',
      );
    });

    const testRefreshUrl = 'https://api.dropboxapi.com/oauth2/token?grant_type=refresh_token&refresh_token=undefined&client_id=foo&client_secret=bar';

    it('sets the correct refresh url (no scope passed)', () => {
      const dbxAuth = new DropboxAuth({
        clientId: 'foo',
        clientSecret: 'bar',
      });

      const fetchSpy = sinon.spy(dbxAuth, 'fetch');
      dbxAuth.refreshAccessToken();
      chai.assert.isTrue(fetchSpy.calledOnce);
      const refreshUrl = dbxAuth.fetch.getCall(0).args[0];
      const { headers } = dbxAuth.fetch.getCall(0).args[1];
      chai.assert.equal(refreshUrl, testRefreshUrl);
      chai.assert.equal(headers['Content-Type'], 'application/json');
    });

    it('sets the correct refresh url (scope passed)', () => {
      const dbxAuth = new DropboxAuth({
        clientId: 'foo',
        clientSecret: 'bar',
      });

      const fetchSpy = sinon.spy(dbxAuth, 'fetch');
      dbxAuth.refreshAccessToken(['files.metadata.read']);
      chai.assert.isTrue(fetchSpy.calledOnce);
      const refreshUrl = dbxAuth.fetch.getCall(0).args[0];
      const { headers } = dbxAuth.fetch.getCall(0).args[1];
      const testScopeUrl = `${testRefreshUrl}&scope=files.metadata.read`;
      chai.assert.equal(refreshUrl, testScopeUrl);
      chai.assert.equal(headers['Content-Type'], 'application/json');
    });
  });
});
