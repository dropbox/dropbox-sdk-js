// @flow

var DropboxBase = require('./dropbox-base');
var routes = require('./routes');

class Dropbox extends DropboxBase {}

// Add the user endpoint methods to the prototype
Dropbox.prototype = Object.assign(Dropbox.prototype, routes);

module.exports = Dropbox;
