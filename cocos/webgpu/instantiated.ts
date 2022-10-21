/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable no-void */
/*
 Copyright (c) 2022 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */
import { WEBGPU } from 'internal:constants';
import webgpuUrl from 'url:native/external/emscripten/webgpu/webgpu_wasm.wasm';
import glslangUrl from 'url:native/external/emscripten/webgpu/glslang.wasm';
import wasmDevice from './webgpu_wasm.js';
import glslangLoader from './glslang.js';
import { legacyCC } from '../core/global-exports';

export const glslalgWasmModule: any = {
    glslang: null,
};

export const gfx: any = legacyCC.gfx = {
    wasmBinary: null,
    nativeDevice: null,
};

export const webgpuAdapter: any = {
    adapter: null,
    device: null,
};

export const promiseForWebGPUInstantiation = (() => {
    if (WEBGPU) {
        return Promise.all([
            // @ts-expect-error The 'import.meta' meta-property is only allowed when the '--module' option is 'es2020', 'es2022', 'esnext', 'system', 'node16', or 'nodenext'.
            glslangLoader(new URL(glslangUrl, import.meta.url).href).then((res) => {
                glslalgWasmModule.glslang = res;
            }),
            new Promise<void>((resolve) => {
                // @ts-expect-error The 'import.meta' meta-property is only allowed when the '--module' option is 'es2020', 'es2022', 'esnext', 'system', 'node16', or 'nodenext'.
                fetch(new URL(webgpuUrl, import.meta.url).href).then((response) => {
                    response.arrayBuffer().then((buffer) => {
                        gfx.wasmBinary = buffer;
                        wasmDevice(gfx).then(() => {
                            legacyCC.WebGPUDevice = gfx.CCWGPUDevice;
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
                        console.log(gfx);
                        resolve();
                    });
                });
            }),
        ]).then(() => Promise.resolve());
    }
    return Promise.resolve();
})();

if (WEBGPU) {
    const intervalId = setInterval(() => {
        if (legacyCC.game) {
            legacyCC.game.onPreInfrastructureInitDelegate.add(() => promiseForWebGPUInstantiation);
            clearInterval(intervalId);
        }
    }, 10);
}
