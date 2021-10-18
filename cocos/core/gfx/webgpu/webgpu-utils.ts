/* eslint-disable @typescript-eslint/no-floating-promises */
// import { wasmBase64 } from './lib/tempArray.js';
// ({
//     wasm: require('fs').readFileSync('CocosGameWASM.wasm'),
// });

// import * as wasmDevice from './lib/webgpu_wasm';

// const wasmDevice = require('./lib/webgpu_wasm');

// let wgpuWasmModule;
// const imports = {};
// WebAssembly.instantiateStreaming(fetch('./lib/webgpu_wasm.wasm'), wgpuWasmModule)
//     .then((results) => {
//         wgpuWasmModule.wasm = results;
//         wasmDevice(wgpuWasmModule).then(() => {
//             wasmLoaded = true;
//             console.log(wgpuWasmModule);
//         });
//     });

// const wasmBin: Uint8Array = Uint8Array.from(atob(wasmBase64), (c) => c.charCodeAt(0));
const wgpuWasmModule = {
    wasmBinary: undefined,
    wasmLoaded: false,
    nativeDevice: undefined,
};

fetch('http://localhost:7456/webgpu_wasm.wasm').then((response) => {
    response.arrayBuffer().then((buffer) => {
        (wgpuWasmModule as any).wasmBinary = buffer;
    });
}).catch((e) => {

});

const glslalgWasmModule = {
};

const nativeLib = wgpuWasmModule as any;

export { nativeLib, glslalgWasmModule };
