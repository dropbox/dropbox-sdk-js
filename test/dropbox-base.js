/* eslint-env mocha */
var DropboxBase = require('../src/dropbox-base');
var REQUEST_CONSTANTS = require('../src/request-constants');
var rpcRequest = require('../src/rpc-request');
var chai = require('chai');
var sinon = require('sinon');

var assert = chai.assert;

describe('DropboxBase', function () {
  var dbx;
  describe('.accessToken', function () {
    it('can be set in the constructor', function () {
      dbx = new DropboxBase({ accessToken: 'foo' });
      assert.equal(dbx.getAccessToken(), 'foo');
    });

    it('is undefined if not set in constructor', function () {
      dbx = new DropboxBase();
      assert.equal(dbx.getAccessToken(), undefined);
    });

    it('can be set after being instantiated', function () {
      dbx = new DropboxBase();
      dbx.setAccessToken('foo');
      assert.equal(dbx.getAccessToken(), 'foo');
    });
  });

  describe('.clientId', function () {
    it('can be set in the constructor', function () {
      dbx = new DropboxBase({ clientId: 'foo' });
      assert.equal(dbx.getClientId(), 'foo');
    });

    it('is undefined if not set in constructor', function () {
      dbx = new DropboxBase();
      assert.equal(dbx.getClientId(), undefined);
    });

    it('can be set after being instantiated', function () {
      dbx = new DropboxBase();
      dbx.setClientId('foo');
      assert.equal(dbx.getClientId(), 'foo');
    });
  });

  describe('.selectUser', function () {
    it('can be set in the constructor', function () {
      dbx = new DropboxBase({ selectUser: 'foo' });
      assert.equal(dbx.selectUser, 'foo');
    });

    it('is undefined if not set in constructor', function () {
      dbx = new DropboxBase();
      assert.equal(dbx.selectUser, undefined);
    });
  });

  describe('#rpcRequest()', function () {
    it('defaults to the libraries implementation', function () {
      dbx = new DropboxBase();
      assert.equal(dbx.getRpcRequest(), rpcRequest);
    });

    it('can be set to something else by the user', function () {
      var aFunction = function () {};
      dbx = new DropboxBase();
      dbx.setRpcRequest(aFunction);
      assert.equal(dbx.getRpcRequest(), aFunction);
    });
  });

  describe('#getAuthenticationUrl()', function () {
    it('throws an error if the client id isn\'t set', function () {
      dbx = new DropboxBase();
      assert.throws(
        DropboxBase.prototype.getAuthenticationUrl.bind(dbx, 'https://redirecturl.com'),
        Error,
        'A client id is required. You can set the client id using .setClientId().'
      );
    });

    it('throws an error if the redirect url isn\'t set', function () {
      dbx = new DropboxBase({ clientId: 'CLIENT_ID' });
      assert.throws(
        DropboxBase.prototype.getAuthenticationUrl.bind(dbx),
        Error,
        'A redirect uri is required.'
      );
    });

    it('returns auth url with redirect uri', function () {
      dbx = new DropboxBase({ clientId: 'CLIENT_ID' });
      assert.equal(
        dbx.getAuthenticationUrl('redirect'),
        'https://www.dropbox.com/oauth2/authorize?response_type=token&client_id=CLIENT_ID&redirect_uri=redirect'
      );
    });

    it('returns auth url with redirect uri and state', function () {
      dbx = new DropboxBase({ clientId: 'CLIENT_ID' });
      assert.equal(
        dbx.getAuthenticationUrl('redirect', 'state'),
        'https://www.dropbox.com/oauth2/authorize?response_type=token&client_id=CLIENT_ID&redirect_uri=redirect&state=state'
      );
    });
  });

  describe('.request()', function () {
    it('calls the correct request method', function () {
      var rpcSpy;
      dbx = new DropboxBase();
      rpcSpy = sinon.spy(dbx.getRpcRequest());
      dbx.setRpcRequest(rpcSpy);
      dbx.request('path', {}, 'user', 'api', REQUEST_CONSTANTS.RPC);
      assert(rpcSpy.calledOnce);
      assert.equal('path', dbx.rpcRequest.getCall(0).args[0]);
      assert.deepEqual({}, dbx.rpcRequest.getCall(0).args[1]);
    });
    it('throws an error for invalid request styles', function () {
      dbx = new DropboxBase();
      assert.throws(
        DropboxBase.prototype.request.bind(DropboxBase, '', {}, 'user', 'api', 'BADTYPE'),
        Error,
        'Invalid request style'
      );
    });
  });
});
