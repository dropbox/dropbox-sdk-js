import fs from 'fs/promises';
import path from 'path';

import chai from 'chai';

import { Dropbox } from '../../index.js';
import { DropboxResponse } from '../../src/response.js';

describe('User', () => {
  const dbx = new Dropbox({ accessToken: process.env.DROPBOX_TOKEN });

  describe('rpc', () => {
    it('rpc request is successful', (done) => {
      dbx.usersGetCurrentAccount()
        .then((resp) => {
          chai.assert.instanceOf(resp, DropboxResponse);
          chai.assert.equal(resp.status, 200, resp.result);
          chai.assert.isObject(resp.result);

          done();
        })
        .catch(done);
    });
  });

  describe('download', () => {
    it('download request is successful', (done) => {
      dbx.sharingGetSharedLinkFile({ url: process.env.DROPBOX_SHARED_LINK })
        .then((resp) => {
          chai.assert.instanceOf(resp, DropboxResponse);
          chai.assert.equal(resp.status, 200, resp.result);
          chai.assert.isObject(resp.result);

          chai.assert.isString(resp.result.name);
          chai.assert.isDefined(resp.result.fileBinary);

          done();
        })
        .catch(done);
    });
  });

  describe('upload', () => {
    it('upload request is successful', (done) => {
      fs.readFile(path.resolve('test/fixtures/test.txt'), 'utf8')
        .then((contents) => {
          dbx.filesUpload({ path: '/test.txt', contents })
            .then((resp) => {
              chai.assert.instanceOf(resp, DropboxResponse);
              chai.assert.equal(resp.status, 200, resp.result);
              chai.assert.isObject(resp.result);

              done();
            })
            .catch(done);
        });
    });
  });
});
