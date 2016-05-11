# Contributing to Dropbox API JavaScript Client

## How to contribute

### Improve documentation

Typo corrections, error fixes, better explanations, more examples, etc are all extremely helpful and will be much appreciated.

### Improve issues

Some issues are created missing information, missing reproduction steps, a result of other third party code or are just invalid. Helping to clean up issues saves a lot of time and leads to things getting fixed faster.

### Write code

Bug fixes, code improvements and better tests are always welcome. Please see the steps below to get up and running. Please open an issue if you are considering opening a pull request for new funtionality.

> Note that `/src/routes.js` is a generated file and cannot be updated by changes to this repository

#### Development environment

You will need [Node.js](https://nodejs.org/en/) and [npm](https://www.npmjs.com/) installed on your machine. Run the following commands to setup a local development environment:

```console
$ git clone @TODO dropbox-api && cd dropbox-api
$ npm install && npm run develop
```

As you make changes to `src/` files, they will be recompiled to `dist/dropbox-sdk.js` and the examples directory will be available at <http://0.0.0.0:8000/examples/>

The develop command is a combination of `watch`, which watches for changes in `src/` and recompiles `dist/dropbox-sdk.js` and `examples-server`, which is just a simple python server for the examples html.

#### Tests
The following command runs the test suite:
```console
$ npm test
```

## Submitting an issue
@TODO

## Submitting a pull request
@TODO
