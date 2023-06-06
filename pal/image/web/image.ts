import { systemInfo } from 'pal/system-info';
import { EDITOR, ALIPAY, XIAOMI, JSB, TEST, BAIDU, TAOBAO, TAOBAO_MINIGAME, WECHAT_MINI_PROGRAM } from 'internal:constants';
import { IMemoryImageSource, ImageSource } from '../types';
import { sys } from '../../../cocos/core/platform/sys';
import { ccwindow } from '../../../cocos/core/global-exports';
import { getError } from '../../../cocos/core';

export class Image {
    private _nativeData: ImageSource;

    constructor (imageAsset?: ImageSource) {
        this._nativeData = {
            _data: null,
            width: 0,
            height: 0,
            format: 0,
            _compressed: false,
            mipmapLevelDataSize: [],
        };
        //this._nativeData = data;
        if (imageAsset !== undefined) {
            this.reset(imageAsset);
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

    get data () {
        if (this.isNativeImage(this._nativeData)) {
            return this._nativeData;
        }

        return this._nativeData && this._nativeData._data;
    }

    get width () {
        return this._nativeData.width;
    }

    get height () {
        return this._nativeData.height;
    }

    get format () {
        return (this._nativeData as IMemoryImageSource).format;
    }

    get compressed () {
        return false;
    }

    get mipmapLevelDataSize () {
        return (this._nativeData as IMemoryImageSource).mipmapLevelDataSize;
    }

    static downloadDomImage (url: string,
        options: Record<string, any>,
        onComplete: ((err: Error | null, data?: HTMLImageElement | null) => void)) {
        const img = new HTMLImageElement();

        // NOTE: on xiaomi platform, we need to force setting img.crossOrigin as 'anonymous'
        if (ccwindow.location.protocol !== 'file:' || XIAOMI) {
            img.crossOrigin = 'anonymous';
        }

        function loadCallback () {
            img.removeEventListener('load', loadCallback);
            img.removeEventListener('error', errorCallback);
            if (onComplete) { onComplete(null, img); }
        }

        function errorCallback () {
            img.removeEventListener('load', loadCallback);
            img.removeEventListener('error', errorCallback);
            if (onComplete) { onComplete(new Error(getError(4930, url))); }
        }

        img.addEventListener('load', loadCallback);
        img.addEventListener('error', errorCallback);
        img.src = url;
        return img;
    }

    public reset (data: ImageSource) {
        this._nativeData = data;
        // if (this.isImageBitmap(data)) {
        //     this._nativeData = data;
        // } else if (!(data instanceof HTMLElement)) {
        //     // this._nativeData = Object.create(data);
        //     this._nativeData = data;
        // } else {
        //     this._nativeData = data;
        // }
    }

    public isHtmlElement () {
        return this._nativeData instanceof HTMLElement;
    }
    public isImageBitmap (imageSource: any): imageSource is ImageBitmap {
        return !!(sys.hasFeature(sys.Feature.IMAGE_BITMAP) && imageSource instanceof ImageBitmap);
    }

    // 返回该图像源是否是平台提供的图像对象。
    public isNativeImage (imageSource: ImageSource): imageSource is (HTMLImageElement | HTMLCanvasElement | ImageBitmap) {
        if (ALIPAY || TAOBAO || TAOBAO_MINIGAME || XIAOMI || BAIDU || WECHAT_MINI_PROGRAM) {
            // We're unable to grab the constructors of Alipay native image or canvas object.
            return !('_data' in imageSource);
        }
        if (JSB && (imageSource as IMemoryImageSource)._compressed === true) {
            return false;
        }

        return imageSource instanceof HTMLImageElement || imageSource instanceof HTMLCanvasElement || this.isImageBitmap(imageSource);
    }

    public fetchImageSource (imageSource: ImageSource) {
        return '_data' in imageSource ? imageSource._data : imageSource;
    }
}
