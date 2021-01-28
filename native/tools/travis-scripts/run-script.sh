#!/bin/bash
set -e

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

function build_android()
{
    echo "Compiling Android ... "

    cd $COCOS2DX_ROOT/templates/
    if [ ! -d  android-template ]; then
      cp -r android/template android-template
    fi
    cd $COCOS2DX_ROOT/templates/android/build
    mkdir -p build-android/proj
    touch build-android/proj/cfg.cmake
    mkdir -p build-android/assets

    ASSET_DIR=$COCOS2DX_ROOT/templates/android/build/build-android/

    sed -i "s@\${NATIVE_DIR}@$NATIVE_DIR@g" settings.gradle
    sed -i "s@\${COCOS_ROOT}@$COCOS2DX_ROOT@g" settings.gradle
    sed -i "s@\${NATIVE_DIR}@$NATIVE_DIR@g" build.gradle
    sed -i "s@^PROP_NDK_PATH.*@PROP_NDK_PATH=$ANDORID_NDK@g" gradle.properties
    sed -i "s@^APPLICATION_ID.*@APPLICATION_ID=com.cocos.android@g" gradle.properties
    sed -i "s@^RES_PATH.*@RES_PATH=$ASSET_DIR@g" gradle.properties
    sed -i "s@^COCOS_ENGINE_PATH.*@COCOS_ENGINE_PATH=$COCOS2DX_ROOT@g" gradle.properties

    #echo "Compile Android - ndk-build ..."
    #./gradlew assembleDebug --quiet

    echo "Compile Android - cmake ..."
    echo "ANDORID_NDK ${ANDROID_NDK} or ${ANDROID_NDK_HOME}"
    ./gradlew assembleDebug --quiet
    echo "Compile Android Debug Done!"
    # ./gradlew assembleRelease # --quiet
    # echo "Compile Android Release Done!"
}

function mac_install_cmake()
{
    echo "Compiling CMake ... "
    NUM_OF_CORES=`getconf _NPROCESSORS_ONLN`
    cd $HOME/bin
    cmake_source=https://github.com/Kitware/CMake/releases/download/v3.17.0/cmake-3.17.0.tar.gz
    wget -t 5 --no-check-certificate $cmake_source -O cmake-mac.tar.gz -q
    tar xf cmake-mac.tar.gz 2>/dev/null
    cd cmake-3.17.0
    ./configure --prefix=$HOME/bin/cmake > /dev/null
    make -j $NUM_OF_CORES >/dev/null
    make install >/dev/null
    ls $HOME/bin/cmake
    export PATH=$HOME/bin/cmake/bin:$PATH
}

function mac_download_cmake()
{
    echo "Download CMake ..."
    cmake_binary=https://github.com/Kitware/CMake/releases/download/v3.17.0/cmake-3.17.0-Darwin-x86_64.tar.gz
    wget -t 3 --no-check-certificate $cmake_binary -O cmake_bin.tar.gz -q
    tar xf cmake_bin.tar.gz 2>/dev/null
    cmake_bin_dir=`dirname $(find . -name cmake-gui)`
    cmake_bin_dir="$PWD/$cmake_bin_dir"
    export PATH=$cmake_bin_dir:$PATH
}

function build_macosx()
{
     NUM_OF_CORES=`getconf _NPROCESSORS_ONLN`

    echo "Compiling MacOSX ... "
    cd  $COCOS2DX_ROOT/templates/mac
    mkdir -p build-mac/proj
    touch build-mac/proj/cfg.cmake
    mkdir build-mac/assets

    RES_DIR=$COCOS2DX_ROOT/templates/mac/build-mac
    cd build-mac
    cmake ../ -GXcode -DCC_USE_METAL=ON -DCMAKE_OSX_ARCHITECTURES=x86_64 -DRES_DIR=$RES_DIR -DCOCOS_X_PATH=$COCOS2DX_ROOT
    cmake --build . --config Release -- -quiet -jobs $NUM_OF_CORES -arch x86_64
    echo "Compile MacOSX X86_64 Release Done!"
    cd ..
    mkdir build-mac-apple-silicon
    cd build-mac-apple-silicon
    cmake ../ -GXcode -DCC_USE_METAL=ON -DCC_USE_GLES3=OFF -DCMAKE_OSX_ARCHITECTURES=arm64 -DRES_DIR=$RES_DIR -DCOCOS_X_PATH=$COCOS2DX_ROOT
    cmake --build . --config Release -- -quiet -jobs $NUM_OF_CORES -arch arm64
    echo "Compile MacOSX ARM64 Release Done!"
}

function build_ios()
{
    NUM_OF_CORES=`getconf _NPROCESSORS_ONLN`

    echo "Compiling iOS ... "
    cd  $COCOS2DX_ROOT/templates/ios
    mkdir -p build-ios/proj
    touch build-ios/proj/cfg.cmake
    mkdir build-ios/assets
    cd build-ios
    RES_DIR=$COCOS2DX_ROOT/templates/ios/build-ios
    cmake ../ -GXcode -DCMAKE_SYSTEM_NAME=iOS \
        -DCMAKE_OSX_SYSROOT=iphonesimulator \
        -DCMAKE_OSX_ARCHITECTURES=x86_64 \
        -DCC_USE_METAL=ON \
        -DRES_DIR=$RES_DIR \
        -DCOCOS_X_PATH=$COCOS2DX_ROOT
    cmake --build . --config Debug -- -quiet -jobs $NUM_OF_CORES -allowProvisioningUpdates
    echo "Compile iOS Done!"
}

function build_windows()
{
    echo "Compiling Win32 ... "
    cd  $COCOS2DX_ROOT/templates/win32
    mkdir -p build-win32/proj
    touch build-win32/proj/cfg.cmake
    mkdir build-win32/assets
    cd build-win32
    RES_DIR=$COCOS2DX_ROOT/templates/win32/build-win32
    cmake ../ -G"Visual Studio 15 2017" -DRES_DIR=$RES_DIR -DCOCOS_X_PATH=$COCOS2DX_ROOT
    cmake --build . --config Debug
    echo "Compile Win32 Debug Done!"
    cmake --build . --config Release
    echo "Compile Win32 Debug Done!"
}


function run_compile()
{
    if [ "$BUILD_TARGET" == "android_cmake" ]; then
        setup_linux_andorid_sdk
        build_android
    fi

    if [ "$BUILD_TARGET" == "macosx_cmake" ]; then
        mac_download_cmake
        build_macosx
    fi

    if [ "$BUILD_TARGET" == "ios_cmake" ]; then
        mac_download_cmake
        build_ios
    fi

    if [ "$BUILD_TARGET" == "windows_cmake" ]; then
        cmake --version
        build_windows
    fi
}

# If not a pull request, setup for Linux only
if [[ "$TRAVIS_OS_NAME" != "linux" && "$TRAVIS_PULL_REQUEST" == "false" ]]; then
  echo "Stop process for TRAVIS_OS_NAME:$TRAVIS_OS_NAME && TRAVIS_PULL_REQUEST:$TRAVIS_PULL_REQUEST"
  exit 0
fi


cd $COCOS2DX_ROOT/tools/travis-scripts
generate_bindings_glue_codes

# Compile pull request
if [[ "$TRAVIS_PULL_REQUEST" != "false" ]]; then
    run_compile
fi

cd $COCOS2DX_ROOT
## revert change
git clean -fdx templates
git checkout HEAD templates
set +x

cd $COCOS2DX_ROOT/tools/travis-scripts
bash ./generate-pr.sh $TRAVIS_BRANCH
exit 0
