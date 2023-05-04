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

import { EDITOR, PREVIEW } from "internal:constants";

export function instantiateWasm (wasmUrl: string, importObject: WebAssembly.Imports): Promise<any> {
    // NOTE: when it's in EDITOR or PREVIEW, wasmUrl is an absolute file path of wasm.
    if (EDITOR) {
        // IDEA: it's better we implement another PAL for nodejs platform.
        const fs = require('fs');
        const arrayBuffer = fs.readFileSync(wasmUrl);
        return WebAssembly.instantiate(arrayBuffer, importObject);
    } else if (PREVIEW) {
        // NOTE: we resolve '/engine_external/' in in editor preview server.
        return fetch(`/engine_external/?path=${wasmUrl}`)
            .then((response) => response.arrayBuffer().then((buff) => WebAssembly.instantiate(buff, importObject)));
    }
    // here is in the BUILD mode
    wasmUrl = new URL(wasmUrl, import.meta.url).href;
    return fetch(wasmUrl).then((response) => response.arrayBuffer().then((buff) => WebAssembly.instantiate(buff, importObject)));
}
