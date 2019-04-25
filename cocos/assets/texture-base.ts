/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
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
import {ccclass, property} from '../core/data/class-decorator';
import { EventTargetFactory } from '../core/event/event-target-factory';
import IDGenerator from '../core/utils/id-generator';
import { GFXBufferTextureCopy, GFXTextureFlagBit, GFXTextureType, GFXTextureUsageBit, GFXTextureViewType } from '../gfx/define';
import { GFXDevice } from '../gfx/device';
import { GFXTexture, IGFXTextureInfo } from '../gfx/texture';
import { GFXTextureView, IGFXTextureViewInfo } from '../gfx/texture-view';
import { SamplerInfoIndex } from '../renderer/core/sampler-lib';
import { Asset } from './asset';
import { Filter, PixelFormat, WrapMode } from './asset-enum';
import { ImageAsset } from './image-asset';

const CHAR_CODE_1 = 49;    // '1'

const idGenerator = new IDGenerator('Tex');

@ccclass('cc.TextureBase')
export class TextureBase extends EventTargetFactory(Asset) {

    /**
     * !#en
     * Texture width, in pixels.
     * For 2D texture, the width of texture is equal to its very first mipmap's width;
     * For Cubemap texture, the width of texture is equal to its every sides's very first mipmaps's width.
     * !#zh
     * 贴图像素宽度
     */
    public get width (): number {
        return this._texture ? this._texture.width : 0;
    }

    /**
     * !#en
     * Texture height, in pixels.
     * For 2D texture, the height of texture is equal to its very first mipmap's height;
     * For Cubemap texture, the height of texture is equal to its every sides's very first mipmaps's height.
     * !#zh
     * 贴图像素高度
     */
    public get height (): number {
        return this._texture ? this._texture.height : 0;
    }

    public static PixelFormat = PixelFormat;

    public static WrapMode = WrapMode;

    public static Filter = Filter;

    /**
     *
     * @param texture
     */
    public static _isCompressed (texture: TextureBase) {
        return texture._format >= PixelFormat.RGB_ETC1 && texture._format <= PixelFormat.RGBA_PVRTC_4BPPV1;
    }

    @property
    protected _format: number = PixelFormat.RGBA8888;

    @property
    protected _premultiplyAlpha = false;

    @property
    protected _flipY = false;

    @property
    protected _minFilter: number = Filter.LINEAR;

    @property
    protected _magFilter: number = Filter.LINEAR;

    @property
    protected _mipFilter: number = Filter.NONE;

    @property
    protected _wrapS: number = WrapMode.REPEAT;

    @property
    protected _wrapT: number = WrapMode.REPEAT;

    @property
    protected _wrapR: number = WrapMode.REPEAT;

    @property
    protected _anisotropy = 16;

    protected _texture: GFXTexture | null = null;

    protected _textureView: GFXTextureView | null = null;

    private _potientialWidth: number = 0;

    private _potientialHeight: number = 0;

    private _mipmapLevel: number = 1;

    private _id: string;

    private _samplerInfo: number[] = [];

    protected constructor (flipY: boolean = false) {
        super();

        this._flipY = flipY;

        // Id for generate hash in material
        this._id = idGenerator.getNewId();

        /**
         * !#en
         * Whether the texture is loaded or not
         * !#zh
         * 贴图是否已经成功加载
         */
        this.loaded = false;
    }

    public create (width: number, height: number, format = PixelFormat.RGBA8888, mipmapLevel = 1) {
        this._potientialWidth = width;
        this._potientialHeight = height;
        this._format = format;
        this._mipmapLevel = mipmapLevel;
        this._recreateTexture();
    }

    /**
     * Gets the underlying texture object.
     * @deprecated Use getGfxTexture() instead.
     */
    public getImpl () {
        return this._texture;
    }

    public getId () {
        return this._id;
    }

    /**
     * !#en
     * Pixel format of the texture.
     * !#zh 获取纹理的像素格式。
     * @return
     */
    public getPixelFormat () {
        // support only in WebGl rendering mode
        return this._format;
    }

