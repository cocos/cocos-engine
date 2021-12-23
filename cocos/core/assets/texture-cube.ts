/*
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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

/**
 * @packageDocumentation
 * @module asset
 */

import { EDITOR, TEST } from 'internal:constants';
import { ccclass, serializable } from 'cc.decorator';
import { TextureType, TextureInfo } from '../gfx';
import { ImageAsset } from './image-asset';
import { PresumedGFXTextureInfo, SimpleTexture } from './simple-texture';
import { ITexture2DCreateInfo, Texture2D } from './texture-2d';
import { legacyCC } from '../global-exports';
import { js } from '../utils/js';
import { builtinResMgr } from '../builtin/builtin-res-mgr';

export type ITextureCubeCreateInfo = ITexture2DCreateInfo;

/**
 * @en The texture cube mipmap interface
 * @zh 立方体贴图的 Mipmap 接口。
 */
interface ITextureCubeMipmap {
    front: ImageAsset;
    back: ImageAsset;
    left: ImageAsset;
    right: ImageAsset;
    top: ImageAsset;
    bottom: ImageAsset;
}

/**
 * @en The index for all faces of the cube
 * @zh 立方体每个面的约定索引。
 */
enum FaceIndex {
    right = 0,
    left = 1,
    top = 2,
    bottom = 3,
    front = 4,
    back = 5,
}

/**
 * @en The texture cube asset.
 * Each mipmap level of a texture cube have 6 [[ImageAsset]], represents 6 faces of the cube.
 * @zh 立方体贴图资源。
 * 立方体贴图资源的每个 Mipmap 层级都为 6 张 [[ImageAsset]]，分别代表了立方体贴图的 6 个面。
 */
@ccclass('cc.TextureCube')
export class TextureCube extends SimpleTexture {
    public static FaceIndex = FaceIndex;

    @serializable
    isRGBE = false;

    /**
     * @en All levels of mipmap images, be noted, automatically generated mipmaps are not included.
     * When setup mipmap, the size of the texture and pixel format could be modified.
     * @zh 所有层级 Mipmap，注意，这里不包含自动生成的 Mipmap。
     * 当设置 Mipmap 时，贴图的尺寸以及像素格式可能会改变。
     */
    get mipmaps () {
        return this._mipmaps;
    }

