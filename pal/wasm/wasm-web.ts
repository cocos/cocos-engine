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

import { EDITOR, PREVIEW } from 'internal:constants';
import { checkPalIntegrity, withImpl } from '../integrity-check';

declare const require: any;

export function instantiateWasm (wasmUrl: string, importObject: WebAssembly.Imports): Promise<any> {
    return fetchBuffer(wasmUrl).then((arrayBuffer) => WebAssembly.instantiate(arrayBuffer, importObject));
}

export function fetchBuffer (binaryUrl: string): Promise<ArrayBuffer> {
    return new Promise<ArrayBuffer>((resolve, reject) => {
        try {
            // NOTE: when it's in EDITOR or PREVIEW, binaryUrl is a url with `external:` protocol.
            if (EDITOR) {
                Editor.Message.request('engine', 'query-engine-info').then((info) => {
                    const externalRoot = `${info.native.path}/external/`;
                    binaryUrl = binaryUrl.replace('external:', externalRoot);
                    // IDEA: it's better we implement another PAL for nodejs platform.
                    // eslint-disable-next-line @typescript-eslint/no-var-requires
                    const fs = require('fs');
                    const arrayBuffer = fs.readFileSync(binaryUrl) as ArrayBuffer;
                    resolve(arrayBuffer);
                });
                return;
            } else if (PREVIEW) {
                // NOTE: we resolve '/engine_external/' in in editor preview server.
                fetch(`/engine_external/?url=${binaryUrl}`).then((response) => response.arrayBuffer().then(resolve)).catch((e) => {});
                return;
            }
            // here is in the BUILD mode
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore NOTE: we need to use 'import.meta' here, but the tsc won't allow this, so we need to force ignoring this error here.
            binaryUrl = new URL(binaryUrl, import.meta.url).href;
            fetch(binaryUrl).then((response) => response.arrayBuffer().then(resolve)).catch((e) => {});
        } catch (e) {
            reject(e);
        }
    });
}

export function ensureWasmModuleReady (): Promise<void> {
    return Promise.resolve();
}

checkPalIntegrity<typeof import('pal/wasm')>(withImpl<typeof import('./wasm-web')>());
