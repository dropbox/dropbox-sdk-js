import fs from 'fs';
import os from 'os';
import path from 'path';
import { expect } from 'chai';
import sinon from 'sinon';

import {
  DropboxFileUploader,
  bytesUpload,
  fileUpload,
  readerUpload,
  sizedReaderUpload,
} from '../../src/filetransfer.js';
import { DropboxResponse } from '../../src/response.js';
import { DropboxResponseError } from '../../src/error.js';

function client() {
  return {
    filesUploadSessionStart: sinon.stub().resolves(new DropboxResponse(200, {}, { session_id: 'session-1' })),
    filesUploadSessionAppendV2: sinon.stub().resolves(new DropboxResponse(200, {}, undefined)),
    filesUploadSessionFinish: sinon.stub().resolves(new DropboxResponse(200, {}, { name: 'file.bin', size: 0 })),
  };
}

function bytes(value) {
  return Buffer.from(value).toString('utf8');
}

async function streamBytes(stream) {
  const chunks = [];
  // eslint-disable-next-line no-restricted-syntax
  for await (const chunk of stream) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

describe('DropboxFileUploader', () => {
  it('uploads byte sources through a sequential session', async () => {
    const dbx = client();
    dbx.filesUploadSessionFinish.resolves(new DropboxResponse(200, {}, { name: 'data.bin' }));
    const progress = [];

    const result = await new DropboxFileUploader(dbx, {
      chunkSize: 4,
      progress: (value) => progress.push(value),
    }).upload(bytesUpload('abcdefghij'), { path: '/data.bin' });

    expect(result.metadata.name).to.equal('data.bin');
    expect(bytes(dbx.filesUploadSessionStart.firstCall.args[0].contents)).to.equal('');
    expect(bytes(dbx.filesUploadSessionAppendV2.firstCall.args[0].contents)).to.equal('abcd');
    expect(bytes(dbx.filesUploadSessionAppendV2.secondCall.args[0].contents)).to.equal('efgh');
    expect(bytes(dbx.filesUploadSessionFinish.firstCall.args[0].contents)).to.equal('ij');
    expect(progress).to.deep.equal([
      { bytesCommitted: 4, totalBytes: 10 },
      { bytesCommitted: 8, totalBytes: 10 },
      { bytesCommitted: 10, totalBytes: 10 },
    ]);
  });

  it('treats an already committed append as successful', async () => {
    const dbx = client();
    dbx.filesUploadSessionAppendV2.rejects(new DropboxResponseError(409, {}, {
      '.tag': 'incorrect_offset', correct_offset: 4,
    }));

    await new DropboxFileUploader(dbx, { chunkSize: 4, maxAttempts: 2 })
      .upload(bytesUpload('abcdef'), { path: '/data.bin' });

    expect(dbx.filesUploadSessionAppendV2.calledOnce).to.equal(true);
    expect(dbx.filesUploadSessionFinish.firstCall.args[0].cursor.offset).to.equal(4);
  });

  it('retries a finish with an empty body after its data was committed', async () => {
    const dbx = client();
    dbx.filesUploadSessionFinish.onFirstCall().rejects(new DropboxResponseError(409, {}, {
      '.tag': 'lookup_failed',
      lookup_failed: { '.tag': 'incorrect_offset', incorrect_offset: { correct_offset: 5 } },
    }));
    dbx.filesUploadSessionFinish.onSecondCall().resolves(new DropboxResponse(200, {}, { name: 'data.bin' }));
    const delays = [];

    await new DropboxFileUploader(dbx, {
      maxAttempts: 2,
      delay: (value) => { delays.push(value); return Promise.resolve(); },
    }).upload(bytesUpload('hello'), { path: '/data.bin' });

    expect(dbx.filesUploadSessionFinish.callCount).to.equal(2);
    expect(bytes(dbx.filesUploadSessionFinish.firstCall.args[0].contents)).to.equal('hello');
    expect(bytes(dbx.filesUploadSessionFinish.secondCall.args[0].contents)).to.equal('');
    expect(dbx.filesUploadSessionFinish.secondCall.args[0].cursor.offset).to.equal(5);
    expect(delays[0]).to.be.within(100, 200);
  });

  it('retries browser-style network failures but not arbitrary TypeErrors', async () => {
    const retryingClient = client();
    retryingClient.filesUploadSessionStart.onFirstCall().rejects(new TypeError('fetch failed'));
    const delays = [];

    await new DropboxFileUploader(retryingClient, {
      delay: (value) => { delays.push(value); return Promise.resolve(); },
    }).upload(bytesUpload('hello'), { path: '/retry.txt' });

    expect(retryingClient.filesUploadSessionStart.callCount).to.equal(2);
    expect(delays[0]).to.be.within(100, 200);

    const failingClient = client();
    failingClient.filesUploadSessionStart.rejects(new TypeError('invalid upload configuration'));
    try {
      await new DropboxFileUploader(failingClient).upload(bytesUpload('hello'), { path: '/failure.txt' });
      throw new Error('expected upload to fail');
    } catch (error) {
      expect(error.message).to.equal('invalid upload configuration');
    }
    expect(failingClient.filesUploadSessionStart.calledOnce).to.equal(true);
  });

  it('honors Retry-After and bounds jittered exponential retry delays', async () => {
    const rateLimitedClient = client();
    rateLimitedClient.filesUploadSessionStart.onFirstCall().rejects(
      new DropboxResponseError(429, { get: () => '7' }, 'rate limit'),
    );
    const rateLimitDelays = [];
    await new DropboxFileUploader(rateLimitedClient, {
      delay: (value) => { rateLimitDelays.push(value); return Promise.resolve(); },
    }).upload(bytesUpload('hello'), { path: '/rate-limit.txt' });
    expect(rateLimitDelays).to.deep.equal([7000]);

    const retryingClient = client();
    retryingClient.filesUploadSessionStart.rejects(new DropboxResponseError(503, {}, 'unavailable'));
    const delays = [];
    try {
      await new DropboxFileUploader(retryingClient, {
        maxAttempts: 7,
        delay: (value) => { delays.push(value); return Promise.resolve(); },
      }).upload(bytesUpload('hello'), { path: '/backoff.txt' });
      throw new Error('expected upload to fail');
    } catch (error) {
      expect(error.status).to.equal(503);
    }
    [
      [100, 200], [200, 400], [400, 800], [800, 1600], [1600, 3200], [2500, 5000],
    ].forEach(([minimum, maximum], index) => {
      expect(delays[index]).to.be.within(minimum, maximum);
    });
  });

  it('aborts upload retry backoff promptly', async () => {
    const dbx = client();
    dbx.filesUploadSessionStart.rejects(new DropboxResponseError(503, {}, 'unavailable'));
    const controller = new AbortController();
    const reason = new Error('cancelled');
    const upload = new DropboxFileUploader(dbx, {
      signal: controller.signal,
      maxAttempts: 2,
    }).upload(bytesUpload('hello'), { path: '/abort.txt' });
    setTimeout(() => controller.abort(reason), 0);

    try {
      await upload;
      throw new Error('expected upload to fail');
    } catch (error) {
      expect(error).to.equal(reason);
    }
    expect(dbx.filesUploadSessionStart.calledOnce).to.equal(true);
  });

  it('supports unknown-size one-shot streams', async () => {
    async function* stream() {
      yield Buffer.from('abc');
      yield Buffer.from('def');
    }
    const dbx = client();
    const updates = [];

    await new DropboxFileUploader(dbx, { chunkSize: 4, progress: (value) => updates.push(value) })
      .upload(readerUpload(stream()), { path: '/stream.bin' });

    expect(bytes(dbx.filesUploadSessionAppendV2.firstCall.args[0].contents)).to.equal('abcd');
    expect(bytes(dbx.filesUploadSessionFinish.firstCall.args[0].contents)).to.equal('ef');
    expect(updates).to.deep.equal([
      { bytesCommitted: 4, totalBytes: -1 },
      { bytesCommitted: 6, totalBytes: -1 },
    ]);
  });

  it('validates a declared stream size', async () => {
    async function* stream() { yield Buffer.from('abc'); }
    try {
      await new DropboxFileUploader(client()).upload(sizedReaderUpload(stream(), 5), { path: '/stream.bin' });
      throw new Error('expected upload to fail');
    } catch (error) {
      expect(error.message).to.contain('expected 5');
    }
  });

  it('uses a concurrent session for parallel ranged uploads', async () => {
    const dbx = client();
    const data = Buffer.alloc(8 * 1024 * 1024 + 1, 97);
    await new DropboxFileUploader(dbx, { parallelUploads: 2, chunkSize: 4 * 1024 * 1024 })
      .upload(bytesUpload(data), { path: '/parallel.bin' });

    expect(dbx.filesUploadSessionStart.firstCall.args[0].session_type).to.deep.equal({ '.tag': 'concurrent' });
    expect(dbx.filesUploadSessionAppendV2.callCount).to.equal(3);
    expect(dbx.filesUploadSessionAppendV2.thirdCall.args[0].close).to.equal(true);
    expect(dbx.filesUploadSessionFinish.firstCall.args[0].cursor.offset).to.equal(data.length);
    expect(bytes(dbx.filesUploadSessionFinish.firstCall.args[0].contents)).to.equal('');
  });

  it('treats parallelUploads below two as sequential', async () => {
    const dbx = client();
    await new DropboxFileUploader(dbx, { parallelUploads: 0 })
      .upload(bytesUpload('data'), { path: '/data.bin' });
    expect(dbx.filesUploadSessionStart.firstCall.args[0].session_type).to.equal(undefined);
  });

  it('rejects short ranged reads before sending them', async () => {
    const dbx = client();
    const source = { size: 3, read: async () => Buffer.from('ab') };
    try {
      await new DropboxFileUploader(dbx).upload(source, { path: '/short.bin' });
      throw new Error('expected upload to fail');
    } catch (error) {
      expect(error.message).to.contain('got 2 bytes, expected 3');
    }
    expect(dbx.filesUploadSessionFinish.called).to.equal(false);
  });

  it('opens local file sources independently for each range', async () => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'dropbox-filetransfer-'));
    const filePath = path.join(directory, 'data.bin');
    fs.writeFileSync(filePath, 'abcdef');
    const source = await fileUpload(filePath);
    expect(await streamBytes(await source.read(0, 3))).to.equal('abc');
    expect(await streamBytes(await source.read(3, 3))).to.equal('def');
  });
});
