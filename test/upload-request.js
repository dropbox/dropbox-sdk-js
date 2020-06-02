import { assert } from 'chai';
import FetchMock from 'fetch-mock';
import isomorphicFetch from 'isomorphic-fetch'; // fetchMock needs this in scope to mock correctly.
import { uploadRequest } from '../src/upload-request';
import {Dropbox} from "../src/dropbox";
import {rpcRequest} from "../src/rpc-request";

describe('uploadRequest', function () {

  let fetchMock;
  beforeEach(function () {
    fetchMock = FetchMock.sandbox().mock('begin:https://api.dropboxapi.com/oauth2/token', new Response(
      '{"access_token": "test", "expires_in": 14400}',
      {
        status: 200,
        statusText: "OK",
        headers: {
          'Content-Type': 'application/json',
          'dropbox-api-result': '{"test":"json"}'
        }
      }
    )).mock('*', new Response(
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

  let client;
  beforeEach(function() {
    let config = {
      clientId: "myclientId",
      clientSecret: "myClientSecret",
      accessToken: "mytoken",

    }
    client = new Dropbox(config);
  })

  afterEach(function () {
    FetchMock.restore();
  });

  it('returns a promise', function () {
    assert.instanceOf(
      uploadRequest(fetchMock)('path', {}, 'user', 'content', client),
      Promise
    );
  });

  it('posts to the correct url', function (done) {
    uploadRequest(fetchMock)('files/upload', { foo: 'bar' }, 'user', 'content', client)
      .then(() => {
        assert.equal(fetchMock.calls().matched.length, 1);
        assert.equal(fetchMock.lastUrl(), 'https://content.dropboxapi.com/2/files/upload');
        done();
      }, done);
  });

  it('attempts to refresh if there is no valid access token', function(done) {
    let refreshConfig = {
      fetch: fetchMock,
      clientId: "myclientId",
      clientSecret: "myClientSecret",
      refreshToken: "mytoken",

    }
    let refreshClient = new Dropbox(refreshConfig);
    uploadRequest(fetchMock)('files/list', { foo: 'bar' }, 'user', 'api', refreshClient)
      .then(res => {
        assert.equal(fetchMock.calls().matched.length, 2);
        assert.equal(fetchMock.lastUrl(), 'https://api.dropboxapi.com/2/files/list');
        done();
      }, done);
  });

  it('sets the request type to application/octet-stream', function (done) {
    uploadRequest(fetchMock)('files/upload', { foo: 'bar' }, 'user', 'content', client)
      .then(() => {
        assert.equal(fetchMock.lastOptions().headers['Content-Type'], 'application/octet-stream');
        done();
      }, done);
  });

  it('sets the authorization header', function (done) {
    uploadRequest(fetchMock)('files/upload', { foo: 'bar' }, 'user', 'content', client)
      .then((data) => {
        assert.equal(fetchMock.lastOptions().headers['Authorization'], 'Bearer mytoken');
        done();
      }, done);
  });

  it('sets the authorization and select user headers if selectUser set', function (done) {
    uploadRequest(fetchMock)('files/upload', { foo: 'bar' }, 'user', 'content', client, {selectUser: 'selectedUserId'})
      .then((data) => {
        assert.equal(fetchMock.lastOptions().headers['Authorization'], 'Bearer mytoken');
        assert.equal(fetchMock.lastOptions().headers['Dropbox-API-Select-User'], 'selectedUserId');
        done();
      }, done);
  });

  it('sets the Dropbox-API-Arg header', function (done) {
    uploadRequest(fetchMock)('files/upload', { foo: 'bar' }, 'user', 'content', client)
      .then((data) => {
        assert.equal(fetchMock.lastOptions().headers['Authorization'], 'Bearer mytoken');
        assert.equal(fetchMock.lastOptions().headers['Dropbox-API-Arg'], JSON.stringify({ foo: 'bar' }));
        done();
      }, done);
  });

  it('escapes special characters in the Dropbox-API-Arg header', function (done) {
    uploadRequest(fetchMock)('files/upload', { foo: 'bar单bazá' }, 'user', 'content', client)
      .then((data) => {
        assert.equal(fetchMock.lastOptions().headers['Authorization'], 'Bearer mytoken');
        assert.equal(fetchMock.lastOptions().headers['Dropbox-API-Arg'], '{"foo":"bar\\u5355baz\\u00e1"}');
        done();
      }, done);
  });



  it('doesn\'t include args.contents in the Dropbox-API-Arg header', function (done) {
    uploadRequest(fetchMock)('files/upload', { foo: 'bar', contents: 'fakecontents' }, 'user', 'content', client)
      .then((data) => {
        assert.equal(fetchMock.lastOptions().headers['Dropbox-API-Arg'], JSON.stringify({ foo: 'bar' }));
        done();
      }, done);
  });

  it('returns a valid response', function (done) {
    uploadRequest(fetchMock)('files/upload', { foo: 'bar' }, 'user', 'content', client)
      .then((data) => {
        assert.deepEqual(data, { foo: 'bar' })
        done();
      }, done);
  });

  it('sets Dropbox-Api-Path-Root header if pathRoot set', function (done) {
    uploadRequest(fetchMock)('files/upload', { foo: 'bar' }, 'user', 'content', client, {pathRoot: 'selectedPathRoot'})
      .then((data) => {
        assert.equal(fetchMock.lastOptions().headers['Dropbox-API-Path-Root'], 'selectedPathRoot');
        done();
      }, done);
  });

});
