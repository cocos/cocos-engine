/*
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

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

/**
 * @packageDocumentation
 * @module asset
 */

// @ts-check
import { EDITOR, TEST } from 'internal:constants';
import { ccclass, serializable } from 'cc.decorator';
import IDGenerator from '../utils/id-generator';
import { Asset } from './asset';
import { Filter, PixelFormat, WrapMode } from './asset-enum';
import { Sampler, Texture, Device, Format, SamplerInfo, Address, Filter as GFXFilter } from '../gfx';
import { legacyCC } from '../global-exports';
import { errorID } from '../platform/debug';
import { murmurhash2_32_gc } from '../utils/murmurhash2_gc';
import { ccenum } from '../value-types/enum';

ccenum(Format);

const idGenerator = new IDGenerator('Tex');
/**
 * @en The base texture class, it defines features shared by all textures.
 * @zh 贴图资源基类。它定义了所有贴图共用的概念。
 */
@ccclass('cc.TextureBase')
export class TextureBase extends Asset {
    /**
     * @en Whether the pixel data is compressed.
     * @zh 此贴图是否为压缩的像素格式。
     */
    public get isCompressed (): boolean {
        return (this._format >= PixelFormat.RGB_ETC1 && this._format <= PixelFormat.RGBA_ASTC_12x12)
        || (this._format >= PixelFormat.RGB_A_PVRTC_2BPPV1 && this._format <= PixelFormat.RGBA_ETC1);
    }

    /**
     * @en Pixel width of the texture
     * @zh 此贴图的像素宽度。
     */
    public get width (): number {
        return this._width;
    }

    /**
     * @en Pixel height of the texture
     * @zh 此贴图的像素高度。
     */
    public get height (): number {
        return this._height;
    }

    /**
     * @en The pixel format enum.
     * @zh 像素格式枚举类型
     */
    public static PixelFormat = PixelFormat;

    /**
     * @en The wrap mode enum.
     * @zh 环绕模式枚举类型
     */
    public static WrapMode = WrapMode;

    /**
     * @en The texture filter mode enum
     * @zh 纹理过滤模式枚举类型
     */
    public static Filter = Filter;

    @serializable
    protected _format = PixelFormat.RGBA8888;

    @serializable
    protected _minFilter = Filter.LINEAR;

    @serializable
    protected _magFilter = Filter.LINEAR;

    @serializable
    protected _mipFilter = Filter.NONE;

    @serializable
    protected _wrapS = WrapMode.REPEAT;

    @serializable
    protected _wrapT = WrapMode.REPEAT;

    @serializable
    protected _wrapR = WrapMode.REPEAT;

    @serializable
    protected _anisotropy = 0;

    protected _width = 1;
    protected _height = 1;

    private _id: string;
    private _samplerInfo = new SamplerInfo();
    private _gfxSampler: Sampler | null = null;
    private _gfxDevice: Device | null = null;

    private _textureHash = 0;

    constructor () {
        super();

        // Id for generate hash in material
        this._id = idGenerator.getNewId();
        this._gfxDevice = this._getGFXDevice();
        this._textureHash = murmurhash2_32_gc(this._id, 666);
    }

    /**
     * @en Gets the id of the texture
     * @zh 获取标识符。
     * @returns The id
     */
    public getId () {
        return this._id;
    }

    /**
     * @en Gets the pixel format
     * @zh 获取像素格式。
     * @returns The pixel format
     */
    public getPixelFormat () {
        return this._format;
    }

    /**
     * @en Gets the anisotropy
     * @zh 获取各向异性。
     * @returns The anisotropy
     */
    public getAnisotropy () {
        return this._anisotropy;
    }

    /**
     * @en Sets the wrap mode of the texture.
     * Be noted, if the size of the texture is not power of two, only [[WrapMode.CLAMP_TO_EDGE]] is allowed.
     * @zh 设置此贴图的缠绕模式。
     * 注意，若贴图尺寸不是 2 的整数幂，缠绕模式仅允许 [[WrapMode.CLAMP_TO_EDGE]]。
     * @param wrapS S(U) coordinate wrap mode
     * @param wrapT T(V) coordinate wrap mode
     * @param wrapR R(W) coordinate wrap mode
     */
    public setWrapMode (wrapS: WrapMode, wrapT: WrapMode, wrapR?: WrapMode) {
        if (wrapR === undefined) wrapR = wrapS; // wrap modes should be as consistent as possible for performance

        this._wrapS = wrapS;
        this._samplerInfo.addressU = wrapS as unknown as Address;
        this._wrapT = wrapT;
        this._samplerInfo.addressV = wrapT as unknown as Address;
        this._wrapR = wrapR;
        this._samplerInfo.addressW = wrapR as unknown as Address;

        if (this._gfxDevice) {
            this._gfxSampler = this._gfxDevice.getSampler(this._samplerInfo);
        }
    }

