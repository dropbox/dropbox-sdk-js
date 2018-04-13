function getSafeUnicode(c) {
  const unicode = `000${c.charCodeAt(0).toString(16)}`.slice(-4);
  return `\\u${unicode}`;
}


/* global WorkerGlobalScope */
export function isWindowOrWorker() {
  return (
    (
      typeof WorkerGlobalScope !== 'undefined' &&
      self instanceof WorkerGlobalScope
    )
    ||
    (
      typeof module === 'undefined' ||
      typeof window !== 'undefined'
    )
  );
}

export function getBaseURL(host) {
  return `https://${host}.dropboxapi.com/2/`;
}

// source https://www.dropboxforum.com/t5/API-support/HTTP-header-quot-Dropbox-API-Arg-quot-could-not-decode-input-as/m-p/173823/highlight/true#M6786
export function httpHeaderSafeJson(args) {
  return JSON.stringify(args).replace(/[\u007f-\uffff]/g, getSafeUnicode);
}
