import { getBaseURL, httpHeaderSafeJson } from './utils';

function parseBodyToType(res) {
  const clone = res.clone();
  return new Promise((resolve) => {
    res.json()
      .then(data => resolve(data))
      .catch(() => clone.text().then(data => resolve(data)));
  }).then(data => [res, data]);
}

export function uploadRequest(fetch) {
  return function uploadRequestWithFetch(path, args, auth, host, accessToken, options) {
    if (auth !== 'user') {
      throw new Error(`Unexpected auth type: ${auth}`);
    }

    const { contents } = args;
    delete args.contents;

    const fetchOptions = {
      body: contents,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/octet-stream',
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
    }

    return fetch(getBaseURL(host) + path, fetchOptions)
      .then(res => parseBodyToType(res))
      .then(([res, data]) => {
        // maintaining existing API for error codes not equal to 200 range
        if (!res.ok) {
          // eslint-disable-next-line no-throw-literal
          throw {
            error: data,
            response: res,
            status: res.status,
          };
        }

        return data;
      });
  };
}
