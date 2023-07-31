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
import { IMemoryImageSource, ImageSource } from './types';
import { sys } from '../../cocos/core/platform/sys';

export class BaseImageData {
    // TODO(qgh):Designed for compatibility, may be removed in the future.
    protected _source: ImageSource;

    constructor (imageAsset?: ImageSource | ArrayBufferView) {
        this._source = {
            _data: null,
            width: 0,
            height: 0,
            format: 0,
            _compressed: false,
            mipmapLevelDataSize: [],
        };
        if (typeof imageAsset !== 'undefined') {
            if (!ArrayBuffer.isView(imageAsset)) {
                this._source = imageAsset;
            } else {
                this._source._data = imageAsset;
            }
        }
    }

    public destroy (): void {
        if (this.source && this.source instanceof HTMLImageElement) {
            this.source.src = '';
        } else if (this.isImageBitmap(this.source)) {
            this.source?.close();
        }
    }

    set source (imageAsset: ImageSource | null) {
        if (imageAsset != null) {
            this.reset(imageAsset);
        }
    }

    get source (): ImageSource {
        return this._source;
    }

    get width (): number {
        return this._source.width;
    }

    get height (): number {
        return this._source.height;
    }

    public reset (data?: ImageSource | ArrayBufferView): void {
        if (data != null) {
            if (!ArrayBuffer.isView(data)) {
                this._source = data;
            } else {
                this._source = {
                    _data: null,
                    width: 0,
                    height: 0,
                    format: 0,
                    _compressed: false,
                    mipmapLevelDataSize: [],
                };
                this._source._data = data;
            }
        }
    }

    private isImageBitmap (imageSource: any): imageSource is ImageBitmap {
        return !!(sys.hasFeature(sys.Feature.IMAGE_BITMAP) && imageSource instanceof ImageBitmap);
    }
}
