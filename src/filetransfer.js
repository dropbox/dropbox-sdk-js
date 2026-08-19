import { DropboxFileDownloader, downloadFile } from './filedownload.js';
import { DropboxResponseError } from './error.js';

const DEFAULT_MAX_ATTEMPTS = 3;
const DEFAULT_RETRY_DELAY = 200;
const MAX_RETRY_DELAY = 5000;
const DEFAULT_CHUNK_SIZE = 8 * 1024 * 1024;
const CONCURRENT_CHUNK_SIZE = 4 * 1024 * 1024;

let nodeRuntime;

function requireNodeModule(moduleName) {
  if (typeof require === 'function') { // eslint-disable-line no-undef
    // eslint-disable-next-line global-require, import/no-dynamic-require, no-undef
    return Promise.resolve(require(moduleName)); // eslint-disable-line no-undef
  }
  // eslint-disable-next-line no-new-func
  return Function('moduleName', 'return import(moduleName)')(moduleName);
}

async function getNodeRuntime() {
  if (nodeRuntime) return nodeRuntime;
  if (typeof process === 'undefined' || !process.versions || !process.versions.node) {
    throw new Error('fileUpload is only supported in Node.js');
  }
  const fsModule = await requireNodeModule('fs');
  nodeRuntime = { fs: fsModule.default || fsModule };
  return nodeRuntime;
}

function validatePositiveInteger(name, value) {
  if (!Number.isInteger(value) || value <= 0) {
    throw new TypeError(`${name} must be a positive integer`);
  }
}

function emptyContents() {
  return new Uint8Array(0);
}

function isBlob(value) {
  return typeof Blob !== 'undefined' && value instanceof Blob;
}

function toUint8Array(value) {
  if (typeof Buffer !== 'undefined' && Buffer.isBuffer(value)) {
    return new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
  }
  if (value instanceof ArrayBuffer) return new Uint8Array(value);
  if (ArrayBuffer.isView(value)) {
    return new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
  }
  return null;
}

async function contentsToBytes(contents) {
  const bytes = toUint8Array(contents);
  if (bytes) return bytes;
  if (isBlob(contents)) return new Uint8Array(await contents.arrayBuffer());
  if (contents && typeof contents[Symbol.asyncIterator] === 'function') {
    const chunks = [];
    let length = 0;
    // eslint-disable-next-line no-restricted-syntax
    for await (const chunk of contents) {
      const value = toUint8Array(chunk);
      if (!value) throw new TypeError('upload source yielded non-byte content');
      chunks.push(value);
      length += value.byteLength;
    }
    const result = new Uint8Array(length);
    let offset = 0;
    chunks.forEach((chunk) => { result.set(chunk, offset); offset += chunk.byteLength; });
    return result;
  }
  throw new TypeError('upload source must provide byte content');
}

function validateRange(size, offset, length) {
  if (!Number.isInteger(offset) || !Number.isInteger(length) || offset < 0 || length < 0
    || offset > size || length > size - offset) {
    throw new RangeError(`range [${offset},${offset + length}) exceeds source size ${size}`);
  }
}

function sourceReadError(offset, error) {
  return new Error(`upload source read failed at offset ${offset}: ${error.message}`);
}

export function bytesUpload(contents) {
  const normalized = typeof contents === 'string'
    ? new TextEncoder().encode(contents)
    : contents;
  if (isBlob(normalized)) {
    return {
      size: normalized.size,
      async read(offset, length) {
        validateRange(normalized.size, offset, length);
        return normalized.slice(offset, offset + length);
      },
    };
  }
  const bytes = toUint8Array(normalized);
  if (!bytes) throw new TypeError('bytesUpload contents must be byte content, a Blob, or a string');
  return {
    size: bytes.byteLength,
    async read(offset, length) {
      validateRange(bytes.byteLength, offset, length);
      return bytes.subarray(offset, offset + length);
    },
  };
}

export async function fileUpload(filePath) {
  const { fs } = await getNodeRuntime();
  const stat = fs.statSync(filePath);
  if (!stat.isFile()) throw new Error(`upload source is not a regular file: ${filePath}`);
  return {
    size: stat.size,
    async read(offset, length) {
      validateRange(stat.size, offset, length);
      const current = fs.statSync(filePath);
      if (current.size !== stat.size) {
        throw new Error(`upload source size changed: got ${current.size} bytes, expected ${stat.size}`);
      }
      if (length === 0) return emptyContents();
      return fs.createReadStream(filePath, { start: offset, end: offset + length - 1 });
    },
  };
}

