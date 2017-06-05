Once the Dropbox SDK for JavaScript is installed. You'll be able to make requests using the [Dropbox](/Dropbox.html) or [DropboxTeam](/DropboxTeam.html) class. The way you access these classes depends on how you've installed the package.

### When installed with CommonJS (Node.js)
Both classes are available as separated requires as most users require only the [Dropbox](/Dropbox.html) class.
```javascript
var Dropbox = require('dropbox');
var DropboxTeam = require('dropbox/team');
```

### When using jspm or an ECMAScript transpiler (Babel)
An ES6 Module exports the Classes separately from the package in a number of ways to support variety of differences between package managers and precompilers.
```javascript
import { Dropbox } from 'dropbox';
import Dropbox from 'dropbox/dropbox';
import DropboxTeam from 'dropbox/team';
import { DropboxTeam } from 'dropbox/team/dropbox-team';
```

### Using the UMD module via the browser
The [Dropbox](/Dropbox.html) and [DropboxTeam](/DropboxTeam.html) classes are available on the global window object as window.Dropbox and window.DropboxTeam.
```html
<script src="https://unpkg.com/dropbox/dist/Dropbox-sdk.min.js"></script>
<script src="https://unpkg.com/dropbox/dist/DropboxTeam-sdk.min.js"></script>
```


## Authentication
Next, you'll need to learn how to authorize your requests with [Authentication](tutorial-Authentication.html).
