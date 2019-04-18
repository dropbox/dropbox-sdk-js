# Dropbox JavaScript SDK
[![Build Status](https://travis-ci.org/dropbox/dropbox-sdk-js.svg?branch=master)](https://travis-ci.org/dropbox/dropbox-sdk-js) [![npm version](https://badge.fury.io/js/dropbox.svg)](https://badge.fury.io/js/dropbox)
The Dropbox JavaScript SDK is a lightweight, promise based interface to the Dropbox v2 API that works in both nodejs and browser environments. It provides common services for making API requests and helper utilities contributed by the community.

## Documentation
Please view our full JavaScript SDK documentation at <http://dropbox.github.io/dropbox-sdk-js>.

## Prerequisites
This library depends on the Promise global which requires a polyfill ([es6-promise](https://www.npmjs.com/package/es6-promise)) for unsupported browsers. It also requires that `fetch` be passed into the constructor; we advise using the [isomorphic-fetch](https://www.npmjs.com/package/isomorphic-fetch) library which supports fetch within both environments.

## Quickstart
For a quick overview the below example will install the package and use it as a CommonJS module. For more alternative loading options please view our [Getting started](http://dropbox.github.io/dropbox-sdk-js/tutorial-Getting%20started.html) tutorial.

Install the SDK with npm
```console
$ npm install --save dropbox
```

Include the Dropbox or DropboxTeam class to start making your API calls.

```javascript
var fetch = require('isomorphic-fetch'); // or another library of choice.
var Dropbox = require('dropbox').Dropbox;
var dbx = new Dropbox({ accessToken: 'YOUR_ACCESS_TOKEN_HERE', fetch: fetch });
dbx.filesListFolder({path: ''})
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

## Contributing
Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for information on how to
contribute, setup the development environment and run tests.

## Versioning
We will try to follow [semver](http://semver.org/) as close as possible.
That means bug fixes will be patch releases (1.0.1 -> 1.0.2), additional
functionality like new endpoints will be minor releases (1.0.1 -> 1.1.0)
and breaking changes to both the library and the API endpoints it hits,
will be major releases (1.0.1 -> 2.0.0).

This SDK will be taking the `dropbox` package name on
[npm](https://www.npmjs.com/package/dropbox) from the [legacy
SDK](https://github.com/dropbox/dropbox-js), that uses the old version of
the Dropbox API. This will bump the version number from `0.10.3` to
`2.0.0`, which should avoid breaking changes due to semver assumptions.
