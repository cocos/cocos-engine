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

import { NATIVE, PREVIEW } from 'internal:constants';
import { checkPalIntegrity, withImpl } from '../../integrity-check';

declare const require: (path: string) =>  Promise<void>;

const ccwindow = typeof globalThis.jsb !== 'undefined' ? (typeof jsb.window !== 'undefined' ? jsb.window : window) : window;
const ccdocument = ccwindow.document;

export function findCanvas (): { frame: HTMLDivElement, container: HTMLDivElement, canvas: HTMLCanvasElement } {
    const container = ccdocument.createElement('div');
    const frame = ccdocument.documentElement as HTMLDivElement;
    const canvas = ccwindow.__canvas;
    return { frame, canvas, container };
}

export function loadJsFile (path: string): Promise<void> {
    if (NATIVE && window.oh && window.scriptEngineType === 'napi') {
        // TODO(qgh):OpenHarmony does not currently support dynamic require expressions
        window.oh.loadModule(path);
        return Promise.resolve();
    } else {
        if (PREVIEW) {
            // NOTE: in native preview (simulator), we need to request script with url http://x.x.x.x:xxxx/plugins/xxx.js
            // so that the editor preview server would resolve the plugin script and return the code.
            // here we use window.eval() function to execute the code of plugin script.
            return new Promise((resolve, reject) => {
                const sourceURL = window.location.href + path;
                const xhr = new XMLHttpRequest();
                xhr.onload = (): void => {
                    if (xhr.status !== 200) {
                        reject(new Error(`load js file failed: ${sourceURL}, error status: ${xhr.status}`));
                        return;
                    }
                    // eslint-disable-next-line no-eval
                    window.eval(`${xhr.response as string}\n//# sourceURL=${sourceURL}`);
                    resolve();
                };
                xhr.onerror = (): void => {
                    reject(new Error(`load js file failed: ${sourceURL}`));
                };
                xhr.open('GET', sourceURL, true);
                xhr.send(null);
            });
        }
        // eslint-disable-next-line import/no-dynamic-require
        return require(`${path}`);
    }
}

checkPalIntegrity<typeof import('pal/env')>(withImpl<typeof import('./env')>());
