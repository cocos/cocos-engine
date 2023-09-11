#!/usr/bin/env bash

set -e

# Get the absolute path of the script
SCRIPT_PATH="$(readlink -f "$0")"

# Extract the directory path from the script path
SCRIPT_DIR="$(dirname "$SCRIPT_PATH")"

cd $SCRIPT_DIR/..
echo "==== Generate compile_commands.json & ninja target"
rm -rf $SCRIPT_DIR/../build/CMakeCache.txt
bash ./utils/generate_compile_commands_android.sh

echo "==== Generate binding code ..."
ninja -C build genbindings


echo "==== npm install in build-engine ..."
cd ..
npm install
cd packages/build-engine

echo "==== Installing babel dependencies ..."
npm install

echo "==== Build typescripts ... "
npm run build

echo "====  parsing ..."
node $SCRIPT_DIR/gen_decorators.js

echo "====  generate done!"
# git checkout HEAD package.json package-lock.json
# git checkout HEAD scripts # revert all changes within build-engine/