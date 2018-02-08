import sinon from 'sinon';
import { assert } from 'chai';

import { RPC } from '../src/constants';
import { Dropbox } from '../src/dropbox';

describe('Dropbox', () => {
  /** @type {Dropbox} */
  let dbx;
  describe('api method', () => {
    it('filesListFolder calls Dropbox.request', () => {
      let requestSpy;
      dbx = new Dropbox();
      requestSpy = sinon.spy(dbx, 'request');
      dbx.filesListFolder({});
      assert(requestSpy.calledOnce);
      assert.equal('files/list_folder', dbx.request.getCall(0).args[0]);
      assert.deepEqual({}, dbx.request.getCall(0).args[1]);
      assert.equal('user', dbx.request.getCall(0).args[2]);
      assert.equal('api', dbx.request.getCall(0).args[3]);
      assert.equal(RPC, dbx.request.getCall(0).args[4]);
    });
  });

  // describe('Upload from read stream', () => {
  //   let readStream;
  //   /** @type {FilesCommitInfo} */
  //   const fileCommitInfo = {
  //     mode: 'add',
  //     path: '/fileFromStream',
  //     contents: null,
  //     mute: true,
  //     autorename: true,
  //   };
  //
  //   before(() => {
  //     readStream = fs.createReadStream(__filename);
  //   });
  //
  //   it('should be able to upload from stream', (done) => {
  //     dbx.filesUploadFromReadStream(fileCommitInfo, readStream).then((fileMetada) => {
  //       console.log(fileMetada);
  //       done();
  //     }, console.error);
  //   });
  // });
});
