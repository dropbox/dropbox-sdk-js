import { JSDOM } from 'jsdom';
import chai from 'chai';
import fs from 'fs';
import path from 'path';

const html = fs.readFileSync(path.resolve(__dirname, './browser/es.html'), 'utf8');

let dom;
let document;

describe('ES Build', () => {
    beforeEach((done) => {
        // Constructing a new JSDOM with this option is the key
        // to getting the code in the script tag to execute.
        // This is indeed dangerous and should only be done with trusted content.
        // https://github.com/jsdom/jsdom#executing-scripts
        dom = new JSDOM(html, { 
            runScripts: 'dangerously',
            resources: "usable"
        });
        dom.window.onload = function () {
            document = dom.window.document;
            done();
        }
    });

    // Broken until JSDOM supports <script type="module">
    // https://github.com/jsdom/jsdom/issues/2475
    it('Can import all members successfully', (done) => {
        const result = document.getElementById("result").innerHTML;
        chai.assert.equal(result, "Success");
        done();
    });
});