export function readerUpload(reader) {
  if (!reader) throw new TypeError('upload reader is required');
  let opened = false;
  return {
    async open() {
      if (opened) throw new Error('upload source has already been opened');
      opened = true;
      return reader;
    },
  };
}

export function sizedReaderUpload(reader, size) {
  if (!Number.isInteger(size) || size < 0) throw new TypeError('upload size must be a non-negative integer');
  return { ...readerUpload(reader), size };
}

function retryAfter(error) {
  if (!(error instanceof DropboxResponseError) || !error.headers) return null;
  const value = typeof error.headers.get === 'function'
    ? error.headers.get('retry-after')
    : error.headers['retry-after'] || error.headers['Retry-After'];
  if (!value || !/^\d+$/.test(value)) return null;
  return Number(value) * 1000;
}

function retryDelay(error, attempt, baseDelay) {
  const rateLimitDelay = retryAfter(error);
  if (rateLimitDelay !== null) {
    return rateLimitDelay;
  }

  const maximum = Math.min(
    baseDelay * (2 ** attempt),
    MAX_RETRY_DELAY,
  );
  const half = maximum / 2;
  return Math.floor(half + Math.random() * (half + 1));
}

function isRetryableError(error) {
  if (error && error.uploadSessionRetry) return true;
  if (error instanceof DropboxResponseError) {
    return error.status === 408
      || error.status === 429
      || (error.status >= 500 && error.status <= 599);
  }
  if (!error || error.name === 'AbortError') return false;
  const code = error.code || (error.cause && error.cause.code);
  if (typeof code === 'string' && /^(EAI_AGAIN|ECONN|ENET|EHOST|ETIMEDOUT|UND_ERR_)/.test(code)) {
    return true;
  }
  return error instanceof TypeError && (
    error.message === 'fetch failed'
    || error.message === 'Failed to fetch'
    || error.message === 'NetworkError when attempting to fetch resource.'
  );
}

function correctOffset(error) {
  if (!(error instanceof DropboxResponseError) || !error.error) return null;
  const visit = (value) => {
    if (!value || typeof value !== 'object') return null;
    if (Number.isInteger(value.correct_offset)) return value.correct_offset;
    return Object.keys(value).reduce(
      (found, key) => (found === null ? visit(value[key]) : found),
      null,
    );
  };
  return visit(error.error);
}

function isClosedSession(error) {
  if (!(error instanceof DropboxResponseError) || !error.error) return false;
  const visit = (value) => {
    if (!value || typeof value !== 'object') return false;
    if (value['.tag'] === 'closed') return true;
    return Object.keys(value).some((key) => visit(value[key]));
  };
  return visit(error.error);
}

function resultOf(response) {
  return response && response.result ? response.result : response;
}

function delay(ms, signal) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    if (!signal) return;
    const abort = () => { clearTimeout(timer); reject(signal.reason || new Error('upload aborted')); };
    if (signal.aborted) abort();
    else signal.addEventListener('abort', abort, { once: true });
  });
}

function isRangedSource(source) {
  return source && Number.isInteger(source.size) && source.size >= 0 && typeof source.read === 'function';
}

function isSequentialSource(source) {
  return source && typeof source.open === 'function';
}

async function rangedChunk(source, offset, length) {
  try {
    const bytes = await contentsToBytes(await source.read(offset, length));
    if (bytes.byteLength !== length) {
      throw new Error(`got ${bytes.byteLength} bytes, expected ${length}`);
    }
    return bytes;
  } catch (error) {
    throw sourceReadError(offset, error);
  }
}

async function sequentialChunks(source, chunkSize) {
  const reader = await source.open();
  if (!reader) {
    throw new TypeError('upload reader must be an async iterable');
  }
  let iterator;
  if (typeof reader[Symbol.asyncIterator] === 'function') {
    iterator = reader[Symbol.asyncIterator]();
  } else if (typeof reader.getReader === 'function') {
    const streamReader = reader.getReader();
    iterator = {
      next: () => streamReader.read(),
    };
  } else {
    throw new TypeError('upload reader must be an async iterable');
  }
  let pending = emptyContents();
  let done = false;
  return async () => {
    const chunks = [];
    let length = 0;
    while (length < chunkSize && !done) {
      if (pending.byteLength === 0) {
        // eslint-disable-next-line no-await-in-loop
        const next = await iterator.next();
        done = next.done;
        if (done) break;
        pending = toUint8Array(next.value);
        if (!pending) throw new TypeError('upload source yielded non-byte content');
      }
      const take = Math.min(chunkSize - length, pending.byteLength);
      chunks.push(pending.subarray(0, take));
      pending = pending.subarray(take);
      length += take;
    }
    const bytes = new Uint8Array(length);
    let offset = 0;
    chunks.forEach((chunk) => { bytes.set(chunk, offset); offset += chunk.byteLength; });
    return { bytes, done: done && pending.byteLength === 0 };
  };
}

