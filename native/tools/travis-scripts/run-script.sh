#!/bin/bash
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
COCOS2DX_ROOT="$DIR"/../..
COCOS_CLI=$COCOS2DX_ROOT/tools/cocos-console/bin/cocos_cli.js
TOJS_ROOT=$COCOS2DX_ROOT/tools/tojs

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
    cd $COCOS2DX_ROOT/templates/template-link/platforms/android
    sed -i "s@\${COCOS_ROOT}@$COCOS2DX_ROOT@g" app/build.gradle
    sed -i "s@\${COCOS_ROOT}@$COCOS2DX_ROOT@g" instantapp/build.gradle
    sed -i "s@RES_DIR@UNUSE_RES_DIR@g" app/build.gradle
    sed -i "s@RES_DIR@UNUSE_RES_DIR@g" instantapp/build.gradle
    sed -i "s@\${COCOS_ROOT}@$COCOS2DX_ROOT@g" ../../common/CMakeLists.txt
    sed -i "s@\${COCOS_ROOT}@$COCOS2DX_ROOT@g" settings.gradle
    sed -i "s@\${COCOS_PROJ_COMMON}@$COCOS2DX_ROOT/templates/template-link/common@g" app/build.gradle
    sed -i "s@\${COCOS_PROJ_COMMON}@$COCOS2DX_ROOT/templates/template-link/common@g" instantapp/build.gradle
    sed -i "s/^RELEASE_/#RELEASE_/g" gradle.properties

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
    cd  $COCOS2DX_ROOT/templates/template-link/platforms/mac
    mkdir build-mac
    cd build-mac
    cmake ../../../common -GXcode -DCOCOS_ROOT=$COCOS2DX_ROOT -DCC_USE_METAL=ON
    cmake --build . --config Debug -- -quiet -jobs $NUM_OF_CORES
    echo "Compile MacOSX Debug Done!"
    cmake --build . --config Release -- -quiet -jobs $NUM_OF_CORES
    echo "Compile MacOSX Release Done!"
}

function build_ios()
{
    NUM_OF_CORES=`getconf _NPROCESSORS_ONLN`

    echo "Compiling iOS ... "
    cd  $COCOS2DX_ROOT/templates/template-link/platforms/ios
    mkdir build-ios
    cd build-ios
    cmake ../../../common -GXcode -DCOCOS_ROOT=$COCOS2DX_ROOT -DCMAKE_SYSTEM_NAME=iOS \
        -DCMAKE_OSX_SYSROOT=iphonesimulator \
        -DCMAKE_OSX_ARCHITECTURES=x86_64 \
        -DCC_USE_METAL=ON
    cmake --build . --config Debug -- -quiet -jobs $NUM_OF_CORES
    echo "Compile iOS Done!"
}

function build_windows()
{
    echo "Compiling Win32 ... "
    cd  $COCOS2DX_ROOT/templates/template-link/platforms/win32
    mkdir build-win32
    cd build-win32
    cmake ../../../common -G"Visual Studio 15 2017" -DCOCOS_ROOT=$COCOS2DX_ROOT
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
