# Backend Download Example

This example downloads a Dropbox file to local storage from a Node.js backend.
It uses the `downloadFile` helper, which writes to `localPath + ".part"` first,
resumes from that partial file with range requests, validates the final size,
verifies Dropbox `content_hash` metadata when present, and renames the partial
file only after validation succeeds.

## Run

Build the SDK from the repository root first:

```sh
npm install
npm run build
```

Then run the example:

```sh
cd examples/javascript/backend-download
npm install
DROPBOX_ACCESS_TOKEN=YOUR_ACCESS_TOKEN \
DROPBOX_DOWNLOAD_PATH=/large-file.bin \
LOCAL_DOWNLOAD_PATH=large-file.bin \
node download_example.js
```

For fresh downloads, set `PARALLEL_DOWNLOADS` to opt in to parallel ranged
requests:

```sh
PARALLEL_DOWNLOADS=4 node download_example.js
```

The helper retries transient failures such as network errors, `408`, `429`, and
`5xx` responses with exponential backoff. Deterministic errors such as
permission failures, invalid metadata, and content hash mismatches fail without
retry. Numeric options such as `parallelDownloads`, `maxAttempts`, `retryDelay`,
and `timeout` must be positive integers.

Partial downloads are retained only while the helper is retrying internally.
If `downloadFile()` ultimately fails, the `.part` file is removed before the
error is returned.

## Browser Range Requests

The `downloadFile` helper is Node.js-only because it writes to local filesystem
paths. In browsers, use `dbx.filesDownload({ path })` and read
`response.result.fileBlob`; that non-range flow is the better fit for ordinary
browser downloads.

Browser applications can request a byte range when they need to assemble chunks
themselves:

```js
const { result } = await dbx.filesDownload(
  { path: '/large-file.bin' },
  { extraHeaders: { Range: 'bytes=0-1048575' } },
);

const chunk = await result.fileBlob.arrayBuffer();
```

Range requests in browsers do not provide the same local `.part` file resume
semantics as the Node.js helper.
