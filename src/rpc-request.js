import 'isomorphic-fetch';
import { getBaseURL } from './utils';

// This doesn't match what was spec'd in paper doc yet
function buildCustomError(error, response) {
  var err;
  if (response) {
    try {
      err = JSON.parse(response.text);
    } catch (e) {
      err = response.text;
    }
  }
  return {
    status: error.status,
    error: err || error,
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
  })
}

export function rpcRequest(path, body, auth, host, accessToken, selectUser) {

  let options = {
    method: 'POST',
    body: (body) ? JSON.stringify(body) : null
  };

  let headers = { 'Content-Type': 'application/json' };

  switch (auth) {
    case 'team':
    case 'user':
      headers.Authorization = 'Bearer ' + accessToken;
      break;
    case 'noauth':
      break;
    default:
      throw new Error('Unhandled auth type: ' + auth);
  }

  if (selectUser) {
    headers['Dropbox-API-Select-User'] = selectUser;
  }

  options.headers = headers;

  return fetch(getBaseURL(host) + path, options)
    .then((res) => parseBodyToType(res).then((data) => [res, data]))
    .then(([res, data]) => {
      // maintaining existing API - sorry!
      if (!res.ok) {
        throw {
          error: data,
          response: res,
          status: res.status,
        };
      }

      return res;
    });
};
