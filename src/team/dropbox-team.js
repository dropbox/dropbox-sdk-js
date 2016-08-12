// @flow

var Dropbox = require('../dropbox');
var DropboxBase = require('../dropbox-base');
var teamRoutes = require('../routes-team');

class DropboxTeam extends Dropbox {
  actAsUser(userId: number) {
    return new Dropbox({
      accessToken: this.accessToken,
      clientId: this.clientId,
      selectUser: userId
    });
  }
}

// Add the team endpoint methods to the prototype
DropboxTeam.prototype = Object.assign(DropboxTeam.prototype, teamRoutes);

module.exports = DropboxTeam;
