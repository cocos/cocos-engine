if [ $# -ne 0 ]; then
    ndk_path=$1
elif [ -n "$HW_NDK" ]; then
    ndk_path=$HW_NDK
else
    echo "Cannot find NDK root path"
    exit 1
fi

proj_dir=I:/Github/test-cases-3d

mkdir -p build
cp utils/CMakeLists.header.txt build/CMakeLists.txt
cmake -Bbuild \
    -DRES_DIR=$proj_dir/build/ohos \
    -S$proj_dir/native/engine/ohos/ \
    -D USE_VIDEO=ON \
    -DCC_USE_GLES3=ON \
    -DCC_USE_GLES2=OFF \
    -DCC_USE_VULKAN=OFF \
    -DOHOS_ARCH=arm64-v8a \
    -DCMAKE_BUILD_TYPE=Debug \
    -DCMAKE_EXPORT_COMPILE_COMMANDS=ON \
    -DCMAKE_TOOLCHAIN_FILE="$ndk_path/build/cmake/ohos.toolchain.cmake" \
    -DCMAKE_CXX_FLAGS="-I$ndk_path/llvm/include/c++/v1" \
    -DCMAKE_C_FLAGS="-I$ndk_path/llvm/include/c++/v1" \
    -DCMAKE_MAKE_PROGRAM="$ndk_path/build-tools/cmake/bin/ninja" \
    -GNinja \
    -DUSE_SOCKET=ON \
    -DUSE_WEBSOCKET_SERVER=ON \
    -DUSE_JOB_SYSTEM_TASKFLOW=OFF \
    -DUSE_JOB_SYSTEM_TBB=OFF

    

    
cp build/compile_commands.json .
