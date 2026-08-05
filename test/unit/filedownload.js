import fs from 'fs';
import os from 'os';
import path from 'path';
import { Readable } from 'stream';
import { expect } from 'chai';
import sinon from 'sinon';

import {
  DropboxFileDownloader,
  downloadFile,
} from '../../src/filedownload.js';
import { contentHash } from '../../src/content-hasher.js';
import { DropboxResponseError } from '../../src/error.js';

function tempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'dropbox-filedownload-'));
}

function parseRange(header) {
  if (!header) {
    return null;
  }

  const match = /^bytes=(\d+)-(\d+)?$/.exec(header);
  const start = Number(match[1]);
  const end = match[2] === undefined ? null : Number(match[2]);

  return { start, end };
}

function contentRangeHeader(header, dataLength, totalSize) {
  const range = parseRange(header);
  if (!range) {
    return null;
  }

  const end = range.end === null
    ? range.start + dataLength - 1
    : range.end;

  return `bytes ${range.start}-${end}/${totalSize}`;
}

function downloadResponse(data, metadata = {}, range = null) {
  const body = typeof data === 'string' ? Buffer.from(data) : data;
  const fullMetadata = {
    name: 'file.bin',
    rev: 'rev1',
    size: body.length,
    ...metadata,
  };
  const headers = {
    'dropbox-api-result': JSON.stringify(fullMetadata),
  };
  if (range) {
    headers['content-range'] = contentRangeHeader(
      range,
      body.length,
      fullMetadata.size,
    );
  }

  return Promise.resolve(new Response(body, {
    status: range ? 206 : 200,
    headers,
  }));
}

function failingResponse(data, error) {
  const metadata = {
    name: 'file.bin',
    rev: 'rev1',
    size: 11,
  };
  let sent = false;
  const stream = new Readable({
    read() {
      if (!sent) {
        sent = true;
        this.push(Buffer.from(data));
        setTimeout(() => this.destroy(error), 10);
      }
    },
  });

  return Promise.resolve({
    ok: true,
    status: 200,
    headers: {
      get(header) {
        return header === 'dropbox-api-result'
          ? JSON.stringify(metadata)
          : null;
      },
    },
    body: Readable.toWeb(stream),
  });
}

function client(fetch) {
  return {
    auth: {
      checkAndRefreshAccessToken: sinon.stub().resolves(),
      getAccessToken: () => 'token',
    },
    fetch,
    setAuthHeaders(auth, fetchOptions) {
      fetchOptions.headers.Authorization = 'Bearer token';
    },
    setCommonHeaders() {},
  };
}

function fetchRange(options) {
  return options && options.headers && options.headers.Range;
}

function rangedDownloadResponse(data, metadata, options) {
  return downloadResponse(data, metadata, fetchRange(options));
}

function metadataResponse(metadata = {}) {
  return Promise.resolve({
    result: {
      name: 'file.bin',
      rev: 'rev1',
      size: 0,
      ...metadata,
    },
  });
}

