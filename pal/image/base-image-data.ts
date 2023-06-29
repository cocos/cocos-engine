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
import { PixelFormat } from '../../cocos/asset/assets/asset-enum';
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
        if (typeof imageAsset !== 'undefined') {
            this.data = imageAsset;
        } else if (typeof imageAsset === 'undefined') {
            this._imageSource = new ccwindow.Image();
        }
    }

    public destroy (): void {
        if (this.data && this.data instanceof HTMLImageElement) {
            this.data.src = '';
            // this._setRawAsset('');
        } else if (this.isImageBitmap(this.data)) {
            this.data?.close();
        }
    }

    set data (imageAsset: ImageSource | ArrayBufferView | null) {
        if (imageAsset != null && !ArrayBuffer.isView(imageAsset)) {
            this.reset(imageAsset);
        } else {
            (this._imageSource as IMemoryImageSource)._data = imageAsset;
        }
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

    public acceptAnonymousCORS (): void {
        (this._imageSource as HTMLImageElement).crossOrigin = 'anonymous';
    }

    set crossOrigin (cors: string) {
        (this._imageSource as HTMLImageElement).crossOrigin = cors;
    }

    set onload (cb: (ev: Event) => void) {
        (this._imageSource as HTMLImageElement).onload = cb;
    }

    set onerror (cb: (ev: Event | string) => void) {
        (this._imageSource as HTMLImageElement).onerror = cb;
    }

    set src (url: string) {
        (this._imageSource as HTMLImageElement).src = url;
    }

    get src (): string {
        return (this._imageSource as HTMLImageElement).src;
    }

    get width (): number {
        return this._imageSource.width;
    }

    set width (value: number) {
        (this._imageSource as IMemoryImageSource).width = value;
    }

    get height (): number {
        if (!(this._imageSource instanceof ArrayBuffer)) {
            return this._imageSource.height;
        }
        return 0;
    }

    set height (value: number) {
        (this._imageSource as IMemoryImageSource).height = value;
    }

    get format (): PixelFormat | null {
        if (!(this._imageSource instanceof HTMLElement) && !this.isImageBitmap(this._imageSource) && !this.isArrayBuffer()) {
            return this._imageSource.format;
        }
        return null;
    }

    get compressed (): boolean {
        return false;
    }

    get mipmapLevelDataSize (): number[] | undefined {
        return (this._imageSource as IMemoryImageSource).mipmapLevelDataSize;
    }

    public reset (data: ImageSource): void {
        this._imageSource = data;
    }

    public isArrayBuffer (): boolean {
        return ArrayBuffer.isView((this._imageSource as IMemoryImageSource)._data);
    }

    public isHtmlElement (): boolean {
        return this._imageSource instanceof HTMLElement;
    }

    public isImageBitmap (imageSource: any): imageSource is ImageBitmap {
        return !!(sys.hasFeature(sys.Feature.IMAGE_BITMAP) && imageSource instanceof ImageBitmap);
    }

    protected isNativeImage (imageSource: ImageSource): imageSource is (HTMLImageElement | HTMLCanvasElement | ImageBitmap) {
        return imageSource instanceof HTMLImageElement || imageSource instanceof HTMLCanvasElement || this.isImageBitmap(imageSource);
    }

    private fetchImageSource (imageSource: ImageSource): any {
        return '_data' in imageSource ? imageSource._data : imageSource;
    }

    protected addEventListener (name: string, cb: (ev: Event) => void): void {
        if (this.isHtmlElement()) {
            (this.data as HTMLImageElement).addEventListener(name, cb);
        }
    }

    protected removeEventListener (name: string, cb: (ev: Event) => void): void {
        if (this.isHtmlElement()) {
            (this.data as HTMLImageElement).removeEventListener(name, cb);
        }
    }
}
