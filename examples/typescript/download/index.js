Object.defineProperty(exports, "__esModule", { value: true });
const dropbox_1 = require("dropbox"); // eslint-disable-line no-unused-vars
const fs = require("fs");
const prompt = require('prompt');
prompt.start();
prompt.get({
    properties: {
        accessToken: {
            description: 'Please enter an API V2 access token',
        },
        sharedLink: {
            description: 'Please enter a shared link to a file',
        },
    },
}, (error, result) => {
    const dbx = new dropbox_1.Dropbox({ accessToken: result.accessToken });
    dbx.sharingGetSharedLinkFile({ url: result.sharedLink })
        .then((data) => {
        // Note: The fileBinary field is not part of the Dropbox SDK
        // specification, so it is not included in the TypeScript type.
        // It is injected by the SDK.
        fs.writeFile(data.result.name, data.result.fileBinary, { encoding: 'binary' }, (err) => {
            if (err) {
                throw err;
            }
            console.log(`File: ${data.result.name} saved.`);
        });
    })
        .catch((err) => {
        throw err;
    });
});
//# sourceMappingURL=download.js.map