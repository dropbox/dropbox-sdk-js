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

  describe('customHeaders', () => {
    it('can be set in the constructor', () => {
      const dbx = new Dropbox({ customHeaders: { foo: 'bar' } });
      chai.assert.equal(dbx.customHeaders.foo, 'bar');
    });

    it('is undefined if not set in constructor', () => {
      const dbx = new Dropbox();
      chai.assert.equal(dbx.customHeaders, undefined);
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

    it('completes a multiauth RPC request with user auth when supplied with an accessToken', () => {
      const dbxAuth = new DropboxAuth({ accessToken: 'foo' });
      const dbx = new Dropbox({ auth: dbxAuth });
      const rpcSpy = sinon.spy(dbx, 'rpcRequest');
      dbx.request('path', {}, 'user, app', 'api', RPC)
        .catch((error) => {
          fail(error);
        });
      chai.assert.isTrue(rpcSpy.calledOnce);
      chai.assert.equal('path', dbx.rpcRequest.getCall(0).args[0]);
      chai.assert.deepEqual({}, dbx.rpcRequest.getCall(0).args[1]);
      chai.assert.equal(USER_AUTH, dbx.rpcRequest.getCall(0).args[2]);
    });

    it('completes a multiauth RPC request with team auth when supplied with an accessToken', () => {
      const dbxAuth = new DropboxAuth({ accessToken: 'foo' });
      const dbx = new Dropbox({ auth: dbxAuth });
      const rpcSpy = sinon.spy(dbx, 'rpcRequest');
      dbx.request('path', {}, 'team, app', 'api', RPC)
        .catch((error) => {
          fail(error);
        });
      chai.assert.isTrue(rpcSpy.calledOnce);
      chai.assert.equal('path', dbx.rpcRequest.getCall(0).args[0]);
      chai.assert.deepEqual({}, dbx.rpcRequest.getCall(0).args[1]);
      chai.assert.equal(TEAM_AUTH, dbx.rpcRequest.getCall(0).args[2]);
    });

    it('completes a multiauth RPC request with app auth when not supplied with an accessToken', () => {
      const dbxAuth = new DropboxAuth({
        clientID: 'foo',
        clientSecret: 'bar',
      });
      const dbx = new Dropbox({ auth: dbxAuth });
      const rpcSpy = sinon.spy(dbx, 'rpcRequest');
      dbx.request('path', {}, 'user, app', 'api', RPC)
        .catch((error) => {
          fail(error);
        });
      chai.assert.isTrue(rpcSpy.calledOnce);
      chai.assert.equal('path', dbx.rpcRequest.getCall(0).args[0]);
      chai.assert.deepEqual({}, dbx.rpcRequest.getCall(0).args[1]);
      chai.assert.equal(APP_AUTH, dbx.rpcRequest.getCall(0).args[2]);
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
});
