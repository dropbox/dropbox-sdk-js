# View a file in the browser

From the repository root, using Node.js 22 or newer:

```sh
npm install
npm run build
node examples/javascript/server.js
```

Open <http://localhost:8080/view-file/> in a modern browser supporting
`Blob.text()` and `HTMLImageElement.decode()`.

For quick testing, create or select an app in the
[App Console](https://www.dropbox.com/developers/apps), enable the
`files.content.read` permission, and generate an access token on the app's
OAuth 2 settings page. If you change permissions, authorize again to obtain
a token with that scope. Paste the token into the password field. The example
keeps it only in page memory, clears it when leaving the page, and does not
store it in a URL or browser storage. No client secret is needed. For an OAuth
flow, see the existing [PKCE browser example](../pkce-browser/index.html).

Enter a file path such as `/photos/example.jpg` or a file ID such as
`id:FILE_ID`, then click **View file**. Paths are relative to the app's access
root: an App Folder app sees its own app folder, while a Full Dropbox app can
access paths in the user's Dropbox. The token must authorize access to the
requested file. Use a path relative to the token's API root; a Dropbox website
URL may include an account-root label that is not part of that path. A file ID
avoids this path ambiguity. Do not enter a shared link or a local filesystem path.

The example calls `filesDownload({ path })` and reads `response.result.fileBlob`.
The returned filename selects the supported format, case insensitively:

- `.png`, `.jpg`, `.jpeg`: an image using a Blob URL and an explicit image MIME type.
- `.txt`: UTF-8 text in a `pre` element via `textContent`, so HTML markup stays literal.

Other formats are rejected. Previous previews are cleared when a new request
starts. Image URLs are revoked when replaced, on decoding failure, or when the
page is left. The button stays disabled until downloading and rendering finish.

The entire file is downloaded into memory before its format is checked or it
is displayed. Use this example for small files; it is not a universal document
viewer and does not impose a download memory limit.
