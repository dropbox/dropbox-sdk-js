import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';
import { expect } from 'chai';
import sinon from 'sinon';

const html = fs.readFileSync(path.resolve(__dirname, '../../examples/javascript/view-file/index.html'), 'utf8');
const script = fs.readFileSync(path.resolve(__dirname, '../../examples/javascript/view-file.js'), 'utf8');

describe('View file example', () => {
  let window;
  let document;
  let download;
  let decode;
  let button;
  let result;
  let status;

  function submit() {
    document.getElementById('view-form').dispatchEvent(new window.Event('submit', { cancelable: true }));
    return new Promise((resolve) => { setImmediate(resolve); });
  }

  function file(name, text = 'hello') {
    download.resolves({ result: { name, fileBlob: new Blob([text], { type: 'text/html' }) } });
  }

  beforeEach(() => {
    ({ window } = new JSDOM(html, { runScripts: 'outside-only' }));
    ({ document } = window);
    window.Blob = Blob;
    window.URL.createObjectURL = sinon.stub().returns('blob:preview');
    window.URL.revokeObjectURL = sinon.spy();
    decode = sinon.stub().resolves();
    window.HTMLImageElement.prototype.decode = decode;
    download = sinon.stub();
    function MockDropbox() { this.filesDownload = download; }
    window.Dropbox = { Dropbox: MockDropbox };
    window.eval(script);
    document.getElementById('access-token').value = 'test-token';
    document.getElementById('path').value = 'id:test';
    button = document.querySelector('button');
    result = document.getElementById('result');
    status = document.getElementById('status');
  });

  afterEach(() => window.close());

  it('displays UTF-8 text and markup literally, using the returned filename', async () => {
    const text = 'Привет\n<script>alert(1)</script><img src=x onerror=alert(1)>';
    file('example.TXT', text);
    await submit();
    expect(download.calledOnceWithExactly({ path: 'id:test' })).to.equal(true);
    expect(result.querySelector('pre').textContent).to.equal(text);
    expect(result.querySelector('script, img')).to.equal(null);
    expect(button.disabled).to.equal(false);
  });

  ['PNG', 'jpg', 'jpeg'].forEach((extension) => {
    it(`renders .${extension} with an explicit image MIME type`, async () => {
      file(`photo.${extension}`);
      await submit();
      expect(window.URL.createObjectURL.firstCall.args[0].type)
        .to.equal(extension === 'PNG' ? 'image/png' : 'image/jpeg');
      expect(decode.calledOnce).to.equal(true);
      expect(result.querySelector('img').src).to.equal('blob:preview');
      expect(window.URL.revokeObjectURL.called).to.equal(false);
    });
  });

  it('blocks duplicate requests through downloading and image decoding', async () => {
    let finishDownload;
    let finishDecode;
    download.returns(new Promise((resolve) => { finishDownload = resolve; }));
    decode.returns(new Promise((resolve) => { finishDecode = resolve; }));
    await submit();
    await submit();
    expect(button.disabled).to.equal(true);
    expect(status.textContent).to.equal('Loading...');
    expect(download.calledOnce).to.equal(true);
    finishDownload({ result: { name: 'test.png', fileBlob: new Blob([]) } });
    await submit();
    expect(button.disabled).to.equal(true);
    finishDecode();
    await new Promise((resolve) => { setImmediate(resolve); });
    expect(button.disabled).to.equal(false);
  });

  ['html', 'svg', 'pdf', 'gif', 'webp', 'mp3', 'mp4', 'docx', ''].forEach((extension) => {
    it(`rejects unsupported extension '${extension}'`, async () => {
      file(`test.${extension}`);
      await submit();
      expect(status.textContent).to.contain('Unsupported file type');
      expect(result.children.length).to.equal(0);
      expect(window.URL.createObjectURL.called).to.equal(false);
      expect(button.disabled).to.equal(false);
    });
  });

  it('clears and revokes a previous preview even for an empty path', async () => {
    file('image.png');
    await submit();
    document.getElementById('path').value = '   ';
    await submit();
    expect(status.textContent).to.contain('Enter a Dropbox file path');
    expect(result.children.length).to.equal(0);
    expect(window.URL.revokeObjectURL.calledOnceWithExactly('blob:preview')).to.equal(true);
    expect(download.calledOnce).to.equal(true);
  });

  const failures = [
    [{ status: 409, error: { error: { '.tag': 'path', path: { '.tag': 'not_found' } } } }, 'File not found'],
    [{ status: 409, error: { error: { '.tag': 'path', path: { '.tag': 'not_file' } } } }, 'folder'],
    [{ status: 401, error: { error: { '.tag': 'invalid_access_token' } } }, 'invalid or expired'],
    [{ status: 401, error: { error: { '.tag': 'expired_access_token' } } }, 'invalid or expired'],
    [{ status: 401, error: { error: { '.tag': 'missing_scope' } } }, 'Permission denied'],
    [{ status: 403 }, 'Permission denied'],
    [{ status: 500 }, 'Could not load'],
  ];
  failures.forEach(([error, message]) => {
    it(`handles ${message} and recovers on the next request`, async () => {
      file('image.png');
      await submit();
      download.rejects(error);
      await submit();
      expect(status.textContent).to.contain(message);
      expect(result.children.length).to.equal(0);
      expect(button.disabled).to.equal(false);
      file('ok.txt');
      await submit();
      expect(result.textContent).to.equal('hello');
    });
  });

  it('handles fetch network failures without logging the error', async () => {
    const log = sinon.spy(window.console, 'error');
    download.rejects(new window.TypeError('Failed to fetch'));
    await submit();
    expect(status.textContent).to.contain('Network error');
    expect(log.called).to.equal(false);
    expect(button.disabled).to.equal(false);
  });

  it('revokes a broken image and allows another preview', async () => {
    file('broken.png');
    decode.rejects(new Error('decode failed'));
    await submit();
    expect(status.textContent).to.contain('could not be decoded');
    expect(result.children.length).to.equal(0);
    expect(window.URL.revokeObjectURL.calledOnce).to.equal(true);
    expect(button.disabled).to.equal(false);
    file('ok.txt');
    await submit();
    expect(result.textContent).to.equal('hello');
  });

  it('cleans up on pagehide and ignores an unfinished request after restoration', async () => {
    file('image.png');
    await submit();
    window.dispatchEvent(new window.Event('pagehide'));
    expect(window.URL.revokeObjectURL.calledOnce).to.equal(true);
    let finish;
    document.getElementById('access-token').value = 'test-token';
    download.returns(new Promise((resolve) => { finish = resolve; }));
    await submit();
    window.dispatchEvent(new window.Event('pagehide'));
    finish({ result: { name: 'late.txt', fileBlob: new Blob(['late']) } });
    await new Promise((resolve) => { setImmediate(resolve); });
    expect(result.children.length).to.equal(0);
    expect(status.textContent).to.equal('');
    expect(document.getElementById('access-token').value).to.equal('');
    expect(button.disabled).to.equal(false);
    document.getElementById('access-token').value = 'new-token';
    file('ok.txt');
    await submit();
    expect(result.textContent).to.equal('hello');
  });
});
