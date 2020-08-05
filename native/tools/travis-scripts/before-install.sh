#!/bin/bash

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
COCOS2DX_ROOT="$DIR"/../..
HOST_NAME=""
set -x


function download_external()
{
    pushd $COCOS2DX_ROOT
    #python download-deps.py -r=yes
    cd $COCOS2DX_ROOT/external
    external_version=`grep version config.json  |awk -F'"' '{print $4}'`
    external_repo_name=`grep name config.json  |awk -F'"' '{print $4}'`
    external_repo_parent=`grep owner config.json  |awk -F'"' '{print $4}'`
    rm *
    git clone --branch $external_version --depth 1 https://github.com/$external_repo_parent/$external_repo_name .
    #git checkout $external_version
    git log --oneline -1
    popd
}

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

function install_python_win32()
{
    choco install --forcex86 -y python2
    export PATH="/c/Python27":$PATH
}

function install_python_module()
{
  if [ "$TRAVIS_OS_NAME" == "osx" ]; then
    sudo easy_install pip
    pip install PyYAML
    pip install Cheetah
  elif [ "$TRAVIS_OS_NAME" == "windows" ]; then
    install_python_win32
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