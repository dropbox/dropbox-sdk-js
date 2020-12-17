import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { Response } from 'node-fetch';
import { httpHeaderSafeJson } from '../../src/utils';
import {
  DropboxResponse,
  parseResponse,
  parseDownloadResponse,
} from '../../src/response.js';
import { DropboxResponseError } from '../../src/error.js';

chai.use(chaiAsPromised);
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

  describe('parseResponse', () => {
    it('correctly parses the response', () => {
      const init = {
        status: 200,
      };
      const response = new Response(undefined, init);
      return chai.assert.isFulfilled(parseResponse(response));
    });

    it('throws an error when not a 200 status code', () => {
      const statusArray = [300, 400, 500];
      for (const status of statusArray) {
        const init = {
          status,
        };
        const response = new Response(undefined, init);
        chai.assert.isRejected(parseResponse(response), DropboxResponseError);
      }
    });
  });

  describe('parseDownloadResponse', () => {
    it('correctly parses the response', () => {
      const init = {
        status: 200,
        headers: {
          'dropbox-api-result': httpHeaderSafeJson({ fileBinary: 'test' }),
        },
      };
      const response = new Response(undefined, init);
      return chai.assert.isFulfilled(parseDownloadResponse(response));
    });

    it('throws an error when not a 200 status code', () => {
      const statusArray = [300, 400, 500];
      for (const status of statusArray) {
        const init = {
          status,
        };
        const response = new Response(undefined, init);
        chai.assert.isRejected(parseDownloadResponse(response), DropboxResponseError);
      }
    });
  });
});
