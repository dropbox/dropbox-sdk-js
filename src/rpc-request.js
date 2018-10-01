import { Buffer } from 'buffer/';
import { getBaseURL } from './utils';

function parseBodyToType(res) {
  if (res.headers.get('Content-Type') === 'application/json') {
    return res.json().then(data => [res, data]);
  }
  return res.text().then(data => [res, data]);
}

export function rpcRequest(fetch) {
  return function rpcRequestWithFetch(path, body, auth, host, accessToken, options) {
    const fetchOptions = {
      method: 'POST',
      body: (body) ? JSON.stringify(body) : null,
    };
    const headers = {};
    if (body) {
      headers['Content-Type'] = 'application/json';
    }
    let authHeader = '';

    switch (auth) {
      case 'app':
        if (!options.clientId || !options.clientSecret) {
          throw new Error('A client id and secret is required for this function');
        }
        authHeader = new Buffer(`${options.clientId}:${options.clientSecret}`).toString('base64');
        headers.Authorization = `Basic ${authHeader}`;
        break;
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
  };
}
