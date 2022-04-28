import chai from 'chai';
import {
  baseApiUrl,
  getTokenExpiresAtDate,
  isWindowOrWorker,
  OAuth2AuthorizationUrl,
  OAuth2TokenUrl,
  isWorkerEnv,
} from '../../src/utils.js';

describe('Dropbox utils', () => {
  describe('baseApiUrl', () => {
    it('correctly sets base url when domainDelimiter is empty', () => {
      const host = 'api';
      const domain = 'mydomain.com';
      const testUrl = baseApiUrl(host, domain, '');
      chai.assert.equal(testUrl, 'https://mydomain.com/2/');
    });

    it('correctly sets base url when provided a subdomain', () => {
      const host = 'test';
      const testUrl = baseApiUrl(host);
      chai.assert.equal(testUrl, 'https://test.dropboxapi.com/2/');
    });

    it('correctly sets base url when provided a subdomain and domain', () => {
      const host = 'test';
      const domain = 'mydomain.com';
      const testUrl = baseApiUrl(host, domain);
      chai.assert.equal(testUrl, 'https://test.mydomain.com/2/');
    });
  });

  it('correctly sets base url when provided a normal subdomain and domain', () => {
    const host = 'api';
    const domain = 'mydomain.com';
    const testUrl = baseApiUrl(host, domain);
    chai.assert.equal(testUrl, 'https://api-mydomain.com/2/');
  });
});

describe('OAuth2AuthorizationUrl', () => {
  it('correctly returns the authorization url when not provided an override', () => {
    const testUrl = OAuth2AuthorizationUrl();
    chai.assert.equal(testUrl, 'https://dropbox.com/oauth2/authorize');
  });

  it('correctly returns the authorization url when provided an override', () => {
    const domain = 'mydomain.com';
    const testUrl = OAuth2AuthorizationUrl(domain);
    chai.assert.equal(testUrl, 'https://meta-mydomain.com/oauth2/authorize');
  });
});

describe('OAuth2TokenUrl', () => {
  it('correctly returns the authorization url when not provided an override', () => {
    const testUrl = OAuth2TokenUrl();
    chai.assert.equal(testUrl, 'https://api.dropboxapi.com/oauth2/token');
  });

  it('correctly returns the authorization url when provided an override', () => {
    const domain = 'mydomain.com';
    const testUrl = OAuth2TokenUrl(domain);
    chai.assert.equal(testUrl, 'https://api-mydomain.com/oauth2/token');
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

describe('isWorkerEnv', () => {
  it('returns false when not running in a service worker env', () => {
    chai.assert.isFalse(isWorkerEnv());
  });
});
