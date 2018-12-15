import { assert } from 'chai';
import { resolve } from 'path';
import FetchMock from 'fetch-mock';
import { createReadStream } from 'fs';
import isomorphicFetch from 'isomorphic-fetch'; // fetchMock needs this in scope to mock correctly.
import { downloadRequest } from '../src/download-request';

FetchMock.configure({sendAsJson: false});

describe('downloadRequest', function () {

  let fetchMock;
  beforeEach(function () {
    fetchMock = FetchMock.sandbox().mock('*', new Response(
      createReadStream(resolve(__dirname, './file.txt')),
      {
        status: 200,
        statusText: "OK",
        headers: {
          'Content-Type': 'application/octet-stream',
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
      downloadRequest(fetchMock)('path', {}, 'user', 'content', 'atoken'),
      Promise
    );
  });

  it('posts to the correct url', function (done) {
    downloadRequest(fetchMock)('sharing/get_shared_link_file', { foo: 'bar' }, 'user', 'content', 'atoken')
      .then((data) => {
        assert.equal(fetchMock.calls().matched.length, 1);
        assert.equal(fetchMock.lastUrl(), 'https://content.dropboxapi.com/2/sharing/get_shared_link_file');
        done();
      }, done).catch(console.error);
  });

  // This is just what the API wants...
  it('the request type is not set', function (done) {
    downloadRequest(fetchMock)('sharing/get_shared_link_file', { foo: 'bar' }, 'user', 'content', 'atoken')
      .then((data) => {
        assert.isUndefined(fetchMock.lastOptions().headers['Content-Type']);
        done();
      }, done);

  });

  it('sets the authorization header', function (done) {
    downloadRequest(fetchMock)('sharing/get_shared_link_file', { foo: 'bar' }, 'user', 'content', 'atoken')
      .then((data) => {
        assert.equal(fetchMock.lastOptions().headers['Authorization'], 'Bearer atoken');
        done();
      }, done);
  });

  it('sets the authorization and select user headers if selectUser set', function (done) {
    downloadRequest(fetchMock)('sharing/create_shared_link', { foo: 'bar' }, 'user', 'content', 'atoken', {selectUser: 'selectedUserId'})
      .then((data) => {
        assert.equal(fetchMock.lastOptions().headers['Authorization'], 'Bearer atoken');
        assert.equal(fetchMock.lastOptions().headers['Dropbox-API-Select-User'], 'selectedUserId');
        done();
      }, done);
  });

  it('sets the Dropbox-API-Arg header', function (done) {
    downloadRequest(fetchMock)('sharing/create_shared_link', { foo: 'bar' }, 'user', 'content', 'atoken')
      .then((data) => {
        assert.equal(fetchMock.lastOptions().headers['Authorization'], 'Bearer atoken');
        assert.equal(fetchMock.lastOptions().headers['Dropbox-API-Arg'], JSON.stringify({ foo: 'bar' }));
        done();
      }, done);
  });

  it('escapes special characters in the Dropbox-API-Arg header', function (done) {
    downloadRequest(fetchMock)('sharing/create_shared_link', { foo: 'bar单bazá' }, 'user', 'content', 'atoken')
      .then((data) => {
        assert.equal(fetchMock.lastOptions().headers['Authorization'], 'Bearer atoken');
        assert.equal(fetchMock.lastOptions().headers['Dropbox-API-Arg'], '{"foo":"bar\\u5355baz\\u00e1"}');
        done();
      }, done);
  });

  it('returns a valid response', function (done) {
    downloadRequest(fetchMock)('sharing/create_shared_link', { foo: 'bar' }, 'user', 'content', 'atoken')
      .then((data) => {
        assert.equal(data.fileBinary, 'Some empty text\n')
        done();
      }, done);
  });

  it('sets Dropbox-Api-Path-Root header if pathRoot set', function (done) {
    downloadRequest(fetchMock)('sharing/create_shared_link', { foo: 'bar' }, 'user', 'content', 'atoken', {pathRoot: 'selectedPathRoot'})
      .then((data) => {
        assert.equal(fetchMock.lastOptions().headers['Dropbox-API-Path-Root'], 'selectedPathRoot');
        done();
      }, done);
  });

});
