import chai from 'chai';
import sinon from 'sinon';

import { RPC, USER_AUTH } from '../../src/constants.js';
import { Dropbox } from '../../index.js';

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

  describe('request()', () => {
    it('calls the correct request method', () => {
      const dbx = new Dropbox();
      const rpcSpy = sinon.spy(dbx, 'rpcRequest');
      dbx.request('path', {}, USER_AUTH, 'api', RPC);
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
});
