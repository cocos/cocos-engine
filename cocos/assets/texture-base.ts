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
import EventTarget from '../core/event/event-target';
import IDGenerator from '../core/utils/id-generator';
import {addon} from '../core/utils/js';
import { ccenum } from '../core/value-types/enum';
import { GFXAddress, GFXBufferTextureCopy, GFXFilter, GFXFormat,
    GFXTextureFlagBit, GFXTextureType, GFXTextureUsageBit, GFXTextureViewType } from '../gfx/define';
import { GFXDevice } from '../gfx/device';
import { GFXSampler } from '../gfx/sampler';
import { GFXTexture, IGFXTextureInfo } from '../gfx/texture';
import { GFXTextureView, IGFXTextureViewInfo } from '../gfx/texture-view';
import { Asset } from './asset';
import { ImageAsset } from './image-asset';

const CHAR_CODE_1 = 49;    // '1'

const idGenerator = new IDGenerator('Tex');

/**
 * The texture pixel format, default value is RGBA8888,
 * you should note that textures loaded by normal image files (png, jpg) can only support RGBA8888 format,
 * other formats are supported by compressed file types or raw data.
 * @enum {number}
 */
export enum PixelFormat {
    /**
     * 16-bit texture without Alpha channel
     */
    RGB565 = GFXFormat.R5G6B5,
    /**
     * 16-bit textures: RGB5A1
     */
    RGB5A1 = GFXFormat.RGB5A1,
    /**
     * 16-bit textures: RGBA4444
     */
    RGBA4444 = GFXFormat.RGBA4,
    /**
     * 24-bit texture: RGB888
     */
    RGB888 = GFXFormat.RGB8,
    /**
     * 32-bit texture: RGBA8888
     */
    RGBA8888 = GFXFormat.RGBA8,
    /**
     * 32-bit float texture: RGBA32F
     */
    RGBA32F = GFXFormat.RGBA32F,
    /**
     * 8-bit textures used as masks
     */
    A8 = GFXFormat.A8,
    /**
     * 8-bit intensity texture
     */
    I8 = GFXFormat.L8,
    /**
     * 16-bit textures used as masks
     */
    AI8 = GFXFormat.LA8,
    /**
     * rgb 2 bpp pvrtc
     */
    RGB_PVRTC_2BPPV1 = GFXFormat.PVRTC_RGB2,
    /**
     * rgba 2 bpp pvrtc
     */
    RGBA_PVRTC_2BPPV1 = GFXFormat.PVRTC_RGBA2,
    /**
     * rgb 4 bpp pvrtc
     */
    RGB_PVRTC_4BPPV1 = GFXFormat.PVRTC_RGB4,
    /**
     * rgba 4 bpp pvrtc
     */
    RGBA_PVRTC_4BPPV1 = GFXFormat.PVRTC_RGBA4,
}
ccenum(PixelFormat);

function toGfxFormat (pixelFormat: PixelFormat) {
    return pixelFormat as unknown as GFXFormat;
}

/**
 * The texture wrap mode.
 * @enum {number}
 */
export enum WrapMode {
    /**
     * Specifies that the repeat warp mode will be used.
     */
    REPEAT = GFXAddress.WRAP,
    /**
     * Specifies that the clamp to edge warp mode will be used.
     */
    CLAMP_TO_EDGE = GFXAddress.CLAMP,
    /**
     * Specifies that the mirrored repeat warp mode will be used.
     */
    MIRRORED_REPEAT = GFXAddress.MIRROR,
    /**
     * Specifies that the  clamp to border wrap mode will be used.
     */
    CLAMP_TO_BORDER = GFXAddress.BORDER,
}
ccenum(WrapMode);

function toGfxAddressMode (wrapMode: WrapMode) {
    return wrapMode as unknown as GFXAddress;
}

/**
 * The texture filter mode
 * @enum {number}
 */
export enum Filter {
    /**
     * Specifies linear filtering.
     */
    LINEAR = GFXFilter.LINEAR,
    /**
     * Specifies nearest filtering.
     */
    NEAREST = GFXFilter.POINT,
}
ccenum(Filter);

function toGfxFilterMode (filter: Filter) {
    return filter as unknown as GFXFilter;
}

