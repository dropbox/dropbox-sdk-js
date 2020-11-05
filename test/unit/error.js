import chai from 'chai';

import { DropboxResponseError } from '../../src/error.js';

describe('DropboxResponseError', () => {
  describe('Error throwing', () => {
    it('can be caught with a try/catch', () => {
      try {
        throw new DropboxResponseError(400, {}, {});
      } catch (error) {
        chai.assert.isTrue(error instanceof DropboxResponseError);
        chai.assert.equal(error.status, 400);
        chai.assert.deepEqual(error.headers, {});
        chai.assert.deepEqual(error.error, {});
      }
    });

    it('can be caught in a promise reject', () => {
      new Promise((resolve, reject) => {
        reject(new DropboxResponseError(400, {}, {}));
      }).catch((error) => {
        chai.assert.isTrue(error instanceof DropboxResponseError);
        chai.assert.equal(error.status, 400);
        chai.assert.deepEqual(error.headers, {});
        chai.assert.deepEqual(error.error, {});
      });
    });

    it('can be caught if thrown in promise', () => {
      new Promise(() => {
        throw new DropboxResponseError(400, {}, {});
      }).catch((error) => {
        chai.assert.isTrue(error instanceof DropboxResponseError);
        chai.assert.equal(error.status, 400);
        chai.assert.deepEqual(error.headers, {});
        chai.assert.deepEqual(error.error, {});
      });
    });
  });

  describe('Message', () => {
    it('correctly formats message with response code', () => {
      const error = new DropboxResponseError(400, {}, {});
      chai.assert.equal(error.message, 'Response failed with a 400 code');
    });
  });

  describe('Name', () => {
    it('correctly sets name', () => {
      const error = new DropboxResponseError(400, {}, {});
      chai.assert.equal(error.name, 'DropboxResponseError');
    });
  });

  describe('Stack Trace', () => {
    it('is set in super', () => {
      const error = new DropboxResponseError(400, {}, {});
      chai.assert.exists(error.stack);
    });
  });

  describe('Status', () => {
    it('can be set in the constructor', () => {
      const error = new DropboxResponseError(400, {}, {});
      chai.assert.equal(error.status, 400);
    });
  });

  describe('Headers', () => {
    it('can be set in the constructor', () => {
      const error = new DropboxResponseError(400, {}, {});
      chai.assert.deepEqual(error.headers, {});
    });
  });

  describe('Error', () => {
    it('can be set in the constructor', () => {
      const error = new DropboxResponseError(400, {}, {});
      chai.assert.deepEqual(error.error, {});
    });
  });
});