describe('DropboxFileDownloader', () => {
  it('rejects invalid numeric options', () => {
    const dbx = client(sinon.stub());

    [
      { maxAttempts: 0 },
      { maxAttempts: 2.5 },
      { maxAttempts: Infinity },
      { maxAttempts: '2' },
      { parallelDownloads: 0 },
      { parallelDownloads: 2.5 },
      { parallelDownloads: Infinity },
      { parallelDownloads: '2' },
      { retryDelay: 0 },
      { retryDelay: 1.5 },
      { retryDelay: Infinity },
      { retryDelay: '1' },
      { timeout: 0 },
      { timeout: 1.5 },
      { timeout: Infinity },
      { timeout: '1' },
    ].forEach((options) => {
      expect(() => new DropboxFileDownloader(dbx, options)).to.throw(
        'must be a positive integer',
      );
    });
  });

  it('downloads a fresh file through the convenience helper', async () => {
    const dir = tempDir();
    const localPath = path.join(dir, 'file.bin');
    const fetch = sinon.stub().returns(downloadResponse('hello'));
    const dbx = client(fetch);

    const result = await downloadFile(dbx, '/file.bin', localPath);

    expect(fs.readFileSync(localPath, 'utf8')).to.equal('hello');
    expect(result.resumedFrom).to.equal(0);
    expect(fetchRange(fetch.firstCall.args[1])).to.equal(undefined);
    expect(fs.existsSync(`${localPath}.part`)).to.equal(false);
  });

  it('resumes from an existing part file with a range request', async () => {
    const dir = tempDir();
    const localPath = path.join(dir, 'file.bin');
    fs.writeFileSync(`${localPath}.part`, 'hello ');

    const fetch = sinon.stub().callsFake((url, options) => (
      rangedDownloadResponse('world', { size: 11 }, options)
    ));
    const dbx = client(fetch);

    const result = await new DropboxFileDownloader(dbx)
      .downloadFile('/file.bin', localPath);

    expect(fs.readFileSync(localPath, 'utf8')).to.equal('hello world');
    expect(result.resumedFrom).to.equal(6);
    expect(fetchRange(fetch.firstCall.args[1])).to.equal('bytes=6-');
    expect(fs.existsSync(`${localPath}.part`)).to.equal(false);
  });

  it('retries failed body reads and resumes from the part file', async () => {
    const dir = tempDir();
    const localPath = path.join(dir, 'file.bin');
    const fetch = sinon.stub();
    fetch.onFirstCall().returns(failingResponse('hello ', new Error('connection reset')));
    fetch.onSecondCall().callsFake((url, options) => (
      rangedDownloadResponse('world', { size: 11 }, options)
    ));
    const delays = [];
    const dbx = client(fetch);

    const result = await new DropboxFileDownloader(dbx, {
      delay: (ms) => {
        delays.push(ms);
        return Promise.resolve();
      },
    }).downloadFile('/file.bin', localPath);

    expect(fetch.callCount).to.equal(2);
    expect(delays).to.deep.equal([500]);
    expect(fetchRange(fetch.secondCall.args[1])).to.equal('bytes=6-');
    expect(fs.readFileSync(localPath, 'utf8')).to.equal('hello world');
    expect(result.resumedFrom).to.equal(6);
  });

  it('retries transient Dropbox responses with exponential backoff', async () => {
    const dir = tempDir();
    const localPath = path.join(dir, 'file.bin');
    const fetch = sinon.stub();
    fetch.onFirstCall().rejects(new DropboxResponseError(429, {}, 'rate limit'));
    fetch.onSecondCall().rejects(new DropboxResponseError(503, {}, 'unavailable'));
    fetch.onThirdCall().returns(downloadResponse('hello'));
    const delays = [];

    await new DropboxFileDownloader(client(fetch), {
      retryDelay: 10,
      delay: (ms) => {
        delays.push(ms);
        return Promise.resolve();
      },
    }).downloadFile('/file.bin', localPath);

    expect(fetch.callCount).to.equal(3);
    expect(delays).to.deep.equal([10, 20]);
    expect(fs.readFileSync(localPath, 'utf8')).to.equal('hello');
  });

  it('aborts during retry backoff without waiting for the delay', async () => {
    const dir = tempDir();
    const localPath = path.join(dir, 'file.bin');
    const fetch = sinon.stub().rejects(
      new DropboxResponseError(503, {}, 'unavailable'),
    );
    const controller = new AbortController();
    const abortReason = new Error('cancelled during backoff');
    const started = Date.now();
    const download = new DropboxFileDownloader(client(fetch), {
      maxAttempts: 2,
      retryDelay: 60000,
      signal: controller.signal,
    }).downloadFile('/file.bin', localPath);

    setTimeout(() => controller.abort(abortReason), 0);

    try {
      await download;
      throw new Error('expected download to fail');
    } catch (error) {
      expect(error).to.equal(abortReason);
    }

    expect(Date.now() - started).to.be.lessThan(1000);
    expect(fetch.callCount).to.equal(1);
  });

  it('does not retry deterministic Dropbox responses', async () => {
    const dir = tempDir();
    const localPath = path.join(dir, 'file.bin');
    const fetch = sinon.stub().rejects(
      new DropboxResponseError(403, {}, 'forbidden'),
    );

    try {
      await new DropboxFileDownloader(client(fetch))
        .downloadFile('/file.bin', localPath);
      throw new Error('expected download to fail');
    } catch (error) {
      expect(error).to.be.instanceOf(DropboxResponseError);
      expect(error.status).to.equal(403);
    }

    expect(fetch.callCount).to.equal(1);
  });

  it('does not retry non-transient server responses', async () => {
    const dir = tempDir();
    const localPath = path.join(dir, 'file.bin');
    const fetch = sinon.stub().rejects(
      new DropboxResponseError(501, {}, 'not implemented'),
    );

    try {
      await new DropboxFileDownloader(client(fetch))
        .downloadFile('/file.bin', localPath);
      throw new Error('expected download to fail');
    } catch (error) {
      expect(error).to.be.instanceOf(DropboxResponseError);
      expect(error.status).to.equal(501);
    }

    expect(fetch.callCount).to.equal(1);
  });

  it('rejects resumed downloads when the server ignores Range', async () => {
    const dir = tempDir();
    const localPath = path.join(dir, 'file.bin');
    fs.writeFileSync(`${localPath}.part`, 'hello ');
    const dbx = client(sinon.stub().returns(downloadResponse('hello world', {
      size: 11,
    })));

    try {
      await new DropboxFileDownloader(dbx, { maxAttempts: 1 })
        .downloadFile('/file.bin', localPath);
      throw new Error('expected download to fail');
    } catch (error) {
      expect(error.message).to.contain('expected 206');
    }

    expect(fs.existsSync(`${localPath}.part`)).to.equal(false);
    expect(fs.existsSync(localPath)).to.equal(false);
  });

  it('validates the final size and removes invalid part files', async () => {
    const dir = tempDir();
    const localPath = path.join(dir, 'file.bin');
    const dbx = client(sinon.stub().returns(downloadResponse('short', { size: 10 })));

    try {
      await new DropboxFileDownloader(dbx, { maxAttempts: 1 })
        .downloadFile('/file.bin', localPath);
      throw new Error('expected download to fail');
    } catch (error) {
      expect(error.message).to.contain('incomplete download');
    }

    expect(fs.existsSync(`${localPath}.part`)).to.equal(false);
    expect(fs.existsSync(localPath)).to.equal(false);
  });

  it('validates Dropbox content_hash metadata', async () => {
    const dir = tempDir();
    const localPath = path.join(dir, 'file.bin');
    const dbx = client(sinon.stub().returns(downloadResponse('hello', {
      content_hash: contentHash(Buffer.from('different')),
    })));

    try {
      await new DropboxFileDownloader(dbx, { maxAttempts: 1 })
        .downloadFile('/file.bin', localPath);
      throw new Error('expected download to fail');
    } catch (error) {
      expect(error.message).to.contain('content hash mismatch');
    }

    expect(fs.existsSync(`${localPath}.part`)).to.equal(false);
  });

  it('validates Dropbox content_hash without reading the whole file into memory', async () => {
    const dir = tempDir();
    const localPath = path.join(dir, 'file.bin');
    const payload = 'hello world';
    const dbx = client(sinon.stub().returns(downloadResponse(payload, {
      content_hash: contentHash(Buffer.from(payload)),
    })));
    const readFileSync = sinon.stub(fs, 'readFileSync').throws(
      new Error('unexpected whole-file read'),
    );

    try {
      await new DropboxFileDownloader(dbx)
        .downloadFile('/file.bin', localPath);
    } finally {
      readFileSync.restore();
    }

    expect(fs.readFileSync(localPath, 'utf8')).to.equal(payload);
  });

  it('does not retry content hash mismatches', async () => {
    const dir = tempDir();
    const localPath = path.join(dir, 'file.bin');
    const fetch = sinon.stub().returns(downloadResponse('hello', {
      content_hash: contentHash(Buffer.from('different')),
    }));

    try {
      await new DropboxFileDownloader(client(fetch))
        .downloadFile('/file.bin', localPath);
      throw new Error('expected download to fail');
    } catch (error) {
      expect(error.message).to.contain('content hash mismatch');
    }

    expect(fetch.callCount).to.equal(1);
  });

  it('reports cumulative progress', async () => {
    const dir = tempDir();
    const localPath = path.join(dir, 'file.bin');
    const updates = [];
    const dbx = client(sinon.stub().returns(downloadResponse('hello')));

    await new DropboxFileDownloader(dbx, {
      progress: (progress) => updates.push(progress),
    }).downloadFile('/file.bin', localPath);

    expect(updates).to.deep.equal([{
      bytesWritten: 5,
      totalBytes: 5,
      resumedFrom: 0,
    }]);
  });

  it('uses ranged requests for parallel fresh downloads', async () => {
    const dir = tempDir();
    const localPath = path.join(dir, 'file.bin');
    const payload = 'hello world';
    const fetch = sinon.stub().callsFake((url, options) => {
      const header = fetchRange(options);
      const match = /^bytes=(\d+)-(\d+)$/.exec(header);
      const start = Number(match[1]);
      const end = Number(match[2]);

      return rangedDownloadResponse(payload.slice(start, end + 1), {
        size: payload.length,
        content_hash: contentHash(Buffer.from(payload)),
      }, options);
    });
    const dbx = client(fetch);
    dbx.filesGetMetadata = sinon.stub().returns(metadataResponse({
      size: payload.length,
      content_hash: contentHash(Buffer.from(payload)),
    }));

    await new DropboxFileDownloader(dbx, { parallelDownloads: 3 })
      .downloadFile('/file.bin', localPath);

    expect(fs.readFileSync(localPath, 'utf8')).to.equal(payload);
    expect(dbx.filesGetMetadata.calledOnceWith(
      { path: '/file.bin' },
      { signal: undefined, timeout: undefined },
    )).to.equal(true);
    expect(fetch.getCalls().map((call) => fetchRange(call.args[1])).sort())
      .to.deep.equal([
        'bytes=0-3',
        'bytes=4-7',
        'bytes=8-10',
      ]);
  });

  it('downloads an empty file in parallel mode without a range request', async () => {
    const dir = tempDir();
    const localPath = path.join(dir, 'file.bin');
    const fetch = sinon.stub();
    const dbx = client(fetch);
    dbx.filesGetMetadata = sinon.stub().returns(metadataResponse({
      size: 0,
      content_hash: contentHash(Buffer.alloc(0)),
    }));

    const result = await new DropboxFileDownloader(dbx, { parallelDownloads: 2 })
      .downloadFile('/file.bin', localPath);

    expect(fs.existsSync(localPath)).to.equal(true);
    expect(fs.readFileSync(localPath)).to.have.length(0);
    expect(fetch.callCount).to.equal(0);
    expect(result.metadata.size).to.equal(0);
  });

  it('rejects a parallel range body that ends before the advertised length', async () => {
    const dir = tempDir();
    const localPath = path.join(dir, 'file.bin');
    const payload = 'hello world';
    const fetch = sinon.stub().callsFake((url, options) => {
      const header = fetchRange(options);
      const match = /^bytes=(\d+)-(\d+)$/.exec(header);
      const start = Number(match[1]);
      const end = Number(match[2]);

      const shouldTruncate = header === 'bytes=4-7';
      const data = shouldTruncate
        ? payload.slice(start, end)
        : payload.slice(start, end + 1);

      return rangedDownloadResponse(data, {
        size: payload.length,
      }, options);
    });
    const dbx = client(fetch);
    dbx.filesGetMetadata = sinon.stub().returns(metadataResponse({
      size: payload.length,
    }));

    try {
      await new DropboxFileDownloader(dbx, {
        maxAttempts: 1,
        parallelDownloads: 3,
      }).downloadFile('/file.bin', localPath);
      throw new Error('expected download to fail');
    } catch (error) {
      expect(error.message).to.contain(
        'range request body length mismatch: received 3 bytes, expected 4',
      );
    }

    expect(fs.existsSync(`${localPath}.part`)).to.equal(false);
    expect(fs.existsSync(localPath)).to.equal(false);
  });

  it('pins parallel retries to the first response revision', async () => {
    const dir = tempDir();
    const localPath = path.join(dir, 'file.bin');
    const payload = 'hello world';
    const fetch = sinon.stub().callsFake((url, options) => {
      const header = fetchRange(options);
      if (fetch.callCount === 1) {
        return rangedDownloadResponse(payload.slice(0, 1), {
          rev: 'rev1',
          size: payload.length,
          content_hash: contentHash(Buffer.from(payload)),
        }, options);
      }
      if (fetch.callCount <= 4) {
        throw new DropboxResponseError(503, {}, 'unavailable');
      }
      if (header === 'bytes=0-0') {
        return rangedDownloadResponse(payload.slice(0, 1), {
          rev: 'rev2',
          size: payload.length,
          content_hash: contentHash(Buffer.from(payload)),
        }, options);
      }
      throw new Error(`unexpected range ${header}`);
    });
    const dbx = client(fetch);
    dbx.filesGetMetadata = sinon.stub();
    dbx.filesGetMetadata.onFirstCall().returns(metadataResponse({
      rev: 'rev1',
      size: payload.length,
      content_hash: contentHash(Buffer.from(payload)),
    }));
    dbx.filesGetMetadata.onSecondCall().returns(metadataResponse({
      rev: 'rev2',
      size: payload.length,
      content_hash: contentHash(Buffer.from(payload)),
    }));

    try {
      await new DropboxFileDownloader(dbx, {
        parallelDownloads: 3,
        delay: () => Promise.resolve(),
      }).downloadFile('/file.bin', localPath);
      throw new Error('expected download to fail');
    } catch (error) {
      expect(error.message).to.contain(
        'remote file changed during retry: got rev "rev2", expected "rev1"',
      );
    }

    expect(fetch.getCalls().map((call) => fetchRange(call.args[1])))
      .to.deep.equal([
        'bytes=0-3',
        'bytes=4-7',
        'bytes=8-10',
      ]);
    expect(dbx.filesGetMetadata.callCount).to.equal(2);
    expect(fs.existsSync(`${localPath}.part`)).to.equal(false);
    expect(fs.existsSync(localPath)).to.equal(false);
  });

  it('removes the part file when a parallel range is ignored', async () => {
    const dir = tempDir();
    const localPath = path.join(dir, 'file.bin');
    const payload = 'hello world';
    const fetch = sinon.stub().callsFake((url, options) => {
      const header = fetchRange(options);

      if (header === 'bytes=0-0') {
        return rangedDownloadResponse(payload.slice(0, 1), {
          size: payload.length,
          content_hash: contentHash(Buffer.from(payload)),
        }, options);
      }

      return downloadResponse(payload, {
        size: payload.length,
        content_hash: contentHash(Buffer.from(payload)),
      });
    });
    const dbx = client(fetch);
    dbx.filesGetMetadata = sinon.stub().returns(metadataResponse({
      size: payload.length,
      content_hash: contentHash(Buffer.from(payload)),
    }));

    try {
      await new DropboxFileDownloader(dbx, {
        maxAttempts: 1,
        parallelDownloads: 3,
      }).downloadFile('/file.bin', localPath);
      throw new Error('expected download to fail');
    } catch (error) {
      expect(error.message).to.contain('expected 206');
    }

    expect(fs.existsSync(`${localPath}.part`)).to.equal(false);
    expect(fs.existsSync(localPath)).to.equal(false);
  });

  it('handles partial fs.write completions during parallel downloads', async () => {
    const dir = tempDir();
    const localPath = path.join(dir, 'file.bin');
    const payload = 'partial writes still produce the complete file';
    const fetch = sinon.stub().callsFake((url, options) => {
      const header = fetchRange(options);
      const match = /^bytes=(\d+)-(\d+)$/.exec(header);
      const start = Number(match[1]);
      const end = Number(match[2]);

      return rangedDownloadResponse(payload.slice(start, end + 1), {
        size: payload.length,
        content_hash: contentHash(Buffer.from(payload)),
      }, options);
    });
    const write = fs.write.bind(fs);
    const writeStub = sinon.stub(fs, 'write').callsFake((
      fd,
      buffer,
      offset,
      length,
      position,
      callback,
    ) => write(
      fd,
      buffer,
      offset,
      Math.max(1, Math.ceil(length / 2)),
      position,
      callback,
    ));
    const dbx = client(fetch);
    dbx.filesGetMetadata = sinon.stub().returns(metadataResponse({
      size: payload.length,
      content_hash: contentHash(Buffer.from(payload)),
    }));

    try {
      await new DropboxFileDownloader(dbx, { parallelDownloads: 4 })
        .downloadFile('/file.bin', localPath);
    } finally {
      writeStub.restore();
    }

    expect(fs.readFileSync(localPath, 'utf8')).to.equal(payload);
    expect(writeStub.callCount).to.be.greaterThan(fetch.callCount);
  });

  it('removes the part file when the remote revision changes', async () => {
    const dir = tempDir();
    const localPath = path.join(dir, 'file.bin');
    fs.writeFileSync(`${localPath}.part`, 'hello ');
    const dbx = client(sinon.stub().callsFake((url, options) => (
      rangedDownloadResponse('world', {
        rev: 'rev2',
        size: 11,
      }, options)
    )));

    try {
      await new DropboxFileDownloader(dbx)
        .downloadFileAttempt('/file.bin', localPath, 'rev1');
      throw new Error('expected download to fail');
    } catch (error) {
      expect(error.message).to.contain('remote file changed');
    }

    expect(fs.existsSync(`${localPath}.part`)).to.equal(false);
  });
});
