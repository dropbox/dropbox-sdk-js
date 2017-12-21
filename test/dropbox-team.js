/* eslint-env mocha */
var Dropbox = require('../src/dropbox');
var DropboxTeam = require('../src/team/dropbox-team');
var REQUEST_CONSTANTS = require('../src/request-constants');
var chai = require('chai');
var sinon = require('sinon');

var assert = chai.assert;

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
      assert.equal(REQUEST_CONSTANTS.RPC, dbx.request.getCall(0).args[4]);
    });
  });
});
