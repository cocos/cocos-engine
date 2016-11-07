#!/bin/bash

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
    echo "Download android-ndk-r11c-${HOST_NAME}-x86_64.zip ..."
    curl -O http://dl.google.com/android/repository/android-ndk-r11c-${HOST_NAME}-x86_64.zip
    echo "Decompress android-ndk-r11c-${HOST_NAME}-x86_64.zip ..."
    unzip -q android-ndk-r11c-${HOST_NAME}-x86_64.zip
    # Rename ndk
    mv android-ndk-r11c android-ndk
}

#we only use osx for generate bindings
if [ $TRAVIS_OS_NAME == 'osx' ]; then
    install_android_ndk
    sudo pip install PyYAML
fi
