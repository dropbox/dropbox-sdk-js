Object.defineProperty(exports, "__esModule", { value: true });
const dropbox_1 = require("dropbox"); // eslint-disable-line no-unused-vars
const prompt = require('prompt');
prompt.start();
prompt.get({
    properties: {
        accessToken: {
            description: 'Please enter an API V2 team access token',
        },
    },
}, (error, result) => {
    const dbx = new dropbox_1.Dropbox({ accessToken: result.accessToken });
    dbx.teamDevicesListTeamDevices({})
        .then((response) => {
        console.log('Devices', response);
    })
        .catch((err) => {
        console.log(err);
    });
});
//# sourceMappingURL=team.js.map