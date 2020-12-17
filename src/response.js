import { isWindowOrWorker } from './utils.js';
import { DropboxResponseError } from './error.js';

export class DropboxResponse {
  constructor(status, headers, result) {
    this.status = status;
    this.headers = headers;
    this.result = result;
  }
}

function throwAsError(res) {
  return res.text()
    .then((data) => {
      let errorObject;
      try {
        errorObject = JSON.parse(data);
      } catch (error) {
        errorObject = data;
      }

      throw new DropboxResponseError(res.status, res.headers, errorObject);
    });
}

export function parseResponse(res) {
  if (!res.ok) {
    return throwAsError(res);
  }
  return res.text()
    .then((data) => {
      let responseObject;
      try {
        responseObject = JSON.parse(data);
      } catch (error) {
        responseObject = data;
      }

      return new DropboxResponse(res.status, res.headers, responseObject);
    });
}

export function parseDownloadResponse(res) {
  if (!res.ok) {
    return throwAsError(res);
  }
  return new Promise((resolve) => {
    if (isWindowOrWorker()) {
      res.blob().then((data) => resolve(data));
    } else {
      res.buffer().then((data) => resolve(data));
    }
  }).then((data) => {
    const result = JSON.parse(res.headers.get('dropbox-api-result'));

    if (isWindowOrWorker()) {
      result.fileBlob = data;
    } else {
      result.fileBinary = data;
    }

    return new DropboxResponse(res.status, res.headers, result);
  });
}
