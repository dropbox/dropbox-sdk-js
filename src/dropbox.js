var DropboxBase = require('./dropbox-base');
var routes = require('./routes');
var Dropbox;

/**
 * @class Dropbox
 * @extends DropboxBase
 * @classdesc The Dropbox SDK class that provides access to the user specific
 * routes
 * @arg {Object} options
 * @arg {String} [options.accessToken] - An access token for making authenticated
 * requests.
 * @arg {String} [options.clientId] - The client id fo ryour app. Used to create
 * authentication url.
 * @arg {String} [options.selectUser] - User is the team access token would like
 * to act as.
 */
Dropbox = function (options) {
  DropboxBase.call(this, options);
};

Dropbox.prototype = Object.create(DropboxBase.prototype);

Dropbox.prototype.constructor = Dropbox;

// Add the user endpoint methods to the prototype
Dropbox.prototype = Object.assign(Dropbox.prototype, routes);

module.exports = Dropbox;
