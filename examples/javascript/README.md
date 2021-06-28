# Dropbox JavaScript SDK Examples

To run the examples in your development environment:

1. Clone this repo
2. Run `npm install`
3. From this directory, start the development server with
   `node server.js`.
4. Point your browser to <http://0.0.0.0:8080/>

## Code flow example

1. Clone this repo
2. Run `npm install` and `npm run build`
3. Create an app in the [App console](https://www.dropbox.com/developers/apps).
4. Set a redirect URI "http://localhost:3000/auth" on the app's page on the [App
console](https://www.dropbox.com/developers/apps).
5. Set app key and secret in `examples/javascript/simple-backend/code_flow_example.js` on lines
17 and 18.
6. Run `node examples/javascript/simple-backend/code_flow_example.js`
7. Point your browser to <http://localhost:3000/>
