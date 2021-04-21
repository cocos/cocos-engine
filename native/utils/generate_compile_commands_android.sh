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
cp CMakeLists.txt CMakeLists-bak.txt
cat utils/CMakeLists.header.txt CMakeLists-bak.txt > CMakeLists.txt
cmake -Bbuild -DCC_USE_GLES2=ON -DCC_USE_VULKAN=ON -DCC_USE_GLES3=ON -DCMAKE_EXPORT_COMPILE_COMMANDS=ON -DCMAKE_TOOLCHAIN_FILE="$ndk_path/build/cmake/android.toolchain.cmake" -DANDROID_PLATFORM=android-21 -G"Unix Makefiles"
mv CMakeLists-bak.txt CMakeLists.txt
cp build/compile_commands.json .
