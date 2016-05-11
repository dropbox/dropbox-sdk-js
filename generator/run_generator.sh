#!/bin/bash
babelapi js.babelg.py ../src ../dropbox-api-spec/*.babel -f 'style!="download" and style!="upload"' -- routes.js -a style
