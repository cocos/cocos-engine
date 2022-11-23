# WebGPU on WASM by Emscripten

Based on Cocos Creator v3.6.2, emsdk 3.1.17.

WebGPU explainer:  https://gpuweb.github.io/gpuweb/explainer/

## About WebGPU

#### What is WebGPU

distinguished from WebGL:
>
WebGPU is a proposed Web API to enable webpages to use the system’s GPU (Graphics Processing Unit) to perform computations and draw complex images that can be presented inside the page. This goal is similar to the WebGL family of APIs, but WebGPU enables access to more advanced features of GPUs. Whereas WebGL is mostly for drawing images but can be repurposed (with great effort) to do other kinds of computations, WebGPU has first-class support for performing general computations on the GPU.

 #### Why WebGPU

There it is.

#### Why not write in typescript

Same to "why do it in c++ and then compile into wasm", in which way we can share other upper-level scheduler logic implementation instead of implement it again in typescript. 

## Native Implementation

#### Compile

##### Environment

unix make is needed because of emscripten compile tool chain, so we have set up extra environment deployment on Windows:

[make](http://gnuwin32.sourceforge.net/packages/make.htm) [coreutils](http://gnuwin32.sourceforge.net/packages/coreutils.htm) [libiconv](http://gnuwin32.sourceforge.net/packages/libiconv.htm) [libintl](http://gnuwin32.sourceforge.net/packages/libintl.htm)

see details at [emscripten](https://emscripten.org/docs/getting_started/downloads.html).

after emscripten is deployed, type `emcc -v` in cmd/zsh, shown as below:
```
emcc (Emscripten gcc/clang-like replacement + linker emulating GNU ld) 3.1.17 (fbc532773d84d2bd7da876275671970e792ad1cd)
clang version 15.0.0 (https://github.com/llvm/llvm-project 17e4c217b66305e60657a48f10fe3c428c2fe4d2)
Target: wasm32-unknown-emscripten
Thread model: posix
InstalledDir: D:\project\emsdk\upstream\bin
```
the output is slightly different from on mac.
##### Custom

All the WGPU C++ files are in engine-native\cocos\renderer\gfx-wgpu. Modifications are applied only after manually compiling(next phrase), you need to copy the generated .js and .wasm to engine\native\external\emscripten\webgpu and engine\cocos\webgpu respectively and replace the original.

##### Compile

If any modification wants to applied in C++, cd to engine-native\cocos\renderer\gfx-wgpu and run:

`emcmake cmake .`

`emmake make`

this will generate the .js and .wasm file.

#### Implementation

##### C++ part

Same to other backends, all the graphics apis are included in `webgpu.h`.

TODO;
