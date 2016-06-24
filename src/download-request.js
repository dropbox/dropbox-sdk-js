var request = require('superagent');
var Promise = require('es6-promise').Promise;

var BASE_URL = 'https://content.dropboxapi.com/2/';

// This doesn't match what was spec'd in paper doc yet
var buildCustomError = function (error, response) {
  return {
    status: error.status,
    error: response.text,
    response: response
  };
};

var downloadRequest = function (path, args, accessToken, selectUser) {
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
      var toDownload;
      if (error) {
        failure(buildCustomError(error, response));
      } else {
        responseData = JSON.parse(response.headers['dropbox-api-result']);
        toDownload = new Blob([response.xhr.response], { type: 'application/octet-stream' });
        responseData.objectDownloadUrl = URL.createObjectURL(toDownload);
        success(responseData);
      }
    }

    apiRequest = request.post(BASE_URL + path)
      .set('Authorization', 'Bearer ' + accessToken)
      .set('Dropbox-API-Arg', JSON.stringify(args));

    if (selectUser) {
      apiRequest = apiRequest.set('Dropbox-API-Select-User', selectUser);
    }

    // apiRequest.send(body)
    apiRequest.end(responseHandler);
  };

  return new Promise(promiseFunction);
};

module.exports = downloadRequest;
