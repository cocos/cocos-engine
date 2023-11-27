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
import { getError, assert } from '@base/debug';
import { BaseImageData } from '../base-image-data';
import { ImageSource, IMemoryImageSource, RawDataType } from '../types';
import { override } from  '../../../cocos/core/data/decorators/override';

declare const jsb: any;

export class ImageData extends BaseImageData {
    protected _rawData: RawDataType | null = null;
    constructor (imageAsset?: ImageSource | ArrayBufferView) {
        super(imageAsset);
        this.reset(imageAsset);
    }

    @override
    public destroy (): void {
        if (this._rawData instanceof jsb.JSBNativeDataHolder) {
            // JSB element should destroy native data.
            jsb.destroyImage(this._rawData);
        }
        super.destroy();
    }

    @override
    get data (): RawDataType | null {
        // TODO(qgh) :ImageBitmap without raw data.
        return this._rawData;
    }

    @override
    public reset (imageSource?: ImageSource | ArrayBufferView): void {
        if (imageSource == null) {
            this._rawData = null;
            return;
        }
        // TODO(qgh):Need to remove implementations such as HTMLImageElement and use a simpler image class.
        if (imageSource instanceof HTMLCanvasElement) {
            this._rawData = (imageSource as any)._data.data;
        } else if (imageSource instanceof HTMLImageElement) {
            this._rawData = (imageSource as any).data;
        } else if (ArrayBuffer.isView(imageSource)) {
            this._rawData = imageSource;
        } else if ('_data' in imageSource) {
            this._rawData = imageSource._data;
        } else {
            this._rawData = imageSource;
        }
        super.reset(imageSource);
    }

    static loadImage (urlOrBase64: string): Promise<ImageData> {
        return new Promise((resolve, reject) => {
            const image = new ImageData();
            jsb.loadImage(urlOrBase64, (info): void => {
                if (!info) {
                    reject(new Error(getError(4930, urlOrBase64)));
                    return;
                }
                (image.source as IMemoryImageSource).width = info.width;
                (image.source as IMemoryImageSource).height = info.height;
                (image.source as IMemoryImageSource)._data = info.data;
                image._rawData = info.data;
                resolve(image);
            });
        });
    }
}
