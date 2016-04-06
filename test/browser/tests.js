var assert = chai.assert;

var xhr, requests, dbx;

before(function () {
  dbx = new DropboxApi();
  xhr = sinon.useFakeXMLHttpRequest();
  requests = [];
  xhr.onCreate = function (req) { requests.push(req); };
});

after(function () {
  // Like before we must clean up when tampering with globals.
  xhr.restore();
  dbx = null;
});

describe('DropboxApi', function () {
  it('makes a POST request for folder items', function () {
    dbx.listFolder('/Screenshots');
    assert.equal(requests.length, 1);
    assert.equal(requests[0].url, 'https://api.dropboxapi.com/2/files/list_folder');
  });
});
