const dropbox = require('dropbox') as typeof import('dropbox');

const dbx: import('dropbox').Dropbox = new dropbox.Dropbox();
const dbxAuth: import('dropbox').DropboxAuth = new dropbox.DropboxAuth();

void dbx;
void dbxAuth;
