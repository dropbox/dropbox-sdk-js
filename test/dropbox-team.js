import sinon from 'sinon';
import { assert } from 'chai';

import { RPC } from '../src/constants';
import { Dropbox } from '../src/dropbox';
import { DropboxTeam } from '../src/team/dropbox-team';

describe('DropboxTeam', function () {
  var dbx;
  describe('#actAsUser()', function () {
    it('Returns an instance of Dropbox', function () {
      var dbxUser;
      dbx = new DropboxTeam();
      dbxUser = dbx.actAsUser(12);
      assert.instanceOf(dbxUser, Dropbox);
    });
  });

  describe('api method', function () {
    it('teamGroupsList calls DropboxTeam.request', function () {
      var requestSpy;
      dbx = new DropboxTeam();
      requestSpy = sinon.spy(dbx, 'request');
      dbx.teamGroupsList({ limit: 10 });
      assert(requestSpy.calledOnce);
      assert.equal('team/groups/list', dbx.request.getCall(0).args[0]);
      assert.deepEqual({ limit: 10 }, dbx.request.getCall(0).args[1]);
      assert.equal('team', dbx.request.getCall(0).args[2]);
      assert.equal('api', dbx.request.getCall(0).args[3]);
      assert.equal(RPC, dbx.request.getCall(0).args[4]);
    });
  });
});
