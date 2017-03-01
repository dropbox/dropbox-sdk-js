# Dropbox JavaScript SDK Examples

To run the examples in your development environment:

1. Clone this repo
2. Run `npm install`
3. `cd node_modules/dropbox && npm run generate-tsds && cd -`
4. `./node_modules/.bin/tsc`
5. `cd node && ../node_modules/.bin/tsc && cd -`

At the moment, there are compilation errors because the examples reference struct fields that are not described in the spec. :(
