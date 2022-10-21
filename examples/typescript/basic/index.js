Object.defineProperty(exports, "__esModule", { value: true });
const dropbox_1 = require("dropbox");
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
    dbx.filesListFolder({ path: '' })
        .then((response) => {
        console.log(response);
    })
        .catch((err) => {
        console.log(err);
    });
});
//# sourceMappingURL=basic.js.map