/* global Dropbox */
(function () {
  const form = document.getElementById('view-form');
  const button = form.querySelector('button');
  const status = document.getElementById('status');
  const result = document.getElementById('result');
  const tokenInput = document.getElementById('access-token');
  let imageUrl;
  let requestId = 0;
  let loading = false;

  function clearResult() {
    result.textContent = '';
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
      imageUrl = null;
    }
  }

  function downloadErrorMessage(error) {
    // DropboxResponseError.error is the parsed API body; the tagged union is inside it.
    const detail = error.error && error.error.error;
    const tag = detail && detail['.tag'];
    if (tag === 'missing_scope' || tag === 'route_access_denied' || error.status === 403) {
      return 'Permission denied. Check the files.content.read scope and app access.';
    }
    if (error.status === 401) {
      return 'The access token is invalid or expired. Enter a new access token.';
    }
    if (tag === 'path' && detail.path) {
      switch (detail.path['.tag']) {
        case 'not_found': return 'File not found. Check the path or file ID and app access.';
        case 'not_file': return 'This path points to a folder. Choose a file.';
        case 'malformed_path': return 'Invalid path. Use /folder/file.txt or id:FILE_ID.';
        case 'restricted_content': return 'Permission denied. This file has restricted content.';
        default: break;
      }
    }
    if (tag === 'unsupported_file') {
      return 'This file cannot be downloaded for preview.';
    }
    // fetch rejects with TypeError on network failures (including blocked CORS requests).
    if (error instanceof TypeError && !error.status) {
      return 'Network error. Check your connection and try again.';
    }
    return 'Could not load the file. Please try again and check your app access.';
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (loading) return;
    clearResult();
    const path = document.getElementById('path').value;
    if (!path.trim()) {
      status.textContent = 'Enter a Dropbox file path or file ID.';
      return;
    }
    if (!tokenInput.value.trim()) {
      status.textContent = 'Enter an access token with the files.content.read scope.';
      return;
    }
    requestId += 1;
    const currentRequest = requestId;
    loading = true;
    button.disabled = true;
    status.textContent = 'Loading...';

    try {
      const dbx = new Dropbox.Dropbox({ accessToken: tokenInput.value });
      const response = await dbx.filesDownload({ path });
      if (currentRequest !== requestId) return;
      const { name, fileBlob } = response.result;
      // Only the returned filename's allowlisted extension selects a renderer.
      const extension = name.slice(name.lastIndexOf('.')).toLowerCase();
      if (extension === '.txt') {
        const text = await fileBlob.text();
        if (currentRequest !== requestId) return;
        const pre = document.createElement('pre');
        pre.style.whiteSpace = 'pre-wrap';
        pre.style.overflowWrap = 'anywhere';
        pre.textContent = text;
        result.appendChild(pre);
      } else if (extension === '.png' || extension === '.jpg' || extension === '.jpeg') {
        const type = extension === '.png' ? 'image/png' : 'image/jpeg';
        imageUrl = URL.createObjectURL(new Blob([fileBlob], { type }));
        const image = document.createElement('img');
        image.alt = name;
        image.style.maxWidth = '100%';
        image.src = imageUrl;
        result.appendChild(image);
        try {
          // Keep the URL alive through loading and for the lifetime of the preview.
          await image.decode();
        } catch (error) {
          if (currentRequest !== requestId) return;
          clearResult();
          status.textContent = 'The image could not be decoded. Choose a valid PNG or JPEG file.';
          return;
        }
        if (currentRequest !== requestId) return;
      } else {
        status.textContent = 'Unsupported file type. Choose a PNG, JPEG (.jpg or .jpeg), or UTF-8 .txt file.';
        return;
      }
      status.textContent = `Showing ${name}`;
    } catch (error) {
      if (currentRequest !== requestId) return;
      clearResult();
      status.textContent = downloadErrorMessage(error);
    } finally {
      if (currentRequest === requestId) {
        loading = false;
        button.disabled = false;
      }
    }
  });

  window.addEventListener('pagehide', () => {
    // Ignore pending work even if this page is later restored from the back/forward cache.
    requestId += 1;
    clearResult();
    tokenInput.value = '';
    status.textContent = '';
    loading = false;
    button.disabled = false;
  });
}());
