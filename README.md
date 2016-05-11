# Dropbox API JavaScript Client

DropboxApi is lightweight JavaScript client that provides a promise based interface to the Dropbox v2 API that works in both nodejs and browser environments.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Examples](#examples)
- [Documentation](#documentation)
- [Contributing](#contributing)

## Installation

#### npm

Use [npm](https://www.npmjs.com/) for [nodejs](https://nodejs.org/en/), [webpack](https://github.com/webpack/webpack) or [browserify](http://browserify.org/):

```console
$ npm install @TODO --save
```

#### `<script>`

The UMD build is available on [npmcdn](https://npmcdn.com/):

```html
<script src="https://npmcdn.com/dropbox/@TODO.min.js"></script>
```

You can find the library on `window.DropboxApi`.

## Usage

#### Browser with `<script>`

```html
<script src="https://npmcdn.com/dropbox/@TODO.min.js"></script>
<script>
  var dbx = new DropboxApi({ accessToken: 'accessToken' });
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
var DropboxApi = require('@TODO');
var dbx = new DropboxApi({ accessToken: 'accessToken' });
dbx.filesListFolder({path: '/'})
  .then(function(response) {
    console.log(response);
  })
  .catch(function(error) {
    console.log(error);
  });
```

## Examples

See [examples/](examples/) for working examples of how the client can be used in a few different environments.

## Documentation

For documentation of all of the available endpoints, the parameters it receives and the data it returns, see @TODO. All other documentation can be found below.

#### Authentication

@TODO

#### Promises implementation

@TODO

#### Chaining promises

@TODO

## Contributing

Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for information on how to contribute, setup the development environment and run tests.
