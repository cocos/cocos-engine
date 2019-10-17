#emconfigure cmake ..

# 生成glue文件并部署
echo "> start compile idl"
python ~/Desktop/E/emsdk/emscripten/1.38.21/tools/webidl_binder.py ../soa.idl glue
curFiles=$(ls glue*)
echo "> 生成的胶水文件：$curFiles"
echo "> end compile idl"


#include \"../SoAMemManager.h\"\\
#USING_CC_NAMESPACE\\
#CC_NAMESPACE_BEGIN\\
#echo 'CC_NAMESPACE_END'>>glue.cpp


#hf=$(cat glue.cpp|head -n 5)
#echo "> 添加头文件：$hf"
#tf=$(cat glue.cpp|tail -n 2)
#echo "> 添加尾文件：$tf"

emmake make
echo "> make end"

#-s ERROR_ON_UNDEFINED_SYMBOLS=0  -s SIMD=1 --source-map-base "http://localhost:8002/"
emcc  libtransform.so -g -v  -s MODULARIZE=1 -s ERROR_ON_UNDEFINED_SYMBOLS=0 -s EXPORT_BINDINGS=1 -s RESERVED_FUNCTION_POINTERS=20  --memory-init-file 0 -s NO_EXIT_RUNTIME=1  -s NO_FILESYSTEM=1 -s EXPORTED_RUNTIME_METHODS=[]  -s ALLOW_MEMORY_GROWTH=1 --post-js glue.js --source-map-base "http://localhost:8002/" -o transform.js

sed -i "" "1a\\
export " transform.js
hf=$(cat transform.js|head -n 5)
echo "> 添加头文件：$hf"

cp ./transform.wasm ./transform.wasm.map ./transform.wast ~/Desktop/F/engine/bin/
cp ./transform.js ~/Desktop/F/engine/cocos/scene-graph/

cp ./transform.wasm ./transform.wasm.map ./transform.wast /Users/shenji/Desktop/D/editor-master-wasm/editor-3d/resources/3d/engine/bin/
cp ./transform.js /Users/shenji/Desktop/D/editor-master-wasm/editor-3d/resources/3d/engine/cocos/scene-graph/
echo "> cy end"
