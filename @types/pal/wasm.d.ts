declare module 'pal/wasm' {
    /**
     * The first parameter of standard `Webassembly.instantiate` interface is the arraybuffer of wasm.
     * But the implementation on some platforms is not standard.
     * So here we provide a more commonly used interface, whose first parameter is the url of wasm.
     *
     * @param wasmUrl the url of wasm
     * @param importObject the standard `WebAssembly.Imports` instance
     */
    export function instantiateWasm (wasmUrl: string, importObject: WebAssembly.Imports): Promise<any>;
}
