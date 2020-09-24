function getSafeUnicode(c) {
  const unicode = `000${c.charCodeAt(0).toString(16)}`.slice(-4);
  return `\\u${unicode}`;
}

export function getBaseURL(host) {
  return `https://${host}.dropboxapi.com/2/`;
}

// source https://www.dropboxforum.com/t5/API-support/HTTP-header-quot-Dropbox-API-Arg-quot-could-not-decode-input-as/m-p/173823/highlight/true#M6786
export function httpHeaderSafeJson(args) {
  return JSON.stringify(args).replace(/[\u007f-\uffff]/g, getSafeUnicode);
}

export function getTokenExpiresAtDate(expiresIn) {
  return new Date(Date.now() + (expiresIn * 1000));
}
