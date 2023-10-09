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
import { ccwindow } from '@base/global';
import { assert } from '@base/debug';
import { RawDataType, ImageSource } from './types';
import { sys } from '../../cocos/core/platform/sys';

export class BaseImageData {
    // TODO(qgh):Designed for compatibility, may be removed in the future.
    protected _source: ImageSource;

    constructor (source?: ImageSource | ArrayBufferView) {
        this._source = {
            _data: null,
            width: 0,
            height: 0,
            format: 0,
            _compressed: false,
            mipmapLevelDataSize: [],
        };
        if (typeof source !== 'undefined') {
            if (!ArrayBuffer.isView(source)) {
                this._source = source;
            } else {
                this._source._data = source;
            }
        }
    }

    public destroy (): void {
        if (this._source && this._source instanceof HTMLImageElement) {
            this._source.src = '';
        } else if (this.isImageBitmap(this._source)) {
            this._source?.close();
        }
    }

    set source (source: ImageSource | null) {
        if (source != null) {
            this.reset(source);
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

    get data (): RawDataType | null {
        if (this._source == null) {
            return null;
        }
        let data: ArrayBufferView | null = null;
        if ('_data' in this._source) {
            data = this._source._data;
        } else if ('getContext' in this._source) {
            const canvasElem = this._source;
            const imageData = canvasElem.getContext('2d')?.getImageData(0, 0, this._source.width, this._source.height);
            const buff = imageData!.data.buffer;
            let rawBuffer;
            if ('buffer' in buff) {
                // es-lint as any
                data = new Uint8Array((buff as any).buffer, (buff as any).byteOffset, (buff as any).byteLength);
            } else {
                rawBuffer = buff;
                data = new Uint8Array(rawBuffer);
            }
        } else if (this._source instanceof HTMLImageElement || this.isImageBitmap(this._source)) {
            const img = this._source;
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
            return this.source;
        }
        return data;
    }

    private isImageBitmap (imageSource: any): imageSource is ImageBitmap {
        return !!(sys.hasFeature(sys.Feature.IMAGE_BITMAP) && imageSource instanceof ImageBitmap);
    }
}
