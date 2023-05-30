# Dropbox JavaScript SDK Examples

To run the examples in your development environment:

1. Clone this repo
2. Run `npm install` and `npm run build`
3. Start the development server with `node server.js`.
4. Point your browser to <http://localhost:8080/>

# Dropbox TypeScript SDK Examples

To run the examples in your development environment:

1. Clone this repo
2. Run `npm install` and `npm run build`
3. Run the example you want (basic, download, team, team-as-user, or upload)
   e.g. `node basic`

## Code flow example

1. Clone this repo
2. Run `npm install` and `npm run build` in the root of the repository
3. Create an app in the [App console](https://www.dropbox.com/developers/apps).
4. Set a redirect URI "http://localhost:3000/auth" on the app's page on the [App console](https://www.dropbox.com/developers/apps).
5. Set app key and secret in `examples/javascript/simple-backend/code_flow_example.js` on lines 17 and 18.
6. Run `node examples/javascript/simple-backend/code_flow_example.js`
7. Point your browser to <http://localhost:3000/>
