var CLIENT_ID = '42zjexze6mfpf7x';
function parseQueryString(str) {
    var ret = Object.create(null);
    if (typeof str !== 'string') {
        return ret;
    }
    str = str.trim().replace(/^(\?|#|&)/, '');
    if (!str) {
        return ret;
    }
    str.split('&').forEach(function (param) {
        var parts = param.replace(/\+/g, ' ').split('=');
        // Firefox (pre 40) decodes `%3D` to `=`
        // https://github.com/sindresorhus/query-string/pull/37
        var key = parts.shift();
        var val = parts.length > 0 ? parts.join('=') : undefined;
        key = decodeURIComponent(key);
        // missing `=` should be `null`:
        // http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
        val = val === undefined ? null : decodeURIComponent(val);
        var retVal = ret[key];
        if (ret[key] === undefined) {
            ret[key] = val;
        }
        else if (Array.isArray(retVal)) {
            retVal.push(val);
        }
        else {
            ret[key] = [ret[key], val];
        }
    });
    return ret;
}
// Parses the url and gets the access token if it is in the urls hash
function getAccessTokenFromUrl() {
    return parseQueryString(window.location.hash)['access_token'];
}
// If the user was just redirected from authenticating, the urls hash will
// contain the access token.
function isAuthenticated() {
    return !!getAccessTokenFromUrl();
}
// Render a list of items to #files
function renderItems(items) {
    var filesContainer = document.getElementById('files');
    items.forEach(function (item) {
        var li = document.createElement('li');
        li.innerHTML = item.name;
        filesContainer.appendChild(li);
    });
}
// This example keeps both the authenticate and non-authenticated setions
// in the DOM and uses this function to show/hide the correct section.
function showPageSection(elementId) {
    document.getElementById(elementId).style.display = 'block';
}
if (isAuthenticated()) {
    showPageSection('authed-section');
    // Create an instance of Dropbox with the access token and use it to
    // fetch and render the files in the users root directory.
    var dbx = new Dropbox({ accessToken: getAccessTokenFromUrl() });
    dbx.filesListFolder({ path: '', recursive: false, include_media_info: false, include_deleted: false, include_has_explicit_shared_members: false })
        .then(function (response) {
        renderItems(response.entries);
    })
        .catch(function (error) {
        console.error(error);
    });
}
else {
    showPageSection('pre-auth-section');
    // Set the login anchors href using dbx.getAuthenticationUrl()
    var dbx = new Dropbox({ clientId: CLIENT_ID });
    var authUrl = dbx.getAuthenticationUrl('http://localhost:8080/auth');
    document.getElementById('authlink').href = authUrl;
}
//# sourceMappingURL=auth.js.map