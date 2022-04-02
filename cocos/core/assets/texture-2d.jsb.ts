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
import { ccclass, type } from 'cc.decorator';
import {
    _applyDecoratedDescriptor,
    _assertThisInitialized,
    _initializerDefineProperty,
} from '../data/utils/decorator-jsb-utils';
import { legacyCC } from '../global-exports';
import { ImageAsset } from './image-asset';
import { SimpleTexture } from './simple-texture';
import { TextureBase } from './texture-base.jsb';
import { js } from '../utils/js';
import { Filter, PixelFormat, WrapMode } from './asset-enum';

const texture2DProto: any = jsb.Texture2D.prototype;

texture2DProto.createNode = null!;

export type Texture2D = jsb.Texture2D;
export const Texture2D: any = jsb.Texture2D;

Texture2D.Filter = Filter;
Texture2D.PixelFormat = PixelFormat;
Texture2D.WrapMode = WrapMode;

export interface ITexture2DSerializeData {
    base: string;
    mipmaps: string[];
}

const clsDecorator = ccclass('cc.Texture2D');

const _class2$c = Texture2D;
const _dec2$6 = type([ImageAsset]); // xwx: jsb.ImageAsset?

const _descriptor$a = _applyDecoratedDescriptor(_class2$c.prototype, '_mipmaps', [_dec2$6], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer () {
        return [];
    },
});

texture2DProto._ctor = function () {
    SimpleTexture.prototype._ctor.apply(this, arguments);
    this._mipmaps = [];
    // for deserialization
    // _initializerDefineProperty(_this, 'isRGBE', _descriptor$b, _assertThisInitialized(_this));
    // _initializerDefineProperty(_this, '_mipmaps', _descriptor2$7, _assertThisInitialized(_this));
};

clsDecorator(Texture2D);

texture2DProto._serialize = function (ctxForExporting: any) {
    if (EDITOR || TEST) {
        return {
            base: TextureBase.prototype._serialize(ctxForExporting),
            mipmaps: this._mipmaps.map((mipmap) => {
                if (!mipmap || !mipmap._uuid) {
                    return null;
                }
                if (ctxForExporting && ctxForExporting._compressUuid) {
                    // ctxForExporting.dependsOn('_textureSource', texture); TODO
                    return EditorExtends.UuidUtils.compressUuid(mipmap._uuid, true);
                }
                return mipmap._uuid;
            }),
        };
    }
    return null;
}


texture2DProto._deserialize = function (serializedData: any, handle: any) {
    const data = serializedData as ITexture2DSerializeData;
    TextureBase.prototype._deserialize.call(this, data.base);

    this._mipmaps = new Array(data.mipmaps.length);
    for (let i = 0; i < data.mipmaps.length; ++i) {
        // Prevent resource load failed
        this._mipmaps[i] = new ImageAsset();
        if (!data.mipmaps[i]) {
            continue;
        }
        const mipmapUUID = data.mipmaps[i];
        handle.result.push(this._mipmaps, `${i}`, mipmapUUID, js._getClassId(ImageAsset));
    }
};

const oldOnLoaded = texture2DProto.onLoaded;
texture2DProto.onLoaded = function () {
    this.syncMipmapsForJS(this._mipmaps);
    oldOnLoaded.call(this);
};

Object.defineProperty(texture2DProto, 'image', {
    configurable: true,
    enumerable: true,
    get () {
        return this._mipmaps.length === 0 ? null : this._mipmaps[0];
    },
    set (value) {
        this.mipmaps = value ? [value] : [];
    }
});

Object.defineProperty(texture2DProto, 'mipmaps', {
    configurable: true,
    enumerable: true,
    get () {
        return this._mipmaps;
    },
    set (arr) {
        for (let i = 0, len = arr.length; i < len; ++i) {
            arr[i]._syncDataToNative();
        }
        this._mipmaps = arr;
        this.setMipmaps(arr);
    }
});

legacyCC.Texture2D = jsb.Texture2D;
