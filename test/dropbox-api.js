var DropboxApi = require('../src/dropbox-api');
var REQUEST_CONSTANTS = require('../src/request-constants');
var chai = require('chai');
var sinon = require('sinon');

var assert = chai.assert;

describe('DropboxApi', function () {
  describe('.accessToken', function () {
    it('defaults to an empty string', function () {
      dbx = new DropboxApi();
      assert.equal(dbx.getAccessToken(), '');
    });

    it('can be set in the constructor', function () {
      dbx = new DropboxApi({ accessToken: 'foo' });
      assert.equal(dbx.getAccessToken(), 'foo');
    });

    it('can be set after being instantiated', function () {
      dbx = new DropboxApi();
      dbx.setAccessToken('foo');
      assert.equal(dbx.getAccessToken(), 'foo');
    });
  });

  describe('.rpcRequest', function () {
    it('defaults to the libraries implementation', function () {
      dbx = new DropboxApi();
      assert.equal(dbx.getAccessToken(), '');
    });

    it('can be set to something else by the user', function () {
      var aFunction = function () {};
      dbx = new DropboxApi();
      dbx.setRpcRequest(aFunction);
      assert.equal(dbx.getRpcRequest(), aFunction);
    });
  });

  describe('.request()', function () {
    it('calls the correct request method', function () {
      dbx = new DropboxApi();
      var rpcSpy = sinon.spy(dbx, 'rpcRequest');
      dbx.request('path', {}, REQUEST_CONSTANTS.RPC);
      assert(rpcSpy.calledOnce);
      assert.equal('path', dbx.rpcRequest.getCall(0).args[0]);
      assert.deepEqual({}, dbx.rpcRequest.getCall(0).args[1]);
    });
    it('throws an error for invalid request types', function () {
      dbx = new DropboxApi();
      assert.throws(
        DropboxApi.prototype.request.bind(DropboxApi, '', {}, 'BADTYPE'),
        Error,
        'Invalid request type'
      );
    });
  });

  describe('api method', function () {
    it('filesListFolder calls DropboxApi.request', function () {
      dbx = new DropboxApi();
      var requestSpy = sinon.spy(dbx, 'request');
      dbx.filesListFolder({});
      assert(requestSpy.calledOnce);
      assert.equal('files/list_folder', dbx.request.getCall(0).args[0]);
      assert.deepEqual({}, dbx.request.getCall(0).args[1]);
      assert.equal(REQUEST_CONSTANTS.RPC, dbx.request.getCall(0).args[2]);
    });
  });
});
