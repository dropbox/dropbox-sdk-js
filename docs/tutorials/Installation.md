This package supports ES6 Modules, CommonJS and UMD distributable files we will guide you through the installation steps of installing the JavaScript SDK for your application. If you're having problems installing the package please [submit an issue](https://github.com/dropbox/dropbox-sdk-js/issues).

## Prerequisites
This library depends on the Promise global which requires a polyfill ([es6-promise](https://www.npmjs.com/package/es6-promise)) for unsupported browsers. It also requires that `fetch` be passed into the constructor; we advise using the [isormophic-fetch](https://www.npmjs.com/package/isomorphic-fetch) library which supports fetch within both environments.

## Methods of installation
**With npm or yarn**

`npm i dropbox -S` or `yarn add dropbox`

Using an up-to-date [npm](https://www.npmjs.com/) or yarn package you can install [dropbox](http://dropbox.github.io/dropbox-sdk-js) package the from the official npm registry.


**With jspm**

`jspm install dropbox --save-dev`

We provide interoperability with JSPM to expose the ES6 modules directly to your application.


**With cached distributed files**

Alternatively, you can load our UMD package directly from [unpkg](https://unpkg.com/). This will expose Dropbox as a global - window.Dropbox.Dropbox within browsers.


## Next steps
Once installed, you're ready to [get started](https://dropbox.github.io/dropbox-sdk-js/tutorial-Getting%20started.html).
