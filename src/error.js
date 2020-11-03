
/**
 * 
 */
export class DropboxError extends Error {
    constructor(status, headers, error) {
      this.status = status;
      this.headers = headers;
      this.error = error;
    }
  }