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
import {ccclass, property} from '../core/data/class-decorator';
import IDGenerator from '../core/utils/id-generator';
import { GFXDevice } from '../gfx/device';
import { GFXTextureView } from '../gfx/texture-view';
import { SamplerInfoIndex, genSamplerHash } from '../renderer/core/sampler-lib';
import { Asset } from './asset';
import { Filter, PixelFormat, WrapMode } from './asset-enum';
import { GFXTexture } from '../gfx/texture';

const CHAR_CODE_1 = 49;    // '1'

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

    public static PixelFormat = PixelFormat;

    public static WrapMode = WrapMode;

    public static Filter = Filter;

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
    protected _mipmapLevel: number = 1;

    private _potientialWidth: number = 0;
    private _potientialHeight: number = 0;
    private _id: string;
    private _samplerInfo: Array<number | undefined> = [];
    private _samplerHash: number = 0;

    protected constructor (flipY: boolean = false) {
        super();

        this._flipY = flipY;

        // Id for generate hash in material
        this._id = idGenerator.getNewId();

        this.loaded = false;
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
     * 返回是否开启了预乘透明通道功能。
     * @returns 此贴图是否开启了预乘透明通道功能。
     */
    public hasPremultipliedAlpha () {
        return this._premultiplyAlpha || false;
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
    }

    /**
     * 设置此贴图的 mip 过滤算法。
     * @param mipFilter mip 过滤算法。
     */
    public setMipFilter (mipFilter: Filter) {
        this._mipFilter = mipFilter;
        this._samplerInfo[SamplerInfoIndex.mipFilter] = mipFilter;
        this._samplerInfo[SamplerInfoIndex.maxLOD] = mipFilter === Filter.NONE ? 0 : 1000; // WebGL2 on some platform need this
        this._samplerHash = genSamplerHash(this._samplerInfo);
    }

    /**
     * 设置渲染时是否运行将此贴图进行翻转。
     * @param flipY 翻转则为 `true`，否则为 `false`。
     */
    public setFlipY (flipY: boolean) {
        this._flipY = flipY;
    }

    /**
     * 设置此贴图是否预乘透明通道。
     * @param premultiply
     */
    public setPremultiplyAlpha (premultiply: boolean) {
        this._premultiplyAlpha = premultiply;
    }

    /**
     * 设置此贴图的各向异性。
     * @param anisotropy 各向异性。
     */
    public setAnisotropy (anisotropy: number) {
        this._anisotropy = anisotropy;
        this._samplerInfo[SamplerInfoIndex.maxAnisotropy] = anisotropy;
        this._samplerHash = genSamplerHash(this._samplerInfo);
    }

    /**
     * 销毁此贴图，并释放占有的所有 GPU 资源。
     */
    public destroy () {
        return super.destroy();
    }

    /**
     * 获取此贴图底层的 GFX 贴图视图对象。
     */
    public getGFXTextureView (): GFXTextureView | null {
        return null;
    }

    /**
     * 获取此贴图内部使用的 GFX 采样器信息。
     * @private
     */
    public getSamplerHash () {
        return this._samplerHash;
    }

    // SERIALIZATION

    /**
     * @return
     */
    public _serialize (exporting?: any): any {
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

    protected _getGFXDevice (): GFXDevice | null {
        return cc.director.root && cc.director.root.device;
    }

    protected _getGFXFormat () {
        return this._format;
    }

    protected _setGFXFormat (format?: PixelFormat) {
        this._format = format === undefined ? PixelFormat.RGBA8888 : format;
    }
}

cc.TextureBase = TextureBase;
