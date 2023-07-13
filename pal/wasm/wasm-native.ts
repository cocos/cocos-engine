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
import { EDITOR } from 'internal:constants';
import { native } from '../../cocos/native-binding/index';
import { checkPalIntegrity, withImpl } from '../integrity-check';

export function instantiateWasm (wasmUrl: string, importObject: WebAssembly.Imports): Promise<any> {
    return fetchBuffer(wasmUrl).then((arrayBuffer) => WebAssembly.instantiate(arrayBuffer, importObject));
}

export function fetchBuffer (binaryUrl: string): Promise<ArrayBuffer> {
    return new Promise<ArrayBuffer>((resolve, reject) => {
        try {
            // NOTE: when it's in EDITOR, binaryUrl is a url with `external:` protocol.
            if (EDITOR) {
                Editor.Message.request('engine', 'query-engine-info').then((info) => {
                    const externalRoot = `${info.native.path}/external/`;
                    binaryUrl = binaryUrl.replace('external:', externalRoot);
                    const arrayBuffer = native.fileUtils.getDataFromFile(binaryUrl);
                    resolve(arrayBuffer);
                });
                return;
            }
            binaryUrl = `src/cocos-js/${binaryUrl}`;
            const arrayBuffer = native.fileUtils.getDataFromFile(binaryUrl);
            resolve(arrayBuffer);
        } catch (e) {
            reject(e);
        }
    });
}

export function ensureWasmModuleReady (): Promise<void> {
    return Promise.resolve();
}

checkPalIntegrity<typeof import('pal/wasm')>(withImpl<typeof import('./wasm-native')>());
