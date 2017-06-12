[![Build Status](https://travis-ci.org/dropbox/dropbox-sdk-js.svg?branch=master)](https://travis-ci.org/dropbox/dropbox-sdk-js) [![npm version](https://badge.fury.io/js/dropbox.svg)](https://badge.fury.io/js/dropbox)

# Dropbox JavaScript SDK
The Dropbox JavaScript SDK is a lightweight, promise based interface to the Dropbox v2 API that works in both nodejs and browser environments. It provides common services for making API requests and helper utilities contributed by the community.  

## Tutorials

- [Installation](tutorial-Installation.html)
- [Getting started](tutorial-Getting%20started.html)
- [JavaScript SDK](tutorial-JavaScript%20SDK.html)
- [Authentication](tutorial-Authentication.html)

## Examples

See [examples/](https://github.com/dropbox/dropbox-sdk-js/tree/master/examples) for working examples of how the SDK can be used in a few different environments.

## Contributing

Please see [CONTRIBUTING.md](https://github.com/dropbox/dropbox-sdk-js/blob/master/CONTRIBUTING.md) for information on how to contribute, setup the development environment and run tests.

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
