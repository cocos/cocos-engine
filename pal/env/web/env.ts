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

import { checkPalIntegrity, withImpl } from '../../integrity-check';

export function findCanvas (): { frame: HTMLDivElement, container: HTMLDivElement, canvas: HTMLCanvasElement } {
    const frame = document.querySelector('#GameDiv') as HTMLDivElement;
    const container = document.querySelector('#Cocos3dGameContainer') as HTMLDivElement;
    const canvas = document.querySelector('#GameCanvas') as HTMLCanvasElement;

    return { frame, container, canvas };
}

export function loadJsFile (path: string): Promise<void> {
    return new Promise((resolve, reject) => {
        let err;
        function windowErrorListener (evt): void {
            if (evt.filename === path) {
                err = evt.error;
            }
        }
        window.addEventListener('error', windowErrorListener);
        const script = document.createElement('script');
        script.charset = 'utf-8';
        script.async = true;
        script.crossOrigin = 'anonymous';
        script.addEventListener('error', () => {
            window.removeEventListener('error', windowErrorListener);
            reject(Error(`Error loading ${path}`));
        });
        script.addEventListener('load', () => {
            window.removeEventListener('error', windowErrorListener);
            document.head.removeChild(script);
            // Note that if an error occurs that isn't caught by this if statement,
            // that getRegister will return null and a "did not instantiate" error will be thrown.
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
        script.src = path.replace('#', '%23');
        document.head.appendChild(script);
    });
}

checkPalIntegrity<typeof import('pal/env')>(withImpl<typeof import('./env')>());
