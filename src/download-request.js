var request = require('superagent');
var Promise = require('es6-promise').Promise;

var buildCustomError;
var downloadRequest;
var BASE_URL = 'https://content.dropboxapi.com/2/';

// Register a handler that will instruct superagent how to parse the response
request.parse['application/octect-stream'] = function (obj) {
  return obj;
};

// This doesn't match what was spec'd in paper doc yet
buildCustomError = function (error, response) {
  return {
    status: error.status,
    error: response.text,
    response: response
  };
};

downloadRequest = function (path, args, accessToken, selectUser) {
  var promiseFunction = function (resolve, reject) {
    var apiRequest;

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

    function responseHandler(error, response) {
      var responseData;
      if (error) {
        failure(buildCustomError(error, response));
      } else {
        responseData = JSON.parse(response.headers['dropbox-api-result']);
        responseData.blob = response.xhr.response;
        success(responseData);
      }
    }

    apiRequest = request.post(BASE_URL + path)
      .set('Authorization', 'Bearer ' + accessToken)
      .set('Dropbox-API-Arg', JSON.stringify(args))
      .on('request', function () {
        this.xhr.responseType = 'blob';
      });

    if (selectUser) {
      apiRequest = apiRequest.set('Dropbox-API-Select-User', selectUser);
    }

    // apiRequest.send(body)
    apiRequest.end(responseHandler);
  };

  return new Promise(promiseFunction);
};

module.exports = downloadRequest;
