#!/bin/bash

mkdir -p native/build
cp native/utils/CMakeLists.header.txt  native/build/CMakeLists.txt
cmake -Sbuild -Bbuild -DCC_USE_GLES2=OFF -DCC_USE_VULKAN=OFF -DCC_USE_GLES3=OFF -DCC_USE_METAL=ON \
    -DCMAKE_EXPORT_COMPILE_COMMANDS=ON \
    -DUSE_PHYSICS_PHYSX=ON \
    -G"Unix Makefiles"
cp native/build/compile_commands.json .
