import { isWindowOrWorker } from './utils.js';

export class DropboxResponse {
  constructor(status, headers, result) {
    this.status = status;
    this.headers = headers;
    this.result = result;
  }
}

export class DropboxError extends Error {
  constructor(status, headers, error) {
    this.status = status;
    this.headers = headers;
    this.error = error;
  }
}

function throwIfError(res) {
  const clone = res.clone();
  if (!res.ok) {
    return res.json()
      .then((data) => {
        throw new DropboxError({
          error: data,
          headers: res.headers,
          status: res.status,
        });
      }, () => {
        throw new DropboxError({
          error: clone.text(),
          headers: res.headers,
          status: res.status,
        });
      });
  }
  return Promise.resolve();
}

export function parseResponse(res) {
  const clone = res.clone();

  return throwIfError(res).then(() => res.json()
    .then(
      (data) => new DropboxResponse(res.status, res.headers, data),
      () => clone.text(),
    ));
}

export function parseDownloadResponse(res) {
  return throwIfError(res).then(() => new Promise((resolve) => {
    if (isWindowOrWorker()) {
      res.blob().then((data) => resolve(data));
    } else {
      res.buffer().then((data) => resolve(data));
    }
  })).then((data) => {
    const result = JSON.parse(res.headers.get('dropbox-api-result'));

    if (isWindowOrWorker()) {
      result.fileBlob = data;
    } else {
      result.fileBinary = data;
    }

    return new DropboxResponse(res.status, res.headers, result);
  });
}
