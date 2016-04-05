(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.DropboxApi = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./dropbox-api":2}],2:[function(require,module,exports){
// This file sets up and exports the base class for the Dropbox Api sdk.
// It is extended in browse and node with the environment appropriate request
// and error handling.

var DropboxApi = function () {
  this.accessToken = '';
  this.BASE_URI = 'https://api.dropboxapi.com/2/';
};

DropboxApi.prototype.setAccessToken = function (accessToken) {
  this.accessToken = accessToken;
};

DropboxApi.prototype.listFolder = function (path) {
  var url = this.BASE_URI + 'files/list_folder';
  return this.genericPostRequest(url, { path: path });
};

module.exports = DropboxApi;

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYnJvd3Nlci5qcyIsInNyYy9kcm9wYm94LWFwaS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgRHJvcGJveEFwaSA9IHJlcXVpcmUoJy4vZHJvcGJveC1hcGknKTtcblxuLy8gQSBnZW5lcmljIFhNTEh0dHBSZXF1ZXN0IGJhc2VkIGZ1bmN0aW9uIGZvciBtYWtpbmcgcmVxdWVzdHMgdG8gdGhlIEFQSSBmcm9tXG4vLyB0aGUgYnJvd3Nlci5cbnZhciBwZXJmb3JtUmVxdWVzdCA9IGZ1bmN0aW9uKHJlcXVlc3REYXRhKSB7XG4gIHZhciByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblxuICB2YXIgcHJvbWlzZUZ1bmN0aW9uID0gZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG5cbiAgICBmdW5jdGlvbiBzdWNjZXNzKGRhdGEpIHtcbiAgICAgIGlmIChyZXNvbHZlKSB7XG4gICAgICAgIHJlc29sdmUoZGF0YSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZmFpbHVyZSgpIHtcbiAgICAgIGlmIChyZWplY3QpIHtcbiAgICAgICAgcmVqZWN0KHJlcSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIHR5cGUgPSByZXF1ZXN0RGF0YS50eXBlIHx8ICdQT1NUJztcbiAgICByZXEub3Blbih0eXBlLCByZXF1ZXN0RGF0YS51cmwpO1xuICAgIGlmIChyZXF1ZXN0RGF0YS5hY2Nlc3NUb2tlbikge1xuICAgICAgcmVxLnNldFJlcXVlc3RIZWFkZXIoJ0F1dGhvcml6YXRpb24nLCAnQmVhcmVyICcgKyByZXF1ZXN0RGF0YS5hY2Nlc3NUb2tlbik7XG4gICAgfVxuXG4gICAgcmVxLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHJlcS5yZWFkeVN0YXRlID09PSA0KSB7XG4gICAgICAgIHZhciBkYXRhID0gbnVsbDtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBkYXRhID0gcmVxLnJlc3BvbnNlVGV4dCA/IEpTT04ucGFyc2UocmVxLnJlc3BvbnNlVGV4dCkgOiAnJztcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHJlcS5zdGF0dXMgPj0gMjAwICYmIHJlcS5zdGF0dXMgPCAzMDApIHtcbiAgICAgICAgICBzdWNjZXNzKGRhdGEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZhaWx1cmUoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICBpZiAodHlwZSA9PT0gJ0dFVCcpIHtcbiAgICAgIHJlcS5zZW5kKG51bGwpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXEuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICAgIHJlcS5zZW5kKHJlcXVlc3REYXRhLnBvc3REYXRhID8gSlNPTi5zdHJpbmdpZnkocmVxdWVzdERhdGEucG9zdERhdGEpIDogbnVsbCk7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBuZXcgd2luZG93LlByb21pc2UocHJvbWlzZUZ1bmN0aW9uKTtcbn07XG5cbkRyb3Bib3hBcGkucHJvdG90eXBlLmdlbmVyaWNQb3N0UmVxdWVzdCA9IGZ1bmN0aW9uKHVybCwgYm9keSwgb3B0aW9ucykge1xuICB2YXIgcmVxdWVzdERhdGEgPSB7XG4gICAgdXJsOiB1cmwsXG4gICAgcG9zdERhdGE6IGJvZHksXG4gICAgYWNjZXNzVG9rZW46IHRoaXMuYWNjZXNzVG9rZW5cbiAgfTtcbiAgcmV0dXJuIHBlcmZvcm1SZXF1ZXN0KHJlcXVlc3REYXRhKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRHJvcGJveEFwaTtcbiIsIi8vIFRoaXMgZmlsZSBzZXRzIHVwIGFuZCBleHBvcnRzIHRoZSBiYXNlIGNsYXNzIGZvciB0aGUgRHJvcGJveCBBcGkgc2RrLlxuLy8gSXQgaXMgZXh0ZW5kZWQgaW4gYnJvd3NlIGFuZCBub2RlIHdpdGggdGhlIGVudmlyb25tZW50IGFwcHJvcHJpYXRlIHJlcXVlc3Rcbi8vIGFuZCBlcnJvciBoYW5kbGluZy5cblxudmFyIERyb3Bib3hBcGkgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuYWNjZXNzVG9rZW4gPSAnJztcbiAgdGhpcy5CQVNFX1VSSSA9ICdodHRwczovL2FwaS5kcm9wYm94YXBpLmNvbS8yLyc7XG59O1xuXG5Ecm9wYm94QXBpLnByb3RvdHlwZS5zZXRBY2Nlc3NUb2tlbiA9IGZ1bmN0aW9uIChhY2Nlc3NUb2tlbikge1xuICB0aGlzLmFjY2Vzc1Rva2VuID0gYWNjZXNzVG9rZW47XG59O1xuXG5Ecm9wYm94QXBpLnByb3RvdHlwZS5saXN0Rm9sZGVyID0gZnVuY3Rpb24gKHBhdGgpIHtcbiAgdmFyIHVybCA9IHRoaXMuQkFTRV9VUkkgKyAnZmlsZXMvbGlzdF9mb2xkZXInO1xuICByZXR1cm4gdGhpcy5nZW5lcmljUG9zdFJlcXVlc3QodXJsLCB7IHBhdGg6IHBhdGggfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IERyb3Bib3hBcGk7XG4iXX0=
