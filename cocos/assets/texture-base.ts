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
import IDGenerator from '../core/utils/id-generator';
import { GFXBufferTextureCopy, GFXTextureFlagBit, GFXTextureType, GFXTextureUsageBit, GFXTextureViewType } from '../gfx/define';
import { GFXDevice } from '../gfx/device';
import { GFXTexture, IGFXTextureInfo } from '../gfx/texture';
import { GFXTextureView, IGFXTextureViewInfo } from '../gfx/texture-view';
import { SamplerInfoIndex } from '../renderer/core/sampler-lib';
import { Asset } from './asset';
import { Filter, PixelFormat, WrapMode } from './asset-enum';
import { ImageAsset } from './image-asset';
import { postLoadImage } from './texture-util';

const CHAR_CODE_1 = 49;    // '1'

const idGenerator = new IDGenerator('Tex');

const _regions: GFXBufferTextureCopy[] = [{
    buffOffset: 0,
    buffStride: 0,
    buffTexHeight: 0,
    texOffset: {
        x: 0,
        y: 0,
        z: 0,
    },
    texExtent: {
        width: 1,
        height: 1,
        depth: 1,
    },
    texSubres: {
        baseMipLevel: 1,
        levelCount: 1,
        baseArrayLayer: 0,
        layerCount: 1,
    },
}];

/**
 * 贴图资源基类。它定义了所有贴图共用的概念。
 */
@ccclass('cc.TextureBase')
export class TextureBase extends Asset {
    /**
     * 此贴图的像素宽度。
     * 对于二维贴图来说，贴图的像素宽度等于它 0 级 Mipmap 的宽度；
     * 对于二维贴图来说，贴图的像素宽度等于它 0 级 Mipmap 任何面的宽度；
     */
    public get width (): number {
        return this._texture ? this._texture.width : 0;
    }

    /**
     * 此贴图的像素高度。
     * 对于二维贴图来说，贴图的像素高度等于它 0 级 Mipmap 的高度；
     * 对于二维贴图来说，贴图的像素高度等于它 0 级 Mipmap 任何面的高度；
     */
    public get height (): number {
        return this._texture ? this._texture.height : 0;
    }

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

    /**
     * 将当且贴图重置为指定尺寸、像素格式以及指定 mipmap 层级的贴图。重置后，贴图的像素数据将变为未定义。
     * @param width 像素宽度。
     * @param height 像素高度。
     * @param format 像素格式。
     * @param mipmapLevel mipmap 层级。
     */
    public create (width: number, height: number, format = PixelFormat.RGBA8888, mipmapLevel = 1) {
        this._potientialWidth = width;
        this._potientialHeight = height;
        this._format = format;
        this._mipmapLevel = mipmapLevel;
        this._recreateTexture();
    }

    /**
     * 获取底层贴图对象。
     * @returns 此贴图的底层贴图对象。
     * @deprecated 请转用 `getGfxTexture()`。
     */
    public getImpl () {
        return this._texture;
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
        // support only in WebGl rendering mode
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
        this._wrapS = wrapS; this._samplerInfo[SamplerInfoIndex.addressU] = wrapS;
        this._wrapT = wrapT; this._samplerInfo[SamplerInfoIndex.addressV] = wrapT;
        if (wrapR === undefined) { return; }
        this._wrapR = wrapR; this._samplerInfo[SamplerInfoIndex.addressW] = wrapR;
    }

    /**
     * 设置此贴图的过滤算法。
     * @param minFilter 缩小过滤算法。
     * @param magFilter 放大过滤算法。
     */
    public setFilters (minFilter: Filter, magFilter: Filter) {
        this._minFilter = minFilter; this._samplerInfo[SamplerInfoIndex.minFilter] = minFilter;
        this._magFilter = magFilter; this._samplerInfo[SamplerInfoIndex.magFilter] = magFilter;
    }

    /**
     * 设置此贴图的 mip 过滤算法。
     * @param mipFilter mip 过滤算法。
     */
    public setMipFilter (mipFilter: Filter) {
        this._mipFilter = mipFilter; this._samplerInfo[SamplerInfoIndex.mipFilter] = mipFilter;
        this._samplerInfo[SamplerInfoIndex.maxLOD] = mipFilter === Filter.NONE ? 0 : 1000; // WebGL2 on some platform need this
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
        this._anisotropy = anisotropy; this._samplerInfo[SamplerInfoIndex.maxAnisotropy] = anisotropy;
    }

    /**
     * 销毁此贴图，并释放占有的所有 GPU 资源。
     */
    public destroy () {
        this._destroyTexture();
        return super.destroy();
    }

    /**
     * 获取此贴图底层的 GFX 贴图对象。
     */
    public getGFXTexture () {
        return this._texture;
    }

    /**
     * 获取此贴图底层的 GFX 贴图视图对象。
     */
    public getGFXTextureView () {
        return this._textureView;
    }

    /**
     * 获取此贴图内部使用的 GFX 采样器信息。
     * @private
     */
    public getGFXSamplerInfo () {
        return this._samplerInfo;
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

    /**
     * 更新 0 级 Mipmap。
     */
    public updateImage () {
        this.updateMipmaps(0);
    }

    /**
     * 更新指定层级范围内的 Mipmap。当 Mipmap 数据发生了改变时应调用此方法提交更改。
     * 若指定的层级范围超出了实际已有的层级范围，只有覆盖的那些层级范围会被更新。
     * @param firstLevel 起始层级。
     * @param count 层级数量。
     */
    public updateMipmaps (firstLevel: number = 0, count?: number) {

    }

    /**
     * 上传图像数据到指定层级的 Mipmap 中。
     * @param source 图像数据源。
     * @param level Mipmap 层级。
     * @param arrayIndex 数组索引。
     */
    public uploadData (source: HTMLCanvasElement | HTMLImageElement | ArrayBuffer, level: number = 0, arrayIndex: number = 0) {
        if (!this._texture || this._texture.mipLevel <= level) { return; }
        const gfxDevice = this._getGlobalDevice();
        if (!gfxDevice) { return; }

        const region = _regions[0];
        region.texExtent.width = this._texture.width >> level;
        region.texExtent.height = this._texture.height >> level;
        region.texSubres.baseMipLevel = level;
        region.texSubres.baseArrayLayer = arrayIndex;

        if (source instanceof ArrayBuffer) {
            gfxDevice.copyBuffersToTexture([source], this._texture, _regions);
        } else {
            gfxDevice.copyTexImagesToTexture([source], this._texture, _regions);
        }
    }

    protected _getGlobalDevice (): GFXDevice | null {
        return cc.director.root && cc.director.root.device;
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
            this.uploadData(source, level, arrayIndex);
        };
        if (image.loaded) {
            upload();
        } else {
            image.once('load', () => {
                upload();
            });
            if (!this.isCompressed) {
                const defaultImg = cc.builtinResMgr.get('black-texture').image as ImageAsset;
                this.uploadData(defaultImg.data as HTMLCanvasElement, level, arrayIndex);
            }
            postLoadImage(image);
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
