import { Dropbox } from '../dropbox';
import { DropboxBase } from '../dropbox-base';
import { routes } from '../routes-team';

/**
 * @class DropboxTeam
 * @extends DropboxBase
 * @classdesc The Dropbox SDK class that provides access to team endpoints.
 * @arg {Object} options
 * @arg {String} [options.accessToken] - An access token for making authenticated
 * requests.
 * @arg {String} [options.clientId] - The client id for your app. Used to create
 * authentication URL.
 */
export class DropboxTeam extends DropboxBase {
  constructor(options) {
    super(options);
    Object.assign(this, routes);
  }

  /**
   * Returns an instance of Dropbox that can make calls to user api endpoints on
   * behalf of the passed user id, using the team access token.
   * @arg {String} userId - The user id to use the Dropbox class as
   * @returns {Dropbox} An instance of Dropbox used to make calls to user api
   * endpoints
   */
  actAsUser(userId) {
    return new Dropbox({
      accessToken: this.accessToken,
      clientId: this.clientId,
      selectUser: userId,
    });
  }
}
