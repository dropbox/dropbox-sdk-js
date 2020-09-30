#!/bin/sh

last_version=$(git tag -l | tail -n 2 | head -n 1)
echo "Getting commit history since $last_version"
num_commits=$(git rev-list --count $last_version..HEAD)
echo "Found $num_commits commits since last revision"
log=$(git log -n $num_commits --pretty="format:* %s %n")
echo $log
#linked_log=$(echo "Release Notes: \n\n$log" | sed 's/#\([0-9]\+\)/[#\1](link\/\1)/g')
#echo $linked_log
echo "Release notes written to release_notes.txt"