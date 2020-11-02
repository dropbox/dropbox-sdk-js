import { isWindowOrWorker } from './utils.js';

export class DropboxResponse {
  constructor(status, headers, result) {
    this.status = status;
    this.headers = headers;
    this.result = result;
  }
}

function throwIfError(res) {
  const clone = res.clone();
  if (!res.ok) {
    return res.json()
      .then((data) => {
        // eslint-disable-next-line no-throw-literal
        throw {
          error: data,
          response: res,
          status: res.status,
        };
      }, (error) => {
        // eslint-disable-next-line no-throw-literal
        throw {
          error: clone.text(),
          response: res,
          status: res.status,
        };
      });
  } else {
    return Promise.resolve();
  }
}

export function parseResponse(res) {
  const clone = res.clone();

  return throwIfError(res).then(() => {
    return res.json()
      .then(
        (data) => new DropboxResponse(res.status, res.headers, data), 
        (error) => clone.text()
      );
  });
}

export function parseDownloadResponse(res) {
  return throwIfError(res).then(() => {
    return new Promise((resolve) => {
      if (isWindowOrWorker()) {
        res.blob().then((data) => resolve(data));
      } else {
        res.buffer().then((data) => resolve(data));
      }
    })
  }).then((data) => {
      let result = JSON.parse(res.headers.get('dropbox-api-result'));

      if (isWindowOrWorker()) {
        result.fileBlob = data;
      } else {
        result.fileBinary = data;
      }
      
      return new DropboxResponse(res.status, res.headers, result);
    });
}
