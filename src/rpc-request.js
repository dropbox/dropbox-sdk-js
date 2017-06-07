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

export function rpcRequest(path, body, auth, host, accessToken, selectUser) {

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

  return fetch(
    getBaseURL(host) + path,
    {
      headers,
      method: 'POST',
      body: (body) ? JSON.stringify(body) : null
    }
  )
    .then(async function(res) {
      let data;
      let clone = res.clone(); // stops err on reading body twice in text recovery

      try {
        data = await res.json();
      } catch (err) {
        data = await clone.text();
      }

      return [res, data];
    })
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