    /**
     * @en Sets the texture's filter mode
     * @zh 设置此贴图的过滤算法。
     * @param minFilter Filter mode for scale down
     * @param magFilter Filter mode for scale up
     */
    public setFilters (minFilter: Filter, magFilter: Filter) {
        this._minFilter = minFilter;
        this._samplerInfo.minFilter = minFilter as unknown as GFXFilter;
        this._magFilter = magFilter;
        this._samplerInfo.magFilter = magFilter as unknown as GFXFilter;

        if (this._gfxDevice) {
            this._gfxSampler = this._gfxDevice.getSampler(this._samplerInfo);
        }
    }

    /**
     * @en Sets the texture's mip filter
     * @zh 设置此贴图的缩小过滤算法。
     * @param mipFilter Filter mode for scale down
     */
    public setMipFilter (mipFilter: Filter) {
        this._mipFilter = mipFilter;
        this._samplerInfo.mipFilter = mipFilter as unknown as GFXFilter;

        if (this._gfxDevice) {
            this._gfxSampler = this._gfxDevice.getSampler(this._samplerInfo);
        }
    }

    /**
     * @en Sets the texture's anisotropy
     * @zh 设置此贴图的各向异性。
     * @param anisotropy
     */
    public setAnisotropy (anisotropy: number) {
        this._anisotropy = anisotropy;
        this._samplerInfo.maxAnisotropy = anisotropy;

        if (this._gfxDevice) {
            this._gfxSampler = this._gfxDevice.getSampler(this._samplerInfo);
        }
    }

    /**
     * @en Destroy the current texture, clear up the related GPU resources.
     * @zh 销毁此贴图，并释放占用的 GPU 资源。
     */
    public destroy () {
        const destroyed = super.destroy();
        if (destroyed && legacyCC.director.root?.batcher2D) {
            legacyCC.director.root.batcher2D._releaseDescriptorSetCache(this._textureHash);
        }
        return destroyed;
    }

    /**
     * @en Gets the texture hash.
     * @zh 获取此贴图的哈希值。
     */
    public getHash () {
        return this._textureHash;
    }

    /**
     * @en Gets the GFX Texture resource
     * @zh 获取此贴图底层的 GFX 贴图对象。
     */
    public getGFXTexture (): Texture | null {
        return null;
    }

    /**
     * @en Gets the internal GFX sampler hash.
     * @zh 获取此贴图内部使用的 GFX 采样器信息。
     * @private
     */
    public getSamplerInfo (): Readonly<SamplerInfo> {
        return this._samplerInfo;
    }

    /**
     * @en Gets the sampler resource for the texture
     * @zh 获取此贴图底层的 GFX 采样信息。
     */
    public getGFXSampler () {
        if (!this._gfxSampler) {
            if (this._gfxDevice) {
                this._gfxSampler = this._gfxDevice.getSampler(this._samplerInfo);
            } else {
                errorID(9302);
            }
        }
        return this._gfxSampler!;
    }

    // SERIALIZATION

    /**
     * @private_cc
     */
    public _serialize (ctxForExporting: any): any {
        if (EDITOR || TEST) {
            return `${this._minFilter},${this._magFilter},${
                this._wrapS},${this._wrapT},${
                this._mipFilter},${this._anisotropy}`;
        }
        return '';
    }

    /**
     * @private_cc
     */
    public _deserialize (serializedData: any, handle: any) {
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
    }

    protected _getGFXDevice (): Device | null {
        if (legacyCC.director.root) {
            return legacyCC.director.root.device as Device;
        }
        return null;
    }

    protected _getGFXFormat () {
        return this._getGFXPixelFormat(this._format);
    }

    protected _setGFXFormat (format?: PixelFormat) {
        this._format = format === undefined ? PixelFormat.RGBA8888 : format;
    }

    protected _getGFXPixelFormat (format: PixelFormat) {
        if (format === PixelFormat.RGBA_ETC1) {
            format = PixelFormat.RGB_ETC1;
        } else if (format === PixelFormat.RGB_A_PVRTC_4BPPV1) {
            format = PixelFormat.RGB_PVRTC_4BPPV1;
        } else if (format === PixelFormat.RGB_A_PVRTC_2BPPV1) {
            format = PixelFormat.RGB_PVRTC_2BPPV1;
        }
        return format as unknown as Format;
    }
}

legacyCC.TextureBase = TextureBase;
