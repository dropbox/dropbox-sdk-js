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
} from '../../src/constants.js';
import { Dropbox } from '../../index.js';

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

    it('throws an error for team auth', () => {
      const dbx = new Dropbox();
      return chai.assert.isRejected(dbx.uploadRequest('path', {}, TEAM_AUTH, 'api'), Error, `Unexpected auth type: ${TEAM_AUTH}`);
    });
    it('throws an error for app auth', () => {
      const dbx = new Dropbox();
      return chai.assert.isRejected(dbx.uploadRequest('path', {}, APP_AUTH, 'api'), Error, `Unexpected auth type: ${APP_AUTH}`);
    });
    it('throws an error for no-auth', () => {
      const dbx = new Dropbox();
      return chai.assert.isRejected(dbx.uploadRequest('path', {}, NO_AUTH, 'api'), Error, `Unexpected auth type: ${NO_AUTH}`);
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

    it('throws an error for team auth', () => {
      const dbx = new Dropbox();
      return chai.assert.isRejected(dbx.downloadRequest('path', {}, TEAM_AUTH, 'api'), Error, `Unexpected auth type: ${TEAM_AUTH}`);
    });

    it('throws an error for app auth', () => {
      const dbx = new Dropbox();
      return chai.assert.isRejected(dbx.downloadRequest('path', {}, APP_AUTH, 'api'), Error, `Unexpected auth type: ${APP_AUTH}`);
    });

    it('throws an error for no-auth', () => {
      const dbx = new Dropbox();
      return chai.assert.isRejected(dbx.downloadRequest('path', {}, NO_AUTH, 'api'), Error, `Unexpected auth type: ${NO_AUTH}`);
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
  });
});
