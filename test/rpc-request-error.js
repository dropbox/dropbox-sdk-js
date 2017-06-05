import sinon from 'sinon';
import { assert } from 'chai';
import fetchMock from 'fetch-mock';
import { rpcRequest } from '../src/rpc-request';

var exampleErr = {
  error_summary: 'other/...',
  error: {
    '.tag': 'other'
  }
};

describe('rpcRequest error', function () {

  afterEach(function () {
    fetchMock.restore();
  });

  it('handles errors in expected format', function (done) {

    fetchMock.mock('*', function () {
      return {
        status: 500,
        body: JSON.stringify(exampleErr)
      };
    }).catch(500);

    rpcRequest('files/list', { foo: 'bar' }, 'user', 'api', 'atoken')
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

    fetchMock.mock('*', function () {
      return {
        status: 500,
        body: 'not json'
      };
    }).catch(500);

    rpcRequest('files/list', { foo: 'bar' }, 'user', 'api', 'atoken')
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
