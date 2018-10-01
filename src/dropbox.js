import { Writable } from 'stream';
import { routes } from './routes';
import { DropboxBase } from './dropbox-base';

/**
 * @class Dropbox
 * @extends DropboxBase
 * @classdesc The Dropbox SDK class that provides methods to read, write and
 * create files or folders in a user's Dropbox.
 * @arg {Object} options
 * @arg {Function} [options.fetch] - fetch library for making requests.
 * @arg {String} [options.accessToken] - An access token for making authenticated
 * requests.
 * @arg {String} [options.clientId] - The client id for your app. Used to create
 * authentication URL.
 * @arg {String} [options.selectUser] - Select user is only used by DropboxTeam.
 * It specifies which user the team access token should be acting as.
 */
export class Dropbox extends DropboxBase {

  constructor(options) {
    super(options);
    Object.assign(this, routes);
  }

  /**
   *
   * @param {FilesCommitInfo} args
   * @param {ReadableStream} stream
   * @return {Promise<FileMetadata>}
   */
  filesUploadFromReadStream(args, stream) {
    let uploaded = 0;
    return new Promise((resolve, reject) => {
      this.filesUploadSessionStart({ close: false })
        .then(res => res.session_id, reject)
        .then((sessionId) => {
          const writable = new Writable({
            write: (chunk, encoding, next) => {
              this.filesUploadSessionAppendV2({
                contents: chunk,
                cursor: {
                  sessionId,
                  offset: uploaded,
                },
              }).then(() => {
                uploaded += chunk.length;
                next();
              }, reject);
            },
            final: () => {
              this.filesUploadSessionFinish({
                cursor: {
                  sessionId,
                  offset: uploaded,
                },
                commit: {
                  path: args.path,
                  mode: args.mode,
                  autorename: args.autorename,
                  mute: args.mute,
                },
                contents: '',
              }).then(resolve, reject);
            },
          });
          writable.setDefaultEncoding('binary');
          stream.pipe(writable);
        });
    });
  }


}
