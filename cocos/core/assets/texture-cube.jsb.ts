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
    _applyDecoratedDescriptor,
    _assertThisInitialized,
    _initializerDefineProperty,
} from '../data/utils/decorator-jsb-utils';
import { legacyCC } from '../global-exports';
import { Filter, PixelFormat, WrapMode } from './asset-enum';
import { js } from '../utils/js';

const textureCubeProto: any = jsb.TextureCube.prototype;
interface ITextureCubeSerializeData {
    base: string;
    rgbe: boolean;
    mipmaps: {
        front: string;
        back: string;
        left: string;
        right: string;
        top: string;
        bottom: string;
    }[];
}

enum FaceIndex {
    right = 0,
    left = 1,
    top = 2,
    bottom = 3,
    front = 4,
    back = 5,
}

textureCubeProto.createNode = null!;

export type TextureCube = jsb.TextureCube;
export const TextureCube = jsb.TextureCube;

(TextureCube as any).Filter = Filter;
(TextureCube as any).PixelFormat = PixelFormat;
(TextureCube as any).WrapMode = WrapMode;

const clsDecorator = ccclass('cc.TextureCube');

const _class2$d = TextureCube;
const _descriptor$b = _applyDecoratedDescriptor(_class2$d.prototype, 'isRGBE', [serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer () {
        return false;
    },
});
const _descriptor2$7 = _applyDecoratedDescriptor(_class2$d.prototype, '_mipmaps', [serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer () {
        return [];
    },
});

textureCubeProto._ctor = function () {
    jsb.SimpleTexture.prototype._ctor.apply(this, arguments);
    this._mipmaps = null;
    // for deserialization
    // _initializerDefineProperty(_this, 'isRGBE', _descriptor$b, _assertThisInitialized(_this));
    // _initializerDefineProperty(_this, '_mipmaps', _descriptor2$7, _assertThisInitialized(_this));
};

function _forEachFace (mipmap, callback: (face, faceIndex) => void) {
    callback(mipmap.front, FaceIndex.front);
    callback(mipmap.back, FaceIndex.back);
    callback(mipmap.left, FaceIndex.left);
    callback(mipmap.right, FaceIndex.right);
    callback(mipmap.top, FaceIndex.top);
    callback(mipmap.bottom, FaceIndex.bottom);
}

Object.defineProperty(textureCubeProto, 'mipmaps', {
    get () {
        return this._mipmaps;
    },
    set (value) {
        this._mipmaps = value;
        this.setMipmaps(value);
        this.mipmapLevel = this._mipmaps.length;
        if (this._mipmaps.length > 0) {
            const imageAsset = this._mipmaps[0].front;
            this.reset({
                width: imageAsset.width,
                height: imageAsset.height,
                format: imageAsset.format,
                mipmapLevel: this._mipmaps.length,
            });
            this._mipmaps.forEach((mipmap, level) => {
                _forEachFace(mipmap, (face, faceIndex) => {
                    this.assignImage(face, level, faceIndex);
                });
            });
        } else {
            this.reset({
                width: 0,
                height: 0,
                mipmapLevel: this._mipmaps.length,
            });
        }
    }
});

Object.defineProperty(textureCubeProto, 'image', {
    get () {
        return this._mipmaps.length === 0 ? null : this._mipmaps[0];
    },
    set (value) {
        this.mipmaps = value ? [value] : [];
    }
});

textureCubeProto._deserialize = function (serializedData: ITextureCubeSerializeData, handle: any) {
    const data = serializedData;
    jsb.TextureBase.prototype._deserialize.call(this, data.base, handle);
    this.isRGBE = data.rgbe;
    this._mipmaps = new Array(data.mipmaps.length);
    for (let i = 0; i < data.mipmaps.length; ++i) {
        // Prevent resource load failed
        this._mipmaps[i] = {
            front: new jsb.ImageAsset(),
            back: new jsb.ImageAsset(),
            left: new jsb.ImageAsset(),
            right: new jsb.ImageAsset(),
            top: new jsb.ImageAsset(),
            bottom: new jsb.ImageAsset(),
        };
        const mipmap = data.mipmaps[i];
        const imageAssetClassId = js._getClassId(jsb.ImageAsset);
        handle.result.push(this._mipmaps[i], `front`, mipmap.front, imageAssetClassId);
        handle.result.push(this._mipmaps[i], `back`, mipmap.back, imageAssetClassId);
        handle.result.push(this._mipmaps[i], `left`, mipmap.left, imageAssetClassId);
        handle.result.push(this._mipmaps[i], `right`, mipmap.right, imageAssetClassId);
        handle.result.push(this._mipmaps[i], `top`, mipmap.top, imageAssetClassId);
        handle.result.push(this._mipmaps[i], `bottom`, mipmap.bottom, imageAssetClassId);
    }
    this.setMipmaps(this._mipmaps);
}

clsDecorator(TextureCube);

legacyCC.TextureCube = jsb.TextureCube;
