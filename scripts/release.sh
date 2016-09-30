#!/bin/bash

# Exit on first error
set -e

if ! [ -e scripts/release.sh ]; then
  echo >&2 "Please run scripts/release.sh from the repo root"
  exit 1
fi

# Assure version is a valid semver version
validate_semver() {
  if ! [[ $1 =~ ^[0-9]\.[0-9]+\.[0-9](-.+)? ]]; then
    echo >&2 "Version $1 is not valid! It must be a valid semver string like 1.0.2 or 2.3.0-beta.1"
    exit 1
  fi
}

# Get the current version from package.json
current_version=$(node -p "require('./package').version")

# Prompt the user to input the new version
printf "Next version (current is $current_version)? "
read next_version


# Validate user input
validate_semver $next_version

# Run tests
npm test

# Push to make sure we are up to date
git push origin master

# Build umd and cjs files
npm run build

# Build new docs and push to github pages site
npm run publish-docs

# Update package.json version (this also adds a git tag with the version)
npm version $next_version

# Publish changes to npm
npm publish

# Push version commit and tags to github
git push origin master --follow-tags
