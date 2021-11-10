import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';

import { fail } from 'assert';
import {
  RPC,
  USER_AUTH,
  DOWNLOAD,
  UPLOAD,
  TEAM_AUTH,
  APP_AUTH,
  NO_AUTH,
  COOKIE,
} from '../../src/constants.js';
import { Dropbox, DropboxAuth } from '../../index.js';

chai.use(chaiAsPromised);
describe('Dropbox', () => {
  describe('selectUser', () => {
    it('can be set in the constructor', () => {
      const dbx = new Dropbox({ selectUser: 'foo' });
      chai.assert.equal(dbx.selectUser, 'foo');
    });

    it('is undefined if not set in constructor', () => {
      const dbx = new Dropbox();
      chai.assert.equal(dbx.selectUser, undefined);
    });
  });

  describe('domain', () => {
    it('can be set in the constructor', () => {
      const dbx = new Dropbox({ domain: 'mydomain.com' });
      chai.assert.equal(dbx.domain, 'mydomain.com');
    });

    it('is undefined if not set in constructor', () => {
      const dbx = new Dropbox();
      chai.assert.equal(dbx.domain, undefined);
    });

    it('is set by auth.domain if not set in constructor', () => {
      const auth = new DropboxAuth({ domain: 'mydomain.com' });
      const dbx = new Dropbox({ auth });
      chai.assert.equal(dbx.domain, 'mydomain.com');
    });
  });

  describe('domainDelimiter', () => {
    it('can be set in the constructor', () => {
      const dbx = new Dropbox({ domainDelimiter: '-' });
      chai.assert.equal(dbx.domainDelimiter, '-');
    });

    it('is undefined if not set in constructor', () => {
      const dbx = new Dropbox();
      chai.assert.equal(dbx.domainDelimiter, undefined);
    });

    it('is set by auth.domainDelimiter if not set in constructor', () => {
      const auth = new DropboxAuth({ domainDelimiter: '-' });
      const dbx = new Dropbox({ auth });
      chai.assert.equal(dbx.domainDelimiter, '-');
    });
  });

  describe('customHeaders', () => {
    it('can be set in the constructor', () => {
      const dbx = new Dropbox({ customHeaders: { foo: 'bar' } });
      chai.assert.equal(dbx.customHeaders.foo, 'bar');
    });

    it('is undefined if not set in constructor', () => {
      const dbx = new Dropbox();
      chai.assert.equal(dbx.customHeaders, undefined);
    });

    it('is set by auth.customHeaders if not set in constructor', () => {
      const auth = new DropboxAuth({ customHeaders: { foo: 'bar' } });
      const dbx = new Dropbox({ auth });
      chai.assert.equal(dbx.customHeaders.foo, 'bar');
    });
  });

  describe('RPC requests', () => {
    it('request() calls the correct request method', () => {
      const dbx = new Dropbox();
      const rpcSpy = sinon.spy(dbx, 'rpcRequest');
      dbx.request('path', {}, USER_AUTH, 'api', RPC)
        .catch((error) => {
          fail(error);
        });
      chai.assert.isTrue(rpcSpy.calledOnce);
      chai.assert.equal('path', dbx.rpcRequest.getCall(0).args[0]);
      chai.assert.deepEqual({}, dbx.rpcRequest.getCall(0).args[1]);
    });

    it('completes a cookie auth RPC request', () => {
      const dbxAuth = new DropboxAuth();
      const dbx = new Dropbox({ auth: dbxAuth });
      const rpcSpy = sinon.spy(dbx, 'rpcRequest');
      dbx.request('path', {}, COOKIE, 'api', RPC)
        .catch((error) => {
          fail(error);
        });
      chai.assert.isTrue(rpcSpy.calledOnce);
      chai.assert.equal('path', dbx.rpcRequest.getCall(0).args[0]);
      chai.assert.deepEqual({}, dbx.rpcRequest.getCall(0).args[1]);
      chai.assert.equal(COOKIE, dbx.rpcRequest.getCall(0).args[2]);
    });

    it('throws an error for invalid request styles', () => {
      chai.assert.throws(
        Dropbox.prototype.request.bind(Dropbox, '', {}, 'user', 'api', 'BADTYPE'),
        Error,
        'Invalid request style',
      );
    });
  });

  describe('Upload Requests', () => {
    it('request() calls the correct request method', () => {
      const dbx = new Dropbox();
      const uploadSpy = sinon.spy(dbx, 'uploadRequest');
      dbx.request('path', {}, USER_AUTH, 'api', UPLOAD)
        .catch((error) => {
          fail(error);
        });
      chai.assert.isTrue(uploadSpy.calledOnce);
      chai.assert.equal('path', dbx.uploadRequest.getCall(0).args[0]);
      chai.assert.deepEqual({}, dbx.uploadRequest.getCall(0).args[1]);
    });
  });

  describe('Download Requests', () => {
    it('calls the correct request method', () => {
      const dbx = new Dropbox();
      const downloadSpy = sinon.spy(dbx, 'downloadRequest');
      dbx.request('path', {}, USER_AUTH, 'api', DOWNLOAD)
        .catch((error) => {
          fail(error);
        });
      chai.assert.isTrue(downloadSpy.calledOnce);
      chai.assert.equal('path', dbx.downloadRequest.getCall(0).args[0]);
      chai.assert.deepEqual({}, dbx.downloadRequest.getCall(0).args[1]);
    });
  });

  describe('pathRoot', () => {
    it('can be set in the constructor', () => {
      const dbx = new Dropbox({ pathRoot: 'foo' });
      chai.assert.equal(dbx.pathRoot, 'foo');
    });

    it('is undefined if not set in constructor', () => {
      const dbx = new Dropbox();
      chai.assert.equal(dbx.pathRoot, undefined);
    });
  });

  describe('setCommonHeaders', () => {
    it('creates the correct headers when constructed with select user/admin and/or path root', () => {
      for (const selectUser of [undefined, 'foo']) {
        for (const selectAdmin of [undefined, 'bar']) {
          for (const pathRoot of [undefined, 'test']) {
            const dbx = new Dropbox({
              selectUser,
              selectAdmin,
              pathRoot,
            });

            const fetchOptions = {
              headers: {},
            };
            dbx.setCommonHeaders(fetchOptions);
            const { headers } = fetchOptions;
            chai.assert.equal(headers['Dropbox-API-Select-User'], selectUser);
            chai.assert.equal(headers['Dropbox-API-Select-Admin'], selectAdmin);
            chai.assert.equal(headers['Dropbox-API-Path-Root'], pathRoot);
          }
        }
      }
    });

    it('sets custom headers correctly', () => {
      const dbx = new Dropbox({
        customHeaders: {
          foo: 'bar',
          milk: 'shake',
          cookie: 'hash',
        },
      });

      const fetchOptions = {
        headers: {},
      };

      dbx.setCommonHeaders(fetchOptions);
      const { headers } = fetchOptions;
      chai.assert.equal(headers.foo, 'bar');
      chai.assert.equal(headers.milk, 'shake');
      chai.assert.equal(headers.cookie, 'hash');
    });
  });

  describe('setAuthHeaders', () => {
    const authTypes = ['user', 'app', 'team', 'noauth', 'user, app', 'team, app', 'cookie'];
    for (const auth of authTypes) {
      for (const hasAccessToken of [true, false]) {
        for (const hasAppKeys of [true, false]) {
          it(`correctly sets auth headers given '${auth}' auth and ${hasAccessToken ? 'has' : 'does not have'} an access token`, () => {
            const dbx = new Dropbox({
              accessToken: hasAccessToken ? 'token' : undefined,
              clientId: hasAppKeys ? 'app_key' : undefined,
              clientSecret: hasAppKeys ? 'app_secret' : undefined,
            });

            const fetchOptions = {
              headers: {},
            };

            const isExpectedToHaveTokenHeader = hasAccessToken && (auth.includes('user') || auth.includes('team'));
            const isExpectedToHaveAppHeader = ((auth === 'app') || (auth.includes('app') && !hasAccessToken)) && hasAppKeys;

            dbx.setAuthHeaders(auth, fetchOptions);

            const { headers } = fetchOptions;
            if (isExpectedToHaveAppHeader) {
              chai.assert.isTrue(headers.Authorization.includes('Basic'));
            } else if (isExpectedToHaveTokenHeader) {
              chai.assert.isTrue(headers.Authorization.includes('Bearer'));
            } else {
              chai.assert.deepEqual(headers, {});
            }
          });
        }
      }
    }

    it('throws an error on an invalid auth type', () => {
      const dbx = new Dropbox();

      const fetchOptions = {
        headers: {},
      };

      chai.assert.throws(
        Dropbox.prototype.setAuthHeaders.bind(Dropbox, 'bad auth type', fetchOptions),
        Error,
      );
    });
  });
});
