declare module 'pal/wasm' {
    /**
     * The first parameter of standard `Webassembly.instantiate` interface is the arraybuffer of wasm.
     * But the implementation on some platforms is not standard.
     * So here we provide a more commonly used interface, whose first parameter is the url of wasm.
     *
     * @param wasmUrl the url of wasm, this should be a url relative from build output chunk.
     * @param importObject the standard `WebAssembly.Imports` instance
     */
    export function instantiateWasm (wasmUrl: string, importObject: WebAssembly.Imports): Promise<WebAssembly.WebAssemblyInstantiatedSource>;

    /**
     * Fetch binary data from wasm url or js mem url.
     * NOTE: This method should only use to instantiate asm.js compiled with `-O2` options,
     * because not all platforms support instantiate wasm by wasm binary.
     * eg. WeChat can only instantiate wasm by wasm url.
     *
     * @param binaryUrl the url of wasm or js mem, this should be a url relative from build output chunk.
     */
    export function fetchBuffer (binaryUrl: string): Promise<ArrayBuffer>;

    /**
     * Sometimes we need to put wasm modules in subpackage to reduce code size.
     * In this case we need to ensure that the wasm modules is ready before we import them.
     * Please remember to invoke this method before we import wasm modules.
     */
    export function ensureWasmModuleReady (): Promise<void>;
}
