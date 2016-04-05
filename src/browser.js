var DropboxApi = require('./dropbox-api');

// A generic XMLHttpRequest based function for making requests to the API from
// the browser.
var performRequest = function(requestData) {
  var req = new XMLHttpRequest();

  var promiseFunction = function(resolve, reject) {

    function success(data) {
      if (resolve) {
        resolve(data);
      }
    }

    function failure() {
      if (reject) {
        reject(req);
      }
    }

    var type = requestData.type || 'POST';
    req.open(type, requestData.url);
    if (requestData.accessToken) {
      req.setRequestHeader('Authorization', 'Bearer ' + requestData.accessToken);
    }

    req.onreadystatechange = function() {
      if (req.readyState === 4) {
        var data = null;
        try {
          data = req.responseText ? JSON.parse(req.responseText) : '';
        } catch (e) {
          console.log(e);
        }

        if (req.status >= 200 && req.status < 300) {
          success(data);
        } else {
          failure();
        }
      }
    };

    if (type === 'GET') {
      req.send(null);
    } else {
      req.setRequestHeader('Content-Type', 'application/json');
      req.send(requestData.postData ? JSON.stringify(requestData.postData) : null);
    }
  };

  return new window.Promise(promiseFunction);
};

DropboxApi.prototype.genericPostRequest = function(url, body, options) {
  var requestData = {
    url: url,
    postData: body,
    accessToken: this.accessToken
  };
  return performRequest(requestData);
};

module.exports = DropboxApi;
