/*
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
*/

/**
 * @category asset
 */

// @ts-check
import {ccclass, property} from '../data/class-decorator';
import { GFXDevice } from '../gfx/device';
import { GFXTexture } from '../gfx/texture';
import { genSamplerHash, SamplerInfoIndex, samplerLib } from '../renderer/core/sampler-lib';
import IDGenerator from '../utils/id-generator';
import { Asset } from './asset';
import { Filter, PixelFormat, WrapMode } from './asset-enum';
import { GFXSampler } from '../gfx';
import { legacyCC } from '../global-exports';
import { errorID } from '../platform/debug';

const idGenerator = new IDGenerator('Tex');
/**
 * 贴图资源基类。它定义了所有贴图共用的概念。
 */
@ccclass('cc.TextureBase')
export class TextureBase extends Asset {
    /**
     * 此贴图是否为压缩的像素格式。
     */
    public get isCompressed (): boolean {
        return this._format >= PixelFormat.RGB_ETC1 && this._format <= PixelFormat.RGBA_PVRTC_4BPPV1;
    }

    /**
     * 此贴图的像素宽度。
     */
    public get width (): number {
        return this._width;
    }

    /**
     * 此贴图的像素高度。
     */
    public get height (): number {
        return this._height;
    }

    public static PixelFormat = PixelFormat;

    public static WrapMode = WrapMode;

    public static Filter = Filter;

    @property
    protected _format: number = PixelFormat.RGBA8888;

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
    protected _anisotropy = 8;

    protected _width: number = 1;
    protected _height: number = 1;

    private _id: string;
    private _samplerInfo: (number | undefined)[] = [];
    private _samplerHash: number = 0;
    private _gfxSampler: GFXSampler | null = null;
    private _gfxDevice: GFXDevice | null = null;

    constructor () {
        super();

        // Id for generate hash in material
        this._id = idGenerator.getNewId();

        this.loaded = false;
        this._gfxDevice = this._getGFXDevice();
    }

    /**
     * 获取标识符。
     * @returns 此贴图的标识符。
     */
    public getId () {
        return this._id;
    }

    /**
     * 获取像素格式。
     * @returns 此贴图的像素格式。
     */
    public getPixelFormat () {
        return this._format;
    }

    /**
     * 获取各向异性。
     * @returns 此贴图的各向异性。
     */
    public getAnisotropy () {
        return this._anisotropy;
    }

    /**
     * 设置此贴图的缠绕模式。
     * 注意，若贴图尺寸不是 2 的整数幂，缠绕模式仅允许 `WrapMode.CLAMP_TO_EDGE`。
     * @param wrapS S(U) 坐标的采样模式。
     * @param wrapT T(V) 坐标的采样模式。
     * @param wrapR R(W) 坐标的采样模式。
     */
    public setWrapMode (wrapS: WrapMode, wrapT: WrapMode, wrapR?: WrapMode) {
        this._wrapS = wrapS;
        this._samplerInfo[SamplerInfoIndex.addressU] = wrapS;
        this._wrapT = wrapT;
        this._samplerInfo[SamplerInfoIndex.addressV] = wrapT;
        if (wrapR !== undefined) {
            this._wrapR = wrapR;
            this._samplerInfo[SamplerInfoIndex.addressW] = wrapR;
        }

        this._samplerHash = genSamplerHash(this._samplerInfo);
        // for editor assetDB
        if (this._gfxDevice) {
            this._gfxSampler = samplerLib.getSampler(this._gfxDevice, this._samplerHash);
        }
    }

    /**
     * 设置此贴图的过滤算法。
     * @param minFilter 缩小过滤算法。
     * @param magFilter 放大过滤算法。
     */
    public setFilters (minFilter: Filter, magFilter: Filter) {
        this._minFilter = minFilter;
        this._samplerInfo[SamplerInfoIndex.minFilter] = minFilter;
        this._magFilter = magFilter;
        this._samplerInfo[SamplerInfoIndex.magFilter] = magFilter;
        this._samplerHash = genSamplerHash(this._samplerInfo);
        if (this._gfxDevice) {
            this._gfxSampler = samplerLib.getSampler(this._gfxDevice, this._samplerHash);
        }
    }

    /**
     * 设置此贴图的 mip 过滤算法。
     * @param mipFilter mip 过滤算法。
     */
    public setMipFilter (mipFilter: Filter) {
        this._mipFilter = mipFilter;
        this._samplerInfo[SamplerInfoIndex.mipFilter] = mipFilter;
        this._samplerInfo[SamplerInfoIndex.maxLOD] = mipFilter === Filter.NONE ? 0 : 15; // WebGL2 on some platform need this
        this._samplerHash = genSamplerHash(this._samplerInfo);
        if (this._gfxDevice) {
            this._gfxSampler = samplerLib.getSampler(this._gfxDevice, this._samplerHash);
        }
    }

    /**
     * 设置此贴图的各向异性。
     * @param anisotropy 各向异性。
     */
    public setAnisotropy (anisotropy: number) {
        this._anisotropy = anisotropy;
        this._samplerInfo[SamplerInfoIndex.maxAnisotropy] = anisotropy;
        this._samplerHash = genSamplerHash(this._samplerInfo);
        if (this._gfxDevice) {
            this._gfxSampler = samplerLib.getSampler(this._gfxDevice, this._samplerHash);
        }
    }

    /**
     * 销毁此贴图，并释放占有的所有 GPU 资源。
     */
    public destroy () {
        return super.destroy();
    }

    /**
     * 获取此贴图底层的 GFX 纹理对象。
     */
    public getGFXTexture (): GFXTexture | null {
        return null;
    }

    /**
     * 获取此贴图内部使用的 GFX 采样器信息。
     * @private
     */
    public getSamplerHash () {
        return this._samplerHash;
    }

    /**
     * 获取此贴图底层的 GFX 采样信息。
     */
    public getGFXSampler () {
        if (!this._gfxSampler) {
            if (this._gfxDevice) {
                this._gfxSampler = samplerLib.getSampler(this._gfxDevice, this._samplerHash);
            } else {
                errorID(9302);
            }
        }
        return this._gfxSampler!;
    }

    // SERIALIZATION

    /**
     * @return
     */
    public _serialize (exporting?: any): any {
        return this._minFilter + ',' + this._magFilter + ',' +
            this._wrapS + ',' + this._wrapT + ',' +
            this._mipFilter + ',' + this._anisotropy;
    }

    /**
     *
     * @param data
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

    protected _getGFXDevice (): GFXDevice | null {
        return legacyCC.director.root && legacyCC.director.root.device;
    }

    protected _getGFXFormat () {
        return this._getGFXPixelFormat(this._format);
    }

    protected _setGFXFormat (format?: PixelFormat) {
        this._format = format === undefined ? PixelFormat.RGBA8888 : format;
    }

    protected _getGFXPixelFormat (format) {
        if (format === PixelFormat.RGBA_ETC1) {
            format = PixelFormat.RGB_ETC1;
        }
        else if (format === PixelFormat.RGB_A_PVRTC_4BPPV1) {
            format = PixelFormat.RGB_PVRTC_4BPPV1;
        }
        else if (format === PixelFormat.RGB_A_PVRTC_2BPPV1) {
            format = PixelFormat.RGB_PVRTC_2BPPV1;
        }
        return format;
    }
}

legacyCC.TextureBase = TextureBase;
