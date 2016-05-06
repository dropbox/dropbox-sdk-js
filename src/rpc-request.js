var request = require('superagent');
var Promise = require('es6-promise').Promise;

var BASE_URL = 'https://api.dropboxapi.com/2/';

// This doesn't match what was spec'd in paper doc yet
var buildCustomError = function (error, response) {
  return {
    status: error.status,
    error: response.text,
    response: response
  };
};

var rpcRequest = function (path, body, accessToken) {
  var promiseFunction = function (resolve, reject) {
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
      if (error) {
        failure(buildCustomError(error, response));
      } else {
        success(response.body);
      }
    }

    request.post(BASE_URL + path)
      .type('application/json')
      .set('Authorization', 'Bearer ' + accessToken)
      .send(body)
      .end(responseHandler);
  };

  return new Promise(promiseFunction);
};

module.exports = rpcRequest;
