import chai from 'chai';

import { DropboxResponse } from '../../src/response.js';

describe('DropboxResponse', () => {
  describe('Status', () => {
    it('can be set in the constructor', () => {
      const response = new DropboxResponse(200, {}, {});
      chai.assert.equal(response.status, 200);
    });
  });

  describe('Headers', () => {
    it('can be set in the constructor', () => {
      const response = new DropboxResponse(200, {}, {});
      chai.assert.deepEqual(response.headers, {});
    });
  });

  describe('Result', () => {
    it('can be set in the constructor', () => {
      const response = new DropboxResponse(200, {}, {});
      chai.assert.deepEqual(response.result, {});
    });
  });
});
