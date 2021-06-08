# Upgrading the Dropbox SDK

This document is designed to show you how to upgrade to the latest version of the SDK accomodating any breaking changes introduced by major version updates.  If you find any issues with either this guide on upgrading or the changes introduced in the new version, please see [CONTRIBUTING.md][contributing]

# Upgrading from v9.X.X to v10.0.0 

## 1. Deprecating the `authenticateWithCordova` function

The `authenticateWithCordova` function used an in-app browser within the Cordova framework to authenticate users via OAuth. As a part of hardening security, we are following [Google’s recommendation](https://developers.googleblog.com/2016/08/modernizing-oauth-interactions-in-native-apps.html) to remove support for authentication via a “web-view” or in-app browsers. Since the `authenticateWithCordova` function relies on running in an in-app browser, we have made the choice to deprecate this function.

Instead, apps will need to implement logic to handle this use case. The high level logic would be as follows:

1. getAuthenticationUrl with your app’s parameters. For Native Apps, we highly encourage using PKCE to increase your app’s security.
2. Open the authentication URL in the default system browser
3. Redirect back into your app upon completion of the OAuth flow. 

We recommend using a custom URI for redirect to ensure you are redirecting directly back into your app. You can read up on this process more in detail on the [OAuth site](https://www.oauth.com/oauth2-servers/redirect-uris/redirect-uris-native-apps/).

# Upgrading from v8.X.X to v9.0.0

## 1. Unblocking browser PKCE flow

Previously, there was an issue in which Node and the Browser use different processes to generate the `codeVerifier` and `codeChallenge`. In order to remedy this, both `generatePKCECodes` and `getAuthenticationUrl` now return promises due to the how the browser digests hashes.

Previous Implementation(synchronous):
```
var authUrl = dbxAuth.getAuthenticationUrl(redirectUri, null, 'code', 'offline', null, 'none', false)
// logic for navigating to authUrl
```
New Implementation(async):
```
dbxAuth.getAuthenticationUrl(redirectUri, null, 'code', 'offline', null, 'none', false)
    .then((authUrl) => {
        // logic for navigating to authUrl
    });
```
# Upgrading from v7.X.X to v8.0.0

## 1. Throwing Errors as `DropboxResponseError` rather than  a literal object

We have created a new Error class called `DropboxResponseError` which contains the same members as the literal that was thrown, but in a cleaner format. It also allows you to leverage the fact this class now extends the builtin `Error` class.

# Upgrading from v6.X.X to v7.0.0

## 1. Fixing the Typescript argument parameter bug ([#41](https://github.com/dropbox/dropbox-sdk-js/issues/41))

We noticed a long lasting bug where the Typescript definitions of routes with no arg would require a `void` argument.  This required users to make calls like this:

```
var result = dbx.usersGetCurrentAccount(null);
```

We have since fixed this to no longer require the null parameter.

# Upgrading from v5.X.X to v6.0.0

## 1. Unifying Dropbox and DropboxTeam

We made the decision to unify the Dropbox and DropboxTeam objects to further simplify the logic in the SDK.  Migrating is very straightforward, a reference like this:

```
var dbx = new DropboxTeam({
    accessToken: 'my_token'
});
```

Can be rewritten as:

```
var dbx = new Dropbox({
    accessToken: 'my_token'
});
```

Additionally, when using features like assume user, select admin, or path root they are not set as a part of the constructor rather than creating a new client. Logic like this:

```
var dbx = new DropboxTeam({
    accessToken: 'my_token'
});
var dbx_user = dbx.actAsUser(user_id);
dbx_user.usersGetCurrentAccount();
```

Can be rewritten as:

```
var dbx = new Dropbox({
    accessToken: 'my_token',
    selectUser: 'my_user_id'
});
dbx.usersGetcurrentAccount();
```

## 2. Moving authentication to DropboxAuth

Another change that was made was to move all auth related functionality into the DropboxAuth object. The main Dropbox object can be constructed the same way but this will internally create a DropboxAuth object.  In order to access any auth functions from the main client you must change your code as such:

```
dbx.get_authentication_url(...);
```

Would become something like this:

```
dbx.auth.get_authentication_url(...);
```

However, we recommend creating a DropboxAuth object before creating a client and then constructing as such:

```
var dbxAuth = new DropboxAuth();
... // Do auth logic
var dbx = new Dropbox(dbxAuth);
```

That way if you need to create another instance of the client, you can easily plug in the same auth object.

## 3. Changing Typescript export format

We have updated the Typescript definitions to be a part of `Dropbox` namespace rather than the `DropboxTypes` namespace.  This would look like:

```
const result: DropboxTypes.users.FullAccount dbx.usersGetCurrentAccount();
```

Would become:

```
const result: Dropbox.users.FullAccount dbx.usersGetCurrentAccount();
```

## 4. Updating the Response object

We have wrapped the raw responses into the `DropboxResponse` object in order to expose more information out to users.  This change looks like:

```
var response = dbx.usersGetcurrentAccount();
console.log(response.fileBlob); //or fileBinary if using workers
```

Would become:

```
var response = dbx.usersGetcurrentAccount();
console.log(response.result.fileBlob); //or fileBinary if using workers
```

This also exposes the other components of the response like the status and headers which was not previously available.

```
var response = dbx.usersGetcurrentAccount();
console.log(response.status);
console.log(response.headers);
```

## 5. Default behavior for `fetch`.

Previously we have provided guidance to SDK users that they should not rely on the Dropbox SDK's global fetch and that it would be deprecated in future versions. In 6.0.0 onwards, we now include the `node-fetch` dependency as part of the NPM package. For browser environments, we fallback to `window.fetch` by default.

As a result, you should not pass in your own `fetch` to the Dropbox constructor unless you have a specific reason to do so (mocking, etc). Note that if you opt to pass in fetch to support your use case, you may need to bind your fetch to the appropriate context e.g. `fetch.bind(your_context)`.

[contributing]: https://github.com/dropbox/dropbox-sdk-js/blob/main/CONTRIBUTING.md
