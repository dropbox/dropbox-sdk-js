var dropbox = require('dropbox');

var dbx = new dropbox.Dropbox();
var dbxAuth = new dropbox.DropboxAuth();

var { Dropbox, DropboxAuth } = dropbox;

var dbx2 = new Dropbox();
var dbxAuth2 = new DropboxAuth();