import chai from 'chai';

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
          for (const tokenAccessType of ['', 'legacy', 'offline', 'online']) {
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

                if (tokenAccessType !== '') {
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
});
