Object.defineProperty(exports, "__esModule", { value: true });
const dropbox_1 = require("dropbox"); // eslint-disable-line no-unused-vars
const prompt = require('prompt');
prompt.start();
prompt.get({
    properties: {
        accessToken: {
            description: 'Please enter an API V2 team access token',
        },
        userId: {
            description: 'Please enter the id of the user you would like to act as',
        },
    },
}, (error, result) => {
    const dbx = new dropbox_1.Dropbox({ accessToken: result.accessToken, selectUser: result.userId });
    dbx.filesListFolder({ path: '' })
        .then((response) => {
        console.log(response);
    })
        .catch((err) => {
        console.log(err);
    });
});
//# sourceMappingURL=team-as-user.js.map