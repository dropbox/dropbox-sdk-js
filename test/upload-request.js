import { assert } from 'chai';
import FetchMock from 'fetch-mock';
import isomorphicFetch from 'isomorphic-fetch'; // fetchMock needs this in scope to mock correctly.
import { uploadRequest } from '../src/upload-request';

describe('uploadRequest', function () {

  let fetchMock;
  beforeEach(function () {
    fetchMock = FetchMock.sandbox().post('*', new Response(
      '{"foo": "bar"}',
      {
        status: 200,
        statusText: "OK",
        headers: {
          'Content-Type': 'application/json',
          'dropbox-api-result': '{"test":"json"}'
        }
      }
    ));
  });

  afterEach(function () {
    FetchMock.restore();
  });

  it('returns a promise', function () {
    assert.instanceOf(
      uploadRequest(fetchMock)('path', {}, 'user', 'content', 'atoken'),
      Promise
    );
  });

  it('posts to the correct url', function (done) {
    uploadRequest(fetchMock)('files/upload', { foo: 'bar' }, 'user', 'content', 'atoken')
      .then(() => {
        assert.equal(fetchMock.calls().matched.length, 1);
        assert.equal(fetchMock.lastUrl(), 'https://content.dropboxapi.com/2/files/upload');
        done();
      }, done);
  });

  it('sets the request type to application/octet-stream', function (done) {
    uploadRequest(fetchMock)('files/upload', { foo: 'bar' }, 'user', 'content', 'atoken')
      .then(() => {
        assert.equal(fetchMock.lastOptions().headers['Content-Type'], 'application/octet-stream');
        done();
      }, done);
  });

  it('sets the authorization header', function (done) {
    uploadRequest(fetchMock)('files/upload', { foo: 'bar' }, 'user', 'content', 'atoken')
      .then((data) => {
        assert.equal(fetchMock.lastOptions().headers['Authorization'], 'Bearer atoken');
        done();
      }, done);
  });

  it('sets the authorization and select user headers if selectUser set', function (done) {
    uploadRequest(fetchMock)('files/upload', { foo: 'bar' }, 'user', 'content', 'atoken', {selectUser: 'selectedUserId'})
      .then((data) => {
        assert.equal(fetchMock.lastOptions().headers['Authorization'], 'Bearer atoken');
        assert.equal(fetchMock.lastOptions().headers['Dropbox-API-Select-User'], 'selectedUserId');
        done();
      }, done);
  });

  it('sets the Dropbox-API-Arg header', function (done) {
    uploadRequest(fetchMock)('files/upload', { foo: 'bar' }, 'user', 'content', 'atoken')
      .then((data) => {
        assert.equal(fetchMock.lastOptions().headers['Authorization'], 'Bearer atoken');
        assert.equal(fetchMock.lastOptions().headers['Dropbox-API-Arg'], JSON.stringify({ foo: 'bar' }));
        done();
      }, done);
  });

  it('escapes special characters in the Dropbox-API-Arg header', function (done) {
    uploadRequest(fetchMock)('files/upload', { foo: 'bar单bazá' }, 'user', 'content', 'atoken')
      .then((data) => {
        assert.equal(fetchMock.lastOptions().headers['Authorization'], 'Bearer atoken');
        assert.equal(fetchMock.lastOptions().headers['Dropbox-API-Arg'], '{"foo":"bar\\u5355baz\\u00e1"}');
        done();
      }, done);
  });



  it('doesn\'t include args.contents in the Dropbox-API-Arg header', function (done) {
    uploadRequest(fetchMock)('files/upload', { foo: 'bar', contents: 'fakecontents' }, 'user', 'content', 'atoken')
      .then((data) => {
        assert.equal(fetchMock.lastOptions().headers['Dropbox-API-Arg'], JSON.stringify({ foo: 'bar' }));
        done();
      }, done);
  });

  it('returns a valid response', function (done) {
    uploadRequest(fetchMock)('files/upload', { foo: 'bar' }, 'user', 'content', 'atoken')
      .then((data) => {
        assert.deepEqual(data, { foo: 'bar' })
        done();
      }, done);
  });

  it('sets Dropbox-Api-Path-Root header if pathRoot set', function (done) {
    uploadRequest(fetchMock)('files/upload', { foo: 'bar' }, 'user', 'content', 'atoken', {pathRoot: 'selectedPathRoot'})
      .then((data) => {
        assert.equal(fetchMock.lastOptions().headers['Dropbox-API-Path-Root'], 'selectedPathRoot');
        done();
      }, done);
  });

});