    /**
     * !#en
     * Whether or not the texture has their Alpha premultiplied.
     * !#zh 检查纹理在上传 GPU 时预乘选项是否开启。
     * @return
     */
    public hasPremultipliedAlpha () {
        return this._premultiplyAlpha || false;
    }

    /**
     * !#en Anisotropy of the texture.
     * !#zh 获取纹理的各向异性。
     * @return
     */
    public getAnisotropy () {
        return this._anisotropy;
    }

    /**
     * !#en Sets the wrap s and wrap t options. <br/>
     * If the texture size is NPOT (non power of 2), then in can only use gl.CLAMP_TO_EDGE in gl.TEXTURE_WRAP_{S,T}.
     * !#zh 设置纹理包装模式。
     * 若纹理贴图尺寸是 NPOT（non power of 2），则只能使用 Texture2D.WrapMode.CLAMP_TO_EDGE。
     * @param wrapS
     * @param wrapT
     * @param wrapR
     */
    public setWrapMode (wrapS: WrapMode, wrapT: WrapMode, wrapR?: WrapMode) {
        this._wrapS = wrapS; this._samplerInfo[SamplerInfoIndex.addressU] = wrapS;
        this._wrapT = wrapT; this._samplerInfo[SamplerInfoIndex.addressV] = wrapT;
        if (wrapR === undefined) { return; }
        this._wrapR = wrapR; this._samplerInfo[SamplerInfoIndex.addressW] = wrapR;
    }

    /**
     * !#en Sets the minFilter and magFilter options
     * !#zh 设置纹理贴图缩小和放大过滤器算法选项。
     * @param minFilter
     * @param magFilter
     */
    public setFilters (minFilter: Filter, magFilter: Filter) {
        this._minFilter = minFilter; this._samplerInfo[SamplerInfoIndex.minFilter] = minFilter;
        this._magFilter = magFilter; this._samplerInfo[SamplerInfoIndex.magFilter] = magFilter;
    }

    /**
     * !#en Sets the mipFilter options
     * !#zh 设置纹理Mipmap过滤算法选项。
     * @param mipFilter
     */
    public setMipFilter (mipFilter: Filter) {
        this._mipFilter = mipFilter; this._samplerInfo[SamplerInfoIndex.mipFilter] = mipFilter;
        this._samplerInfo[SamplerInfoIndex.maxLOD] = mipFilter === Filter.NONE ? 0 : 1000; // WebGL2 on some platform need this
    }

    /**
     * !#en
     * Sets the flipY options
     * !#zh 设置贴图的纵向翻转选项。
     * @param flipY
     */
    public setFlipY (flipY: boolean) {
        this._flipY = flipY;
    }

    /**
     * !#en
     * Sets the premultiply alpha options
     * !#zh 设置贴图的预乘选项。
     * @param premultiply
     */
    public setPremultiplyAlpha (premultiply: boolean) {
        this._premultiplyAlpha = premultiply;
    }

    /**
     * !#en Sets the anisotropy of the texture
     * !#zh 设置贴图的各向异性。
     * @param anisotropy
     */
    public setAnisotropy (anisotropy: number) {
        this._anisotropy = anisotropy; this._samplerInfo[SamplerInfoIndex.maxAnisotropy] = anisotropy;
    }

    public destroy () {
        this._destroyTexture();

        return true;
    }

    public getGFXTexture () {
        return this._texture;
    }

    public getGFXTextureView () {
        return this._textureView;
    }

    public getGFXSamplerInfo () {
        return this._samplerInfo;
    }

    // SERIALIZATION

    /**
     * @return
     */
    public _serialize (): any {
        return this._minFilter + ',' + this._magFilter + ',' +
            this._wrapS + ',' + this._wrapT + ',' +
            (this._premultiplyAlpha ? 1 : 0) + ',' +
            this._mipFilter + ',' + this._anisotropy + ',' +
            (this._flipY ? 1 : 0);
    }

