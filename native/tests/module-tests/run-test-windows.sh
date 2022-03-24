#!/bin/bash

set -x
set -e

if [ -f "$HW_NDK/build/cmake/ohos.toolchain.cmake" ]; then

    cmake -B build-ohos \
    -DCMAKE_TOOLCHAIN_FILE="$HW_NDK/build/cmake/ohos.toolchain.cmake" \
    -DCMAKE_MAKE_PROGRAM=ninja \
    -GNinja \
    -DOHOS_ARCH=arm64-v8a 

    for target in test-log test-bindings test-math test-fs 
    do
        cmake --build build-ohos --target $target
    done

fi

if [ -f "$NDK_ROOT/build/cmake/android.toolchain.cmake" ]; then
    ANDOIR_TOOLCHAIN_FILE="$NDK_ROOT/build/cmake/android.toolchain.cmake"
elif [ -f "$ANDROID_NDK/build/cmake/android.toolchain.cmake" ]; then
    ANDOIR_TOOLCHAIN_FILE="$ANDROID_NDK/build/cmake/android.toolchain.cmake"
elif [ -f "$ANDROID_NDK_HOME/build/cmake/android.toolchain.cmake" ]; then
    ANDOIR_TOOLCHAIN_FILE="$ANDROID_NDK_HOME/build/cmake/android.toolchain.cmake"
else
    ANDOIR_TOOLCHAIN_FILE="$ANDROID_NDK_ROOT/build/cmake/android.toolchain.cmake"
fi

cmake -B build-win32 -A win32 


if ! [ -x "$(command -v ninja)" ]; then
    cmake -B build-android \
        -DCMAKE_TOOLCHAIN_FILE="$ANDOIR_TOOLCHAIN_FILE" \
        -DANDROID_PLATFORM=android-21 \
        -DCMAKE_MAKE_PROGRAM=make \
        -DANDROID_LD=lld \
        -G"Unix Makefiles"
else
    cmake -B build-android \
        -DCMAKE_TOOLCHAIN_FILE="$ANDOIR_TOOLCHAIN_FILE" \
        -DANDROID_PLATFORM=android-21 \
        -DCMAKE_MAKE_PROGRAM=ninja \
        -DANDROID_LD=lld \
        -GNinja
fi


for target in test-log test-bindings test-math test-fs 
do
cmake --build build-android --target $target -- -j 4
cmake --build build-win32 --target $target --config Release --  /verbosity:minimal
done

TEST_LOG_EXE=./build-win32/log/Release/test-log.exe
TESTS_MATH_EXE=./build-win32/math/Release/test-math.exe
TEST_BINDINGS_EXE=./build-win32/bindings/Release/test-bindings.exe
TEST_FS_EXE=./build-win32/filesystem/Release/test-fs.exe

for exe in $TEST_LOG_EXE $TESTS_MATH_EXE $TEST_BINDINGS_EXE $TEST_FS_EXE
do
if ! [ -f $exe ]; then
echo "File $exe not found!"
exit 1
fi
done

echo "done!"