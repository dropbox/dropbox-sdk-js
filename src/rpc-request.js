import { getBaseURL } from './utils';

function parseBodyToType(res) {
  const clone = res.clone();
  return new Promise((resolve) => {
    res.json()
      .then(data => resolve(data))
      .catch(() => clone.text().then(data => resolve(data)));
  }).then(data => [res, data]);
}

export function rpcRequest(path, body, auth, host, accessToken, options) {
  const fetchOptions = {
    method: 'POST',
    body: (body) ? JSON.stringify(body) : null,
  };

  const headers = { 'Content-Type': 'application/json' };

  switch (auth) {
    case 'team':
    case 'user':
      headers.Authorization = `Bearer ${accessToken}`;
      break;
    case 'noauth':
      break;
    default:
      throw new Error(`Unhandled auth type: ${auth}`);
  }

  if (options) {
    if (options.selectUser) {
      headers['Dropbox-API-Select-User'] = options.selectUser;
    }
    if (options.selectAdmin) {
      headers['Dropbox-API-Select-Admin'] = options.selectAdmin;
    }
  }

  fetchOptions.headers = headers;
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
}
