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

    it('parses a standards-compliant response as a Buffer', () => {
      const init = {
        status: 200,
        headers: {
          'dropbox-api-result': httpHeaderSafeJson({ name: 'test.bin' }),
        },
      };
      const response = new global.Response(Buffer.from([0, 1, 255]), init);

      return parseDownloadResponse(response).then((parsedResponse) => {
        chai.assert.isTrue(Buffer.isBuffer(parsedResponse.result.fileBinary));
        chai.assert.deepEqual([...parsedResponse.result.fileBinary], [0, 1, 255]);
      });
    });

    it('propagates errors while reading the download body', () => {
      const response = {
        ok: true,
        status: 200,
        headers: {
          get: () => httpHeaderSafeJson({ name: 'test.bin' }),
        },
        arrayBuffer: () => Promise.reject(new Error('body read failed')),
      };

      return chai.assert.isRejected(
        parseDownloadResponse(response),
        Error,
        'body read failed',
      );
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
