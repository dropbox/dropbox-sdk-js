# Dropbox SDK examples

The examples require Node.js 22 or newer. From the repository root, install and
build the SDK first:

```sh
npm install
npm run build
```

## Browser JavaScript examples

From the repository root, start the development server:

```sh
node examples/javascript/server.js
```

Open <http://localhost:8080/> in your browser.

## TypeScript examples

From the repository root, install the example dependencies and compile the
examples:

```sh
cd examples/typescript
npm install
npm run build
```

Run the compiled JavaScript from `examples/typescript`, for example:

```sh
node dist/team-as-user/team-as-user.js
```

The other examples are `basic`, `download`, `team`, and `upload`; their compiled
files follow the same `dist/<name>/<name>.js` pattern. After editing a `.ts`
file, run `npm run build` again before running its compiled `.js` file. Do not
run the TypeScript source directly with `node`.

## Simple backend OAuth example

1. Build the SDK as described above.
2. From the repository root, install the example's local SDK dependency:

   ```sh
   cd examples/javascript/simple-backend
   npm install
   ```

3. Create an app in the [App console](https://www.dropbox.com/developers/apps)
   and add `http://localhost:3000/auth` as a redirect URI.
4. Set `clientId` and `clientSecret` in `code_flow_example.js` to the app key
   and secret.
5. From `examples/javascript/simple-backend`, run:

   ```sh
   node code_flow_example.js
   ```

6. Open <http://localhost:3000/> and follow the authorization flow.

The backend example uses CommonJS (`require('dropbox')`). Node.js 22 provides
`fetch`, so the example does not need a separate fetch package. If an error
names a file in your own application as an ES module, check that application's
module configuration and use `import` to load ES modules.
