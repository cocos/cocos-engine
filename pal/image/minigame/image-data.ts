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
import { ALIPAY, XIAOMI, JSB, BAIDU, TAOBAO, TAOBAO_MINIGAME, WECHAT_MINI_PROGRAM } from 'internal:constants';
import { BaseImageData } from '../base-image-data';
import { ImageSource, RawDataType   } from '../types';
import { ccwindow } from '../../../cocos/core/global-exports';
import { getError } from '../../../cocos/core';

export type ImageDataType = ArrayBufferView;
export class ImageData extends BaseImageData {
    public getRawData (): RawDataType | null {
        if (this.source == null) {
            return null;
        }
        let data: ArrayBufferView | null = null;
        if ('_data' in this.source) {
            data = this.source._data;
        } else if ('getContext' in this.source) {
            const canvasElem = this.source;
            const imageData = canvasElem.getContext('2d')?.getImageData(0, 0, this.source.width, this.source.height);
            const buff = imageData!.data.buffer;
            let rawBuffer;
            if ('buffer' in buff) {
                // es-lint as any
                data = new Uint8Array((buff as any).buffer, (buff as any).byteOffset, (buff as any).byteLength);
            } else {
                rawBuffer = buff;
                data = new Uint8Array(rawBuffer);
            }
        } else if (this.source instanceof HTMLImageElement || this.source instanceof ImageBitmap) {
            const img = this.source;
            const canvas = ccwindow.document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img as any, 0, 0);
            const imageData = ctx?.getImageData(0, 0, img.width, img.height);
            const buff = imageData!.data.buffer;
            let rawBuffer;
            if ('buffer' in buff) {
                // es-lint as any
                data = new Uint8Array((buff as any).buffer, (buff as any).byteOffset, (buff as any).byteLength);
            } else {
                rawBuffer = buff;
                data = new Uint8Array(rawBuffer);
            }
        } else {
        // eslint-disable-next-line no-console
            console.log('imageBmp copy not impled!');
        }
        return data;
    }

    static loadImage (url: string): Promise<ImageData> {
        return new Promise((resolve, reject) => {
            const image = new ccwindow.Image();

            if (ccwindow.location.protocol !== 'file:' || XIAOMI) {
                image.crossOrigin = 'anonymous';
            }

            image.onload = (): void => {
                const imageData = new ImageData(image);
                resolve(imageData);
            };
            image.onerror = (): void => {
                reject(new Error(getError(4930, url)));
            };

            image.src = url;
        });
    }
}
