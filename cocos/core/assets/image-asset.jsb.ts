/*
 Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/
import { ccclass, override } from 'cc.decorator';
import { ALIPAY, XIAOMI, JSB, TEST, BAIDU } from 'internal:constants';
import { Format, FormatFeatureBit } from '../gfx';
import { legacyCC } from '../global-exports';
import { PixelFormat } from './asset-enum';
import { macro, sys, warnID } from '../platform';

export type ImageAsset = jsb.ImageAsset;
export const ImageAsset = jsb.ImageAsset;

export interface IMemoryImageSource {
    _data: ArrayBufferView | null;
    _compressed: boolean;
    width: number;
    height: number;
    format: number;
}

export type ImageSource = HTMLCanvasElement | HTMLImageElement | IMemoryImageSource | ImageBitmap;

const extnames = ['.png', '.jpg', '.jpeg', '.bmp', '.webp', '.pvr', '.pkm', '.astc'];

function isImageBitmap (imageSource: any): boolean {
    return !!(sys.hasFeature(sys.Feature.IMAGE_BITMAP) && imageSource instanceof ImageBitmap);
}

function isNativeImage (imageSource: ImageSource): imageSource is (HTMLImageElement | HTMLCanvasElement | ImageBitmap) {
    if (ALIPAY || XIAOMI || BAIDU) {
        // We're unable to grab the constructors of Alipay native image or canvas object.
        return !('_data' in imageSource);
    }
    if (JSB && (imageSource as IMemoryImageSource)._compressed === true) {
        return false;
    }

    return imageSource instanceof HTMLImageElement || imageSource instanceof HTMLCanvasElement || isImageBitmap(imageSource);
}

const imageAssetProto = ImageAsset.prototype;

imageAssetProto._ctor = function (nativeAsset?: ImageSource) {
    jsb.Asset.prototype._ctor.apply(this, arguments);
    this._width = 0;
    this._height = 0;
    this._nativeData = {
        _data: null,
        width: 0,
        height: 0,
        format: 0,
        _compressed: false,
    };

    if (nativeAsset !== undefined) {
        this.reset(nativeAsset);
    }
};

Object.defineProperty(imageAssetProto, '_nativeAsset', {
    configurable: true,
    enumerable: true,
    get () {
        return this._nativeData;
    },
    set (value: ImageSource) {
        if (!(value instanceof HTMLElement) && !isImageBitmap(value)) {
            // @ts-expect-error internal API usage
            value.format = value.format || this.format;
        }
        this.reset(value);
    },
});

Object.defineProperty(imageAssetProto, 'data', {
    configurable: true,
    enumerable: true,
    get () {
        if (this._nativeData && isNativeImage(this._nativeData)) {
            return this._nativeData;
        }

        return this._nativeData && this._nativeData._data;
    },
});

imageAssetProto._setRawAsset = function (filename: string, inLibrary = true) {
    if (inLibrary !== false) {
        this._native = filename || '';
    } else {
        this._native = `/${filename}`;  // simply use '/' to tag location where is not in the library
    }
};

imageAssetProto.reset = function (data: ImageSource) {
    this._nativeData = data;

    if (!(data instanceof HTMLElement)) {
        // @ts-expect-error internal api usage
        this.format = data.format;
    }
    this._syncDataToNative();
};

const superDestroy = jsb.Asset.prototype.destroy;
imageAssetProto.destroy = function () {
    if(this.data && this.data instanceof HTMLImageElement) {
        this.data.src = '';
        this._setRawAsset('');
        this.data.destroy();
    } else if (isImageBitmap(this.data)) {
        this.data.close && this.data.close();
    }
    return superDestroy.call(this);
};

Object.defineProperty(imageAssetProto, 'width', {
    configurable: true,
    enumerable: true,
    get () {
        return this._nativeData.width || this._width;
    }
});

Object.defineProperty(imageAssetProto, 'height', {
    configurable: true,
    enumerable: true,
    get () {
        return this._nativeData.height || this._height;
    }
});

imageAssetProto._syncDataToNative = function () {
    const data: any = this._nativeData;
    this._width = data.width;
    this._height = data.height;

    this.setWidth(this._width);
    this.setHeight(this._height);
    this.url = this.nativeUrl;

    if (data instanceof HTMLCanvasElement) {
        this.setData(data._data.data);
    }
    else if (data instanceof HTMLImageElement) {
        this.setData(data._data);
    }
    else {
        this.setData(this._nativeData._data);
    }
};

imageAssetProto._serialize = function () {
    if (EDITOR || TEST) {
        let targetExtensions;
        if (this._native) {
            targetExtensions = [this._native];
        }

        if (!targetExtensions) {
            return '';
        }

        const extensionIndices: string[] = [];
        for (const targetExtension of targetExtensions) {
            const extensionFormat = targetExtension.split('@');
            const i = extnames.indexOf(extensionFormat[0]);
            let exportedExtensionID = i < 0 ? targetExtension : `${i}`;
            if (extensionFormat[1]) {
                exportedExtensionID += `@${extensionFormat[1]}`;
            }
            extensionIndices.push(exportedExtensionID);
        }
        return { fmt: extensionIndices.join('_'), w: this.width, h: this.height };
    }
}

imageAssetProto._deserialize = function (data: any) {
    let fmtStr = '';
    if (typeof data === 'string') {
        fmtStr = data;
    } else {
        this._width = data.w;
        this._height = data.h;
        fmtStr = data.fmt;
    }
    const device = legacyCC.director.root.device;
    const extensionIDs = fmtStr.split('_');

    let preferedExtensionIndex = Number.MAX_VALUE;
    // let format = this._format;
    let format = this.format;
    let ext = '';
    const SupportTextureFormats = macro.SUPPORT_TEXTURE_FORMATS as string[];
    for (const extensionID of extensionIDs) {
        const extFormat = extensionID.split('@');

        const i = parseInt(extFormat[0], undefined);
        // const tmpExt = ImageAsset.extnames[i] || extFormat[0];
        const tmpExt = extnames[i] || extFormat[0];

        const index = SupportTextureFormats.indexOf(tmpExt);
        if (index !== -1 && index < preferedExtensionIndex) {
            // const fmt = extFormat[1] ? parseInt(extFormat[1]) : this._format;
            const fmt = extFormat[1] ? parseInt(extFormat[1]) : this.format;

            // check whether or not support compressed texture
            if (tmpExt === '.astc' && (!device || !(device.getFormatFeatures(Format.ASTC_RGBA_4X4) & FormatFeatureBit.SAMPLED_TEXTURE))) {
                continue;
            } else if (tmpExt === '.pvr' && (!device || !(device.getFormatFeatures(Format.PVRTC_RGBA4) & FormatFeatureBit.SAMPLED_TEXTURE))) {
                continue;
            } else if ((fmt === PixelFormat.RGB_ETC1 || fmt === PixelFormat.RGBA_ETC1)
                && (!device || !(device.getFormatFeatures(Format.ETC_RGB8) & FormatFeatureBit.SAMPLED_TEXTURE))) {
                continue;
            } else if ((fmt === PixelFormat.RGB_ETC2 || fmt === PixelFormat.RGBA_ETC2)
                && (!device || !(device.getFormatFeatures(Format.ETC2_RGB8) & FormatFeatureBit.SAMPLED_TEXTURE))) {
                continue;
            } else if (tmpExt === '.webp' && !sys.hasFeature(sys.Feature.WEBP)) {
                continue;
            }
            preferedExtensionIndex = index;
            ext = tmpExt;
            format = fmt;
        }
    }

    if (ext) {
        this._setRawAsset(ext);
        this.format = format;
        // this._format = format;
    } else {
        warnID(3121);
    }
};

legacyCC.ImageAsset = jsb.ImageAsset;

// handle meta data, it is generated automatically
const ImageAssetProto = ImageAsset.prototype;
const _nativeAssetDescriptor = Object.getOwnPropertyDescriptor(ImageAssetProto, '_nativeAsset');
override(ImageAssetProto, '_nativeAsset', _nativeAssetDescriptor);
ccclass('cc.ImageAsset')(ImageAsset);
