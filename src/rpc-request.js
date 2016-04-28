var request = require('superagent');
var Promise = require('es6-promise').Promise;


// This doesn't match what was spec'd in paper doc yet
var buildCustomError = function (error, response) {
  return {
    status: error.status,
    error: response.text,
    response: response
  };
};

var rpcRequest = function (path, body, authDetails) {
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

    if (authDetails.useCookieAuth) {
      request.post(authDetails.baseUrls.cookieAuth + path)
        .type('application/json')
        .set('X-Dropbox-Subject-User', authDetails.subjectUid)
        .set('X-CSRF-Token', authDetails.csrfToken)
        .withCredentials()
        .send(body)
        .end(responseHandler);
    } else {
      request.post(authDetails.baseUrls.tokenAuth + path)
        .type('application/json')
        .set('Authorization', 'Bearer ' + authDetails.accessToken)
        .send(body)
        .end(responseHandler);
    }
  };

  return new Promise(promiseFunction);
};

module.exports = rpcRequest;
