import { fail } from 'assert';
import chai from 'chai';
import {
  getBaseURL,
  getTokenExpiresAtDate,
  isWindowOrWorker,
} from '../../src/utils.js';

describe('Dropbox utils', () => {
  describe('getBaseUrl', () => {
    it('correctly sets base url when provided a host', () => {
      const host = 'test';
      const testUrl = getBaseURL(host);
      chai.assert.equal(testUrl, 'https://test.dropboxapi.com/2/');
    });
  });

  describe('getTokenExpiresAtDate', () => {
    it('correctly sets when the token will expire', () => {
      const expirationTime = 600;
      const currentDate = new Date(Date.now());
      const expiresDate = getTokenExpiresAtDate(expirationTime);
      // adding a buffer of 100ms to expiration time
      chai.assert.isTrue((expiresDate - currentDate) / 1000 <= (expirationTime + 100));
    });
  });

  describe('isWindowOrWorker', () => {
    it('returns false when not window or of type WorkerGlobalScope', () => {
      const testEnv = isWindowOrWorker();
      chai.assert.isFalse(testEnv);
    });
  });
});
