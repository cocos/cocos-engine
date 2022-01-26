# should be run from the MSVC developer command prompt
# (search `x64 Native Tools Command Prompt for VS 20xx` in start menu)

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

if [ -x "$(command -v ninja)" ]; then
    MAKE_BIN=-DCMAKE_MAKE_PROGRAM="$(command -v ninja)"
else
    echo "Cannot find Ninja"
    exit 1
fi

mkdir -p native/build
cp native/utils/CMakeLists.header.txt native/build/CMakeLists.txt
set -x
cmake -Sbuild -Bbuild -DCC_USE_GLES2=ON -DCC_USE_VULKAN=ON -DCC_USE_GLES3=ON \
    -DCMAKE_EXPORT_COMPILE_COMMANDS=ON \
    -GNinja $MAKE_BIN

cp native/build/compile_commands.json .
