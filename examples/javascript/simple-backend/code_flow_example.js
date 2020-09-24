// Standalone example to demonstrate codeflow.
// Start the server, hit localhost:3000 on the browser, and click through.
// On the server logs, you should have the auth code, as well as the token
// from exchanging it. This exchange is invisible to the app user

const fetch = require('node-fetch');
const app = require('express')();

const hostname = 'localhost';
const port = 3000;

const config = {
  fetch,
  clientId: 'jg8wc1hfkvel6ql',
  clientSecret: 'f0i5w4e6mlbbme5',
};

const { Dropbox } = require('dropbox'); // eslint-disable-line import/no-unresolved

const dbx = new Dropbox(config);

const redirectUri = `http://${hostname}:${port}/auth`;
const authUrl = dbx.auth.getAuthenticationUrl(redirectUri, null, 'code', 'offline', null, 'none', false);

app.get('/', (req, res) => {
  res.writeHead(302, { Location: authUrl });
  res.end();
});

app.get('/auth', (req, res) => { // eslint-disable-line no-unused-vars
  const { code } = req.query;
  console.log(`code:${code}`);

  dbx.auth.getAccessTokenFromCode(redirectUri, code)
    .then((token) => {
      console.log(`Token Result:${JSON.stringify(token)}`);
      dbx.auth.setRefreshToken(token.refreshToken);
      dbx.usersGetCurrentAccount()
        .then((response) => {
          console.log('response', response);
        })
        .catch((error) => {
          console.error(error);
        });
    })
    .catch((error) => {
      console.log(error);
    });
});

app.listen(port);
