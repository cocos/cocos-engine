#!/bin/bash

# Generate script bindings for Cocos2D-X-lite
# ... using Android NDK system headers
# ... and push these changes to remote repos

# Dependencies
#
# For bindings generator:
# (see tools/tojs/genbindings.py for the defaults used if the environment is not customized)
#
#  * $PYTHON_BIN
#  * $CLANG_ROOT
#  * $NDK_ROOT
#

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$DIR/../.."
TRAVIS_ROOT="$PROJECT_ROOT/tools/travis-scripts"
JS_AUTO_GENERATED_DIR="$PROJECT_ROOT/cocos/bindings/auto"
COMMITTAG="[ci skip][AUTO]: updating jsbinding automatically: ${TRAVIS_COMMIT:0:8}"
ELAPSEDSECS=`date +%s`
COCOS_BRANCH="update_js_bindings_$ELAPSEDSECS"
COCOS_ROBOT_REMOTE="https://${GH_USER}:${GH_PASSWORD}@github.com/${GH_USER}/cocos2d-x-lite.git"
PULL_REQUEST_REPO="https://api.github.com/repos/cocos-creator/engine-native/pulls"
FETCH_REMOTE_BRANCH=$1
JS_COMMIT_PATH="cocos/bindings/auto"

# Exit on error
set -e

if [ "$TRAVIS_OS_NAME" == "windows" ]; then
  export PATH="/c/Python27":$PATH
fi


if [ "$TRAVIS_OS_NAME" != "linux" ]; then
  exit 0
fi

if [ "$TRAVIS_PULL_REQUEST" != "false" ]; then
  exit 0
fi


if [ -z "${GH_EMAIL}" ]; then
  echo "GH_EMAIL not set"
  exit 1
fi
if [ -z "${GH_USER}" ]; then
  echo "GH_USER not set"
  exit 1
fi
if [ -z "${GH_PASSWORD}" ]; then
  echo "GH_PASSWORD not set"
  exit 1
fi

pushd "$PROJECT_ROOT"
#Set git user for cocos2d-js repo
git config user.email ${GH_EMAIL}
git config user.name ${GH_USER}
popd


echo
echo Bindings generated successfully
echo

echo
echo Using "'$COMMITTAG'" in the commit messages
echo


echo Using "$ELAPSEDSECS" in the branch names for pseudo-uniqueness

# 2. In Bindings repo, Check if there are any files that are different from the index

pushd "$PROJECT_ROOT"

# Run status to record the output in the log
git status

echo
echo Comparing with origin HEAD ...
echo

git fetch origin ${FETCH_REMOTE_BRANCH}

# Don't exit on non-zero return value
set +e

git diff FETCH_HEAD --stat --exit-code ${JS_COMMIT_PATH}

JS_DIFF_RETVAL=$?
if [ $JS_DIFF_RETVAL -eq 0 ]
then
    echo
    echo "No differences in generated files"
    echo "Exiting with success."
    echo
    exit 0
else
    echo
    echo "Generated files differ from HEAD. Continuing."
    echo
fi

# Exit on error
set -e

set -x

git add -f --all "$JS_AUTO_GENERATED_DIR"
git checkout -b "$COCOS_BRANCH"
git commit -m "$COMMITTAG"

#Set remotes
git remote add upstream "$COCOS_ROBOT_REMOTE" 2> /dev/null > /dev/null
if $(git rev-parse --is-shallow-repository); then
    git fetch --unshallow 
fi
git fetch upstream --no-recurse-submodules

echo "Pushing to Robot's repo ..."
# git push -fq upstream "$COCOS_BRANCH" 2> /dev/null
git push -fq upstream "$COCOS_BRANCH"

echo "  finish push ..."

# set +x

# 7.
ENCODED_MESSAGE=$(python -c "from cgi import escape; print escape('''$TRAVIS_COMMIT_MESSAGE''')")
echo "Sending Pull Request to base repo ..."
curl -u $GH_USER:$GH_PASSWORD --request POST --data "{ \"title\": \"$COMMITTAG\", \"body\": \"> $ENCODED_MESSAGE\", \"head\": \"${GH_USER}:${COCOS_BRANCH}\", \"base\": \"${TRAVIS_BRANCH}\"}" "${PULL_REQUEST_REPO}" # 2> /dev/null > /dev/null

echo "  finish sending PR ..."

popd
