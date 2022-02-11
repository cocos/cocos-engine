#!/bin/bash

set -e

# If not a pull request, setup for Linux only
if [[ "$TRAVIS_PULL_REQUEST" != "false" ]]; then
  echo "Should run when TRAVIS_PULL_REQUEST == false"
  echo "Commit msg: $TRAVIS_COMMIT_MESSAGE"
  echo "Stop process for TRAVIS_OS_NAME:$TRAVIS_OS_NAME && TRAVIS_PULL_REQUEST:$TRAVIS_PULL_REQUEST"
  exit 0
fi


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

function install_python_module()
{
  sudo easy_install pip
  sudo -H pip install pyyaml
  sudo -H pip install Cheetah
}

#we only use osx for generate bindings

download_external
install_python_module

set +x