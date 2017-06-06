import sinon from 'sinon';
import { assert } from 'chai';
import superagent from 'superagent';
import { rpcRequest } from '../src/rpc-request';


var exampleErr = {
  error_summary: 'other/...',
  error: {
    '.tag': 'other'
  }
};

describe('rpcRequest error', function () {
  var postStub;

  afterEach(function () {
    postStub.restore();
  });

  it('handles errors in expected format', function (done) {
    var stubRequest;

    stubRequest = {
      end: function (cb) {
        var err = new Error('Internal server error');
        err.status = 500;
        return cb(err, { text: JSON.stringify(exampleErr) });
      },
      send: function () {},
      set: function () {},
      type: function () {}
    };
    postStub = sinon.stub(superagent, 'post').returns(stubRequest);
    sinon.stub(stubRequest, 'send').returns(stubRequest);
    sinon.stub(stubRequest, 'set').returns(stubRequest);
    sinon.stub(stubRequest, 'type').returns(stubRequest);

    rpcRequest('files/list', { foo: 'bar' }, 'user', 'api', 'atoken')
      .then(function () {
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
    var stubRequest;

    stubRequest = {
      end: function (cb) {
        var err = new Error('Internal server error');
        err.status = 500;
        return cb(err, { text: 'not json' });
      },
      send: function () {},
      set: function () {},
      type: function () {}
    };
    postStub = sinon.stub(superagent, 'post').returns(stubRequest);
    sinon.stub(stubRequest, 'send').returns(stubRequest);
    sinon.stub(stubRequest, 'set').returns(stubRequest);
    sinon.stub(stubRequest, 'type').returns(stubRequest);

    rpcRequest('files/list', { foo: 'bar' }, 'user', 'api', 'atoken')
      .then(function () {
        done(new Error('shouldn’t reach this callback'));
      })
      .catch(function (err) {
        assert(err);
        assert.equal(err.status, 500);
        assert.equal(err.error, 'not json');
        done();
      });
  });
});
