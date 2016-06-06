# Dropbox JavaScript SDK

The Dropbox JavaScript SDK is lightweight and provides a promise based
interface to the Dropbox v2 API that works in both nodejs and browser
environments.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Examples](#examples)
- [Documentation](#documentation)
- [Versioning](#versioning)
- [Contributing](#contributing)

## Installation

#### Npm

Use [npm](https://www.npmjs.com/) for [nodejs](https://nodejs.org/en/),
[webpack](https://github.com/webpack/webpack) or
[browserify](http://browserify.org/):

```console
$ npm install dropbox --save
```

#### Script tag

The UMD build is available on [npmcdn](https://npmcdn.com/):

```html
<script src="https://npmcdn.com/dropbox/umd/dropbox-sdk.min.js"></script>
```

You can find the library on `window.Dropbox`.

## Usage

#### Browser with `<script>`

```html
<script src="https://npmcdn.com/dropbox/umd/dropbox-sdk.min.js"></script>
<script>
  var dbx = new Dropbox({ accessToken: 'YOUR_ACCESS_TOKEN_HERE' });
  dbx.filesListFolder({path: '/'})
    .then(function(response) {
      console.log(response);
    })
    .catch(function(error) {
      console.log(error);
    });
</script>
```

#### Nodejs, Browserify or Webpack

```javascript
var Dropbox = require('dropbox');
var dbx = new Dropbox({ accessToken: 'YOUR_ACCESS_TOKEN_HERE' });
dbx.filesListFolder({path: '/'})
  .then(function(response) {
    console.log(response);
  })
  .catch(function(error) {
    console.log(error);
  });
```

## Examples

See [examples/](examples/) for working examples of how the SDK can be used
in a few different environments.

## Documentation

#### Authentication

The Dropbox SDK uses [OAuth2](http://oauth.net/) for authorizing API
requests. Dropbox requires an access token to make authenticated requests.
The access token can be supplied at instantiation or set later using the
`setAccessToken()` method.

`Dropbox.getAuthenticationUrl()` is a method that is very helpful for
authenticating users. See the [authentication
example](examples/auth/index.html) for a basic example of how it can be
used.

For more information on how to obtain an access token using OAuth, please
see our [OAuth
Guide](https://www.dropbox.com/developers/reference/oauth-guide).

#### Endpoints

For documentation of all of the available endpoints, the parameters they
receive and the data they return, see [src/routes.js](src/routes.js).
These methods are all available directly from an instance of the API
class, ex: `dbx.filesListFolder()`.

@TODO: Autogenerate docs from JSDocs in routes.js.

#### Promises implementation

The SDK returns Promises using the [native Promise
implementation](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise)
and polyfills with
[jakearchibald/es6-promise](https://github.com/stefanpenner/es6-promise)
when needed.

## Versioning

We will try to follow [semver](http://semver.org/) as close as possible.
That means bug fixes will be patch releases (1.0.1 -> 1.0.2), additional
functionality like new endpoints will be minor releases (1.0.1 -> 1.1.0)
and breaking changes to both the library and the API endpoints it hits,
will be major releases (1.0.1 -> 2.0.0).

## Contributing

Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for information on how to
contribute, setup the development environment and run tests.
