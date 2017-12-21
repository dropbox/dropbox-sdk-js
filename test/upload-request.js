/* eslint-env mocha */
var Promise = require('es6-promise').Promise;
var chai = require('chai');
var request = require('superagent');
var uploadRequest = require('../src/upload-request');
var sinon = require('sinon');

var assert = chai.assert;

describe('uploadRequest', function () {
  var stubRequest;
  var postStub;
  var endStub;
  var setStub;
  var typeStub;
  var sendStub;

  beforeEach(function () {
    stubRequest = {
      end: function () {},
      send: function () {},
      set: function () {},
      type: function () {}
    };
    postStub = sinon.stub(request, 'post').returns(stubRequest);
    endStub = sinon.stub(stubRequest, 'end').returns(stubRequest);
    setStub = sinon.stub(stubRequest, 'set').returns(stubRequest);
    typeStub = sinon.stub(stubRequest, 'type').returns(stubRequest);
    sendStub = sinon.stub(stubRequest, 'send').returns(stubRequest);
  });

  afterEach(function () {
    postStub.restore();
  });

  it('returns a promise', function () {
    assert.instanceOf(
      uploadRequest('path', {}, 'user', 'content', 'atoken'),
      Promise
    );
  });

  it('posts to the correct url', function () {
    uploadRequest('files/upload', { foo: 'bar' }, 'user', 'content', 'atoken');
    assert(postStub.calledOnce);
    assert.equal('https://content.dropboxapi.com/2/files/upload', postStub.firstCall.args[0]);
  });

  it('sets the request type to application/octet-stream', function () {
    uploadRequest('files/upload', { foo: 'bar' }, 'user', 'content', 'atoken');
    assert(typeStub.calledOnce);
    assert.equal('application/octet-stream', typeStub.firstCall.args[0]);
  });


  it('sets the authorization header', function () {
    uploadRequest('files/upload', { foo: 'bar' }, 'user', 'content', 'atoken');
    assert(setStub.calledTwice);
    assert.equal('Authorization', setStub.firstCall.args[0]);
    assert.equal('Bearer atoken', setStub.firstCall.args[1]);
  });

  it('sets the authorization and select user headers if selectUser set', function () {
    uploadRequest('files/upload', { foo: 'bar' }, 'user', 'content', 'atoken', 'selectedUserId');
    assert(setStub.calledThrice);
    assert.equal('Authorization', setStub.firstCall.args[0]);
    assert.equal('Bearer atoken', setStub.firstCall.args[1]);
    assert.equal('Dropbox-API-Select-User', setStub.thirdCall.args[0]);
    assert.equal('selectedUserId', setStub.thirdCall.args[1]);
  });

  it('sets the Dropbox-API-Arg header', function () {
    uploadRequest('files/upload', { foo: 'bar' }, 'user', 'content', 'atoken');
    assert(setStub.calledTwice);
    assert.equal('Dropbox-API-Arg', setStub.secondCall.args[0]);
    assert.equal(JSON.stringify({ foo: 'bar' }), setStub.secondCall.args[1]);
  });

  it('escapes special characters in the Dropbox-API-Arg header', function () {
    uploadRequest('files/upload', { foo: 'bar单bazá' }, 'user', 'content', 'atoken');
    assert(setStub.calledTwice);
    assert.equal('Dropbox-API-Arg', setStub.secondCall.args[0]);
    assert.equal('{"foo":"bar\\u5355baz\\u00e1"}', setStub.secondCall.args[1]);
  });

  it('doesn\'t include args.contents in the Dropbox-API-Arg header', function () {
    uploadRequest('files/upload', { foo: 'bar', contents: 'fakecontents' }, 'user', 'content', 'atoken');
    assert(setStub.calledTwice);
    assert.equal('Dropbox-API-Arg', setStub.secondCall.args[0]);
    assert.equal(JSON.stringify({ foo: 'bar' }), setStub.secondCall.args[1]);
  });

  it('sends the contents arg as the body of the request', function () {
    uploadRequest('files/upload', { foo: 'bar', contents: 'fakecontents' }, 'user', 'content', 'atoken');
    assert(sendStub.calledOnce);
    assert.equal('fakecontents', sendStub.firstCall.args[0]);
    // assert.equal(JSON.stringify({ foo: 'bar' }), setStub.secondCall.args[1]);
  });

  it('sets the response handler function', function () {
    uploadRequest('files/upload', { foo: 'bar' }, 'user', 'content', 'atoken');
    assert(endStub.calledOnce);
    assert.isFunction(endStub.firstCall.args[0]);
  });
});
