# Dropbox JavaScript SDK

[![node-current](https://img.shields.io/node/v/dropbox)](https://www.npmjs.com/package/dropbox)
[![npm](https://img.shields.io/npm/v/dropbox)](https://www.npmjs.com/package/dropbox)
[![codecov](https://codecov.io/gh/dropbox/dropbox-sdk-js/branch/main/graph/badge.svg)](https://codecov.io/gh/dropbox/dropbox-sdk-js)

The official Dropbox API v2 SDK for JavaScript.

## Runtime support

The SDK supports Node.js, modern web browsers, and Web Workers. Continuous
integration currently tests Node.js 22 and 24. Browser and Worker environments
must provide `Promise`, `fetch`, and `TextEncoder`; PKCE authentication also
requires the Web Crypto API. Add polyfills when targeting older environments
that do not provide the required APIs.

## Installation

Create an app in the [Developer Console][devconsole], then install the SDK from
npm. Published npm packages already contain CommonJS, ES module, browser, and
TypeScript builds; applications do not need to build the SDK from source.

```sh
npm install dropbox
```

### Node.js

```js
const { Dropbox } = require('dropbox');

const dbx = new Dropbox({
  accessToken: process.env.DROPBOX_ACCESS_TOKEN,
});

dbx.filesListFolder({ path: '' })
  .then(({ result }) => console.log(result.entries))
  .catch(console.error);
```

### Browser application with a bundler

Webpack, Rollup, Vite, and similar tools can use the package's ES module build.

```js
import { Dropbox } from 'dropbox';

const dbx = new Dropbox({ accessToken: 'YOUR_ACCESS_TOKEN' });
```

### Browser application from a CDN

The browser bundle exposes the SDK through the global `Dropbox` object. Pin an
exact SDK version so a future breaking release cannot change your application
unexpectedly.

```html
<script src="https://cdn.jsdelivr.net/npm/dropbox@10.34.0/dist/Dropbox-sdk.min.js"></script>
<script>
  const dbx = new Dropbox.Dropbox({ accessToken: 'YOUR_ACCESS_TOKEN' });
</script>
```

Do not hard-code production access tokens in public source code.

### Web Worker

The same browser bundle can be loaded in a Worker:

```js
importScripts('https://cdn.jsdelivr.net/npm/dropbox@10.34.0/dist/Dropbox-sdk.min.js');

const dbx = new Dropbox.Dropbox({ accessToken: 'YOUR_ACCESS_TOKEN' });
```

### Install from source

Building is required only when developing the SDK itself or running examples
directly from this repository.

```sh
git clone https://github.com/dropbox/dropbox-sdk-js.git
cd dropbox-sdk-js
npm install
npm run build
```

## Browser authentication and PKCE

Client-side applications cannot keep an app secret confidential. Never embed a
Dropbox app secret in browser or Worker code. Use the OAuth authorization-code
flow with PKCE and your app key instead. See the [browser PKCE example][pkce-example]
and the [Dropbox OAuth guide][oauthguide]. PKCE requires a secure context and the
Web Crypto API.

Server applications can keep an app secret confidential and may use the regular
authorization-code flow.

## API reference

- [Dropbox class][dropbox-class] — Dropbox API routes for files, sharing, users,
  teams, and other namespaces.
- [DropboxAuth class][dropbox-auth] — OAuth URLs, PKCE, access tokens, and token
  refresh.
- [DropboxResponseError class][dropbox-error] — errors returned by API requests.
- [Global API][global-api] — generated methods and route type definitions.

The complete generated [API reference][documentation] is published on GitHub
Pages.

## Examples

The [examples][examples] demonstrate common SDK operations. Most are available
in both JavaScript and TypeScript, with additional Node.js OAuth examples.

- **OAuth**
    - Auth - [ [JS](https://github.com/dropbox/dropbox-sdk-js/tree/main/examples/javascript/auth) ] - A simple auth example to get an access token and list the files in the root of your Dropbox account.
    - Simple Backend [ [JS](https://github.com/dropbox/dropbox-sdk-js/tree/main/examples/javascript/simple-backend) ] - A simple example of a node backend doing a multi-step auth flow for Short Lived Tokens.
    - PKCE Backend [ [JS](https://github.com/dropbox/dropbox-sdk-js/tree/main/examples/javascript/PKCE-backend) ] - A simple example of a node backend doing a multi-step auth flow using PKCE and Short Lived Tokens.
    - PKCE Browser [ [JS](https://github.com/dropbox/dropbox-sdk-js/tree/main/examples/javascript/pkce-browser) ] - A simple example of a frontend doing a multi-step auth flow using PKCE and Short Lived Tokens.

- **Other Examples**
    - Basic - [ [TS](https://github.com/dropbox/dropbox-sdk-js/tree/main/examples/typescript/basic), [JS](https://github.com/dropbox/dropbox-sdk-js/tree/main/examples/javascript/basic) ] - A simple example that takes in a token and fetches files from your Dropbox account.
    - Download - [ [TS](https://github.com/dropbox/dropbox-sdk-js/tree/main/examples/typescript/download), [JS](https://github.com/dropbox/dropbox-sdk-js/tree/main/examples/javascript/download) ] - An example showing how to download a shared file.
    - Team As User - [ [TS](https://github.com/dropbox/dropbox-sdk-js/tree/main/examples/typescript/team-as-user), [JS](https://github.com/dropbox/dropbox-sdk-js/tree/main/examples/javascript/team-as-user) ] - An example showing how to act as a user.
    - Team - [ [TS](https://github.com/dropbox/dropbox-sdk-js/tree/main/examples/typescript/team), [JS](https://github.com/dropbox/dropbox-sdk-js/tree/main/examples/javascript/team) ] - An example showing how to use the team functionality and list team devices.
    - Upload [ [TS](https://github.com/dropbox/dropbox-sdk-js/tree/main/examples/typescript/upload), [JS](https://github.com/dropbox/dropbox-sdk-js/tree/main/examples/javascript/upload) ] - An example showing how to upload a file to Dropbox.

## Getting Help

If you find a bug, please see [CONTRIBUTING.md][contributing] for information on how to report it.

If you need help that is not specific to this SDK, please reach out to [Dropbox Support][support].

## License

This SDK is distributed under the MIT license, please see [LICENSE][license] for more information.

[documentation]: https://dropbox.github.io/dropbox-sdk-js/Dropbox.html
[dropbox-class]: https://dropbox.github.io/dropbox-sdk-js/Dropbox.html
[dropbox-auth]: https://dropbox.github.io/dropbox-sdk-js/DropboxAuth.html
[dropbox-error]: https://dropbox.github.io/dropbox-sdk-js/DropboxResponseError.html
[global-api]: https://dropbox.github.io/dropbox-sdk-js/global.html
[examples]: https://github.com/dropbox/dropbox-sdk-js/tree/main/examples
[license]: https://github.com/dropbox/dropbox-sdk-js/blob/main/LICENSE
[contributing]: https://github.com/dropbox/dropbox-sdk-js/blob/main/CONTRIBUTING.md
[devconsole]: https://dropbox.com/developers/apps
[oauthguide]: https://www.dropbox.com/lp/developers/reference/oauth-guide
[pkce-example]: https://github.com/dropbox/dropbox-sdk-js/tree/main/examples/javascript/pkce-browser
[support]: https://www.dropbox.com/developers/contact
