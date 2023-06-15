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
import { instantiateWasm, fetchBuffer } from 'pal/wasm';
import { JSB, WASM_SUPPORT_MODE } from 'internal:constants';
import asmFactory from 'external:emscripten/spine/spine.asm.js';
import asmJsMemUrl from 'external:emscripten/spine/spine.js.mem';
import wasmFactory from 'external:emscripten/spine/spine.wasm.js';
import spineWasmUrl from 'external:emscripten/spine/spine.wasm';
import { game } from '../../game';
import { sys } from '../../core';
import { WebAssemblySupportMode } from '../../misc/webassembly-support';
import { overrideSpineDefine } from './spine-define';

const PAGESIZE = 65536; // 64KiB

// How many pages of the wasm memory
// TODO: let this can be canfiguable by user.
const PAGECOUNT = 64 * 16;

// How mush memory size of the wasm memory
const MEMORYSIZE = PAGESIZE * PAGECOUNT; // 64 MiB

const wasmInstance: SpineWasm.instance = {} as any;
const registerList: any[] = [];
///////////////////////////////////////////////////////////////////////////////////////////////////
function initWasm (wasmUrl): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return wasmFactory({
        instantiateWasm (importObject: WebAssembly.Imports,
            receiveInstance: (instance: WebAssembly.Instance, module: WebAssembly.Module) => void) {
            return instantiateWasm(wasmUrl, importObject).then((result: any) => {
                receiveInstance(result.instance, result.module);
            });
        },
    }).then((Instance: any) => {
        Object.assign(wasmInstance, Instance);
        registerList.forEach((cb) => {
            cb(wasmInstance);
        });
    }, (reason: any) => { console.error('[Spine]:', `Spine wasm load failed: ${reason}`); });
}

function initAsm (): Promise<void> {
    return fetchBuffer(asmJsMemUrl).then((arrayBuffer) => {
        const wasmMemory: any = {};
        wasmMemory.buffer = new ArrayBuffer(MEMORYSIZE);
        const module = {
            wasmMemory,
            memoryInitializerRequest: {
                response: arrayBuffer,
                status: 200,
            } as Partial<XMLHttpRequest>,
        };
        return asmFactory(module).then((instance: any) => {
            Object.assign(wasmInstance, instance);
            registerList.forEach((cb) => {
                cb(wasmInstance);
            });
        });
    });
}

export function waitForSpineWasmInstantiation (): Promise<void> {
    return new Promise<void>((resolve) => {
        const errorReport = (msg: any) => { console.error(msg); };
        if (WASM_SUPPORT_MODE === WebAssemblySupportMode.MAYBE_SUPPORT) {
            if (sys.hasFeature(sys.Feature.WASM)) {
                initWasm(spineWasmUrl).then(resolve).catch(errorReport);
            } else {
                initAsm().then(resolve).catch(errorReport);
            }
        } else if (WASM_SUPPORT_MODE === WebAssemblySupportMode.SUPPORT) {
            initWasm(spineWasmUrl).then(resolve).catch(errorReport);
        } else {
            initAsm().then(resolve).catch(errorReport);
        }
    });
}
if (!JSB) {
    game.onPostInfrastructureInitDelegate.add(waitForSpineWasmInstantiation);
    registerList.push(overrideSpineDefine);
}
export const SPINE_WASM = 1;
