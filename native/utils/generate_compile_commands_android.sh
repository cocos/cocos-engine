if [ $# -ne 0 ]; then
    ndk_path=$1
elif [ -n "$ANDROID_NDK_HOME" ]; then
    ndk_path=$ANDROID_NDK_HOME
elif [ -n "$ANDROID_NDK_ROOT" ]; then
    ndk_path=$ANDROID_NDK_ROOT
elif [ -n "$NDK_ROOT" ]; then
    ndk_path=$NDK_ROOT
else
    echo "Cannot find NDK root path"
    exit 1
fi

GENERATER="Ninja"
if [ -x "$(command -v ninja)" ]; then
    MAKE_BIN=-DCMAKE_MAKE_PROGRAM="$(command -v ninja).exe"
else
    echo "Ninja is not find, use 'make' instead."
    GENERATER="Unix Makefiles"
    MAKE_BIN=""
fi

mkdir -p build
cp ./utils/CMakeLists.header.txt  build/CMakeLists.txt
set -x
cmake -Sbuild -Bbuild -DCC_USE_GLES2=ON -DCC_USE_VULKAN=ON -DCC_USE_GLES3=ON \
    -DCMAKE_EXPORT_COMPILE_COMMANDS=ON \
    -DCMAKE_TOOLCHAIN_FILE="$ndk_path/build/cmake/android.toolchain.cmake" \
    -DANDROID_PLATFORM=android-21 \
    -DCMAKE_BUILD_TYPE=Debug \
    -G "$GENERATER" $MAKE_BIN 

cp build/compile_commands.json .