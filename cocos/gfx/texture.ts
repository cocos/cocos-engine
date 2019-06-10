import {
    GFXFormat,
    GFXObject,
    GFXObjectType,
    GFXSampleCount,
    GFXTextureFlagBit,
    GFXTextureFlags,
    GFXTextureType,
    GFXTextureUsage,
    GFXTextureUsageBit,
} from './define';
import { GFXDevice } from './device';

/**
 * @zh
 * GFX纹理描述信息
 */
export interface IGFXTextureInfo {
    type: GFXTextureType;
    usage: GFXTextureUsage;
    format: GFXFormat;
    width: number;
    height: number;
    depth?: number;
    arrayLayer?: number;
    mipLevel?: number;
    samples?: GFXSampleCount;
    flags?: GFXTextureFlags;
}

/**
 * @zh
 * GFX纹理
 */
export abstract class GFXTexture extends GFXObject {

    /**
     * @zh
     * 纹理类型
     */
    public get type (): GFXTextureType {
        return this._type;
    }

    /**
     * @zh
     * 纹理使用方式
     */
    public get usage (): GFXTextureUsage {
        return this._usage;
    }

    /**
     * @zh
     * 纹理格式
     */
    public get format (): GFXFormat {
        return this._format;
    }

    /**
     * @zh
     * 纹理宽度
     */
    public get width (): number {
        return this._width;
    }

    /**
     * @zh
     * 纹理高度
     */
    public get height (): number {
        return this._height;
    }

    /**
     * @zh
     * 纹理深度
     */
    public get depth (): number {
        return this._depth;
    }

    /**
     * @zh
     * 纹理数组层数
     */
    public get arrayLayer (): number {
        return this._arrayLayer;
    }

    /**
     * @zh
     * 纹理mip层级数
     */
    public get mipLevel (): number {
        return this._mipLevel;
    }

    /**
     * @zh
     * 纹理采样数
     */
    public get samples (): GFXSampleCount {
        return this._samples;
    }

    /**
     * @zh
     * 纹理标识位
     */
    public get flags (): GFXTextureFlags {
        return this._flags;
    }

    /**
     * @zh
     * 纹理大小
     */
    public get size (): number {
        return this._size;
    }

    /**
     * @zh
     * 纹理缓冲
     */
    public get buffer (): ArrayBuffer | null {
        return this._buffer;
    }

    /**
     * @zh
     * GFX设备
     */
    protected _device: GFXDevice;

    /**
     * @zh
     * 纹理类型
     */
    protected _type: GFXTextureType = GFXTextureType.TEX2D;

    /**
     * @zh
     * 纹理使用方式
     */
    protected _usage: GFXTextureUsage = GFXTextureUsageBit.NONE;

    /**
     * @zh
     * 纹理格式
     */
    protected _format: GFXFormat = GFXFormat.UNKNOWN;

    /**
     * @zh
     * 纹理宽度
     */
    protected _width: number = 0;

    /**
     * @zh
     * 纹理高度
     */
    protected _height: number = 0;

    /**
     * @zh
     * 纹理深度
     */
    protected _depth: number = 1;

    /**
     * @zh
     * 纹理数组层数
     */
    protected _arrayLayer: number = 1;

    /**
     * @zh
     * 纹理mip层级数
     */
    protected _mipLevel: number = 1;

    /**
     * @zh
     * 纹理采样数
     */
    protected _samples: GFXSampleCount = GFXSampleCount.X1;

    /**
     * @zh
     * 纹理标识位
     */
    protected _flags: GFXTextureFlags = GFXTextureFlagBit.NONE;

    /**
     * @zh
     * 是否是2次幂大小
     */
    protected _isPowerOf2: boolean = false;

    /**
     * @zh
     * 纹理大小
     */
    protected _size: number = 0;

    /**
     * @zh
     * 纹理缓冲
     */
    protected _buffer: ArrayBuffer | null = null;

    /**
     * @zh
     * 构造函数
     * @param device GFX设备
     */
    constructor (device: GFXDevice) {
        super(GFXObjectType.TEXTURE);
        this._device = device;
    }

    /**
     * @zh
     * 初始化函数
     * @param info GFX纹理描述信息
     */
    public abstract initialize (info: IGFXTextureInfo): boolean;

    /**
     * @zh
     * 销毁函数
     */
    public abstract destroy ();

    /**
     * @zh
     * 重置纹理大小
     * @param width 纹理宽度
     * @param height 纹理高度
     */
    public abstract resize (width: number, height: number);
}
