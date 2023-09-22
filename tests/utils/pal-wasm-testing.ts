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

import { checkPalIntegrity, withImpl } from '../../pal/integrity-check';
import { join } from 'node:path';
import { readFileSync } from 'node:fs';

export async function instantiateWasm (wasmUrl: string, importObject: WebAssembly.Imports): Promise<any> {
    return fetchBuffer(wasmUrl).then((arrayBuffer) => WebAssembly.instantiate(arrayBuffer, importObject));
}

export async function fetchBuffer (binaryUrl: string): Promise<ArrayBuffer> {
    const relativePathToExternal = /^external:(.*)/.exec(binaryUrl)?.[1];
    if (relativePathToExternal) {
        const externalHome = join(__dirname, '..', '..', 'native', 'external');
        const path = join(externalHome, relativePathToExternal);
        try {
            const content = readFileSync(path);
            return content.buffer;
        } catch (err) {
            throw new Error(`Unable to fetch buffer from ${binaryUrl}`, { cause: error });
        }
    }

    throw new Error(`Don't know how to fetch buffer at url ${binaryUrl}`);
}

export async function ensureWasmModuleReady() {
    return Promise.resolve();
}

checkPalIntegrity<typeof import('@pal/wasm')>(withImpl<typeof import('./pal-wasm-testing')>());
