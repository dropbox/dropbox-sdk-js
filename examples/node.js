var DropboxApi = require('../index');

var dbx = new DropboxApi();
accessToken = 'hjIsF2ns3_AAAAAAAAhd2Z2E1FXHksrwqnTYbssExyc1yAN6UBZ1mhXeCIY2JrzP';
dbx.setAccessToken({ accessToken: accessToken });
dbx.filesListFolder({ path: '/Screenshots' })
  .then(function(response) {
    console.log(response);
  })
  .catch(function(error) {
    console.log(error);
  });
