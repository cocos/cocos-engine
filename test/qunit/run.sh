#!/bin/bash
echo Run unit tests in Chrome \(sh test/qunit/run.sh\)
echo \(You need to run \"gulp build-test-sm\" before testing.\)
echo
sh test/qunit/run-helper.sh &
node test/qunit/server.js
