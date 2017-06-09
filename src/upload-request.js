import { getBaseURL, httpHeaderSafeJson } from './utils';

// This doesn't match what was spec'd in paper doc yet
function buildCustomError(error, response) {
  return {
    status: error.status,
    error: (response ? response.text : null) || error.toString(),
    response: response
  };
};

function parseBodyToType(res) {
  let data;
  let clone = res.clone();

  return new Promise((resolve) => {
    res.json()
      .then((data) => resolve(data))
      .catch(() => { clone.text().then((data) => resolve(data)) });
  }).then((data) => [res, data])
}

export function uploadRequest(path, args, auth, host, accessToken, selectUser) {

  if (auth !== 'user') {
    throw new Error('Unexpected auth type: ' + auth);
  }

  var { contents } = args;
  delete args.contents;

  let options = {
    body: contents,
    method: 'POST',
    headers: {
      'Content-Type': 'application/octet-stream',
      'Authorization': `Bearer ${accessToken}`,
      'Dropbox-API-Arg': httpHeaderSafeJson(args)
    }
  };

  if (selectUser) {
    options.headers['Dropbox-API-Select-User'] = selectUser;
  }

  return fetch(getBaseURL(host) + path, options)
    .then((res) => parseBodyToType(res))
    .then(([res, data]) => {
      // maintaining existing API for error codes not equal to 200 range
      if (!res.ok) {
        throw {
          error: data,
          response: res,
          status: res.status,
        };
      }

      return data;
    });
};
