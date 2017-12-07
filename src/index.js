const dropbox = require('./dropbox');
const dropboxTeam = require('./team/dropbox-team.js');

module.exports = {
  Dropbox: dropbox.Dropbox,
  DropboxTeam: dropboxTeam.DropboxTeam,
};
