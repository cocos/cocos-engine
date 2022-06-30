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
import { ccclass, serializable } from 'cc.decorator';
import {
    _assertThisInitialized,
    _initializerDefineProperty,
} from '../data/utils/decorator-jsb-utils';
import { legacyCC } from '../global-exports';
import { Filter, PixelFormat, WrapMode } from './asset-enum';
import './asset';

const textureBaseProto: any = jsb.TextureBase.prototype;

textureBaseProto._serialize = function (ctxForExporting: any): any {
    if (EDITOR || TEST) {
        return `${this._minFilter},${this._magFilter},${this._wrapS},${this._wrapT},${this._mipFilter},${this._anisotropy}`;
    }
    return '';
}

textureBaseProto._deserialize = function (serializedData: any, handle: any) {
    const data = serializedData as string;
    const fields = data.split(',');
    fields.unshift('');
    if (fields.length >= 5) {
        // decode filters
        this.setFilters(parseInt(fields[1]), parseInt(fields[2]));
        // decode wraps
        this.setWrapMode(parseInt(fields[3]), parseInt(fields[4]));
    }
    if (fields.length >= 7) {
        this.setMipFilter(parseInt(fields[5]));
        this.setAnisotropy(parseInt(fields[6]));
    }
};

textureBaseProto._getGFXDevice = function () {
    if (legacyCC.director.root) {
        return legacyCC.director.root.device;
    }
    return null;
};

textureBaseProto._getGFXFormat = function () {
    return this._getGFXPixelFormat(this.format);
};

textureBaseProto._setGFXFormat = function (format?: PixelFormat) {
    this.format = format === undefined ? PixelFormat.RGBA8888 : format;
};

textureBaseProto._getGFXPixelFormat = function (format) {
    if (format === PixelFormat.RGBA_ETC1) {
        format = PixelFormat.RGB_ETC1;
    } else if (format === PixelFormat.RGB_A_PVRTC_4BPPV1) {
        format = PixelFormat.RGB_PVRTC_4BPPV1;
    } else if (format === PixelFormat.RGB_A_PVRTC_2BPPV1) {
        format = PixelFormat.RGB_PVRTC_2BPPV1;
    }
    return format;
};

textureBaseProto.createNode = null!;

export type TextureBase = jsb.TextureBase;
export const TextureBase: any = jsb.TextureBase;

TextureBase.Filter = Filter;
TextureBase.PixelFormat = PixelFormat;
TextureBase.WrapMode = WrapMode;

textureBaseProto._ctor = function () {
    jsb.Asset.prototype._ctor.apply(this, arguments);
    this._gfxSampler = null;
    this._samplerInfo = null;
    this._textureHash = 0;

    this._registerGFXSamplerUpdatedListener();
};

const oldGetGFXSampler = textureBaseProto.getGFXSampler;
textureBaseProto.getGFXSampler = function () {
    if (!this._gfxSampler) {
        this._gfxSampler = oldGetGFXSampler.call(this);
    }
    return this._gfxSampler;
};

const oldGetHash = textureBaseProto.getHash;
textureBaseProto.getHash = function () {
    if (this._textureHash === 0) {
        this._textureHash = oldGetHash.call(this);
    }
    return this._textureHash;
};

const oldGetSamplerInfo = textureBaseProto.getSamplerInfo;
textureBaseProto.getSamplerInfo = function () {
    if (!this._samplerInfo) {
        this._samplerInfo = oldGetSamplerInfo.call(this);
    }
    return this._samplerInfo;
};

const oldDestroy = textureBaseProto.destroy;
textureBaseProto.destroy = function () {
    let destroyed = oldDestroy.call(this);
    if (destroyed && legacyCC.director.root?.batcher2D) {
        legacyCC.director.root.batcher2D._releaseDescriptorSetCache(this.getHash());
    }
    return destroyed;
};

textureBaseProto._onGFXSamplerUpdated = function (gfxSampler, samplerInfo) {
    this._gfxSampler = gfxSampler;
    this._samplerInfo = samplerInfo;
};

legacyCC.TextureBase = jsb.TextureBase;

// handle meta data, it is generated automatically
const TextureBaseProto = TextureBase.prototype;
serializable(TextureBaseProto, '_format');
serializable(TextureBaseProto, '_minFilter');
serializable(TextureBaseProto, '_magFilter');
serializable(TextureBaseProto, '_mipFilter');
serializable(TextureBaseProto, '_wrapS');
serializable(TextureBaseProto, '_wrapT');
serializable(TextureBaseProto, '_wrapR');
serializable(TextureBaseProto, '_anisotropy');
ccclass('cc.TextureBase')(TextureBase);
