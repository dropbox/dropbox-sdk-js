import { expect } from 'chai';
import crypto from 'crypto';

import {
  BLOCK_SIZE,
  DropboxContentHasher,
  contentHash,
} from '../../src/content-hasher.js';

function referenceContentHash(data) {
  const blockHashes = [];

  for (let offset = 0; offset < data.length; offset += BLOCK_SIZE) {
    const block = data.subarray(
      offset,
      Math.min(offset + BLOCK_SIZE, data.length),
    );

    blockHashes.push(
      crypto.createHash('sha256').update(block).digest(),
    );
  }

  return crypto
    .createHash('sha256')
    .update(Buffer.concat(blockHashes))
    .digest('hex');
}

describe('DropboxContentHasher', () => {
  it('hashes empty content', () => {
    expect(contentHash(Buffer.alloc(0))).to.equal(
      crypto.createHash('sha256').update(Buffer.alloc(0)).digest('hex'),
    );
  });

  it('hashes content smaller than one block', () => {
    const data = Buffer.from('hello world');

    expect(contentHash(data)).to.equal(referenceContentHash(data));
  });

  it('hashes exactly one block', () => {
    const data = Buffer.alloc(BLOCK_SIZE, 0x61);

    expect(contentHash(data)).to.equal(referenceContentHash(data));
  });

  it('hashes multiple blocks', () => {
    const data = Buffer.alloc(BLOCK_SIZE + 123, 0x62);

    expect(contentHash(data)).to.equal(referenceContentHash(data));
  });

  it('supports multiple update calls', () => {
    const data = Buffer.alloc((BLOCK_SIZE * 2) + 500, 0x63);
    const hasher = new DropboxContentHasher();

    for (let offset = 0; offset < data.length; offset += 1000) {
      hasher.update(data.subarray(offset, offset + 1000));
    }

    expect(hasher.digest('hex')).to.equal(referenceContentHash(data));
  });

  it('returns itself from update', () => {
    const hasher = new DropboxContentHasher();

    expect(hasher.update(Buffer.from('data'))).to.equal(hasher);
  });

  it('returns a Buffer from digest without encoding', () => {
    const hasher = new DropboxContentHasher();

    hasher.update(Buffer.from('data'));

    const digest = hasher.digest();

    expect(Buffer.isBuffer(digest)).to.equal(true);
    expect(digest.toString('hex')).to.equal(
      contentHash(Buffer.from('data')),
    );
  });

  it('supports Uint8Array input', () => {
    const data = new Uint8Array([1, 2, 3, 4]);

    expect(contentHash(data)).to.equal(
      referenceContentHash(Buffer.from(data)),
    );
  });

  it('supports ArrayBuffer input', () => {
    const data = new Uint8Array([5, 6, 7, 8]).buffer;

    expect(contentHash(data)).to.equal(
      referenceContentHash(Buffer.from(data)),
    );
  });

  it('supports views with a nonzero byte offset', () => {
    const source = new Uint8Array([0, 1, 2, 3, 4, 5]);
    const data = source.subarray(2, 5);

    expect(contentHash(data)).to.equal(
      referenceContentHash(Buffer.from([2, 3, 4])),
    );
  });

  it('rejects unsupported input', () => {
    expect(() => contentHash('data')).to.throw(TypeError);
  });

  it('rejects unsupported digest encodings', () => {
    const hasher = new DropboxContentHasher();

    hasher.update(Buffer.from('data'));

    expect(() => hasher.digest('base64')).to.throw(TypeError);
  });

  it('cannot be updated after digest', () => {
    const hasher = new DropboxContentHasher();

    hasher.update(Buffer.from('data'));
    hasher.digest('hex');

    expect(() => hasher.update(Buffer.from('more'))).to.throw(
      'cannot be used after digest() has been called',
    );
  });

  it('cannot be digested twice', () => {
    const hasher = new DropboxContentHasher();

    hasher.update(Buffer.from('data'));
    hasher.digest('hex');

    expect(() => hasher.digest('hex')).to.throw(
      'cannot be used after digest() has been called',
    );
  });
});