export class DropboxFileUploader {
  constructor(client, options = {}) {
    const maxAttempts = options.maxAttempts === undefined || options.maxAttempts <= 0
      ? DEFAULT_MAX_ATTEMPTS : options.maxAttempts;
    const chunkSize = options.chunkSize === undefined ? DEFAULT_CHUNK_SIZE : options.chunkSize;
    validatePositiveInteger('maxAttempts', maxAttempts);
    validatePositiveInteger('chunkSize', chunkSize);
    if (options.parallelUploads !== undefined
      && (!Number.isInteger(options.parallelUploads) || options.parallelUploads < 0)) {
      throw new TypeError('parallelUploads must be a non-negative integer');
    }
    this.client = client;
    this.maxAttempts = maxAttempts;
    this.chunkSize = chunkSize;
    this.parallelUploads = options.parallelUploads > 1 ? options.parallelUploads : 1;
    this.retryDelay = options.retryDelay === undefined ? DEFAULT_RETRY_DELAY : options.retryDelay;
    validatePositiveInteger('retryDelay', this.retryDelay);
    if (options.timeout !== undefined) validatePositiveInteger('timeout', options.timeout);
    this.progress = options.progress;
    this.signal = options.signal;
    this.timeout = options.timeout;
    this.delay = options.delay || delay;
  }

  requestOptions(signal = this.signal) { return { signal, timeout: this.timeout }; }

  validate(source, commitInfo) {
    if (!this.client || typeof this.client.filesUploadSessionStart !== 'function'
      || typeof this.client.filesUploadSessionAppendV2 !== 'function'
      || typeof this.client.filesUploadSessionFinish !== 'function') {
      throw new Error('upload client is required');
    }
    if (!isRangedSource(source) && !isSequentialSource(source)) {
      throw new TypeError('upload source must provide read(offset, length) or open()');
    }
    if (!commitInfo) throw new TypeError('upload commit info is required');
    if (!commitInfo.path) throw new TypeError('upload destination path is required');
    if (this.parallelUploads > 1 && !isRangedSource(source)) throw new TypeError('parallel uploads require a ranged upload source');
  }

  report(bytesCommitted, totalBytes) {
    if (this.progress && bytesCommitted > 0) this.progress({ bytesCommitted, totalBytes });
  }

  async retry(operation, signal = this.signal) {
    let lastError;
    for (let attempt = 0; attempt < this.maxAttempts; attempt += 1) {
      try { // eslint-disable-line no-await-in-loop
        return await operation(); // eslint-disable-line no-await-in-loop
      } catch (error) {
        if (signal && signal.aborted) throw signal.reason || error;
        if (!isRetryableError(error)) throw error;
        lastError = error;
        if (attempt < this.maxAttempts - 1) {
          // eslint-disable-next-line no-await-in-loop
          await this.delay(
            retryDelay(error, attempt, this.retryDelay),
            signal,
          );
        }
      }
    }
    throw lastError;
  }

  async start(concurrent) {
    const response = await this.retry(() => this.client.filesUploadSessionStart({
      contents: emptyContents(),
      ...(concurrent ? { session_type: { '.tag': 'concurrent' } } : {}),
    }, this.requestOptions()));
    const sessionId = resultOf(response) && resultOf(response).session_id;
    if (!sessionId) throw new Error('upload session id is empty');
    return sessionId;
  }

  async append(sessionId, offset, contents, close = false, signal = this.signal) {
    const expectedOffset = offset + contents.byteLength;
    return this.retry(async () => {
      try {
        await this.client.filesUploadSessionAppendV2({
          cursor: { session_id: sessionId, offset }, close, contents,
        }, this.requestOptions(signal));
      } catch (error) {
        const actual = correctOffset(error);
        if (actual === expectedOffset) return;
        if (close && isClosedSession(error)) return;
        if (actual === offset) {
          error.uploadSessionRetry = true; // eslint-disable-line no-param-reassign
        }
        if (actual !== null && actual !== offset) {
          throw new Error(`upload session offset mismatch: got ${actual}, expected ${offset} or ${expectedOffset}`);
        }
        throw error;
      }
    }, signal);
  }

