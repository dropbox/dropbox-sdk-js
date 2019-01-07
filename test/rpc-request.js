import 'babel-polyfill';
import sinon from 'sinon';
import { assert } from 'chai';
import FetchMock from 'fetch-mock';
import isomorphicFetch from 'isomorphic-fetch'; // fetchMock needs this in scope to mock correctly.
import { rpcRequest } from '../src/rpc-request';

describe('rpcRequest', function () {

  let fetchMock;
  beforeEach(function () {
    fetchMock = FetchMock.sandbox().mock('*', new Response(
      '{"test": "test"}',
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

  it('returns an error when no auth given', function () {
    assert.throws(
      rpcRequest(fetchMock),
      Error
    );
  });

  it('returns a promise when given valid arguments', function () {
    assert.instanceOf(
      rpcRequest(fetchMock)('files/list', { foo: 'bar' }, 'user', 'api', 'atoken'),
      Promise
    );
  });

  it('posts to the correct url once', function (done) {
    rpcRequest(fetchMock)('files/list', { foo: 'bar' }, 'user', 'api', 'atoken')
      .then(res => {
        assert.equal(fetchMock.calls().matched.length, 1);
        assert.equal(fetchMock.lastUrl(), 'https://api.dropboxapi.com/2/files/list');
        done();
      }, done);
  });

  it('sets the request type to application/json', function (done) {
    rpcRequest(fetchMock)('files/list', { foo: 'bar' }, 'user', 'api', 'atoken')
      .then((res) => {
        assert.equal(fetchMock.lastOptions().headers['Content-Type'], 'application/json');
        done();
      });
  });

  it('sets the authorization header', function (done) {
    rpcRequest(fetchMock)('files/list', { foo: 'bar' }, 'user', 'api', 'atoken')
      .then((res) => {
        assert.equal(fetchMock.lastOptions().headers['Authorization'], 'Bearer atoken');
        done();
      });
  });

  it('sets the authorization and select user headers if selectUser set', function (done) {
    rpcRequest(fetchMock)('files/list', { foo: 'bar' }, 'user', 'api', 'atoken', {selectUser: 'selectedUserId'})
      .then((res) => {
        assert.equal(fetchMock.lastOptions().headers['Authorization'], 'Bearer atoken');
        assert.equal(fetchMock.lastOptions().headers['Dropbox-API-Select-User'], 'selectedUserId');
        done();
      });
  });

  it('sets the request body', function (done) {
    rpcRequest(fetchMock)('files/list', { foo: 'bar' }, 'user', 'api', 'atoken')
      .then((res) => {
        assert.equal(fetchMock.lastOptions().body, JSON.stringify({ foo: 'bar' }));
        done();
      });
  });

  it('sets the request body to null if body isn\'t passed', function (done) {
    rpcRequest(fetchMock)('files/list', undefined, 'user', 'api', 'atoken')
      .then((res) => {
        assert.deepEqual(fetchMock.lastOptions().body, null);
        done();
      });
  });

  it('sets Dropbox-Api-Path-Root header if pathRoot set', function (done) {
    rpcRequest(fetchMock)('files/list', { foo: 'bar' }, 'user', 'api', 'atoken', { pathRoot: 'selectedPathRoot' })
      .then((data) => {
        assert.equal(fetchMock.lastOptions().headers['Dropbox-API-Path-Root'], 'selectedPathRoot');
        done();
      }, done);
  });

});