@ccclass('cc.TextureBase')
export class TextureBase extends Asset {

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
        return texture._format >= PixelFormat.RGB_PVRTC_2BPPV1 && texture._format <= PixelFormat.RGBA_PVRTC_4BPPV1;
    }

    protected _texture: GFXTexture | null = null;

    protected _textureView: GFXTextureView | null = null;

    private _potientialWidth: number = 0;

    private _potientialHeight: number = 0;

    private _mipmapLevel: number = 1;

    @property
    private _genMipmap = false;

    @property
    private _format: PixelFormat = PixelFormat.RGBA8888;

    @property
    private _premultiplyAlpha = false;

    @property
    private _flipY = false;

    @property
    private _minFilter = Filter.LINEAR;

    @property
    private _magFilter = Filter.LINEAR;

    @property
    private _mipFilter = Filter.LINEAR;

    @property
    private _wrapS: WrapMode = WrapMode.CLAMP_TO_EDGE;

    @property
    private _wrapT: WrapMode = WrapMode.CLAMP_TO_EDGE;

    @property
    private _anisotropy = 1;

    private _sampler: GFXSampler | null = null;

    private _id: string;

    protected constructor (flipY: boolean = false) {
        super();
        EventTarget.call(this);

        this._flipY = flipY;

        // Id for generate hash in material
        this._id = idGenerator.getNewId();

        /**
         * !#en
         * Whether the texture is loaded or not
         * !#zh
         * 贴图是否已经成功加载
         * @property loaded
         * @type {Boolean}
         */
        // @ts-ignore
        this.loaded = false;
    }

    public create (width: number, height: number, format = PixelFormat.RGBA8888, mipmapLevel = 1) {
        this._potientialWidth = width;
        this._potientialHeight = height;
        this._format = format;
        this._mipmapLevel = 1;
        this._updateSampler();
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
     * !#en
     * Whether or not to generate mipmap.
     * !#zh 检查纹理在上传 GPU 时是否生成 mipmap。
     * @return
     */
    public genMipmap () {
        return this._genMipmap || false;
    }

    /**
     * !#en Sets the wrap s and wrap t options. <br/>
     * If the texture size is NPOT (non power of 2), then in can only use gl.CLAMP_TO_EDGE in gl.TEXTURE_WRAP_{S,T}.
     * !#zh 设置纹理包装模式。
     * 若纹理贴图尺寸是 NPOT（non power of 2），则只能使用 Texture2D.WrapMode.CLAMP_TO_EDGE。
     * @param wrapS
     * @param wrapT
     */
    public setWrapMode (wrapS: WrapMode, wrapT: WrapMode) {
        if (this._wrapS !== wrapS || this._wrapT !== wrapT) {
            this._wrapS = wrapS;
            this._wrapT = wrapT;
            this._updateSampler();
        }
    }

    /**
     * !#en Sets the minFilter and magFilter options
     * !#zh 设置纹理贴图缩小和放大过滤器算法选项。
     * @param minFilter
     * @param magFilter
     */
    public setFilters (minFilter: Filter, magFilter: Filter) {
        if (this._minFilter !== minFilter || this._magFilter !== magFilter) {
            this._minFilter = minFilter;
            this._magFilter = magFilter;
            this._updateSampler();
        }
    }

    /**
     * !#en Sets the mipFilter options
     * !#zh 设置纹理Mipmap过滤算法选项。
     * @param mipFilter
     */
    public setMipFilter (mipFilter: Filter) {
        if (this._mipFilter !== mipFilter) {
            this._mipFilter = mipFilter;
            this._updateSampler();
        }
    }

    /**
     * !#en
     * Sets the flipY options
     * !#zh 设置贴图的纵向翻转选项。
     * @param flipY
     */
    public setFlipY (flipY: boolean) {
        if (this._flipY !== flipY) {
            this._flipY = flipY;
            this._updateSampler();
        }
    }

    /**
     * !#en
     * Sets the premultiply alpha options
     * !#zh 设置贴图的预乘选项。
     * @param premultiply
     */
    public setPremultiplyAlpha (premultiply: boolean) {
        if (this._premultiplyAlpha !== premultiply) {
            this._premultiplyAlpha = premultiply;
            this._updateSampler();
        }
    }

    /**
     * !#en Sets the anisotropy of the texture
     * !#zh 设置贴图的各向异性。
     * @param anisotropy
     */
    public setAnisotropy (anisotropy: number) {
        if (this._anisotropy !== anisotropy) {
            this._anisotropy = anisotropy;
            this._updateSampler();
        }
    }

    /**
     * !#en
     * Sets whether generate mipmaps for the texture
     * !#zh 是否为纹理设置生成 mipmaps。
     * @param mipmap
     */
    public setGenMipmap (mipmap: boolean) {
        if (this._genMipmap !== mipmap) {
            this._genMipmap = mipmap;
            this._updateSampler();
        }
    }

    public destroy () {
        this._destroyTexture();

        if (this._sampler) {
            this._sampler.destroy();
        }

        return true;
    }

    public getGFXTexture () {
        return this._texture;
    }

    public getGFXTextureView () {
        return this._textureView;
    }

    public getGFXSampler () {
        return this._sampler;
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
            (this._flipY ? 1 : 0) + ',' +
            (this._genMipmap ? 1 : 0);
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
            this._minFilter = parseInt(fields[1], undefined);
            this._magFilter = parseInt(fields[2], undefined);
            // decode wraps
            this._wrapS = parseInt(fields[3], undefined);
            this._wrapT = parseInt(fields[4], undefined);
            // decode premultiply alpha
            this._premultiplyAlpha = fields[5].charCodeAt(0) === CHAR_CODE_1;
        }
        if (fields.length >= 8) {
            this._mipFilter = parseInt(fields[6], undefined);
            this._anisotropy = parseInt(fields[7], undefined);
        }
        if (fields.length >= 10) {
            this._flipY = fields[8].charCodeAt(0) === CHAR_CODE_1;
            this._genMipmap = fields[9].charCodeAt(0) === CHAR_CODE_1;
        }
    }

    public onLoaded () {
        this._updateSampler();
        this._recreateTexture();
    }

    protected _getGlobalDevice (): GFXDevice | null {
        // @ts-ignore
        return cc.director.root.device;
    }

    protected _getGfxFormat () {
        return toGfxFormat(this._format);
    }

    protected _assignImage (image: ImageAsset, level: number, arrayIndex?: number) {
        const upload = () => { this._uploadImage(image, level, arrayIndex); };
        // @ts-ignore
        if (image.loaded) {
            upload();
        } else {
            // @ts-ignore
            image.addEventListener('load', () => {
                upload();
            });
        }
    }

    protected _uploadImage (image: ImageAsset, level: number, arrayIndex?: number) {
        if (!this._texture) {
            return;
        }

        if (level >= this._texture.mipLevel) {
            return;
        }

        const data = image.data;
        if (!data) {
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
                width: this._texture.width,
                height: this._texture.height,
                depth: 1,
            },
            texSubres: {
                baseMipLevel: level,
                levelCount: 1,
                baseArrayLayer: arrayIndex || 0,
                layerCount: 1,
            },
        };

        if (data instanceof HTMLElement) {
            gfxDevice.copyImageSourceToTexture(data, this._texture, [region]);
        } else {
            gfxDevice.copyBufferToTexture(data.buffer, this._texture, [region]);
        }
    }

    protected _getTextureCreateInfo (): IGFXTextureInfo {
        return {
            type: GFXTextureType.TEX2D,
            usage: GFXTextureUsageBit.SAMPLED | GFXTextureUsageBit.TRANSFER_DST,
            format: toGfxFormat(this._format),
            width: this._potientialWidth,
            height: this._potientialHeight,
            mipLevel: this._mipmapLevel,
            flags: this._genMipmap ? GFXTextureFlagBit.GEN_MIPMAP : GFXTextureFlagBit.NONE,
        };
    }

    protected _getTextureViewCreateInfo (): IGFXTextureViewInfo {
        return {
            texture: this._texture!,
            type: GFXTextureViewType.TV2D,
            format: this._getGfxFormat(),
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

    private _updateSampler () {
        if (this._sampler) {
            this._sampler.destroy();
        }

        const gfxDevice = this._getGlobalDevice();
        if (!gfxDevice) {
            return;
        }

        this._sampler = gfxDevice.createSampler({
            name: `Sampler of ${this.name}`,
            minFilter: toGfxFilterMode(this._minFilter),
            magFilter: toGfxFilterMode(this._magFilter),
            addressU: toGfxAddressMode(this._wrapS),
            addressV: toGfxAddressMode(this._wrapT),
            maxAnisotropy: this._anisotropy,
        });
    }
}

cc.TextureBase = TextureBase;

/**
 * !#zh
 * 当该资源加载成功后触发该事件
 * !#en
 * This event is emitted when the asset is loaded
 *
 * @event load
 */

addon(TextureBase.prototype, EventTarget.prototype);
