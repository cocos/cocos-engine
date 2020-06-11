#!/bin/bash

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
COCOS2DX_ROOT="$DIR"/../..
HOST_NAME=""
set -x


function download_external()
{
    pushd $COCOS2DX_ROOT
    node ./utils/download-deps.js
    popd
}

pushd $COCOS2DX_ROOT
npm install
popd

download_external


mkdir -p $HOME/bin
cd $HOME/bin

function install_android_ndk()
{
    # Download android ndk
    if [ $TRAVIS_OS_NAME = 'osx' ]; then
        HOST_NAME="darwin"
    elif [ $TRAVIS_OS_NAME = 'linux' ]; then
        HOST_NAME="linux"
    else
        HOST_NAME="windows"
    fi
    echo "Download android-ndk-r16b-${HOST_NAME}-x86_64.zip ..."
    curl -O http://dl.google.com/android/repository/android-ndk-r16b-${HOST_NAME}-x86_64.zip
    echo "Decompress android-ndk-r16b-${HOST_NAME}-x86_64.zip ..."
    unzip -q android-ndk-r16b-${HOST_NAME}-x86_64.zip
    # Rename ndk
    mv android-ndk-r16b android-ndk
}


function install_python_module()
{
  if [ "$TRAVIS_OS_NAME" == "osx" ]; then
    sudo easy_install pip
    pip install PyYAML
    pip install Cheetah
  elif [ "$TRAVIS_OS_NAME" == "windows" ]; then
    python -m easy_install pip 
    python -m pip install PyYAML
    python -m pip install Cheetah
  else
    sudo easy_install pip
    sudo -H pip install pyyaml
    sudo -H pip install Cheetah
  fi
}

#we only use osx for generate bindings
install_python_module
install_android_ndk

set +x