Object.defineProperty(exports, "__esModule", { value: true });
const dropbox_1 = require("dropbox"); // eslint-disable-line no-unused-vars
const fs = require("fs");
const path = require("path");
const prompt = require('prompt');
prompt.start();
prompt.get({
    properties: {
        accessToken: {
            description: 'Please enter an API V2 access token',
        },
    },
}, (error, result) => {
    const dbx = new dropbox_1.Dropbox({ accessToken: result.accessToken });
    fs.readFile(path.join(__dirname, '/basic.js'), 'utf8', (err, contents) => {
        if (err) {
            console.log('Error: ', err);
        }
        // This uploads basic.js to the root of your dropbox
        dbx.filesUpload({ path: '/basic.js', contents })
            .then((response) => {
            console.log(response);
        })
            .catch((uploadErr) => {
            console.log(uploadErr);
        });
    });
});
//# sourceMappingURL=upload.js.map