/*
 Copyright (c) 2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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
import { WASM_SUPPORT_MODE } from 'internal:constants';
import { ensureWasmModuleReady, instantiateWasm } from 'pal/wasm';

import { sys, logID } from '../../core';

import { game } from '../../game';
import { WebAssemblySupportMode } from '../../misc/webassembly-support';

export const MeshoptDecoder = {} as any;

function initDecoderASM (meshopt_asm_factory: any): Promise<void> {
    const Module = meshopt_asm_factory;
    return Promise.all([Module.ready]).then(() => {
        MeshoptDecoder.supported = Module.supported;
        MeshoptDecoder.ready = Promise.resolve();
        MeshoptDecoder.decodeVertexBuffer = Module.decodeVertexBuffer;
        MeshoptDecoder.decodeIndexBuffer = Module.decodeIndexBuffer;
        MeshoptDecoder.decodeIndexSequence = Module.decodeIndexSequence;
        MeshoptDecoder.decodeGltfBuffer = Module.decodeGltfBuffer;
        MeshoptDecoder.useWorkers = Module.useWorkers;
        MeshoptDecoder.decodeGltfBufferAsync = Module.decodeGltfBufferAsync;
        logID(14202);
    });
}

function initDecoderWASM (meshopt_wasm_factory: any, meshopt_wasm_url: string): Promise<void> {
    const Module = meshopt_wasm_factory;
    function instantiate (importObject: WebAssembly.Imports): any {
        return instantiateWasm(meshopt_wasm_url, importObject) as any;
    }
    return Promise.all([Module.ready(instantiate)]).then(() => {
        MeshoptDecoder.supported = Module.supported;
        MeshoptDecoder.ready = Promise.resolve();
        MeshoptDecoder.decodeVertexBuffer = Module.decodeVertexBuffer;
        MeshoptDecoder.decodeIndexBuffer = Module.decodeIndexBuffer;
        MeshoptDecoder.decodeIndexSequence = Module.decodeIndexSequence;
        MeshoptDecoder.decodeGltfBuffer = Module.decodeGltfBuffer;
        MeshoptDecoder.useWorkers = Module.useWorkers;
        MeshoptDecoder.decodeGltfBufferAsync = Module.decodeGltfBufferAsync;
        logID(14203);
    });
}

function shouldUseWasmModule (): boolean {
    if (WASM_SUPPORT_MODE === (WebAssemblySupportMode.MAYBE_SUPPORT as number)) {
        return sys.hasFeature(sys.Feature.WASM);
    } else if (WASM_SUPPORT_MODE === (WebAssemblySupportMode.SUPPORT as number)) {
        return true;
    } else {
        return false;
    }
}

export function InitDecoder (): Promise<void> {
    return ensureWasmModuleReady().then(() => Promise.all([
        import('external:emscripten/meshopt/meshopt_decoder.asm.js'),
        import('external:emscripten/meshopt/meshopt_decoder.wasm.js'),
        import('external:emscripten/meshopt/meshopt_decoder.wasm.wasm'),
    ]).then(([
        { default: meshopt_asm_factory },
        { default: meshopt_wasm_factory },
        { default: meshopt_wasm_url },
    ]) => {
        if (shouldUseWasmModule()) {
            return initDecoderWASM(meshopt_wasm_factory, meshopt_wasm_url);
        } else {
            return initDecoderASM(meshopt_asm_factory);
        }
    }));
}

game.onPostInfrastructureInitDelegate.add(InitDecoder);
