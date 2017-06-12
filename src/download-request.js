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
    result.fileBinary = data.toString();
  }

  return result;
}

export function downloadRequest(path, args, auth, host, accessToken, selectUser) {
  if (auth !== 'user') {
    throw new Error(`Unexpected auth type: ${auth}`);
  }

  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Dropbox-API-Arg': httpHeaderSafeJson(args),
    },
  };

  if (selectUser) {
    options.headers['Dropbox-API-Select-User'] = selectUser;
  }

  return fetch(getBaseURL(host) + path, options)
    .then(res => getDataFromConsumer(res).then(data => [res, data]))
    .then(([res, data]) => responseHandler(res, data));
}
