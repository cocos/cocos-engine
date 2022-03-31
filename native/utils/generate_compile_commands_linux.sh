#!/bin/bash

GENERATER="Ninja"
if [ -x "$(command -v ninja)" ]; then
    MAKE_BIN=-DCMAKE_MAKE_PROGRAM="$(command -v ninja)"
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
    -DCMAKE_BUILD_TYPE=Debug \
    -DCMAKE_C_COMPILER=clang \
    -DCMAKE_CXX_COMPILER=clang++ \
    -G "$GENERATER" $MAKE_BIN 

cp build/compile_commands.json .
