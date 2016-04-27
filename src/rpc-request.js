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

    if (this.useCookieAuth) {
      request.post(this.getBaseUrls().cookieAuth + path)
        .type('application/json')
        .set('X-Dropbox-Subject-User', this.getSubjectUid())
        .set('X-CSRF-Token', this.getCsrfToken())
        .withCredentials()
        .send(body)
        .end(responseHandler);
    } else {
      request.post(this.getBaseUrls().tokenAuth + path)
        .type('application/json')
        .set('Authorization', 'Bearer ' + this.getAccessToken())
        .send(body)
        .end(responseHandler);
    }
  };

  return new Promise(promiseFunction.bind(this));
};

module.exports = rpcRequest;
