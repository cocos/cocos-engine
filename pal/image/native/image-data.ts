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
import { BaseImageData } from '../base-image-data';
import type { ImageSource, IMemoryImageSource } from '../types';
import { ccwindow } from '../../../cocos/core/global-exports';
import { getError } from '../../../cocos/core';

export class ImageData extends BaseImageData {
    public destroy (): void {
        if (this.data && this.data instanceof HTMLImageElement) {
            // JSB element should destroy native data.
            // TODO: Property 'destroy' does not exist on type 'HTMLImageElement'.
            // maybe we need a higher level implementation called `pal/image`, we provide `destroy` interface here.
            // issue: https://github.com/cocos/cocos-engine/issues/14646
            (this.data as any).destroy();
        }
        super.destroy();
    }

    public getRawData (): unknown {
        // TODO(qgh):Need to remove implementations such as HTMLImageElement and use a simpler image class.
        if (this._imageSource instanceof HTMLCanvasElement) {
            return (this._imageSource as any)._data.data;
        } else if (this._imageSource instanceof HTMLImageElement) {
            return (this._imageSource as any)._data;
        } else if (ArrayBuffer.isView(this._imageSource)) {
            return this._imageSource.buffer;
        }
        return super.getRawData();
    }

    protected isNativeImage (imageSource: ImageSource): imageSource is (HTMLImageElement | HTMLCanvasElement | ImageBitmap) {
        if ((imageSource as IMemoryImageSource)._compressed === true) {
            return false;
        }
        return super.isNativeImage(imageSource);
    }

    static loadImage (url: string): Promise<ImageData> {
        return new Promise((resolve, reject) => {
            const image = new ImageData();

            if (ccwindow.location.protocol !== 'file:') {
                image.crossOrigin = 'anonymous';
            }

            image.onload = (): void => {
                resolve(image);
            };
            image.onerror = (): void => {
                reject(new Error(getError(4930, url)));
            };

            image.src = url;
            return image;
        });
    }
}
