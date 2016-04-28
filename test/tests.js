var DropboxApi = require('../../index');
var chai = require('chai');
var sinon = require('sinon');

var assert = chai.assert;

describe('DropboxApi [Node]', function () {
  describe('access token', function () {
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

  describe('rpcRequest', function () {
    it('defaults to the libraries implementation', function () {
      dbx = new DropboxApi();
      assert.equal(dbx.getAccessToken(), '');
    });

    it('can be set to something else by the user', function () {
      var aFunc = function () {};
      dbx = new DropboxApi();
      dbx.setRpcRequest(aFunc);
      assert.equal(dbx.getRpcRequest(), aFunc);
    });
  });
});
