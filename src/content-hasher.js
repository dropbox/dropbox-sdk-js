import crypto from 'crypto';

const BLOCK_SIZE = 4 * 1024 * 1024;

/**
 * Computes hashes using the same block-based algorithm as Dropbox's
 * content_hash metadata field.
 */
class DropboxContentHasher {
  constructor() {
    this.overallHasher = crypto.createHash('sha256');
    this.blockHasher = crypto.createHash('sha256');
    this.blockPosition = 0;
    this.finished = false;
  }

  /**
   * Adds binary data to the hash.
   *
   * @param {Buffer|Uint8Array|ArrayBuffer} data Binary data to hash.
   * @returns {DropboxContentHasher} This hasher instance.
   */
  update(data) {
    this.assertNotFinished();

    const bytes = DropboxContentHasher.toBuffer(data);

    let position = 0;

    while (position < bytes.length) {
      if (this.blockPosition === BLOCK_SIZE) {
        this.finishBlock();
      }

      const remainingBlockSpace = BLOCK_SIZE - this.blockPosition;
      const remainingData = bytes.length - position;
      const length = Math.min(remainingBlockSpace, remainingData);

      this.blockHasher.update(
        bytes.subarray(position, position + length),
      );

      this.blockPosition += length;
      position += length;
    }

    return this;
  }

  /**
   * Returns the final Dropbox content hash.
   *
   * @param {'hex'|undefined} encoding Optional output encoding.
   * @returns {Buffer|string} Binary digest, or a hexadecimal string.
   */
  digest(encoding) {
    this.assertNotFinished();

    if (this.blockPosition > 0) {
      this.finishBlock();
    }

    this.finished = true;

    if (encoding === undefined) {
      return this.overallHasher.digest();
    }

    if (encoding !== 'hex') {
      throw new TypeError('DropboxContentHasher only supports hex encoding');
    }

    return this.overallHasher.digest('hex');
  }

  finishBlock() {
    this.overallHasher.update(this.blockHasher.digest());
    this.blockHasher = crypto.createHash('sha256');
    this.blockPosition = 0;
  }

  assertNotFinished() {
    if (this.finished) {
      throw new Error(
        'DropboxContentHasher cannot be used after digest() has been called',
      );
    }
  }

  static toBuffer(data) {
    if (Buffer.isBuffer(data)) {
      return data;
    }

    if (data instanceof ArrayBuffer) {
      return Buffer.from(data);
    }

    if (ArrayBuffer.isView(data)) {
      return Buffer.from(
        data.buffer,
        data.byteOffset,
        data.byteLength,
      );
    }

    throw new TypeError(
      'DropboxContentHasher.update() expects a Buffer, Uint8Array, or ArrayBuffer',
    );
  }
}

/**
 * Computes the Dropbox content hash for a complete binary payload.
 *
 * @param {Buffer|Uint8Array|ArrayBuffer} data Binary data to hash.
 * @returns {string} Lowercase hexadecimal Dropbox content hash.
 */
function contentHash(data) {
  return new DropboxContentHasher()
    .update(data)
    .digest('hex');
}

export {
  BLOCK_SIZE,
  DropboxContentHasher,
  contentHash,
};
