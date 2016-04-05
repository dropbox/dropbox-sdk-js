var DropboxApi = require('./dropbox-api');
var Promise = require('es6-promise').Promise;
var request = require('request');

// A generic XMLHttpRequest based function for making requests to the API from node.
var performRequest = function(url, body, options) {
  var promiseFunction = function(resolve, reject) {

    function success(data) {
      if (resolve) {
        resolve(data);
      }
    }

    function failure(error) {
      if (reject) {
        reject(error);
      }
    }

    var requestOptions = {
      url: url,
      method: options.method || 'POST',
      json: true,
      headers: {}
    };

    if (options.accessToken) {
      requestOptions.headers['Authorization'] = 'Bearer ' + options.accessToken;
    }

    if (options.method !== 'GET') {
      requestOptions.body = body || {};
    }

    request(requestOptions, function(error, response, body) {
      if (error) {
        failure(error);
      } else {
        success(body);
      }
    });
  };

  return new Promise(promiseFunction);
};

DropboxApi.prototype.genericPostRequest = function(url, body, options) {
  return performRequest(url, body, {
    accessToken: this.accessToken
  });
};

module.exports = DropboxApi;
