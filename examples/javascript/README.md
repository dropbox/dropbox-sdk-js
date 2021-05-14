# Dropbox JavaScript SDK Examples

To run the examples in your development environment:

1. Clone this repo
2. Run `npm install` in the root of the repository
3. Run `npm run build` in the root of the repository
4. From this directory, start the development server with
   `node server.js`.
5. Point your browser to <http://0.0.0.0:8080/>

## Code flow example

1. Clone this repo
2. Run `npm install`
3. Run `npm run build` in the root of the repository
4. Create an app in the [App console](https://www.dropbox.com/developers/apps).
5. Set a redirect URI "http://localhost:3000/auth" on the app's page on the [App
console](https://www.dropbox.com/developers/apps).
6. Set app key and secret in `examples/javascript/simple-backend/code_flow_example.js` on lines
17 and 18.
7. Run `node examples/javascript/simple-backend/code_flow_example.js`
8. Point your browser to <http://0.0.0.0:3000/>
