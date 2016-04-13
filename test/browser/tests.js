var assert = chai.assert;

var xhr, requests, dbx;

var ACCESS_TOKEN = 'ACCESS_TOKEN';

before(function () {
  dbx = new DropboxApi({ accessToken: ACCESS_TOKEN });
  xhr = sinon.useFakeXMLHttpRequest();
  requests = [];
  xhr.onCreate = function (req) { requests.push(req); };
});

after(function () {
  // Like before we must clean up when tampering with globals.
  xhr.restore();
  dbx = null;
});

describe('DropboxApi [Browser]', function () {
  it('makes a POST request for folder items', function () {
    var request;
    dbx.filesListFolder({ path: '/Screenshots' });
    request = requests[0];
    assert.equal(requests.length, 1);
    assert.equal(request.requestHeaders.Authorization, 'Bearer ' + ACCESS_TOKEN);
    assert.equal(request.requestHeaders['Content-Type'], 'application/json;charset=utf-8');
    assert.equal(request.method, 'POST');
    assert.equal(request.url, 'https://api.dropboxapi.com/2/files/list_folder');
    assert.deepEqual(JSON.parse(request.requestBody), { path: '/Screenshots' });
  });
});
