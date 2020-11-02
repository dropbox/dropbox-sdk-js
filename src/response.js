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
  if (!res.ok) {
    return res.text()
      .then((data) => {
        let error_object;
        try{
          error_object = JSON.parse(data);
        }catch(error){
          error_object = data;
        }

        throw new DropboxError({
          error: error_object,
          headers: res.headers,
          status: res.status,
        });
      });
  }
  return Promise.resolve();
}

export function parseResponse(res) {
  return throwIfError(res).then(() => res.text()
    .then((data) => {
      let response_object;
        try{
          response_object = JSON.parse(data);
        }catch(error){
          response_object = data;
        }

        return new DropboxResponse(res.status, res.headers, response_object)
    }
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
