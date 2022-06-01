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
    mipmapMode: number;
    mipmapAtlas:  {
        front: string;
        back: string;
        left: string;
        right: string;
        top: string;
        bottom: string;
    };
    mipmapLayout: [];
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
enum MipmapBakeMode {  
    None = 0,
    BakeReflectionConvolution = 1,
}
textureCubeProto.createNode = null!;

export type TextureCube = jsb.TextureCube;
export const TextureCube: any = jsb.TextureCube;

TextureCube.Filter = Filter;
TextureCube.PixelFormat = PixelFormat;
TextureCube.WrapMode = WrapMode;

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
const _descriptor3$b = _applyDecoratedDescriptor(_class2$d.prototype, '_mipmapMode', [serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer () {
        return false;
    },
});
const _descriptor4$b = _applyDecoratedDescriptor(_class2$d.prototype, '_mipmapAtlas', [serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer () {
        return false;
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
Object.defineProperty(textureCubeProto, 'mipmapMode', {
    get () {
        return this._mipmapMode;
    },
    set (value) {
        this._mipmapMode = value;
    }
});


Object.defineProperty(textureCubeProto, 'mipmapAtlas', {
    get () {
        return this._mipmapAtlas;
    },
    set (value) {
        this._mipmapAtlas = value;
        if (!this._mipmapAtlas) {
            this.reset({
                width: 0,
                height: 0,
                mipmapLevel: 0,
            });
            return;
        }
        const imageAtlasAsset: jsb.ImageAsset = this._mipmapAtlas.atlas.front;
        if (!imageAtlasAsset.data) {
            return;
        }
        const faceAtlas = this._mipmapAtlas.atlas;
        const layout = this._mipmapAtlas.layout;
        const mip0Layout = layout[0];

        const ctx = Object.assign(document.createElement('canvas'), {
            width: imageAtlasAsset.width,
            height: imageAtlasAsset.height,
        }).getContext('2d');

        this.reset({
            width: mip0Layout.width,
            height: mip0Layout.height,
            format: imageAtlasAsset.format,
            mipmapLevel: layout.length,
        });

        for (let j = 0; j < layout.length; j++) {
            const layoutInfo = layout[j];
            _forEachFace(faceAtlas, (face, faceIndex) => {
                ctx!.clearRect(0, 0, imageAtlasAsset.width, imageAtlasAsset.height);
                const drawImg = face.data as HTMLImageElement;
                ctx!.drawImage(drawImg, 0, 0);
                const rawData = ctx!.getImageData(layoutInfo.left, layoutInfo.top, layoutInfo.width, layoutInfo.height);

                const bufferAsset = new jsb.ImageAsset({
                    _data: rawData.data,
                    _compressed: face.isCompressed,
                    width: rawData.width,
                    height: rawData.height,
                    format: face.format,
                });
                this._assignImage(bufferAsset, layoutInfo.level, faceIndex);
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

const oldOnLoaded = textureCubeProto.onLoaded;
textureCubeProto.onLoaded = function () {
    if (this.mipmapMode === MipmapBakeMode.BakeReflectionConvolution) {
        this.setMipmapAtlasForJS(this._mipmapAtlas);
    } else {
        this.setMipmapsForJS(this._mipmaps);
    }
    oldOnLoaded.apply(this);
}

textureCubeProto._serialize = function (ctxForExporting: any): Record<string, unknown> | null {
    if (EDITOR || TEST) {
        if (this.mipmapMode === MipmapBakeMode.BakeReflectionConvolution) {
            const atlas = this._mipmapAtlas!.atlas;
            let uuids = {};
            if (ctxForExporting && ctxForExporting._compressUuid) {
                uuids = {
                    front: EditorExtends.UuidUtils.compressUuid(atlas.front._uuid, true),
                    back: EditorExtends.UuidUtils.compressUuid(atlas.back._uuid, true),
                    left: EditorExtends.UuidUtils.compressUuid(atlas.left._uuid, true),
                    right: EditorExtends.UuidUtils.compressUuid(atlas.right._uuid, true),
                    top: EditorExtends.UuidUtils.compressUuid(atlas.top._uuid, true),
                    bottom: EditorExtends.UuidUtils.compressUuid(atlas.bottom._uuid, true),
                };
            } else {
                uuids = {
                    front: atlas.front._uuid,
                    back: atlas.back._uuid,
                    left: atlas.left._uuid,
                    right: atlas.right._uuid,
                    top: atlas.top._uuid,
                    bottom: atlas.bottom._uuid,
                };
            }
            return {
                base: jsb.TextureBase.prototype._serialize(ctxForExporting),
                rgbe: this.isRGBE,
                mipmapMode: this.mipmapMode,
                mipmapAtlas: uuids,
                mipmapLayout: this._mipmapAtlas!.layout,
            };
        } else {
            return {
                base: jsb.TextureBase.prototype._serialize(ctxForExporting),
                rgbe: this.isRGBE,
                mipmaps: this._mipmaps.map((mipmap) => ((ctxForExporting && ctxForExporting._compressUuid) ? {
                    front: EditorExtends.UuidUtils.compressUuid(mipmap.front._uuid, true),
                    back: EditorExtends.UuidUtils.compressUuid(mipmap.back._uuid, true),
                    left: EditorExtends.UuidUtils.compressUuid(mipmap.left._uuid, true),
                    right: EditorExtends.UuidUtils.compressUuid(mipmap.right._uuid, true),
                    top: EditorExtends.UuidUtils.compressUuid(mipmap.top._uuid, true),
                    bottom: EditorExtends.UuidUtils.compressUuid(mipmap.bottom._uuid, true),
                } : {
                    front: mipmap.front._uuid,
                    back: mipmap.back._uuid,
                    left: mipmap.left._uuid,
                    right: mipmap.right._uuid,
                    top: mipmap.top._uuid,
                    bottom: mipmap.bottom._uuid,
                })),
            };
        }
    }
    return null;
}

textureCubeProto._deserialize = function (serializedData: ITextureCubeSerializeData, handle: any) {
    const data = serializedData;
    jsb.TextureBase.prototype._deserialize.call(this, data.base, handle);
    this.isRGBE = data.rgbe;
    this.mipmapMode = data.mipmapMode;
    if (this.mipmapMode === MipmapBakeMode.BakeReflectionConvolution) {
        const mipmapAtlas = data.mipmapAtlas;
        const mipmapLayout = data.mipmapLayout;
        this._mipmapAtlas = {
            atlas: {},
            layout: mipmapLayout,
        };
        this._mipmapAtlas.atlas = {
            front: new jsb.ImageAsset(),
            back: new jsb.ImageAsset(),
            left: new jsb.ImageAsset(),
            right: new jsb.ImageAsset(),
            top: new jsb.ImageAsset(),
            bottom: new jsb.ImageAsset(),
        };
        if (mipmapAtlas) {
            const imageAssetClassId = js._getClassId(jsb.ImageAsset);
            handle.result.push(this._mipmapAtlas.atlas, `front`, mipmapAtlas.front, imageAssetClassId);
            handle.result.push(this._mipmapAtlas.atlas, `back`, mipmapAtlas.back, imageAssetClassId);
            handle.result.push(this._mipmapAtlas.atlas, `left`, mipmapAtlas.left, imageAssetClassId);
            handle.result.push(this._mipmapAtlas.atlas, `right`, mipmapAtlas.right, imageAssetClassId);
            handle.result.push(this._mipmapAtlas.atlas, `top`, mipmapAtlas.top, imageAssetClassId);
            handle.result.push(this._mipmapAtlas.atlas, `bottom`, mipmapAtlas.bottom, imageAssetClassId);   
        }
    }else{
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
    }
}

clsDecorator(TextureCube);

legacyCC.TextureCube = jsb.TextureCube;
