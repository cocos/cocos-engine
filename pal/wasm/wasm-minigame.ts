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

import { OPPO, XIAOMI } from 'internal:constants';

export function instantiateWasm (wasmUrl: string, importObject: WebAssembly.Imports): Promise<any> {
    wasmUrl = `cocos-js/${wasmUrl}`;
    return WebAssembly.instantiate(wasmUrl, importObject);
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

/**
 * The binary url can be different on different platforms.
 * @param binaryUrl the basic build output binary url
 * @returns the real binary url on the exact platform
 */
function getPlatformBinaryUrl (binaryUrl: string): Promise<string> {
    return new Promise((resolve) => {
        if (OPPO) {
            const urlInCocosJS = `cocos-js/${binaryUrl}`;
            // NOTE: fsUtils is defined in engine-adapter
            globalThis.fsUtils.exists(urlInCocosJS, (isExists: boolean) => {
                if (isExists) {
                    resolve(urlInCocosJS);
                } else {
                    // On OPPO platform, we put binary assets in cocos-library directory when using separate engine.
                    resolve(`cocos-library/${binaryUrl}`);
                }
            });
        } else if (XIAOMI) {
            resolve(`src/cocos-js/${binaryUrl}`);
        } else {
            resolve(`cocos-js/${binaryUrl}`);
        }
    });
}
