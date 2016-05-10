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


if [ $TRAVIS_OS_NAME == 'linux' ]; then
    if [ "$GEN_COCOS_FILES"x = "YES"x ]; then
        exit 0
    elif [ "$GEN_BINDING"x = "YES"x ]; then
        if [ "$TRAVIS_PULL_REQUEST" != "false" ]; then
            exit 0
        fi
    fi
    sudo add-apt-repository -y ppa:ubuntu-toolchain-r/test
    sudo apt-get update
    sudo apt-get install gcc-4.7 g++-4.7
    sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-4.6 60 --slave /usr/bin/g++ g++ /usr/bin/g++-4.6
    sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-4.7 90 --slave /usr/bin/g++ g++ /usr/bin/g++-4.7
    g++ --version
    bash $COCOS2DX_ROOT/build/install-deps-linux.sh
    install_android_ndk
elif [ $TRAVIS_OS_NAME == 'osx' ]; then
    if [ "$TRAVIS_PULL_REQUEST" == "false" ]; then
        echo "Mac is only used for PR build."
        exit 0
    fi

    install_android_ndk
else
    echo "Unknown \$PLATFORM: '$PLATFORM'"
    exit 1
fi
