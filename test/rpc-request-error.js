import sinon from 'sinon';
import { assert } from 'chai';
import FetchMock from 'fetch-mock';
import isomorphicFetch from 'isomorphic-fetch'; // fetchMock needs this in scope to mock correctly.
import { rpcRequest } from '../src/rpc-request';

var exampleErr = {
  error_summary: 'other/...',
  error: {
    '.tag': 'other'
  }
};

describe('rpcRequest error', function () {

  afterEach(function () {
    FetchMock.restore();
  });

  it('handles errors in expected format', function (done) {

    const fetchMock = FetchMock.sandbox().mock('*', function () {
      return {
        status: 500,
        body: JSON.stringify(exampleErr),
        headers: {
          'Content-Type': 'application/json',
        },
      };
    }).catch(500);

    rpcRequest(fetchMock)('files/list', { foo: 'bar' }, 'user', 'api', 'atoken')
      .then(function (data) {
        done(new Error('shouldn’t reach this callback'));
      })
      .catch(function (err) {
        assert(err);
        assert.equal(err.status, 500);
        assert.deepEqual(err.error, exampleErr);
        done();
      });
  });

  it('handles errors when json cannot be parsed', function (done) {

    const fetchMock = FetchMock.sandbox().mock('*', function () {
      return {
        status: 500,
        body: 'not json'
      };
    }).catch(500);

    rpcRequest(fetchMock)('files/list', { foo: 'bar' }, 'user', 'api', 'atoken')
      .then(function (data) {
        done(new Error('shouldn’t reach this callback'));
      })
      .catch(function (err) {
        assert(err);
        assert.equal(err.status, 500);
        assert.deepEqual(err.error, 'not json');
        done();
      });
  });
});
