import sinon from 'sinon';
import { assert } from 'chai';
import { RPC } from '../src/constants';
import { DropboxBase } from '../src/dropbox-base';
import { rpcRequest } from '../src/rpc-request';

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
    
    it('throws an error if the redirect url isn\'t set and type is code', function () {
      dbx = new DropboxBase({ clientId: 'CLIENT_ID' });
      assert.equal(
        dbx.getAuthenticationUrl('', null, 'code'),
        'https://www.dropbox.com/oauth2/authorize?response_type=code&client_id=CLIENT_ID'
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

  describe('#authenticateWithCordova()', function () {
    it('opens authentication page', function () {
      dbx = new DropboxBase({ clientId: 'CLIENT_ID' });
      var redirect_url = 'https://www.dropbox.com/1/oauth2/redirect_receiver';
      var url = dbx.getAuthenticationUrl(redirect_url);
      var browser = {
        addEventListener: sinon.spy(),
        removeEventListener: sinon.spy(),
      };
      global.window = {
        open: function(url, target) {},
      };

      var windowMock = sinon.mock(global.window);
      windowMock.expects('open')
        .withArgs(url, '_blank')
        .returns(browser);

      var successCallback = sinon.spy();
      var errorCallback = sinon.spy();

      dbx.authenticateWithCordova(
        successCallback,
        errorCallback);

      sinon.assert.neverCalledWith(successCallback);
      sinon.assert.neverCalledWith(errorCallback);

      windowMock.verify();
    });
    it('registers and unregisters events', function () {
      dbx = new DropboxBase({ clientId: 'CLIENT_ID' });
      var browser = {
        addEventListener: sinon.spy(),
        removeEventListener: sinon.spy()
      };
      global.window = {
        open: sinon.stub()
      };
      global.window.open
        .returns(browser);

      var successCallback = sinon.spy();
      var errorCallback = sinon.spy();

      dbx.authenticateWithCordova(
        successCallback,
        errorCallback
      );

      sinon.assert.calledWith(browser.addEventListener, 'loaderror');
      sinon.assert.calledWith(browser.addEventListener, 'loadstop');
      sinon.assert.calledWith(browser.addEventListener, 'exit');

      var onExit = browser.addEventListener.getCall(2).args[1];
      onExit({ });

      sinon.assert.calledWith(browser.removeEventListener, 'loaderror');
      sinon.assert.calledWith(browser.removeEventListener, 'loadstop');
      sinon.assert.calledWith(browser.removeEventListener, 'exit');

      sinon.assert.neverCalledWith(successCallback);
      sinon.assert.neverCalledWith(errorCallback);
    });
    it('calls error callback when loading the autentication page failed', function () {
      dbx = new DropboxBase({ clientId: 'CLIENT_ID' });
      var browser = {
        addEventListener: sinon.spy(),
        removeEventListener: sinon.spy(),
        close: sinon.spy()
      };
      global.window = {
        open: sinon.stub(),
        setTimeout: sinon.spy()
      };
      global.window.open
        .returns(browser);

      var successCallback = sinon.spy();
      var errorCallback = sinon.spy();

      dbx.authenticateWithCordova(
        successCallback,
        errorCallback
      );

      var onLoadError = browser.addEventListener.getCall(0).args[1];
      onLoadError({});

      var timeOut = global.window.setTimeout.getCall(0).args[0];
      timeOut();
      sinon.assert.called(browser.close);

      sinon.assert.neverCalledWith(successCallback);
      sinon.assert.calledWith(errorCallback);
    });
    it('calls the error callback when authentication failed', function () {
      dbx = new DropboxBase({ clientId: 'CLIENT_ID' });
      var redirect_url = 'https://www.dropbox.com/1/oauth2/redirect_receiver';
      var browser = {
        addEventListener: sinon.spy(),
        removeEventListener: sinon.spy(),
        close: sinon.spy()
      };
      global.window = {
        open: sinon.stub(),
        setTimeout: sinon.spy()
      };
      global.window.open
        .returns(browser);

      var successCallback = sinon.spy();
      var errorCallback = sinon.spy();

      dbx.authenticateWithCordova(
        successCallback,
        errorCallback
      );

      var onLoadStop = browser.addEventListener.getCall(1).args[1];

      onLoadStop({ url: redirect_url + '#error_description=ERROR_DESCRIPTION&error=ERROR_TYPE' });

      var timeOut = global.window.setTimeout.getCall(0).args[0];
      timeOut();
      sinon.assert.called(browser.close);

      sinon.assert.neverCalledWith(successCallback);
      sinon.assert.calledWith(errorCallback);
    });
    it('calls the success callback with the access token as a parameter', function () {
      dbx = new DropboxBase({ clientId: 'CLIENT_ID' });
      var redirect_url = 'https://www.dropbox.com/1/oauth2/redirect_receiver';
      var browser = {
        addEventListener: sinon.spy(),
        removeEventListener: sinon.spy(),
        close: sinon.spy()
      };
      global.window = {
        open: sinon.stub(),
        setTimeout: sinon.spy()
      };
      global.window.open
        .returns(browser);

      var successCallback = sinon.spy();
      var errorCallback = sinon.spy();

      dbx.authenticateWithCordova(
        successCallback,
        errorCallback
      );

      var onLoadStop = browser.addEventListener.getCall(1).args[1];

      var ACCESS_TOKEN = 'ACCESS_TOKEN';

      onLoadStop({ url: redirect_url + '#access_token=' + ACCESS_TOKEN + '&token_type=TOKEN_TYPE' });

      var timeOut = global.window.setTimeout.getCall(0).args[0];
      timeOut();
      sinon.assert.called(browser.close);

      sinon.assert.calledWithExactly(successCallback, ACCESS_TOKEN);
      sinon.assert.neverCalledWith(errorCallback);
    });
  });

  describe('.request()', function () {
    it('calls the correct request method', function () {
      var rpcSpy;
      dbx = new DropboxBase();
      rpcSpy = sinon.spy(dbx.getRpcRequest());
      dbx.setRpcRequest(rpcSpy);
      dbx.request('path', {}, 'user', 'api', RPC);
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
