Once the Dropbox SDK for JavaScript is installed. You'll be able to make
requests using the
[Dropbox](https://dropbox.github.io/dropbox-sdk-js/Dropbox.html) or [DropboxTeam](https://dropbox.github.io/dropbox-sdk-js/DropboxTeam.html) class. The way you access these classes depends on how you've installed the package.

### When installed with CommonJS (Node.js)
Both classes are available as separated requires as most users require only the [Dropbox](https://dropbox.github.io/dropbox-sdk-js/Dropbox.html) class.
```javascript
var Dropbox = require('dropbox').Dropbox;
var DropboxTeam = require('dropbox').DropboxTeam;
```

### When using jspm or an ECMAScript transpiler (Babel)
An ES6 Module exports the Classes separately from the package in a number of ways to support variety of differences between package managers and precompilers.
```javascript
import { Dropbox } from 'dropbox';
import Dropbox from 'dropbox/dropbox';
import DropboxTeam from 'dropbox';
import { DropboxTeam } from 'dropbox';
```

### Using the UMD module via the browser
The [Dropbox](https://dropbox.github.io/dropbox-sdk-js/Dropbox.html) and [DropboxTeam](https://dropbox.github.io/dropbox-sdk-js/DropboxTeam.html) classes are available on the global window object as window.Dropbox.Dropbox and window.Dropbox.DropboxTeam.
```html
<script src="https://unpkg.com/dropbox/dist/Dropbox-sdk.min.js"></script>
<script src="https://unpkg.com/dropbox/dist/DropboxTeam-sdk.min.js"></script>
```

On the web and on most modern browsers, `fetch` should be available ([List of supported browsers](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API#Browser_compatibility)).  Otherwise, use the polyfill below (for example), or use an npm package such as `whatwg-fetch`.
```html
<!-- Optional. -->
<script src="https://cdn.jsdelivr.net/npm/promise-polyfill@7/dist/polyfill.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/fetch/2.0.3/fetch.js"></script>
```

## Authentication
Next, you'll need to learn how to authorize your requests with [Authentication](https://dropbox.github.io/dropbox-sdk-js/tutorial-Authentication.html).