    /**
     *
     * @param data
     */
    public _deserialize (serializedData: any, handle: any) {
        const data = serializedData as string;
        const fields = data.split(',');
        fields.unshift('');
        if (fields.length >= 6) {
            // decode filters
            this.setFilters(parseInt(fields[1]), parseInt(fields[2]));
            // decode wraps
            this.setWrapMode(parseInt(fields[3]), parseInt(fields[4]));
            // decode premultiply alpha
            this._premultiplyAlpha = fields[5].charCodeAt(0) === CHAR_CODE_1;
        }
        if (fields.length >= 8) {
            this.setMipFilter(parseInt(fields[6]));
            this.setAnisotropy(parseInt(fields[7]));
        }
        if (fields.length >= 9) {
            this._flipY = fields[8].charCodeAt(0) === CHAR_CODE_1;
        }
    }

    /**
     * Updates mipmaps at level 0.
     */
    public updateImage () {
        this.updateMipmaps(0);
    }

    /**
     * Updates mipmaps at specified range of levels.
     * @param firstLevel The first level from which the sources update.
     * @description
     * If the range specified by [firstLevel, firstLevel + sources.length) exceeds
     * the actually range of mipmaps this texture contains, only overlaped mipmaps are updated.
     * Use this method if your mipmap data are modified.
     */
    public updateMipmaps (firstLevel: number = 0, count?: number) {

    }

    protected _getGlobalDevice (): GFXDevice | null {
        if (cc.director && cc.director.root) {
            return cc.director.root.device;
        } else {
            return null;
        }
    }

    protected _assignImage (image: ImageAsset, level: number, arrayIndex?: number) {
        const upload = () => {
            const data = image.data;
            if (!data) {
                return;
            }
            let source: HTMLCanvasElement | HTMLImageElement | ArrayBuffer;
            if (ArrayBuffer.isView(data)) {
                source = data.buffer;
            } else {
                source = data;
            }
            this._uploadData(source, level, arrayIndex);
        };
        if (image.loaded) {
            upload();
        } else {
            image.on('load', () => {
                upload();
            });
        }
    }

    protected _uploadData (
        source: HTMLCanvasElement | HTMLImageElement | ArrayBuffer, level: number, arrayIndex?: number) {
        if (!this._texture) {
            return;
        }

        if (level >= this._texture.mipLevel) {
            return;
        }

        const gfxDevice = this._getGlobalDevice();
        if (!gfxDevice) {
            return;
        }

        const region: GFXBufferTextureCopy = {
            buffOffset: 0,
            buffStride: 0,
            buffTexHeight: 0,
            texOffset: {
                x: 0,
                y: 0,
                z: 0,
            },
            texExtent: {
                width: this._texture.width >> level,
                height: this._texture.height >> level,
                depth: 1,
            },
            texSubres: {
                baseMipLevel: level,
                levelCount: 1,
                baseArrayLayer: arrayIndex || 0,
                layerCount: 1,
            },
        };

        if (source instanceof ArrayBuffer) {
            gfxDevice.copyBuffersToTexture([source], this._texture, [region]);
        } else {
            gfxDevice.copyTexImagesToTexture([source], this._texture, [region]);
        }
    }

    protected _getTextureCreateInfo (): IGFXTextureInfo {
        return {
            type: GFXTextureType.TEX2D,
            usage: GFXTextureUsageBit.SAMPLED | GFXTextureUsageBit.TRANSFER_DST,
            format: this._format,
            width: this._potientialWidth,
            height: this._potientialHeight,
            mipLevel: this._mipmapLevel,
            flags: this._mipFilter !== Filter.NONE ? GFXTextureFlagBit.GEN_MIPMAP : GFXTextureFlagBit.NONE,
        };
    }

    protected _getTextureViewCreateInfo (): IGFXTextureViewInfo {
        return {
            texture: this._texture!,
            type: GFXTextureViewType.TV2D,
            format: this._format,
        };
    }

    protected _recreateTexture () {
        this._destroyTexture();

        const gfxDevice = this._getGlobalDevice();
        if (!gfxDevice) {
            return;
        }

        this._texture = gfxDevice.createTexture(this._getTextureCreateInfo());

        this._textureView = gfxDevice.createTextureView(this._getTextureViewCreateInfo());
    }

    private _destroyTexture () {
        if (this._textureView) {
            this._textureView.destroy();
            this._textureView = null;
        }

        if (this._texture) {
            this._texture.destroy();
            this._texture = null;
        }
    }
}

cc.TextureBase = TextureBase;
