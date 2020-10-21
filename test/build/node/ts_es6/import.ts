import dropbox from 'dropbox';

const dbx: dropbox.Dropbox = new dropbox.Dropbox();
const dbxAuth: dropbox.DropboxAuth = new dropbox.DropboxAuth();

const { Dropbox, DropboxAuth } = dropbox;

var dbx2: dropbox.Dropbox = new Dropbox();
var dbxAuth2: dropbox.DropboxAuth = new DropboxAuth();