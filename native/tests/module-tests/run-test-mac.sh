#!/bin/bash

set -x
set -e
cmake -B build-mac -GXcode 
cmake -B build-iOS \
    -GXcode \
    -DCMAKE_SYSTEM_NAME=iOS \
    -DCMAKE_OSX_SYSROOT=iphoneos 


for target in test-log test-bindings test-math test-fs 
do
cmake --build build-mac --target $target --config Release -- -quiet
cmake --build build-iOS --target $target -- -allowProvisioningUpdates CODE_SIGN_IDENTITY="" CODE_SIGNING_REQUIRED=NO CODE_SIGNING_ALLOWED=NO  -quiet
done

./build-mac/log/Release/test-log
./build-mac/math/Release/test-math
./build-mac/bindings/Release/test-bindings
./build-mac/filesystem/Release/test-fs

