import sinon from 'sinon';
import { assert } from 'chai';
import superagent from 'superagent';
import { rpcRequest } from '../src/rpc-request';

describe('rpcRequest', function () {
  var stubRequest;
  var postStub;
  var endStub;
  var sendStub;
  var setStub;
  var typeStub;

  beforeEach(function () {
    stubRequest = {
      end: function () {},
      send: function () {},
      set: function () {},
      type: function () {}
    };
    postStub = sinon.stub(superagent, 'post').returns(stubRequest);
    endStub = sinon.stub(stubRequest, 'end').returns(stubRequest);
    sendStub = sinon.stub(stubRequest, 'send').returns(stubRequest);
    setStub = sinon.stub(stubRequest, 'set').returns(stubRequest);
    typeStub = sinon.stub(stubRequest, 'type').returns(stubRequest);
  });

  afterEach(function () {
    postStub.restore();
  });

  it('returns a promise', function () {
    // this is in no way correct. It should validate errors thrown that exist but
    // have no tests currently. 
    assert.instanceOf(
      rpcRequest(),
      Promise
    );
  });

  it('posts to the correct url', function () {
    rpcRequest('files/list', { foo: 'bar' }, 'user', 'api', 'atoken');
    assert(postStub.calledOnce);
    assert.equal('https://api.dropboxapi.com/2/files/list', postStub.firstCall.args[0]);
  });

  it('sets the request type to application/json', function () {
    rpcRequest('files/list', { foo: 'bar' }, 'user', 'api', 'atoken');
    assert(typeStub.calledOnce);
    assert.equal('application/json', typeStub.firstCall.args[0]);
  });

  it('sets the authorization header', function () {
    rpcRequest('files/list', { foo: 'bar' }, 'user', 'api', 'atoken');
    assert(setStub.calledOnce);
    assert.equal('Authorization', setStub.firstCall.args[0]);
    assert.equal('Bearer atoken', setStub.firstCall.args[1]);
  });

  it('sets the authorization and select user headers if selectUser set', function () {
    rpcRequest('files/list', { foo: 'bar' }, 'user', 'api', 'atoken', 'selectedUserId');
    assert(setStub.calledTwice);
    assert.equal('Authorization', setStub.firstCall.args[0]);
    assert.equal('Bearer atoken', setStub.firstCall.args[1]);
    assert.equal('Dropbox-API-Select-User', setStub.secondCall.args[0]);
    assert.equal('selectedUserId', setStub.secondCall.args[1]);
  });

  it('sets the request body', function () {
    rpcRequest('files/list', { foo: 'bar' }, 'user', 'api', 'atoken');
    assert(sendStub.calledOnce);
    assert.deepEqual({ foo: 'bar' }, sendStub.firstCall.args[0]);
  });

  it('sets the request body to null if body isn\'t passed', function () {
    rpcRequest('files/list', undefined, 'user', 'api', 'atoken');
    assert(sendStub.calledOnce);
    assert.deepEqual(null, sendStub.firstCall.args[0]);
  });

  it('sets the response handler function', function () {
    rpcRequest('files/list', { foo: 'bar' }, 'user', 'api', 'atoken');
    assert(endStub.calledOnce);
    assert.isFunction(endStub.firstCall.args[0]);
  });
});
