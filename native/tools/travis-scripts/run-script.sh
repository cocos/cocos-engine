#!/bin/bash
set -e


# If not a pull request, setup for Linux only
if [[ "$TRAVIS_PULL_REQUEST" != "false" ]]; then
  echo "Should run when TRAVIS_PULL_REQUEST == false"
  echo "Stop process for TRAVIS_OS_NAME:$TRAVIS_OS_NAME && TRAVIS_PULL_REQUEST:$TRAVIS_PULL_REQUEST"
  exit 0
fi

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
COCOS2DX_ROOT="$DIR"/../..
COCOS_CLI=$COCOS2DX_ROOT/tools/cocos-console/bin/cocos_cli.js
TOJS_ROOT=$COCOS2DX_ROOT/tools/tojs

NATIVE_DIR=$COCOS2DX_ROOT/templates/android-template

if [ -z "$NDK_ROOT" ]; then
    export NDK_ROOT=$HOME/bin/android-ndk
fi

# to fix git error: shallow update not allowed
# https://stackoverflow.com/questions/28983842/remote-rejected-shallow-update-not-allowed-after-changing-git-remote-url
#git remote add old https://github.com/cocos-creator/cocos2d-x-lite
#git fetch --unshallow old

set -x


ANDROID_SDK=$COCOS2DX_ROOT/../android/android_sdk
export ANDROID_HOME=$ANDROID_SDK
export ANDROID_NDK=$NDK_ROOT       #installed in generate-bindings.sh
export ANDROID_NDK_HOME=$NDK_ROOT

# Enable treat warning as error in CMakeList.txt
export COCOS_ENGINE_DEV=1 

generate_bindings_glue_codes()
{
    echo "Create auto-generated jsbinding glue codes."
    pushd $TOJS_ROOT
    python -V
    python ./genbindings.py
    rm userconf.ini
    popd
}


function setup_linux_andorid_sdk()
{
    echo "Download Android SDK... "
    cd $COCOS2DX_ROOT/..
    mkdir android
    cd android
    wget -t 5 -q https://dl.google.com/android/repository/commandlinetools-linux-6200805_latest.zip
    unzip *.zip
    yes | ./tools/bin/sdkmanager  --sdk_root="$ANDROID_SDK" \
            "platforms;android-27" \
            "build-tools;28.0.3" \
            "platform-tools" \
            "tools"  \
            "cmake;3.10.2.4988404"
    cmake_dir=$ANDROID_SDK/cmake/3.10.2.4988404/bin
    export PATH=$cmake_dir:$PATH
}



setup_linux_andorid_sdk

cd $COCOS2DX_ROOT/tools/travis-scripts
generate_bindings_glue_codes


cd $COCOS2DX_ROOT
## revert change
git clean -fdx templates
git checkout HEAD templates
set +x

cd $COCOS2DX_ROOT/tools/travis-scripts
bash ./generate-pr.sh $TRAVIS_BRANCH
exit 0
