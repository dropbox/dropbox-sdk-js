var REQUEST_CONSTANTS = require('./request-constants');
var endpoints = {};

/**
 * Returns the contents of a folder.
 * @param {Object} params - The requests parameters
 * @param {string} params.path - The path to the folder you want to see the contents of.
 * @param {boolean} [params.recursive=false] - If true, the list folder operation will be applied recursively to all subfolders and the response will contain contents of all subfolders.
 * @param {boolean} [params.include_media_info=false] - If true, FileMetadata.media_info is set for photo and video.
 * @param {boolean} [params.include_deleted=false] - If true, the results will include entries for files and folders that used to exist but were deleted.
 * @returns {Object}
 * */
endpoints.filesListFolder = function (params) {
  return this.request('files/list_folder', params, REQUEST_CONSTANTS.RPC);
};

module.exports = endpoints;
