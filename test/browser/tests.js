var assert = chai.assert;

var xhr, requests, dbx;

var ACCESS_TOKEN = 'ACCESS_TOKEN';

before(function () {
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
  describe('access token', function () {
    it('defaults to an empty string', function () {
      dbx = new DropboxApi();
      assert.equal(dbx.getAccessToken(), '');
    });

    it('can be set in the constructor', function () {
      dbx = new DropboxApi({ accessToken: 'foo' });
      assert.equal(dbx.getAccessToken(), 'foo');
    });

    it('can be set after being instantiated', function () {
      dbx = new DropboxApi();
      dbx.setAccessToken('foo');
      assert.equal(dbx.getAccessToken(), 'foo');
    });
  });

  describe('rpcRequest', function () {
    it('defaults to the libraries implementation', function () {
      dbx = new DropboxApi();
      assert.equal(dbx.getAccessToken(), '');
    });

    it('can be set to something else by the user', function () {
      var aFunc = function () {};
      dbx = new DropboxApi();
      dbx.setRpcRequest(aFunc);
      assert.equal(dbx.getRpcRequest(), aFunc);
    });
  });

  it('makes a POST request for folder items', function () {
    var request;
    dbx = new DropboxApi({ accessToken: ACCESS_TOKEN });
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
