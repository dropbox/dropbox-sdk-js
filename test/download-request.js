/* eslint-env mocha */
var Promise = require('es6-promise').Promise;
var chai = require('chai');
var request = require('superagent');
var downloadRequest = require('../src/download-request');
var sinon = require('sinon');

var assert = chai.assert;

describe('downloadRequest', function () {
  var stubRequest;
  var postStub;
  var endStub;
  var onStub;
  var setStub;
  var typeStub;
  var bufferStub;
  var parseStub;

  beforeEach(function () {
    stubRequest = {
      end: function () {},
      on: function () {},
      set: function () {},
      type: function () {},
      buffer: function () {},
      parse: function () {}
    };
    postStub = sinon.stub(request, 'post').returns(stubRequest);
    endStub = sinon.stub(stubRequest, 'end').returns(stubRequest);
    onStub = sinon.stub(stubRequest, 'on').returns(stubRequest);
    setStub = sinon.stub(stubRequest, 'set').returns(stubRequest);
    typeStub = sinon.stub(stubRequest, 'type').returns(stubRequest);
    bufferStub = sinon.stub(stubRequest, 'buffer').returns(stubRequest);
    parseStub = sinon.stub(stubRequest, 'parse').returns(stubRequest);
  });

  afterEach(function () {
    postStub.restore();
  });

  it('returns a promise', function () {
    assert.instanceOf(
      downloadRequest('path', {}, 'user', 'content', 'atoken'),
      Promise
    );
  });

  it('posts to the correct url', function () {
    downloadRequest('sharing/get_shared_link_file', { foo: 'bar' }, 'user', 'content', 'atoken');
    assert(postStub.calledOnce);
    assert.equal('https://content.dropboxapi.com/2/sharing/get_shared_link_file', postStub.firstCall.args[0]);
  });

  // This is just what the API wants...
  it('the request type is not set', function () {
    downloadRequest('sharing/get_shared_link_file', { foo: 'bar' }, 'user', 'content', 'atoken');
    assert(!typeStub.called);
  });

  it('sets the authorization header', function () {
    downloadRequest('sharing/create_shared_link', { foo: 'bar' }, 'user', 'content', 'atoken');
    assert(setStub.calledTwice);
    assert.equal('Authorization', setStub.firstCall.args[0]);
    assert.equal('Bearer atoken', setStub.firstCall.args[1]);
  });

  it('sets the authorization and select user headers if selectUser set', function () {
    downloadRequest('sharing/create_shared_link', { foo: 'bar' }, 'user', 'content', 'atoken', 'selectedUserId');
    assert(setStub.calledThrice);
    assert.equal('Authorization', setStub.firstCall.args[0]);
    assert.equal('Bearer atoken', setStub.firstCall.args[1]);
    assert.equal('Dropbox-API-Select-User', setStub.thirdCall.args[0]);
    assert.equal('selectedUserId', setStub.thirdCall.args[1]);
  });

  it('sets the Dropbox-API-Arg header', function () {
    downloadRequest('sharing/create_shared_link', { foo: 'bar' }, 'user', 'content', 'atoken');
    assert(setStub.calledTwice);
    assert.equal('Dropbox-API-Arg', setStub.secondCall.args[0]);
    assert.equal(JSON.stringify({ foo: 'bar' }), setStub.secondCall.args[1]);
  });

  it('escapes special characters in the Dropbox-API-Arg header', function () {
    downloadRequest('sharing/create_shared_link', { foo: 'bar单bazá' }, 'user', 'content', 'atoken');
    assert(setStub.calledTwice);
    assert.equal('Dropbox-API-Arg', setStub.secondCall.args[0]);
    assert.equal('{"foo":"bar\\u5355baz\\u00e1"}', setStub.secondCall.args[1]);
  });

  it('sets the response handler function', function () {
    downloadRequest('sharing/create_shared_link', { foo: 'bar' }, 'user', 'content', 'atoken');
    assert(endStub.calledOnce);
    assert.isFunction(endStub.firstCall.args[0]);
  });
});
