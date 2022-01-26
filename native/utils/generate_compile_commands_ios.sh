#!/bin/bash

mkdir -p native/build
cp native/utils/CMakeLists.header.txt  native/build/CMakeLists.txt
cmake -S native/build -B native/build -DCC_USE_GLES2=OFF -DCC_USE_VULKAN=OFF -DCC_USE_GLES3=OFF -DCC_USE_METAL=ON \
    -DCMAKE_EXPORT_COMPILE_COMMANDS=ON \
    -DUSE_PHYSICS_PHYSX=ON \
    -DCMAKE_OSX_SYSROOT=iphoneos \
    -DCMAKE_SYSTEM_NAME=iOS \
    -GXcode
if [[ -f native/build/compile_commands.json ]]; then
   cp native/build/compile_commands.json .
fi
