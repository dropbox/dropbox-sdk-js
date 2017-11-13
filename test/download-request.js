import { assert } from 'chai';
import { resolve } from 'path';
import fetchMock from 'fetch-mock';
import { createReadStream } from 'fs';
import { downloadRequest } from '../src/download-request';

fetchMock.configure({sendAsJson: false});

describe('downloadRequest', function () {

  beforeEach(function () {
    fetchMock.mock('*', new Response(
      createReadStream(resolve(__dirname, './file.txt')),
      {
        status : 200 ,
        statusText : "OK",
        headers: {
          'Content-Type': 'application/octet-stream',
          'dropbox-api-result': '{"test":"json"}'
        }
      }
    ));
  });

  afterEach(function () {
    fetchMock.restore();
  });

  it('returns a promise', function () {
    assert.instanceOf(
      downloadRequest('path', {}, 'user', 'content', 'atoken'),
      Promise
    );
  });

  it('posts to the correct url', function (done) {
    downloadRequest('sharing/get_shared_link_file', { foo: 'bar' }, 'user', 'content', 'atoken')
      .then((data) => {
        assert.equal(fetchMock.calls().matched.length, 1);
        assert.equal(fetchMock.lastUrl(), 'https://content.dropboxapi.com/2/sharing/get_shared_link_file');
        done();
      }, done);
  });

  // This is just what the API wants...
  it('the request type is not set', function (done) {
    downloadRequest('sharing/get_shared_link_file', { foo: 'bar' }, 'user', 'content', 'atoken')
      .then((data) => {
        assert.isUndefined(fetchMock.lastOptions().headers['Content-Type']);
        done();
      }, done);

  });

  it('sets the authorization header', function (done) {
    downloadRequest('sharing/get_shared_link_file', { foo: 'bar' }, 'user', 'content', 'atoken')
      .then((data) => {
        assert.equal(fetchMock.lastOptions().headers['Authorization'], 'Bearer atoken');
        done();
      }, done);
  });

  it('sets the authorization and select user headers if selectUser set', function (done) {
    downloadRequest('sharing/create_shared_link', { foo: 'bar' }, 'user', 'content', 'atoken', {selectUser: 'selectedUserId'})
      .then((data) => {
        assert.equal(fetchMock.lastOptions().headers['Authorization'], 'Bearer atoken');
        assert.equal(fetchMock.lastOptions().headers['Dropbox-API-Select-User'], 'selectedUserId');
        done();
      }, done);
  });

  it('sets the Dropbox-API-Arg header', function (done) {
    downloadRequest('sharing/create_shared_link', { foo: 'bar' }, 'user', 'content', 'atoken')
    .then((data) => {
      assert.equal(fetchMock.lastOptions().headers['Authorization'], 'Bearer atoken');
      assert.equal(fetchMock.lastOptions().headers['Dropbox-API-Arg'], JSON.stringify({ foo: 'bar' }));
      done();
    }, done);
  });

  it('escapes special characters in the Dropbox-API-Arg header', function (done) {
    downloadRequest('sharing/create_shared_link', { foo: 'bar单bazá' }, 'user', 'content', 'atoken')
    .then((data) => {
      assert.equal(fetchMock.lastOptions().headers['Authorization'], 'Bearer atoken');
      assert.equal(fetchMock.lastOptions().headers['Dropbox-API-Arg'], '{"foo":"bar\\u5355baz\\u00e1"}');
      done();
    }, done);
  });

  it('returns a valid response', function (done) {
    downloadRequest('sharing/create_shared_link', { foo: 'bar' }, 'user', 'content', 'atoken')
      .then((data) => {
        assert.equal(data.fileBinary, 'Some empty text\n')
        done();
      }, done);
  });
});
