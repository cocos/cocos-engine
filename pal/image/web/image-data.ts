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
import { ImageSource } from 'pal/image';
import { BaseImageData } from '../base-image-data';
import { ccwindow } from '../../../cocos/core/global-exports';
import { getError } from '../../../cocos/core';

export class ImageData extends BaseImageData {
    public nativeData (): unknown {
        let data;
        if ('getContext' in this._imageSource) {
            const canvasElem = this._imageSource;
            const imageData = canvasElem.getContext('2d')?.getImageData(0, 0, this._imageSource.width, this._imageSource.height);
            const buff = imageData!.data.buffer;
            let rawBuffer;
            if ('buffer' in buff) {
                // es-lint as any
                data = new Uint8Array((buff as any).buffer, (buff as any).byteOffset, (buff as any).byteLength);
            } else {
                rawBuffer = buff;
                data = new Uint8Array(rawBuffer);
            }
            //buffers[i] = data;
        } else if (this._imageSource instanceof HTMLImageElement || this._imageSource instanceof ImageBitmap) {
            const img = this._imageSource;
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
            console.log('imageBmp copy not impled!');
        }
        return this.data;
    }

    static loadImage (url: string,
        options: Record<string, any>,
        onComplete: ((err: Error | null, data?: ImageSource | ArrayBufferView | null) => void)): ImageData {
        const image = new ImageData();

        // NOTE: on xiaomi platform, we need to force setting img.crossOrigin as 'anonymous'
        if (ccwindow.location.protocol !== 'file:') {
            image.crossOrigin = 'anonymous';
        }

        image.onload = () => {
            if (onComplete) { onComplete(null, image.data); }
        };
        image.onerror = () => {
            if (onComplete) { onComplete(new Error(getError(4930, url))); }
        };

        image.src = url;
        return image;
    }
}
