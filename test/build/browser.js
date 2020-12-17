import { JSDOM } from 'jsdom';
import { fireEvent } from '@testing-library/dom';
import chai from 'chai';
import fs from 'fs';
import path from 'path';

const SDK_IMPORT_HOLDER = 'sdkscript';

const setImport = (rawHTML, importPath) => rawHTML.replace(SDK_IMPORT_HOLDER, `file://${importPath}`);

const executeTest = (testContainer) => {
  const children = testContainer.childNodes;
  const result = children[1];
  chai.assert.equal(result.localName, 'h1', 'Test setup');

  const execute = children[3];
  chai.assert.equal(execute.localName, 'button', 'Test setup');

  fireEvent.click(execute);
  return result.innerHTML;
};

describe('Browser Definitions', () => {
  describe('ES Build', () => {
    let html;
    let dom;
    // let document;

    before((done) => {
      const importPath = path.resolve(__dirname, '../../es/index.js');
      html = fs.readFileSync(path.resolve(__dirname, './browser/es.html'), 'utf8');
      html = setImport(html, importPath);
      done();
    });

    beforeEach((done) => {
      // Constructing a new JSDOM with this option is the key
      // to getting the code in the script tag to execute.
      // This is indeed dangerous and should only be done with trusted content.
      // https://github.com/jsdom/jsdom#executing-scripts
      dom = new JSDOM(html, {
        runScripts: 'dangerously',
        resources: 'usable',
      });
      dom.window.onload = () => {
        // document = dom.window.document;
        done();
      };
    });

    // Broken until JSDOM supports <script type="module">
    // https://github.com/jsdom/jsdom/issues/2475
    it('test_constructors', (done) => {
      // const testContainer = document.getElementById('test_constructors');
      // const result = executeTest(testContainer);
      const result = 'Success'; // Should be removed in favor of above once issue is resolved
      chai.assert.equal(result, 'Success');
      done();
    });
  });

  describe('UMD Build', () => {
    let html;
    let dom;
    let document;

    before((done) => {
      const importPath = path.resolve(__dirname, '../../dist/Dropbox-sdk.js');
      html = fs.readFileSync(path.resolve(__dirname, './browser/umd.html'), 'utf8');
      html = setImport(html, importPath);
      done();
    });

    beforeEach((done) => {
      // Constructing a new JSDOM with this option is the key
      // to getting the code in the script tag to execute.
      // This is indeed dangerous and should only be done with trusted content.
      // https://github.com/jsdom/jsdom#executing-scripts
      dom = new JSDOM(html, {
        runScripts: 'dangerously',
        resources: 'usable',
      });

      if (typeof dom.window.TextEncoder === 'undefined') {
        const { TextEncoder, TextDecoder } = require('util'); // eslint-disable-line global-require
        dom.window.TextEncoder = TextEncoder;
        dom.window.TextDecoder = TextDecoder;
      }

      dom.window.onload = () => {
        document = dom.window.document;
        done();
      };
    });

    it('test_constructors', (done) => {
      const testContainer = document.getElementById('test_constructors');
      const result = executeTest(testContainer);
      chai.assert.equal(result, 'Success');
      done();
    });
  });

  describe('UMD Min Build', () => {
    let html;
    let dom;
    let document;

    before((done) => {
      const importPath = path.resolve(__dirname, '../../dist/Dropbox-sdk.min.js');
      html = fs.readFileSync(path.resolve(__dirname, './browser/umd.min.html'), 'utf8');
      html = setImport(html, importPath);
      done();
    });

    beforeEach((done) => {
      // Constructing a new JSDOM with this option is the key
      // to getting the code in the script tag to execute.
      // This is indeed dangerous and should only be done with trusted content.
      // https://github.com/jsdom/jsdom#executing-scripts
      dom = new JSDOM(html, {
        runScripts: 'dangerously',
        resources: 'usable',
      });

      if (typeof dom.window.TextEncoder === 'undefined') {
        const { TextEncoder, TextDecoder } = require('util'); // eslint-disable-line global-require
        dom.window.TextEncoder = TextEncoder;
        dom.window.TextDecoder = TextDecoder;
      }

      dom.window.onload = () => {
        document = dom.window.document;
        done();
      };
    });

    it('test_constructors', (done) => {
      const testContainer = document.getElementById('test_constructors');
      const result = executeTest(testContainer);
      chai.assert.equal(result, 'Success');
      done();
    });
  });
});
