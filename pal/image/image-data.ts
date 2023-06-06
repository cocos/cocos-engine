import { ALIPAY, XIAOMI, JSB, BAIDU, TAOBAO, TAOBAO_MINIGAME, WECHAT_MINI_PROGRAM } from 'internal:constants';
import { IMemoryImageSource, ImageSource } from './types';
import { sys } from '../../cocos/core/platform/sys';
import { ccwindow } from '../../cocos/core/global-exports';
import { getError } from '../../cocos/core';

export class ImageData {
    private _imageSource: ImageSource;

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
            // JSB element should destroy native data.
            // TODO: Property 'destroy' does not exist on type 'HTMLImageElement'.
            // maybe we need a higher level implementation called `pal/image`, we provide `destroy` interface here.
            // issue: https://github.com/cocos/cocos-engine/issues/14646
            if (JSB) (this.data as any).destroy();
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
        if (JSB) {
            if (this._imageSource instanceof HTMLCanvasElement) {
                // @ts-ignore
                return this._imageSource._data.data;
            } else if (this._imageSource instanceof HTMLImageElement) {
                // @ts-ignore
                return this._imageSource._data;
            } else if (ArrayBuffer.isView(this._imageSource)) {
                return this._imageSource.buffer;
            }
        }
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
    private isNativeImage (imageSource: ImageSource): imageSource is (HTMLImageElement | HTMLCanvasElement | ImageBitmap) {
        if (ALIPAY || TAOBAO || TAOBAO_MINIGAME || XIAOMI || BAIDU || WECHAT_MINI_PROGRAM) {
            // We're unable to grab the constructors of Alipay native image or canvas object.
            return !('_data' in imageSource);
        }
        if (JSB && (imageSource as IMemoryImageSource)._compressed === true) {
            return false;
        }

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

    static downloadImage (url: string,
        options: Record<string, any>,
        onComplete: ((err: Error | null, data?: HTMLImageElement | null) => void)): HTMLImageElement {
        const image = new ImageData();

        // NOTE: on xiaomi platform, we need to force setting img.crossOrigin as 'anonymous'
        if (ccwindow.location.protocol !== 'file:' || XIAOMI) {
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
