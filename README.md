[![Logo][logo]][repo]

[![node-current](https://img.shields.io/node/v/dropbox)](https://www.npmjs.com/package/dropbox)
[![npm](https://img.shields.io/npm/v/dropbox)](https://www.npmjs.com/package/dropbox)
[![codecov](https://codecov.io/gh/dropbox/dropbox-sdk-js/branch/main/graph/badge.svg)](https://codecov.io/gh/dropbox/dropbox-sdk-js)

The offical Dropbox SDK for Javascript.

Documentation can be found on [GitHub Pages][documentation]

## Installation

Create an app via the [Developer Console][devconsole]

Install via [npm](https://www.npmjs.com/)

```
$ npm install --save dropbox
```

Install from source:

```
$ git clone https://github.com/dropbox/dropbox-sdk-js.git
$ cd dropbox-sdk-js
$ npm install
```

If you are using the repository from the browser, you can use any CDNs that hosts the Dropbox package by including a script tag with the link to the package. However, we highly recommend you do not directly import the latest version and instead choose a specific version. When we update and release a breaking change, this could break production code which we hope to avoid. Note, we follow [semver](https://semver.org/) naming conventions which means that any major version update could contain a breaking change.

After installation, follow one of our [Examples][examples] or read the [Documentation][documentation].

You can also view our [OAuth guide][oauthguide].

## Examples

We provide [Examples][examples] to help get you started with a lot of the basic functionality in the SDK.  We provide most examples in both Javascript and Typescript with some having a Node equivalent.

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

[logo]: https://cfl.dropboxstatic.com/static/images/sdk/javascript_banner.png
[repo]: https://github.com/dropbox/dropbox-sdk-js
[documentation]: https://dropbox.github.io/dropbox-sdk-js/
[examples]: https://github.com/dropbox/dropbox-sdk-js/tree/main/examples
[license]: https://github.com/dropbox/dropbox-sdk-js/blob/main/LICENSE
[contributing]: https://github.com/dropbox/dropbox-sdk-js/blob/main/CONTRIBUTING.md
[devconsole]: https://dropbox.com/developers/apps
[oauthguide]: https://www.dropbox.com/lp/developers/reference/oauth-guide
[support]: https://www.dropbox.com/developers/contact
