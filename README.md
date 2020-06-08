# Dropbox JavaScript SDK
[![Build Status](https://travis-ci.org/dropbox/dropbox-sdk-js.svg?branch=master)](https://travis-ci.org/dropbox/dropbox-sdk-js)
[![npm version](https://badge.fury.io/js/dropbox.svg)](https://badge.fury.io/js/dropbox)

The Dropbox JavaScript SDK is a lightweight, promise based interface to the Dropbox v2 API that works in both nodejs and browser environments. It provides common services for making API requests and helper utilities contributed by the community.  This library depends on the Promise global which requires a polyfill ([es6-promise](https://www.npmjs.com/package/es6-promise)) for unsupported browsers.

It also requires that `fetch` be passed into the constructor; we advise using the [isomorphic-fetch](https://www.npmjs.com/package/isomorphic-fetch) library which supports fetch within both environments.

A JavaScript SDK for integrating with the Dropbox API v2. Node v6+. Documentation is available on [gh-pages](http://dropbox.github.io/dropbox-sdk-js/).

Installation
------------

Create an app at https://dropbox.com/developers/apps

Install via [npm](https://www.npmjs.com):

```console
    $ npm install --save dropbox
```

Install from source:

```console
    $ git clone git://github.com/dropbox/dropbox-sdk-js.git
    $ cd dropbox-sdk-js
    $ npm install
```

After installation, to get started, follow one of our examples or read the documentation on [gh-pages](http://dropbox.github.io/dropbox-sdk-js/).

Authentication
--------------

All requests need to be made with an OAuth 2 access token. To get started, once you've created an app, you can go to the app's console and generate an access
token for your own Dropbox account for development.  You can also find a variety of examples outlining different authorization flows under:

- [Code Flow Example](http://github.com/dropbox/dropbox-sdk-js/tree/master/examples/javascript/simple-backend/)
- [PKCE Flow Example](http://github.com/dropbox/dropbox-sdk-js/tree/master/examples/javascript/PKCE-backend/)
- [Front-End Auth Example](http://github.com/dropbox/dropbox-sdk-js/tree/master/examples/javascript/auth/)

You can also view our OAuth [guide](https://www.dropbox.com/lp/developers/reference/oauth-guide.html)

Example Applications
--------------------

- [JavaScript](https://github.com/dropbox/dropbox-sdk-js/tree/master/examples/javascript) - A set sample applications that demonstrate various functionalities
- [TypeScript](http://github.com/dropbox/dropbox-sdk-js/tree/master/examples/typescript/) - A set of sample applications the demonstrate various functionalities

Contributing
------------

Contributions to this SDK are always welcome and encouraged!

See the [CONTRIBUTING](http://github.com/dropbox/dropbox-sdk-js/blob/master/CONTRIBUTING.md) doc for more information

License
-------
MIT - See the [LICENSE](http://github.com/dropbox/dropbox-sdk-js/blob/master/LICENSE) for more information
