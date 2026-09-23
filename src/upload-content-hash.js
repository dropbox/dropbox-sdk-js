const BLOCK_SIZE = 4 * 1024 * 1024;

async function sha256(data) {
  const digest = await globalThis.crypto.subtle.digest(
    'SHA-256',
    data,
  );

  return new Uint8Array(digest);
}

function toHex(bytes) {
  return Array.from(
    bytes,
    (byte) => byte.toString(16).padStart(2, '0'),
  ).join('');
}

function isBlob(value) {
  return typeof Blob !== 'undefined' && value instanceof Blob;
}

function toUint8Array(value) {
  if (typeof Buffer !== 'undefined' && Buffer.isBuffer(value)) {
    return new Uint8Array(
      value.buffer,
      value.byteOffset,
      value.byteLength,
    );
  }

  if (value instanceof ArrayBuffer) {
    return new Uint8Array(value);
  }

  if (ArrayBuffer.isView(value)) {
    return new Uint8Array(
      value.buffer,
      value.byteOffset,
      value.byteLength,
    );
  }

  return null;
}

async function finishHash(blockHashes) {
  const combined = new Uint8Array(blockHashes.length * 32);

  blockHashes.forEach((hash, index) => {
    combined.set(hash, index * 32);
  });

  return toHex(await sha256(combined));
}

async function hashByteArray(bytes) {
  const blockHashes = [];

  /* eslint-disable no-await-in-loop */
  for (let offset = 0; offset < bytes.byteLength; offset += BLOCK_SIZE) {
    const block = bytes.subarray(
      offset,
      Math.min(offset + BLOCK_SIZE, bytes.byteLength),
    );

    blockHashes.push(await sha256(block));
  }
  /* eslint-enable no-await-in-loop */

  return finishHash(blockHashes);
}

async function hashBlob(blob) {
  const blockHashes = [];

  /* eslint-disable no-await-in-loop */
  for (let offset = 0; offset < blob.size; offset += BLOCK_SIZE) {
    const block = await blob
      .slice(offset, Math.min(offset + BLOCK_SIZE, blob.size))
      .arrayBuffer();

    blockHashes.push(await sha256(block));
  }
  /* eslint-enable no-await-in-loop */

  return finishHash(blockHashes);
}

/**
 * Computes a Dropbox content hash for supported upload payloads.
 *
 * Returns null if a content hash cannot be computed, such as for
 * unsupported values or when Web Crypto is unavailable.
 *
 * @param {Buffer|Uint8Array|ArrayBuffer|Blob|File} contents Upload contents.
 * @returns {Promise<string|null>} Lowercase hexadecimal content hash.
 */
async function contentHash(contents) {
  if (
    typeof globalThis.crypto === 'undefined'
    || !globalThis.crypto.subtle
  ) {
    return null;
  }

  try {
    if (isBlob(contents)) {
      return await hashBlob(contents);
    }

    const bytes = toUint8Array(contents);

    if (bytes === null) {
      return null;
    }

    return await hashByteArray(bytes);
  } catch {
    return null;
  }
}

export {
  BLOCK_SIZE,
  contentHash,
};
