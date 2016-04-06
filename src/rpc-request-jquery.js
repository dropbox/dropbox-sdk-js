var $ = require('jquery');
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

    console.log('using jquery.ajax');

    $.ajax(BASE_URL + path, {
      contentType: 'application/json',
      data: JSON.stringify(body),
      headers: {
        'Authorization': 'Bearer ' + accessToken
      },
      method: 'POST',
      success: function(data) {
        success(data);
      },
      error: function(jqXHR, textStatus) {
        // TODO: this is not the same custom error object the other function uses
        failure(jqXHR);
      }
    });
  };

  return new Promise(promiseFunction);
};

module.exports = rpcRequest;
