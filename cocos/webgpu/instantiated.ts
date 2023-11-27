/// <reference path="../../@types/consts.d.ts"/>
/// <reference path="../../native/external/emscripten/external-wasm.d.ts"/>
/// <reference path="../../native/external/emscripten/webgpu/webgpu.d.ts"/>

/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable no-void */
/*
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

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
import { WASM_SUPPORT_MODE, WEBGPU } from 'internal:constants';
import webgpuUrl from 'external:emscripten/webgpu/webgpu_wasm.wasm';
import glslangUrl from 'external:emscripten/webgpu/glslang.wasm';
import twgslUrl from 'external:emscripten/webgpu/twgsl.wasm'

import wasmDevice from 'external:emscripten/webgpu/webgpu_wasm.js';
import glslangLoader from 'external:emscripten/webgpu/glslang.js';
import twgslLoader from 'external:emscripten/webgpu/twgsl.js'
import { cclegacy } from '@base/global';
import { WebAssemblySupportMode } from '../misc/webassembly-support';
import { log } from 'console';

export const glslangWasmModule: any = {
    glslang: null,
};

export const twgslModule: any = {
    twgsl: null,
};

export const gfx: any = cclegacy.gfx = {
    wasmBinary: null,
    nativeDevice: null,
};

export const webgpuAdapter: any = {
    adapter: null,
    device: null,
};

export const promiseForWebGPUInstantiation = (() => {
    if (WEBGPU && WASM_SUPPORT_MODE !== WebAssemblySupportMode.NONE) {
        // TODO: we need to support AsmJS fallback option
        return Promise.all([
            glslangLoader(new URL(glslangUrl, import.meta.url).href).then((res) => {
                glslangWasmModule.glslang = res;
            }),
            twgslLoader(new URL(twgslUrl, import.meta.url).href).then((data) => {
                twgslModule.twgsl = data;
            }),
            new Promise<void>((resolve) => {
                fetch(new URL(webgpuUrl, import.meta.url).href).then((response) => {
                    response.arrayBuffer().then((buffer) => {
                        gfx.wasmBinary = buffer;
                        wasmDevice(gfx).then(() => {
                            cclegacy.WebGPUDevice = gfx.CCWGPUDevice;
                            resolve();
                        });
                    });
                });
            }),
            new Promise<void>((resolve) => {
                (navigator as any).gpu.requestAdapter().then((adapter) => {
                    adapter.requestDevice().then((device) => {
                        webgpuAdapter.adapter = adapter;
                        webgpuAdapter.device = device;
                        log(gfx);
                        resolve();
                    });
                });
            }),
        ]).then(() => Promise.resolve());
    }
    return Promise.resolve();
})();

if (WEBGPU && WASM_SUPPORT_MODE !== WebAssemblySupportMode.NONE) {
    const intervalId = setInterval(() => {
        if (cclegacy.game) {
            cclegacy.game.onPreInfrastructureInitDelegate.add(() => promiseForWebGPUInstantiation);
            clearInterval(intervalId);
        }
    }, 10);
}
