Once the Dropbox SDK for JavaScript is installed. You'll be able to make
requests using the
[Dropbox](https://dropbox.github.io/dropbox-sdk-js/Dropbox.html) or [DropboxTeam](https://dropbox.github.io/dropbox-sdk-js/DropboxTeam.html) class. The way you access these classes depends on how you've installed the package.

### When installed with CommonJS (Node.js)
Both classes are available as separated requires as most users require only the [Dropbox](/Dropbox.html) class.
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


## Authentication
Next, you'll need to learn how to authorize your requests with [Authentication](tutorial-Authentication.html).
