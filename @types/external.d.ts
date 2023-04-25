declare module 'external://*.wasm' {
    const wasmPath: string;
    export default wasmPath;
}

declare module 'external:///emscripten/bullet/bullet.asm.js' {
    function factory (env: any, wasmMemory: ArrayBuffer): Bullet.instance;

    export default factory;
}

// declare module 'url:native/external/emscripten/webgpu/webgpu_wasm.wasm' {
//     const url: string;
//     export default url;
// }

// declare module 'url:native/external/emscripten/webgpu/glslang.wasm' {
//     const url: string;
//     export default url;
// }
