import { instantiateWasm, fetchBuffer } from 'pal/wasm';
import { NATIVE_CODE_BUNDLE_MODE } from 'internal:constants';
import { sys } from '../../core';
import { NativeCodeBundleMode } from '../../misc/webassembly-support';
import { overrideSpineDefine } from './spine-define';

const PAGESIZE = 65536; // 64KiB

// How many pages of the wasm memory
// TODO: let this can be canfiguable by user.
const PAGECOUNT = 32 * 16;

// How mush memory size of the wasm memory
const MEMORYSIZE = PAGESIZE * PAGECOUNT; // 32 MiB

let wasmInstance: SpineWasm.instance = null!;
const registerList: any[] = [];

///////////////////////////////////////////////////////////////////////////////////////////////////
export function initWasm (wasmFactory, wasmUrl: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        const errorMessage = (err: any): string => `[Spine]: Spine wasm load failed: ${err}`;
        wasmFactory({
            instantiateWasm (
                importObject: WebAssembly.Imports,
                receiveInstance: (instance: WebAssembly.Instance, module: WebAssembly.Module) => void,
            ) {
                // NOTE: the Promise return by instantiateWasm hook can't be caught.
                instantiateWasm(wasmUrl, importObject).then((result) => {
                    receiveInstance(result.instance, result.module);
                }).catch((err) => reject(errorMessage(err)));
            },
        }).then((Instance: any) => {
            wasmInstance = Instance;
            registerList.forEach((cb) => {
                cb(wasmInstance);
            });
        }).then(resolve).catch((err: any) => reject(errorMessage(err)));
    });
}

export function initAsmJS (asmFactory, asmJsMemUrl: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        fetchBuffer(asmJsMemUrl).then((arrayBuffer) => {
            const wasmMemory: any = {};
            wasmMemory.buffer = new ArrayBuffer(MEMORYSIZE);
            const module = {
                wasmMemory,
                memoryInitializerRequest: {
                    response: arrayBuffer,
                    status: 200,
                } as Partial<XMLHttpRequest>,
            };
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return asmFactory(module).then((instance: any) => {
                wasmInstance = instance;
                registerList.forEach((cb) => {
                    cb(wasmInstance);
                });
            });
        }).then(resolve).catch(reject);
    });
}

export function shouldUseWasmModule (): boolean {
    if (NATIVE_CODE_BUNDLE_MODE === (NativeCodeBundleMode.BOTH as number)) {
        return sys.hasFeature(sys.Feature.WASM);
    } else if (NATIVE_CODE_BUNDLE_MODE === (NativeCodeBundleMode.WASM as number)) {
        return true;
    } else {
        return false;
    }
}

registerList.push(overrideSpineDefine);
