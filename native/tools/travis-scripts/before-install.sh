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

function install_android_ndk()
{
    # Download android ndk
    if [ $TRAVIS_OS_NAME = 'osx' ]; then
        HOST_NAME="darwin"
    else
        HOST_NAME="linux"
    fi
    echo "Download android-ndk-r16b-${HOST_NAME}-x86_64.zip ..."
    curl -O http://dl.google.com/android/repository/android-ndk-r16b-${HOST_NAME}-x86_64.zip
    echo "Decompress android-ndk-r16b-${HOST_NAME}-x86_64.zip ..."
    unzip -q android-ndk-r16b-${HOST_NAME}-x86_64.zip
    # Rename ndk
    mv android-ndk-r16b android-ndk
}

function install_clang()
{
    if [ ! -f $COCOS2DX_ROOT/tools/bindings-generator/libclang/libclang.so ]; then
        echo "Download clang"
        curl -O http://releases.llvm.org/5.0.0/clang+llvm-5.0.0-linux-x86_64-ubuntu14.04.tar.xz
        echo "Decompress clang"
        tar xpf ./clang+llvm-5.0.0-linux-x86_64-ubuntu14.04.tar.xz
        cp ./clang+llvm-5.0.0-linux-x86_64-ubuntu14.04/lib/libclang.so.5.0 $COCOS2DX_ROOT/tools/bindings-generator/libclang/libclang.so
    else
        echo "Skip downloading clang"
        echo "  file $COCOS2DX_ROOT/tools/bindings-generator/libclang/libclang.so exists!"
    fi
}

function install_python_module_for_osx()
{
  sudo easy_install pip
  sudo -H pip install pyyaml
  sudo -H pip install Cheetah
}

#we only use osx for generate bindings
install_android_ndk
install_python_module_for_osx
install_clang