  async finish(sessionId, offset, commit, contents) {
    let currentOffset = offset;
    let currentContents = contents;
    return this.retry(async () => {
      try {
        const response = await this.client.filesUploadSessionFinish({
          cursor: { session_id: sessionId, offset: currentOffset },
          commit,
          contents: currentContents,
        }, this.requestOptions());
        return resultOf(response);
      } catch (error) {
        const actual = correctOffset(error);
        const expected = currentOffset + currentContents.byteLength;
        if (actual === expected) {
          currentOffset = actual;
          currentContents = emptyContents();
          error.uploadSessionRetry = true; // eslint-disable-line no-param-reassign
        } else if (actual === currentOffset) {
          error.uploadSessionRetry = true; // eslint-disable-line no-param-reassign
        } else if (actual !== null) {
          throw new Error(`upload session offset mismatch: got ${actual}, expected ${currentOffset} or ${expected}`);
        }
        throw error;
      }
    });
  }

  async uploadSequential(source, commit) {
    let total = -1;
    if (isRangedSource(source) || Number.isInteger(source.size)) total = source.size;
    const sessionId = await this.start(false);
    let offset = 0;
    const next = isRangedSource(source)
      ? async () => {
        const length = Math.min(this.chunkSize, source.size - offset);
        return {
          bytes: await rangedChunk(source, offset, length),
          done: offset + length === source.size,
        };
      }
      : await sequentialChunks(source, this.chunkSize);
    for (;;) {
      // eslint-disable-next-line no-await-in-loop
      const chunk = await next();
      if (total >= 0 && offset + chunk.bytes.byteLength > total) {
        throw new Error(`read upload content: got more than declared size ${total}`);
      }
      if (chunk.done) {
        if (total >= 0 && offset + chunk.bytes.byteLength !== total) {
          throw new Error(
            `read upload content: got ${offset + chunk.bytes.byteLength} bytes, expected ${total}`,
          );
        }
        // eslint-disable-next-line no-await-in-loop
        const metadata = await this.finish(sessionId, offset, commit, chunk.bytes);
        this.report(offset + chunk.bytes.byteLength, total);
        return { metadata };
      }
      if (chunk.bytes.byteLength === 0) throw new Error('read upload content: no progress');
      // eslint-disable-next-line no-await-in-loop
      await this.append(sessionId, offset, chunk.bytes);
      offset += chunk.bytes.byteLength;
      this.report(offset, total);
    }
  }

  async uploadParallel(source, commit) {
    if (source.size === 0) return this.uploadSequential(source, commit);
    if (this.chunkSize % CONCURRENT_CHUNK_SIZE !== 0) {
      throw new TypeError(`chunkSize must be a multiple of ${CONCURRENT_CHUNK_SIZE} for parallel uploads`);
    }
    const sessionId = await this.start(true);
    const ranges = [];
    for (let offset = 0; offset < source.size; offset += this.chunkSize) {
      ranges.push({ offset, length: Math.min(this.chunkSize, source.size - offset) });
    }
    const finalRange = ranges.pop();
    let committed = 0;
    const controller = new AbortController();
    const signal = this.signal
      ? AbortSignal.any([this.signal, controller.signal])
      : controller.signal;
    let firstError;
    const stop = (error) => {
      if (!firstError) {
        firstError = error;
        controller.abort(error);
      }
    };
    const uploadRange = async (range, close) => {
      if (firstError) throw firstError;
      const bytes = await rangedChunk(source, range.offset, range.length);
      if (firstError) throw firstError;
      await this.append(sessionId, range.offset, bytes, close, signal);
      if (firstError) throw firstError;
      committed += range.length;
      this.report(committed, source.size);
    };
    const workerCount = Math.min(this.parallelUploads, ranges.length);
    const workers = Array.from({ length: workerCount }, async () => {
      while (!firstError && ranges.length) {
        const range = ranges.shift();
        try {
          // eslint-disable-next-line no-await-in-loop
          await uploadRange(range, false);
        } catch (error) {
          stop(error);
          return;
        }
      }
    });
    await Promise.allSettled(workers);
    if (firstError) throw firstError;
    try {
      await uploadRange(finalRange, true);
    } catch (error) {
      stop(error);
      throw firstError;
    }
    if (committed !== source.size) {
      throw new Error(`incomplete upload: committed ${committed} of ${source.size} bytes`);
    }
    return { metadata: await this.finish(sessionId, source.size, commit, emptyContents()) };
  }

  upload(source, commitInfo) {
    this.validate(source, commitInfo);
    if (this.parallelUploads > 1) return this.uploadParallel(source, commitInfo);
    return this.uploadSequential(source, commitInfo);
  }
}

export function uploadFile(client, source, commitInfo, options = {}) {
  return new DropboxFileUploader(client, options).upload(source, commitInfo);
}

export { DropboxFileDownloader, downloadFile };
