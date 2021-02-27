import fs from 'fs/promises';
import path from 'path';

import chai from 'chai';

import { Dropbox, DropboxAuth } from '../../index.js';
import { DropboxResponse } from '../../src/response.js';
import { DropboxResponseError } from '../../src/error.js';

const appInfo = {
  LEGACY: {
    accessToken: process.env.LEGACY_USER_DROPBOX_TOKEN,
    clientId: process.env.LEGACY_USER_CLIENT_ID,
    clientSecret: process.env.LEGACY_USER_CLIENT_SECRET,
    refreshToken: process.env.LEGACY_USER_REFRESH_TOKEN,
  },
  SCOPED: {
    accessToken: process.env.SCOPED_USER_DROPBOX_TOKEN,
    clientId: process.env.SCOPED_USER_CLIENT_ID,
    clientSecret: process.env.SCOPED_USER_CLIENT_SECRET,
    refreshToken: process.env.SCOPED_USER_REFRESH_TOKEN,
  },
};

for (const appType in appInfo) {
  if (appType) { // for linter
    describe(`User ${appType}`, () => {
      let dbxAuth;
      let dbx;
      beforeEach(() => {
        dbxAuth = new DropboxAuth(appInfo[appType]);
        dbx = new Dropbox({ auth: dbxAuth });
      });

      describe('rpc', () => {
        it('rpc request is successful', (done) => {
          dbx.usersGetCurrentAccount()
            .then((resp) => {
              chai.assert.instanceOf(resp, DropboxResponse);
              chai.assert.equal(resp.status, 200, resp.result);
              chai.assert.isObject(resp.result);

              done();
            })
            .catch(done);
        });
      });

      describe('download', () => {
        it('download request is successful', (done) => {
          dbx.sharingGetSharedLinkFile({ url: process.env.DROPBOX_SHARED_LINK })
            .then((resp) => {
              chai.assert.instanceOf(resp, DropboxResponse);
              chai.assert.equal(resp.status, 200, resp.result);
              chai.assert.isObject(resp.result);

              chai.assert.isString(resp.result.name);
              chai.assert.isDefined(resp.result.fileBinary);

              done();
            })
            .catch(done);
        });
      });

      describe('upload', () => {
        it('upload request is successful', (done) => {
          fs.readFile(path.resolve('test/fixtures/test.txt'), 'utf8')
            .then((contents) => {
              dbx.filesUpload({ path: '/test.txt', contents })
                .then((resp) => {
                  chai.assert.instanceOf(resp, DropboxResponse);
                  chai.assert.equal(resp.status, 200, resp.result);
                  chai.assert.isObject(resp.result);

                  done();
                })
                .catch(done);
            });
        });
      });

      describe('app auth', () => {
        it('successfully uses app auth', (done) => {
          dbx.checkApp({ query: 'Echo string' })
            .then((resp) => {
              chai.assert.instanceOf(resp, DropboxResponse);
              chai.assert.equal(resp.status, 200, resp.result);
              chai.assert.isObject(resp.result);
              chai.assert.equal('Echo string', resp.result.result);

              done();
            })
            .catch(done);
        });
      });

      describe('token refresh', () => {
        it('refreshes the token when necessary', (done) => {
          const currentDate = new Date();
          // setting expired refresh token
          dbxAuth.setAccessTokenExpiresAt(currentDate.setHours(currentDate.getHours() - 20));

          const expirationBeforeRefresh = dbxAuth.getAccessTokenExpiresAt();
          const dbxWithRefreshToken = new Dropbox({ auth: dbxAuth });

          dbxWithRefreshToken.usersGetCurrentAccount()
            .then((resp) => {
              chai.assert.instanceOf(resp, DropboxResponse);
              chai.assert.equal(resp.status, 200, resp.result);
              chai.assert.isObject(resp.result);
              // testing to make sure that the token has been refreshed
              chai.assert.notEqual(
                dbxAuth.getAccessToken(), appInfo[appType].token,
              );
              // comparing dates to make sure new token expiration is set
              chai.assert.isTrue(
                dbxAuth.accessTokenExpiresAt > new Date(expirationBeforeRefresh),
              );

              done();
            })
            .catch(done);
        });
      });
    });
  }
}

describe('incorrect auth', () => {
  it('fails if there is an empty auth object', () => {
    const dbxAuth = new DropboxAuth();
    const dbx = new Dropbox({ auth: dbxAuth });

    dbx.usersGetCurrentAccount()
      .catch((err) => {
        chai.assert.instanceOf(err, DropboxResponseError);
        chai.assert.isObject(err);
        chai.assert.equal(err.error, 'Error in call to API function "users/get_current_account": The given OAuth 2 access token is malformed.');
      });
  });

  it('fails if token is invalid', () => {
    const dbxAuth = new DropboxAuth({ accessToken: 'foo' });
    const dbx = new Dropbox({ auth: dbxAuth });

    dbx.usersGetCurrentAccount()
      .catch((err) => {
        chai.assert.instanceOf(err, DropboxResponseError);
        chai.assert.isObject(err);
        chai.assert.equal(err.error, 'Error in call to API function "users/get_current_account": The given OAuth 2 access token is malformed.');
      });
  });
});

describe('multiauth', () => {
  it('mulitauth request is successful', (done) => {
    const dbxAuth = new DropboxAuth(appInfo.LEGACY);
    const dbx = new Dropbox({ auth: dbxAuth });
    const arg = {
      resource: {
        '.tag': 'link',
        url: process.env.DROPBOX_SHARED_LINK,
      },
      format: 'jpeg',
      size: 'w64h64',
      mode: 'strict',
    };
    dbx.filesGetThumbnailV2(arg)
      .then((resp) => {
        chai.assert.instanceOf(resp, DropboxResponse);
        chai.assert.equal(resp.status, 200, resp.result);
        done();
      })
      .catch(done);
  });
});
