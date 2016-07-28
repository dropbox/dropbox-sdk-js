var DropboxBase = require('./dropbox-base');
var routes = require('./routes');
var Dropbox;

/**
 * @class Dropbox
 * @extends DropboxBase
 * @classdesc The Dropbox SDK class that provides methods to list and create folders in a user's Dropbox, view file metadata, and manipulate files via methods that do not involve content upload or download.
 * @arg {Object} options
 * @arg {String} [options.accessToken] - An access token for making authenticated
 * requests.
 * @arg {String} [options.clientId] - The client id for your app. Used to create
 * authentication URL.
 * @arg {String} [options.selectUser] - Select user is only used by DropboxTeam.
 * It specifies which user the team access token should be acting as.
 */
Dropbox = function (options) {
  DropboxBase.call(this, options);
};

Dropbox.prototype = Object.create(DropboxBase.prototype);

Dropbox.prototype.constructor = Dropbox;

// Add the user endpoint methods to the prototype
Dropbox.prototype = Object.assign(Dropbox.prototype, routes);

module.exports = Dropbox;
