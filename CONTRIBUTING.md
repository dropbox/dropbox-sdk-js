# Contributing to the Dropbox SDK for Javascript
We value and rely on the feedback from our community. This comes in the form of bug reports, feature requests, and general guidance. We welcome your issues and pull requests and try our hardest to be timely in both response and resolution. Please read through this document before submitting issues or pull requests to ensure we have the necessary information to help you resolve your issue.

## Filing Bug Reports
You can file a bug report on the [GitHub Issues][issues] page.

1. Search through existing issues to ensure that your issue has not been reported. If it is a common issue, there is likely already an issue.

2. Please ensure you are using the latest version of the SDK. While this may be a valid issue, we only will fix bugs affecting the latest version and your bug may have been fixed in a newer version.

3. Provide as much information as you can regarding the language version, SDK version, and any other relevant information about your environment so we can help resolve the issue as quickly as possible.

## Submitting Pull Requests

We are more than happy to recieve pull requests helping us improve the state of our SDK. You can open a new pull request on the [GitHub Pull Requests][pr] page.

1. Please ensure that you have read the [License][license], [Code of Conduct][coc] and have signed the [Contributing License Agreement (CLA)][cla].

2. Please add tests confirming the new functionality works. Pull requests will not be merged without passing continuous integration tests unless the pull requests aims to fix existing issues with these tests.

3. If the pull request is modifying typescript definitions, please remember to change the template found under `generator/typescript` and run the generation instead of manually changing types.  If there is an issue with the generation, please file an issue.

## Updating Generated Code

Generated code can be updated by running the following commands:

```
$ git submodule init
$ git submodule update --remote --recursive
$ cd generator/stone
$ python setup.py install
$ cd ..
$ python generate_routes.py
```

This will generate typescript definitions and route code.

## Testing the Code

Tests live under the `test/` folder and are then broken down into the type of test it is.  To run both the unit tests and the typescript tests, you can use:

```
$ npm test
```

If you would like to run the integration tests locally, you can run: 

```
export DROPBOX_TOKEN={fill in user token}
export DROPBOX_TEAM_TOKEN={fill in team token}
export DROPBOX_USER_ID={fill in assume user id}
export DROPBOX_SHARED_LINK={fill in shared link}
$ npm run test:integration
```

Note: If you do not have all of these tokens available, we run integration tests as a part of pull request validation and you are able to rely on those if you are unable to obtain yourself.

[issues]: https://github.com/dropbox/dropbox-sdk-js/issues
[pr]: https://github.com/dropbox/dropbox-sdk-js/pulls
[coc]: https://github.com/dropbox/dropbox-sdk-js/blob/main/CODE_OF_CONDUCT.md
[license]: https://github.com/dropbox/dropbox-sdk-js/blob/main/LICENSE
[cla]: https://opensource.dropbox.com/cla/