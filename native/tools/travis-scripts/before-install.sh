#!/bin/bash

# exit this script if any commmand fails
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
COCOS2DX_ROOT="$DIR"/../..
HOST_NAME=""

pushd $COCOS2DX_ROOT
python download-deps.py -r=yes
popd

mkdir -p $HOME/bin
cd $HOME/bin

install_android_ndk()
{
    # Download android ndk
    if [ $TRAVIS_OS_NAME = 'osx' ]; then
        HOST_NAME="darwin"
    else
        HOST_NAME="linux"
    fi
    echo "Download android-ndk-r9d-${HOST_NAME}-x86_64.tar.bz2 ..."
    curl -O http://dl.google.com/android/ndk/android-ndk-r9d-${HOST_NAME}-x86_64.tar.bz2
    echo "Decompress android-ndk-r9d-${HOST_NAME}-x86_64.tar.bz2 ..."
    tar xjf android-ndk-r9d-${HOST_NAME}-x86_64.tar.bz2
    # Rename ndk
    mv android-ndk-r9d android-ndk
}

#we only use osx for generate bindings
if [ $TRAVIS_OS_NAME == 'osx' ]; then
    install_android_ndk
fi
