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
import { ImageSource, IMemoryImageSource } from '../types';
import { ccwindow } from '../../../cocos/core/global-exports';
import { getError } from '../../../cocos/core';

export class ImageData extends BaseImageData {
    public destroy () {
        if (this.data && this.data instanceof HTMLImageElement) {
            // JSB element should destroy native data.
            // TODO: Property 'destroy' does not exist on type 'HTMLImageElement'.
            // maybe we need a higher level implementation called `pal/image`, we provide `destroy` interface here.
            // issue: https://github.com/cocos/cocos-engine/issues/14646
            (this.data as any).destroy();
        }
        super.destroy();
    }
    public nativeData (): unknown {
        if (this._imageSource instanceof HTMLCanvasElement) {
            // @ts-ignore
            return this._imageSource._data.data;
        } else if (this._imageSource instanceof HTMLImageElement) {
            // @ts-ignore
            return this._imageSource._data;
        } else if (ArrayBuffer.isView(this._imageSource)) {
            return this._imageSource.buffer;
        }
        return super.nativeData();
    }

    protected isNativeImage (imageSource: ImageSource): imageSource is (HTMLImageElement | HTMLCanvasElement | ImageBitmap) {
        if ((imageSource as IMemoryImageSource)._compressed === true) {
            return false;
        }
        return super.isNativeImage(imageSource);
    }

    static downloadImage (url: string,
        options: Record<string, any>,
        onComplete: ((err: Error | null, data?: HTMLImageElement | null) => void)): HTMLImageElement {
        const image = new ImageData();

        // NOTE: on xiaomi platform, we need to force setting img.crossOrigin as 'anonymous'
        if (ccwindow.location.protocol !== 'file:') {
            image.crossOrigin = 'anonymous';
        }

        function loadCallback () {
            image.removeEventListener('load', loadCallback);
            if (onComplete) { onComplete(null, image.data as HTMLImageElement); }
            image.removeEventListener('error', errorCallback);
        }

        function errorCallback () {
            image.removeEventListener('load', loadCallback);
            image.removeEventListener('error', errorCallback);
            if (onComplete) { onComplete(new Error(getError(4930, url))); }
        }

        image.addEventListener('load', loadCallback);
        image.addEventListener('error', errorCallback);
        image.src = url;
        return (image.data as HTMLImageElement);
    }
}
