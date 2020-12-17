#!/bin/sh

if [ -z $1 ]; then
    echo "error: $0 needs a version number as argument.";
    exit 1
else
    set -ex
    NEW_VERSION=$1

    git checkout main
    git reset --hard HEAD

    git tag "v${NEW_VERSION}" -m "${NEW_VERSION} release"

    git push origin
    git push origin --tags
fi