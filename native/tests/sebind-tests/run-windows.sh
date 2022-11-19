#!bin/bash
set -x

cp -r ../../../templates/windows win64
mkdir -p proj
cp cfg.cmake proj/
GW="$(realpath `pwd`/../..)"
cmake -B proj -S win64 -DRES_DIR="${GW}/tests/sebind-tests" -DCOCOS_X_PATH="${GW}" \
    -DAPP_NAME=sebind

cmake --build proj
cd proj/Debug
rm -f result.txt
./sebind.exe || true
if [[ -f "result.txt" ]]; 
then
echo "success!"
else
echo "Run sebind-tests fail!"
exit 1
fi