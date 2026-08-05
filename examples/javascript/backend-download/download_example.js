// Standalone backend example for downloading a Dropbox file to local storage.
// Build the SDK from the repository root first with `npm run build`.

const { Dropbox, downloadFile } = require('dropbox'); // eslint-disable-line import/no-unresolved

const {
  DROPBOX_ACCESS_TOKEN,
  DROPBOX_DOWNLOAD_PATH,
  LOCAL_DOWNLOAD_PATH,
  PARALLEL_DOWNLOADS,
} = process.env;

if (!DROPBOX_ACCESS_TOKEN) {
  throw new Error('Set DROPBOX_ACCESS_TOKEN before running this example.');
}

if (!DROPBOX_DOWNLOAD_PATH) {
  throw new Error('Set DROPBOX_DOWNLOAD_PATH to the Dropbox file path to download.');
}

const dbx = new Dropbox({
  accessToken: DROPBOX_ACCESS_TOKEN,
});

const localPath = LOCAL_DOWNLOAD_PATH || DROPBOX_DOWNLOAD_PATH.split('/').pop();
const parallelDownloads = Number(PARALLEL_DOWNLOADS || 1);

downloadFile(dbx, DROPBOX_DOWNLOAD_PATH, localPath, {
  parallelDownloads,
  progress: ({ bytesWritten, totalBytes, resumedFrom }) => {
    const total = totalBytes || 'unknown';
    console.log(`${bytesWritten}/${total} bytes, resumed from ${resumedFrom}`);
  },
})
  .then((result) => {
    console.log(
      `downloaded ${result.metadata.name} to ${localPath}, resumed from ${result.resumedFrom}`,
    );
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
