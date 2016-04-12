var rpcRequest = require('./rpc-request');
require('./polyfills');

var DropboxApi = function (options) {
  this.accessToken = options && options.accessToken || '';
};

DropboxApi.prototype.setAccessToken = function (accessToken) {
  this.accessToken = accessToken;
};

DropboxApi.prototype.getAccessToken = function () {
  return this.accessToken;
};

/**
 * Returns the contents of a folder.
 * @param {Object} params - The requests parameters
 * @param {string} params.path - The path to the folder you want to see the contents of.
 * @param {boolean} [params.recursive=false] - If true, the list folder operation will be applied recursively to all subfolders and the response will contain contents of all subfolders.
 * @param {boolean} [params.include_media_info=false] - If true, FileMetadata.media_info is set for photo and video.
 * @param {boolean} [params.include_deleted=false] - If true, the results will include entries for files and folders that used to exist but were deleted.
 * @returns {Object}
 * */
DropboxApi.prototype.listFolder = function (params) {
  return rpcRequest('files/list_folder', params, this.getAccessToken());
};

module.exports = DropboxApi;
