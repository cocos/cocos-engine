declare module 'external:emscripten/*.wasm' {
    /**
     * This is a url relative from build output chunk.
     */
    const wasmPath: string;
    export default wasmPath;
}

// declare module 'url:native/external/emscripten/webgpu/webgpu_wasm.wasm' {
//     const url: string;
//     export default url;
// }

// declare module 'url:native/external/emscripten/webgpu/glslang.wasm' {
//     const url: string;
//     export default url;
// }
