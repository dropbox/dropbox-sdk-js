The JavaScript SDK provides a promise interface to relaying calls to the Dropbox SDK.

## Example request
Using an access token generated from your developer account you'll be able to access your Dropbox information using the Dropbox class to demonstrate the SDK is working correctly.

```javascript
require('isomorphic-fetch')
var Dropbox = require('dropbox').Dropbox;
new Dropbox({
  accessToken: 'YOUR_ACCESS_TOKEN_HERE'
})
  .filesListFolder({path: ''})
  .then(console.log, console.error);
```

## API Classes

- [Dropbox](Dropbox.html)
- [DropboxTeam](DropboxTeam.html)

### Dropbox

For documentation of all of the available endpoints, the parameters they receive and the data they return, see the [Dropbox class definition](http://dropbox.github.io/dropbox-sdk-js/Dropbox.html). These methods are all available directly from an instance of the API class, e.g: `dbx.filesListFolder()`.

### DropboxTeam

The Dropbox API has a series of actions that can be completed on a team wide level. These endpoint methods are available by using the DropboxTeam class. It can be loaded like this: `var DropboxTeam= require('dropbox/team');`. For more information , see the [DropboxTeam class definition](http://dropbox.github.io/dropbox-sdk-js/DropboxTeam.html).
