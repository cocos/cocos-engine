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
import { ccwindow } from '../../cocos/core/global-exports';

export class BaseImageData {
    protected _imageSource: ImageSource;

    constructor (imageAsset?: ImageSource | ArrayBufferView) {
        this._imageSource = {
            _data: null,
            width: 0,
            height: 0,
            format: 0,
            _compressed: false,
            mipmapLevelDataSize: [],
        };
        //this._nativeData = data;
        if (typeof imageAsset !== 'undefined') {
            if (!ArrayBuffer.isView(imageAsset)) {
                this.reset(imageAsset);
            } else {
                this._imageSource._data = imageAsset;
            }
        } else if (typeof imageAsset === 'undefined') {
            this._imageSource = new ccwindow.Image();
        }
    }

    public destroy () {
        if (this.data && this.data instanceof HTMLImageElement) {
            this.data.src = '';
            // this._setRawAsset('');
        } else if (this.isImageBitmap(this.data)) {
            this.data?.close();
        }
    }

    set data (value: any) {
        this.reset(value);
    }

    get data (): ImageSource | ArrayBufferView | null {
        if (this._imageSource && this.isNativeImage(this._imageSource)) {
            return this._imageSource;
        }

        return this._imageSource && this._imageSource._data;
    }

    public nativeData (): unknown {
        return this.data as any;
    }

    set crossOrigin (string) {
        (this._imageSource as HTMLImageElement).crossOrigin = 'anonymous';
    }

    set onload (cb) {
        (this._imageSource as HTMLImageElement).onload = cb;
    }

    set onerror (cb) {
        (this._imageSource as HTMLImageElement).onerror = cb;
    }

    set src (url: string) {
        (this._imageSource as HTMLImageElement).src = url;
    }

    get src (): string {
        return (this._imageSource as HTMLImageElement).src;
    }

    get width () {
        return this._imageSource.width;
    }

    set width (value) {
        // @ts-ignore
        this._imageSource.width = value;
    }

    get height (): number {
        if (!(this._imageSource instanceof ArrayBuffer)) {
            return this._imageSource.height;
        }
        return 0;
    }

    set height (value) {
        // @ts-ignore
        this._imageSource.height = value;
    }

    get format (): number | null {
        if (!(this._imageSource instanceof HTMLElement) && !this.isImageBitmap(this._imageSource) && !this.isArrayBuffer()) {
            return this._imageSource.format;
        }
        return null;
    }

    get compressed () {
        return false;
    }

    get mipmapLevelDataSize () {
        return (this._imageSource as IMemoryImageSource).mipmapLevelDataSize;
    }

    public reset (data: ImageSource) {
        this._imageSource = data;
    }
    public isArrayBuffer () {
        return ArrayBuffer.isView((this._imageSource as IMemoryImageSource)._data);
    }
    public isHtmlElement () {
        return this._imageSource instanceof HTMLElement;
    }
    public isImageBitmap (imageSource: any): imageSource is ImageBitmap {
        return !!(sys.hasFeature(sys.Feature.IMAGE_BITMAP) && imageSource instanceof ImageBitmap);
    }

    // 返回该图像源是否是平台提供的图像对象。
    protected isNativeImage (imageSource: ImageSource): imageSource is (HTMLImageElement | HTMLCanvasElement | ImageBitmap) {
        return imageSource instanceof HTMLImageElement || imageSource instanceof HTMLCanvasElement || this.isImageBitmap(imageSource);
    }

    private fetchImageSource (imageSource: ImageSource) {
        return '_data' in imageSource ? imageSource._data : imageSource;
    }

    public addEventListener (name, cb) {
        if (this.isHtmlElement()) {
            (this.data as HTMLImageElement).addEventListener(name, cb);
        }
    }

    public removeEventListener (name, cb) {
        if (this.isHtmlElement()) {
            (this.data as HTMLImageElement).removeEventListener(name, cb);
        }
    }
}
