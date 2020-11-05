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
  if (isAxios) {
    return Promise.reject(new DropboxResponseError(res.response.status, res.response.headers, res.response.data));
  } else {
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
}

function isResponseOk(res) {
  return isAxios(res) ? res.statusText == 'OK' : res.ok;
}

function isAxios(res){
  return res.statusText;
}

export function parseResponse(res) {
  if (!isResponseOk(res)) {
    return throwAsError(res);
  }

  if (isAxios){
    return Promise.resolve(new DropboxResponse(res.status, res.headers, res.data));
  }else{
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
}

export function parseDownloadResponse(res) {
  if (!isResponseOk(res)) {
    return throwAsError(res);
  }

  return new Promise((resolve) => {
    if (isAxios(res)){
      resolve(res.data);
    }else if (isWindowOrWorker()) {
      res.blob().then((data) => resolve(data));
    } else {
      res.buffer().then((data) => resolve(data));
    }
  }).then((data) => {
    let result;
    if(isAxios(res)){
      result = JSON.parse(res.headers['dropbox-api-result']);
    }else {
      result = JSON.parse(res.headers.get('dropbox-api-result'));
    }

    if (isWindowOrWorker()) {
      result.fileBlob = data;
    } else {
      result.fileBinary = data;
    }

    return new DropboxResponse(res.status, res.headers, result);
  });
}
