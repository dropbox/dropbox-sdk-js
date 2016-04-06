# Dropbox API v2 JavaScript Client

A lightweight JavaScript client that allows users to easily access the Dropbox API with a promise based interface.

## Development
You will need Node.js and npm installed on your machine.
```
// From repo root
npm install && npm run develop
```
As you make changes to `src/` files, they will be recompiled to `dist/dropbox-sdk.js` and the examples directory will be available at [http://0.0.0.0:8000/examples/](http://0.0.0.0:8000/examples/)

The develop command is a combination of `watch`, which watches for changes in `src/` and recompiles `dist/dropbox-sdk.js` and `examples-server`, which is just a simple python server for the examples html.

## Build
Run the following command to build an uglified and minified version of the client at `dist/dropbox-sdk.min.js`.
```
npm run build
```

## Examples
See `examples/` for examples of how the client can be used in a few different environments.
