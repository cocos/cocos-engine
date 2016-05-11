#!/bin/bash
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
COCOS2DX_ROOT="$DIR"/../..

if [ -z "$NDK_ROOT" ]; then
    export NDK_ROOT=$HOME/bin/android-ndk
fi

if [ -z "$PYTHON_BIN" ]; then
    export PYTHON_BIN=/usr/bin/python
fi

if [ $TRAVIS_OS_NAME == 'linux' ]; then
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
        echo "GH_USER not set"
        exit 1
    fi

    cd $COCOS2DX_ROOT/tools/travis-scripts
    ./generate-bindings.sh $TRAVIS_BRANCH
elif [ $TRAVIS_OS_NAME == 'osx' ]; then
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
        echo "GH_USER not set"
        exit 1
    fi

    cd $COCOS2DX_ROOT/tools/travis-scripts
    ./generate-cocosfiles.sh $TRAVIS_BRANCH
else
    echo "Unknown \$PLATFORM: '$PLATFORM'"
    exit 1
fi
