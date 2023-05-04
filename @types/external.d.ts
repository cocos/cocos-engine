declare module 'external:emscripten/*.wasm' {
    /**
     * This is a url relative from build output chunk.
     */
    const wasmPath: string;
    export default wasmPath;
}
