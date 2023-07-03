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

import { HUAWEI, WASM_SUBPACKAGE, XIAOMI } from 'internal:constants';
import { minigame } from 'pal/minigame';
import { warn } from '../../cocos/core/platform/debug';

export function instantiateWasm (wasmUrl: string, importObject: WebAssembly.Imports): Promise<any> {
    return getPlatformBinaryUrl(wasmUrl).then((url) => WebAssembly.instantiate(url, importObject));
}

export function fetchBuffer (binaryUrl: string): Promise<ArrayBuffer> {
    return new Promise<ArrayBuffer>((resolve, reject) => {
        getPlatformBinaryUrl(binaryUrl).then((url) => {
            // NOTE: fsUtils is defined in engine-adapter, we need to access globalThis explicitly for Taobao platform
            globalThis.fsUtils.readArrayBuffer(url, (err, arrayBuffer) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(arrayBuffer);
            });
        }).catch((e) => {});
    });
}

function loadSubpackage (name: string): Promise<void> {
    return new Promise((resolve, reject) => {
        if (minigame.loadSubpackage) {
            minigame.loadSubpackage({
                name,
                success () {
                    resolve();
                },
                fail (err) {
                    reject(err);
                },
            });
        } else {
            warn(`Subpackage is not supported on this platform`);
            resolve();
        }
    });
}

let isWasmModuleReady = false;
/**
 * Sometimes we need to put wasm in subpackage to reduce code size.
 * In this case we need to ensure the wasm module is ready before we import it.
 */
export function ensureWasmModuleReady (): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        if (isWasmModuleReady) {
            resolve();
            return;
        }
        if (WASM_SUBPACKAGE) {
            if (HUAWEI) {
                // NOTE: huawei quick game doesn't support concurrent loading subpackage.
                loadSubpackage('__ccWasmAssetSubpkg__').then(() => loadSubpackage('__ccWasmChunkSubpkg__')).then(() => {
                    isWasmModuleReady = true;
                    resolve();
                }).catch(reject);
            } else {
                Promise.all(['__ccWasmAssetSubpkg__', '__ccWasmChunkSubpkg__'].map((pkgName) => loadSubpackage(pkgName)))
                    .then(() => {
                        isWasmModuleReady = true;
                        resolve();
                    }).catch(reject);
            }
        } else {
            isWasmModuleReady = true;
            resolve();
        }
    });
}

/**
 * The binary url can be different on different platforms.
 * @param binaryUrl the basic build output binary url
 * @returns the real binary url on the exact platform
 */
function getPlatformBinaryUrl (binaryUrl: string): Promise<string> {
    return new Promise((resolve) => {
        if (XIAOMI) {
            resolve(`src/cocos-js/${binaryUrl}`);
        } else {
            resolve(`cocos-js/${binaryUrl}`);
        }
    });
}
