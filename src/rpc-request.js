var request = require('superagent');
var Promise = require('es6-promise').Promise;

var BASE_URL = 'https://meta-dbdev.dev.corp.dropbox.com/2/';

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

    var requestObj = request.post(BASE_URL + path).type('application/json');

    // Setup access token or cookie based auth
    if (this.useCookieAuth) {
      requestObj
        .set('X-Dropbox-Subject-User', this.getSubjectUid())
        .set('X-CSRF-Token', this.getCsrfToken())
        .withCredentials();
    } else {
      requestObj.set('Authorization', 'Bearer ' + this.getAccessToken());
    }

    requestObj
      .send(body)
      .end(function (error, response) {
        if (error) {
          failure(buildCustomError(error, response));
        } else {
          success(response.body);
        }
      });
  };

  return new Promise(promiseFunction.bind(this));
};

module.exports = rpcRequest;
