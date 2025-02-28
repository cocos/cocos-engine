/*
 Copyright (c) 2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { fetchBuffer, ensureWasmModuleReady, instantiateWasm, fetchUrl } from 'pal/wasm';
import { NATIVE_CODE_BUNDLE_MODE } from 'internal:constants';
import { error, sys } from '../../core';
import { NativeCodeBundleMode } from '../../misc/webassembly-support';
import { WebGPUWasm } from './webgpu-core';
import { overrideWebGPUDefine } from './define';

const PAGESIZE = 65536; // 64KiB

// How many pages of the wasm memory
// TODO: let this can be canfiguable by user.
const PAGECOUNT = 32 * 16;

// How mush memory size of the wasm memory
const MEMORYSIZE = PAGESIZE * PAGECOUNT; // 32 MiB

let wasmInstance: WebGPUWasm.instance = null!;
const registerList: any[] = [];

function initWasm (wasmFactory, wasmUrl: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        const errorMessage = (err: any): string => `[WebGPU]: WebGPU wasm load failed: ${err}`;
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        wasmFactory({
            instantiateWasm (
                importObject: WebAssembly.Imports,
                receiveInstance: (instance: WebAssembly.Instance, module: WebAssembly.Module) => void,
            ) {
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

function initAsmJS (asmFactory, asmJsMemUrl: string): Promise<void> {
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

function shouldUseWasmModule (): boolean {
    if (NATIVE_CODE_BUNDLE_MODE === (NativeCodeBundleMode.BOTH as number)) {
        return sys.hasFeature(sys.Feature.WASM);
    } else if (NATIVE_CODE_BUNDLE_MODE === (NativeCodeBundleMode.WASM as number)) {
        return true;
    } else {
        return false;
    }
}

export async function waitForWebGPUWasmInstantiation (): Promise<void> {
    const errorReport = (msg: any): void => {
        error('Error during WebGPU Wasm instantiation:', msg);
    };
    try {
        await ensureWasmModuleReady();
        if (shouldUseWasmModule()) {
            const [
                glslModule,
                glslWasmModule,
                twgslModule,
                twgslWasmModule,
            ] = await Promise.all([
                import('external:emscripten/webgpu/glslang.js'),
                import('external:emscripten/webgpu/glslang.wasm'),
                import('external:emscripten/webgpu/twgsl.js'),
                import('external:emscripten/webgpu/twgsl.wasm'),
            ]);
            const glslFactory = glslModule.default;
            const glslWasmUrl = glslWasmModule.default;
            const twgslFactory = twgslModule.default;
            const twgslWasmUrl = twgslWasmModule.default;
            await Promise.all([initWasm(glslFactory, glslWasmUrl), initWasm(twgslFactory, twgslWasmUrl)]);
        } else {
            throw new Error('Wasm module is not supported in this environment.');
        }
    } catch (error) {
        errorReport(error);
    }
}

registerList.push(overrideWebGPUDefine);

export const WEBGPU_WASM = 1;
