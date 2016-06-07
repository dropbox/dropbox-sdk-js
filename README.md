# Dropbox JavaScript SDK

The Dropbox JavaScript SDK is lightweight and provides a promise based
interface to the Dropbox v2 API that works in both nodejs and browser
environments.

## Table of Contents

- [Documentation](#documentation)
- [Quickstart](#quickstart)
- [Examples](#examples)
- [Versioning](#versioning)
- [Contributing](#contributing)

## Documentation

The full documentation can be found here:
<http://dropbox.github.io/dropbox-sdk-js>

## Quickstart

Install the SDK using npm:
```console
$ npm install --save dropbox
```

Use with a module bundler like
[webpack](https://github.com/webpack/webpack) or
[browserify](http://browserify.org/):
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

## Versioning

We will try to follow [semver](http://semver.org/) as close as possible.
That means bug fixes will be patch releases (1.0.1 -> 1.0.2), additional
functionality like new endpoints will be minor releases (1.0.1 -> 1.1.0)
and breaking changes to both the library and the API endpoints it hits,
will be major releases (1.0.1 -> 2.0.0).

## Contributing

Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for information on how to
contribute, setup the development environment and run tests.
