import chai from 'chai';

import { Dropbox } from '../../index.js';
import { DropboxResponse } from '../../src/response.js';

describe('Team', () => {
  const dbx = new Dropbox({ accessToken: process.env.DROPBOX_TEAM_TOKEN });

  describe('rpc', () => {
    it('rpc request is successful', (done) => {
      dbx.teamGetInfo()
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
