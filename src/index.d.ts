/// <reference path="../dist/dropbox.d.ts" />
/// <reference path="../dist/dropbox_team.d.ts" />

declare module "dropbox/team" {
  export = DropboxTypes.DropboxTeam;
}

declare module "dropbox" {
  export = DropboxTypes.Dropbox;
}
