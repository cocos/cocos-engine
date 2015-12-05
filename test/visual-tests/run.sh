#!/bin/bash
echo Run unit tests in Chrome \(sh test/visual-tests/run.sh\)
echo \(You need to run \"gulp build-test\" before testing.\)
echo
sh test/visual-tests/run-helper.sh &
node test/visual-tests/server.js
