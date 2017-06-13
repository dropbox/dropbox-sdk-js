import sinon from 'sinon';
import { assert } from 'chai';

import { RPC } from '../src/constants';
import { Dropbox } from '../src/dropbox';

describe('Dropbox', function () {
  var dbx;
  describe('api method', function () {
    it('filesListFolder calls Dropbox.request', function () {
      var requestSpy;
      dbx = new Dropbox();
      requestSpy = sinon.spy(dbx, 'request');
      dbx.filesListFolder({});
      assert(requestSpy.calledOnce);
      assert.equal('files/list_folder', dbx.request.getCall(0).args[0]);
      assert.deepEqual({}, dbx.request.getCall(0).args[1]);
      assert.equal('user', dbx.request.getCall(0).args[2]);
      assert.equal('api', dbx.request.getCall(0).args[3]);
      assert.equal(RPC, dbx.request.getCall(0).args[4]);
    });
  });
});
