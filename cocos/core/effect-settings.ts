/*
 Copyright (c) 2022 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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
import { HTML5 } from 'internal:constants';
import { legacyCC } from './global-exports';

declare const fsUtils: any;

export class EffectSettings {
    init (path = ''): Promise<void> {
        if (!legacyCC.rendering || !legacyCC.rendering.enableEffectImport || !path) {
            return Promise.resolve();
        }
        return new Promise((resolve, reject) => {
            if (!HTML5 && !path.startsWith('http')) {
                fsUtils.readArrayBuffer(path, (err: Error, arrayBuffer: ArrayBuffer) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    this._data = arrayBuffer;
                    resolve();
                });
            } else {
                const xhr = new XMLHttpRequest();
                xhr.open('GET', path);
                xhr.responseType = 'arraybuffer';
                xhr.onload = () => {
                    this._data = xhr.response;
                    resolve();
                };
                xhr.onerror = () => {
                    reject(new Error('request effect settings failed!'));
                };
                xhr.send(null);
            }
        });
    }
    get data (): ArrayBuffer | null {
        return this._data;
    }
    private _data: ArrayBuffer | null = null;
}

export const effectSettings = new EffectSettings();
legacyCC.effectSettings = effectSettings;
