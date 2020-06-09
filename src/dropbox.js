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
 * @arg {String} [options.pathRoot] - root pass to access other namespaces
 * Use to access team folders for example
 * @arg {String} [options.refreshToken] - A refresh token for retrieving access tokens
 * @arg {Date} [options.AccessTokenExpiresAt] - Date of the current access token's
 * expiration (if available)
 */
export class Dropbox extends DropboxBase {
  constructor(options) {
    super(options);
    Object.assign(this, routes);
  }

  filesGetSharedLinkFile(arg) {
    return this.request('sharing/get_shared_link_file', arg, 'api', 'download');
  }
}
