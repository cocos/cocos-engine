#!/bin/bash

mkdir -p build
cp utils/CMakeLists.header.txt  build/CMakeLists.txt
cmake -Sbuild -Bbuild -DCC_USE_GLES2=OFF -DCC_USE_VULKAN=OFF -DCC_USE_GLES3=OFF -DCC_USE_METAL=ON \
    -DCMAKE_EXPORT_COMPILE_COMMANDS=ON \
    -DUSE_PHYSICS_PHYSX=ON \
    -DCMAKE_OSX_SYSROOT=iphoneos \
    -DCMAKE_SYSTEM_NAME=iOS \
    -GXcode
cp build/compile_commands.json .
