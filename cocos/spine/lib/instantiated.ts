/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

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

import { instantiateWasm } from 'pal/wasm';
import { WASM_SUPPORT_MODE } from 'internal:constants';
import asmFactory from 'external:emscripten/spine/spine.asm.js';
import wasmFactory from 'external:emscripten/spine/spine.js';
import spineWasmUrl from 'external:emscripten/spine/spine.wasm';
import { game } from '../../game';
import { sys } from '../../core';
import { WebAssemblySupportMode } from '../../misc/webassembly-support';
import { overrideSpineDefine } from './spine-define';

const wasmInstance: SpineWasm.instance = {} as any;
const registerList: any[] = [];
///////////////////////////////////////////////////////////////////////////////////////////////////
function initWasm (wasmUrl) {
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

function initAsm (resolve) {
    // console.log('[Spine]: Using asmjs libs.');
    // const wasmMemory: any = {};
    // wasmMemory.buffer = new ArrayBuffer(MEMORYSIZE);
    // const asmLibraryArg2 = { memory: wasmMemory };
    // const module = {
    //     asmLibraryArg1: { ...asmLibraryArg, ...asmLibraryArg2 },
    //     wasmMemory,
    // };
    // return asmFactory(module).then((instance: any) => {
    //     btInstance = (instance).asm;
    //     btInstance.spineWasmInstanceInit();
    //     _HEAPU8 = instance.HEAPU8;
    // });
}

export function waitForSpineWasmInstantiation () {
    console.log('[spine] waitForSpineWasmInstantiation');
    return new Promise<void>((resolve) => {
        const errorReport = (msg: any) => { console.error(msg); };
        // if (WASM_SUPPORT_MODE === WebAssemblySupportMode.MAYBE_SUPPORT) {
        //     if (sys.hasFeature(sys.Feature.WASM)) {
        //         initWasm(spineWasmUrl).then(resolve).catch(errorReport);
        //     } else {
        //         initAsm(resolve);
        //     }
        // } else if (WASM_SUPPORT_MODE === WebAssemblySupportMode.SUPPORT) {
        //     initWasm(spineWasmUrl).then(resolve).catch(errorReport);
        // } else {
        //     initAsm(resolve);
        // }
        initWasm(spineWasmUrl).then(resolve).catch(errorReport);
    });
}

game.onPostInfrastructureInitDelegate.add(waitForSpineWasmInstantiation);

registerList.push(overrideSpineDefine);

export const SPINE_WASM = 1;
