/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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
 ****************************************************************************/
// @ts-check
import { Texture2D } from '../../assets';
import ImageAsset from '../../assets/image-asset';
import TextureBase from '../../assets/texture-base';
import { ccclass, property } from '../../core/data/class-decorator';
import { GFXTextureType, GFXTextureUsageBit, GFXTextureViewType, GFXTextureFlagBit } from '../../gfx/define';
import { GFXDevice } from '../../gfx/device';

interface ITextureCubeMipmap {
    front: ImageAsset;
    back: ImageAsset;
    left: ImageAsset;
    right: ImageAsset;
    top: ImageAsset;
    bottom: ImageAsset;
}

@ccclass('cc.TextureCube')
export default class TextureCube extends TextureBase {
    /**
     * Gets the mipmap images.
     * Note that the result do not contains the auto generated mipmaps.
     */
    get mipmaps () {
        return this._mipmaps;
    }

    /**
     * Sets the mipmaps images.
     */
    set mipmaps (value) {
        this._mipmaps = value;
        this._potientialWidth = value.length === 0 ? 0 : value[0].front.width;
        this._potientialHeight = value.length === 0 ? 0 : value[0].front.height;
        this._recreateTexture();
        this._mipmaps.forEach((mipmap, level) => {
            _forEachFace(mipmap, (face, faceIndex) => {
                this._assignImage(face, level, faceIndex);
            });
        });
    }

    /**
     * Gets the mipmap image at level 0.
     */
    get image () {
        return this._mipmaps.length === 0 ? null : this._mipmaps[0];
    }

    /**
     * Sets the mipmap images as a single mipmap image.
     */
    set image (value) {
        this.mipmaps = value ? [value] : [];
    }

    /**
     * @param textures
     * @deprecated Manually assign to mipmaps property instead.
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
        if (!out) { out = new TextureCube(); }
        out.mipmaps = mipmaps;
        return out;
    }

    @property
    public _mipmaps: ITextureCubeMipmap[] = [];

    constructor () {
        super();
    }

    /**
     * !#en
     * Destory this texture and immediately release its video memory. (Inherit from cc.Object.destroy)<br>
     * After destroy, this object is not usable any more.
     * You can use cc.isValid(obj) to check whether the object is destroyed before accessing it.
     * !#zh
     * 销毁该贴图，并立即释放它对应的显存。（继承自 cc.Object.destroy）<br/>
     * 销毁后，该对象不再可用。您可以在访问对象之前使用 cc.isValid(obj) 来检查对象是否已被销毁。
     */
    public destroy () {
        this._mipmaps = [];
        return super.destroy();
    }

    /**
     * !#en
     * Release texture, please use destroy instead.
     * !#zh 释放纹理，请使用 destroy 替代。
     * @deprecated Since v2.0.
     */
    public releaseTexture () {
        this.mipmaps = [];
    }

    public _serialize () {
        return {
            base: super._serialize(),
            mipmaps: this._mipmaps.map((mipmap) => {return {
                front: mipmap.front._uuid,
                back: mipmap.back._uuid,
                left: mipmap.left._uuid,
                right: mipmap.right._uuid,
                top: mipmap.top._uuid,
                bottom: mipmap.bottom._uuid,
            }; }),
        };
    }

    public _deserialize (serializedData: ITextureCubeSerializeData, handle: any) {
        const data = serializedData as ITextureCubeSerializeData;
        super._deserialize(data.base, handle);

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
            handle.result.push(this._mipmaps[i], `front`, mipmap.front);
            handle.result.push(this._mipmaps[i], `back`, mipmap.back);
            handle.result.push(this._mipmaps[i], `left`, mipmap.left);
            handle.result.push(this._mipmaps[i], `right`, mipmap.right);
            handle.result.push(this._mipmaps[i], `top`, mipmap.top);
            handle.result.push(this._mipmaps[i], `bottom`, mipmap.bottom);
        }
    }

    protected _createTextureImpl (gfxDevice: GFXDevice) {
        this._texture = gfxDevice.createTexture({
            type: GFXTextureType.TEX2D,
            /* tslint:disable:no-bitwise */
            usage: GFXTextureUsageBit.SAMPLED | GFXTextureUsageBit.TRANSFER_DST,
            /* tslint:enable:no-bitwise */
            format: this._getGfxFormat(),
            width: this._potientialWidth,
            height: this._potientialHeight,
            mipLevel: this._mipmaps.length,
            arrayLayer: 6,
            flags: GFXTextureFlagBit.CUBEMAP,
        });
    }

    protected _createTextureViewImpl (gfxDevice: GFXDevice) {
        if (!this._texture) {
            return;
        }

        this._textureView = gfxDevice.createTextureView({
            texture: this._texture,
            type: GFXTextureViewType.CUBE,
            format: this._getGfxFormat(),
            layerCount: 6,
        });
    }
}

/* tslint:disable:no-string-literal */
cc['TextureCube'] = TextureCube;

interface ITextureCubeSerializeData {
    base: string;
    mipmaps: Array<{
        front: string;
        back: string;
        left: string;
        right: string;
        top: string;
        bottom: string;
    }>;
}

enum FaceIndex {
    right = 0,
    left = 1,
    top = 2,
    bottom = 3,
    front = 4,
    back = 5,
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
