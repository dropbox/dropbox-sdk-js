import { isWindowOrWorker } from './utils.js';
import { DropboxError } from './error.js';

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

export function parseResponse(res) {
  if(!res.ok){
    return throwAsError(res);
  }
  return res.text()
    .then((data) => {
      let response_object;
        try{
          response_object = JSON.parse(data);
        }catch(error){
          response_object = data;
        }

        return new DropboxResponse(res.status, res.headers, response_object)
    }
    );
}

export function parseDownloadResponse(res) {
  if(!res.ok){
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