    set mipmaps (value) {
        this._mipmaps = value;
        this._setMipmapLevel(this._mipmaps.length);
        if (this._mipmaps.length > 0) {
            const imageAsset: ImageAsset = this._mipmaps[0].front;
            this.reset({
                width: imageAsset.width,
                height: imageAsset.height,
                format: imageAsset.format,
                mipmapLevel: this._mipmaps.length,
            });
            this._mipmaps.forEach((mipmap, level) => {
                _forEachFace(mipmap, (face, faceIndex) => {
                    this._assignImage(face, level, faceIndex);
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

    /**
     * @en Level 0 mipmap image.
     * Be noted, `this.image = img` equals `this.mipmaps = [img]`,
     * sets image will clear all previous mipmaps.
     * @zh 0 级 Mipmap。
     * 注意，`this.image = img` 等价于 `this.mipmaps = [img]`，
     * 也就是说，通过 `this.image` 设置 0 级 Mipmap 时将隐式地清除之前的所有 Mipmap。
     */
    get image () {
        return this._mipmaps.length === 0 ? null : this._mipmaps[0];
    }

    set image (value) {
        this.mipmaps = value ? [value] : [];
    }

    /**
     * @en Create a texture cube with an array of [[Texture2D]] which represents 6 faces of the texture cube.
     * @zh 通过二维贴图数组指定每个 Mipmap 的每个面创建立方体贴图。
     * @param textures Texture array, the texture count must be multiple of 6. Every 6 textures are 6 faces of a mipmap level.
     * The order should obey [[FaceIndex]] order.
     * @param out Output texture cube, if not given, will create a new texture cube.
     * @returns The created texture cube.
     * @example
     * ```ts
     * const textures = new Array<Texture2D>(6);
     * textures[TextureCube.FaceIndex.front] = frontImage;
     * textures[TextureCube.FaceIndex.back] = backImage;
     * textures[TextureCube.FaceIndex.left] = leftImage;
     * textures[TextureCube.FaceIndex.right] = rightImage;
     * textures[TextureCube.FaceIndex.top] = topImage;
     * textures[TextureCube.FaceIndex.bottom] = bottomImage;
     * const textureCube = TextureCube.fromTexture2DArray(textures);
     * ```
     */
    public static fromTexture2DArray (textures: Texture2D[], out?: TextureCube) {
        const mipmaps: ITextureCubeMipmap[] = [];
        const nMipmaps = textures.length / 6;
        for (let i = 0; i < nMipmaps; i++) {
            const x = i * 6;
            mipmaps.push({
                front: textures[x + FaceIndex.front].image!,
                back: textures[x + FaceIndex.back].image!,
                left: textures[x + FaceIndex.left].image!,
                right: textures[x + FaceIndex.right].image!,
                top: textures[x + FaceIndex.top].image!,
                bottom: textures[x + FaceIndex.bottom].image!,
            });
        }
        out = out || new TextureCube();
        out.mipmaps = mipmaps;
        return out;
    }

    /**
     * @legacyPublic
     */
    @serializable
    public _mipmaps: ITextureCubeMipmap[] = [];

    public onLoaded () {
        this.mipmaps = this._mipmaps;
    }

    /**
     * @en Reset the current texture with given size, pixel format and mipmap images.
     * After reset, the gfx resource will become invalid, you must use [[uploadData]] explicitly to upload the new mipmaps to GPU resources.
     * @zh 将当前贴图重置为指定尺寸、像素格式以及指定 mipmap 层级。重置后，贴图的像素数据将变为未定义。
     * mipmap 图像的数据不会自动更新到贴图中，你必须显式调用 [[uploadData]] 来上传贴图数据。
     * @param info The create information
     */
    public reset (info: ITextureCubeCreateInfo) {
        this._width = info.width;
        this._height = info.height;
        this._setGFXFormat(info.format);
        this._setMipmapLevel(info.mipmapLevel || 1);
        this._tryReset();
    }

    public updateMipmaps (firstLevel = 0, count?: number) {
        if (firstLevel >= this._mipmaps.length) {
            return;
        }

        const nUpdate = Math.min(
            count === undefined ? this._mipmaps.length : count,
            this._mipmaps.length - firstLevel,
        );

        for (let i = 0; i < nUpdate; ++i) {
            const level = firstLevel + i;
            _forEachFace(this._mipmaps[level], (face, faceIndex) => {
                this._assignImage(face, level, faceIndex);
            });
        }
    }

    /**
     * 销毁此贴图，清空所有 Mipmap 并释放占用的 GPU 资源。
     */
    public destroy () {
        this._mipmaps = [];
        return super.destroy();
    }

    /**
     * @en Release used GPU resources.
     * @zh 释放占用的 GPU 资源。
     * @deprecated please use [[destroy]] instead
     */
    public releaseTexture () {
        this.mipmaps = [];
    }

    /**
     * @legacyPublic
     */
    public _serialize (ctxForExporting: any): Record<string, unknown> | null {
        if (EDITOR || TEST) {
            return {
                base: super._serialize(ctxForExporting),
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
        return null;
    }

    /**
     * @legacyPublic
     */
    public _deserialize (serializedData: ITextureCubeSerializeData, handle: any) {
        const data = serializedData;
        super._deserialize(data.base, handle);
        this.isRGBE = data.rgbe;
        this._mipmaps = new Array(data.mipmaps.length);
        for (let i = 0; i < data.mipmaps.length; ++i) {
            // Prevent resource load failed
            this._mipmaps[i] = {
                front: new ImageAsset(),
                back: new ImageAsset(),
                left: new ImageAsset(),
                right: new ImageAsset(),
                top: new ImageAsset(),
                bottom: new ImageAsset(),
            };
            const mipmap = data.mipmaps[i];
            const imageAssetClassId = js._getClassId(ImageAsset);
            handle.result.push(this._mipmaps[i], `front`, mipmap.front, imageAssetClassId);
            handle.result.push(this._mipmaps[i], `back`, mipmap.back, imageAssetClassId);
            handle.result.push(this._mipmaps[i], `left`, mipmap.left, imageAssetClassId);
            handle.result.push(this._mipmaps[i], `right`, mipmap.right, imageAssetClassId);
            handle.result.push(this._mipmaps[i], `top`, mipmap.top, imageAssetClassId);
            handle.result.push(this._mipmaps[i], `bottom`, mipmap.bottom, imageAssetClassId);
        }
    }

    protected _getGfxTextureCreateInfo (presumed: PresumedGFXTextureInfo): TextureInfo {
        const texInfo = new TextureInfo(TextureType.CUBE);
        texInfo.width = this._width;
        texInfo.height = this._height;
        texInfo.layerCount = 6;
        Object.assign(texInfo, presumed);
        return texInfo;
    }

    public initDefault (uuid?: string) {
        super.initDefault(uuid);

        const imageAsset = new ImageAsset();
        imageAsset.initDefault();
        this.mipmaps = [{
            front: imageAsset,
            back: imageAsset,
            top: imageAsset,
            bottom: imageAsset,
            left: imageAsset,
            right: imageAsset,
        }];
    }

    public validate () {
        return this._mipmaps.length !== 0 && !this._mipmaps.find((x) => !(x.top && x.bottom && x.front && x.back && x.left && x.right));
    }
}

legacyCC.TextureCube = TextureCube;

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

/**
 * @param {Mipmap} mipmap
 * @param {(face: ImageAsset) => void} callback
 */
function _forEachFace (mipmap: ITextureCubeMipmap, callback: (face: ImageAsset, faceIndex: number) => void) {
    callback(mipmap.front, FaceIndex.front);
    callback(mipmap.back, FaceIndex.back);
    callback(mipmap.left, FaceIndex.left);
    callback(mipmap.right, FaceIndex.right);
    callback(mipmap.top, FaceIndex.top);
    callback(mipmap.bottom, FaceIndex.bottom);
}
