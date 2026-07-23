import { expect } from 'chai';

import { contentHash as nodeContentHash } from '../../src/content-hasher.js';
import {
  contentHash,
} from '../../src/upload-content-hash.js';

describe('upload content hash', () => {
  it('hashes a Buffer', async () => {
    const contents = Buffer.from('hello world');

    expect(await contentHash(contents)).to.equal(
      nodeContentHash(contents),
    );
  });

  it('hashes a Uint8Array', async () => {
    const contents = new Uint8Array(
      Buffer.from('hello world'),
    );

    expect(await contentHash(contents)).to.equal(
      nodeContentHash(Buffer.from(contents)),
    );
  });

  it('hashes an ArrayBuffer', async () => {
    const bytes = new Uint8Array(
      Buffer.from('hello world'),
    );
    const contents = bytes.buffer.slice(
      bytes.byteOffset,
      bytes.byteOffset + bytes.byteLength,
    );

    expect(await contentHash(contents)).to.equal(
      nodeContentHash(Buffer.from(bytes)),
    );
  });

  it('hashes multiple blocks', async () => {
    const contents = Buffer.alloc(
      (4 * 1024 * 1024) + 1,
      1,
    );

    expect(await contentHash(contents)).to.equal(
      nodeContentHash(contents),
    );
  });

  it('returns null for unsupported contents', async () => {
    expect(await contentHash({ pipe() {} })).to.equal(null);
  });
});
