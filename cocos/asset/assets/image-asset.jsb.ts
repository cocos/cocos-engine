/*
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

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

import { ALIPAY, XIAOMI, JSB, TEST, BAIDU, EDITOR } from 'internal:constants';
import { Format, FormatFeatureBit, deviceManager } from '../../gfx';
import { ImageData } from 'pal/image';
import { IMemoryImageSource, ImageSource } from '../../../pal/image/types';
import { PixelFormat } from './asset-enum';
import { sys, macro } from '../../core';
import { warnID, error } from '@base/debug';
import { cclegacy } from '@base/global';
import { patch_cc_ImageAsset } from '../../native-binding/decorators';
import './asset';
import type { ImageAsset as JsbImageAsset } from './image-asset';

declare const jsb: any;

export type ImageAsset = JsbImageAsset;
export const ImageAsset: typeof JsbImageAsset = jsb.ImageAsset;
const jsbWindow = jsb.window;

const extnames = ['.png', '.jpg', '.jpeg', '.bmp', '.webp', '.pvr', '.pkm', '.astc'];

// TODO: we mark imageAssetProto as type of any, because here we have many dynamic injected property @dumganhar
const imageAssetProto: any = ImageAsset.prototype;

imageAssetProto._ctor = function (imageSource?: ImageData | IMemoryImageSource | HTMLCanvasElement | HTMLImageElement | ImageBitmap) {
    jsb.Asset.prototype._ctor.apply(this, arguments);
    this._width = 0;
    this._height = 0;
    if (imageSource instanceof ImageData) {
        this._imageData = imageSource;
    } else {
        this._imageData = new ImageData(imageSource);
    }
};

Object.defineProperty(imageAssetProto, '_nativeAsset', {
    configurable: true,
    enumerable: true,
    get () {
        return this._imageData.source;
    },
    set (value: ImageData | IMemoryImageSource | HTMLCanvasElement | HTMLImageElement | ImageBitmap) {
        if (value instanceof ImageData) {
            this._imageData = value;
            this._syncDataToNative();
        } else {
            this.reset(value);
        }
    },
});

Object.defineProperty(imageAssetProto, 'data', {
    configurable: true,
    enumerable: true,
    get () {
        return this._imageData.data;
    },
});

Object.defineProperty(imageAssetProto, 'imageData', {
    configurable: true,
    enumerable: true,
    get () {
        return this._imageData;
    }
});

imageAssetProto._setRawAsset = function (filename: string, inLibrary = true) {
    if (inLibrary !== false) {
        this._native = filename || '';
    } else {
        this._native = `/${filename}`;  // simply use '/' to tag location where is not in the library
    }
};

// TODO: Property 'format' does not exist on type 'HTMLCanvasElement'.
// imageAssetProto.reset = function (data: ImageSource) {
imageAssetProto.reset = function (data: IMemoryImageSource | HTMLCanvasElement | HTMLImageElement | ImageBitmap) {
    this._imageData.reset(data);
    if ('_data' in data) {
        const format = data.format;
        if (format != null) {
            this._format = format;
        }
    }
    this._syncDataToNative();
};

const superDestroy = jsb.Asset.prototype.destroy;
imageAssetProto.destroy = function () {
    this._setRawAsset('');
    this._imageData.destroy();
    return superDestroy.call(this);
};

Object.defineProperty(imageAssetProto, 'width', {
    configurable: true,
    enumerable: true,
    get () {
        return this._imageData.width || this._width;
    }
});

Object.defineProperty(imageAssetProto, 'height', {
    configurable: true,
    enumerable: true,
    get () {
        return this._imageData.height || this._height;
    }
});

imageAssetProto._syncDataToNative = function () {
    const data: any = this._imageData;
    this._width = data.width;
    this._height = data.height;

    this.setWidth(this._width);
    this.setHeight(this._height);
    this.url = this.nativeUrl;

    this.setData(this._imageData.data);
    if (data._mipmapLevelDataSize){
        this.setMipmapLevelDataSize(data._mipmapLevelDataSize);
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
    const device = deviceManager.gfxDevice;
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

cclegacy.ImageAsset = jsb.ImageAsset;

// handle meta data, it is generated automatically
patch_cc_ImageAsset({ImageAsset});

