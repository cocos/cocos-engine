#!/bin/bash
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
COCOS2DX_ROOT="$DIR"/../..

if [ -z "$NDK_ROOT" ]; then
    export NDK_ROOT=$HOME/bin/android-ndk
fi

cd $COCOS2DX_ROOT/tools/travis-scripts
./generate-bindings.sh $TRAVIS_BRANCH

cd $COCOS2DX_ROOT/tools/travis-scripts
./generate-cocosfiles.sh $TRAVIS_BRANCH
exit 0
