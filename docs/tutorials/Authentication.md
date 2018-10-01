The Dropbox SDK uses [OAuth 2](http://oauth.net/) for authorizing API
requests. Dropbox requires an access token to make authenticated requests.
The access token can be supplied at instantiation or set later using the
`setAccessToken()` method.

For more information on how to obtain an access token using OAuth, please
see our [OAuth Guide](https://www.dropbox.com/developers/reference/oauth-guide).

### Dropbox.getAuthenticationUrl()
`Dropbox.getAuthenticationUrl()` is a method that is very helpful for
authenticating users. See the [authentication
example](https://github.com/dropbox/dropbox-sdk-js/blob/master/examples/javascript/auth/index.html) for a basic example of how it can be
used.

### Dropbox.authenticateWithCordova()
`Dropbox.authenticateWithCordova()` is a method that simplifies authentication from a Cordova / PhoneGap application.

```javascript
var fetch = require('isomorphic-fetch');
var Dropbox = require('dropbox').Dropbox;
var dbx = new Dropbox({ clientId: 'YOUR_CLIENT_KEY_HERE', fetch: fetch });
dbx.authenticateWithCordova(
  function(accessToken) {
      console.log(accessToken);
  },
  function() {
      console.log("failed");
  });
```

The method requires the cordova inappbrowser plugin.
```console
$ cordova plugin add cordova-plugin-inappbrowser
```

## Using the SDK
Learn more about using the [JavaScript SDK](tutorial-JavaScript%20SDK.html)
