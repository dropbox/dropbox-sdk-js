import { getBaseURL, httpHeaderSafeJson, isWindowOrWorker } from './utils';

function getDataFromConsumer(res) {
  if (!res.ok) {
    return res.text();
  }

  return (isWindowOrWorker()) ? res.blob() : res.buffer();
}

function responseHandler(res, data) {
  if (!res.ok) {
    // eslint-disable-next-line no-throw-literal
    throw {
      error: data,
      response: res,
      status: res.status,
    };
  }

  const result = JSON.parse(res.headers.get('dropbox-api-result'));

  if (isWindowOrWorker()) {
    result.fileBlob = data;
  } else {
    result.fileBinary = data;
  }

  return result;
}

export function downloadRequest(fetch) {
  return function downloadRequestWithFetch(path, args, auth, host, client, options) {
    return client.checkAndRefreshAccessToken()
      .then(() => {
        if (auth !== 'user') {
          throw new Error(`Unexpected auth type: ${auth}`);
        }

        const fetchOptions = {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${client.getAccessToken()}`,
            'Dropbox-API-Arg': httpHeaderSafeJson(args),
          },
        };

        if (options) {
          if (options.selectUser) {
            fetchOptions.headers['Dropbox-API-Select-User'] = options.selectUser;
          }
          if (options.selectAdmin) {
            fetchOptions.headers['Dropbox-API-Select-Admin'] = options.selectAdmin;
          }
          if (options.pathRoot) {
            fetchOptions.headers['Dropbox-API-Path-Root'] = options.pathRoot;
          }
        }

        return fetchOptions;
      })
      .then(fetchOptions => fetch(getBaseURL(host) + path, fetchOptions))
      .then(res => getDataFromConsumer(res).then(data => [res, data]))
      .then(([res, data]) => responseHandler(res, data));
  };
}
