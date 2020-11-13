/**
 * The response class of HTTP errors from API calls using the Dropbox SDK.
 * @class DropboxResponseError
 * @classdesc The response class of HTTP errors from API calls using the Dropbox SDK.
 * @arg {number} status - HTTP Status code of the call
 * @arg {Object} headers - Headers returned from the call
 * @arg {Object} error - Serialized Error of the call
 */
export class DropboxResponseError extends Error {
  constructor(status, headers, error) {
    super(`Response failed with a ${status} code`);
    this.name = 'DropboxResponseError';
    this.status = status;
    this.headers = headers;
    this.error = error;
  }
}
