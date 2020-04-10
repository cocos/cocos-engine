/**
 * @category gfx
 */

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
    GFXStatus,
    GFXFormatSurfaceSize,
} from './define';
import { GFXDevice } from './device';

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

function IsPowerOf2 (x: number): boolean{
    return x > 0 && (x & (x - 1)) === 0;
}

/**
 * @en GFX texture.
 * @zh GFX 纹理。
 */
export abstract class GFXTexture extends GFXObject {

    /**
     * @en Get texture type.
     * @zh 纹理类型。
     */
    public get type (): GFXTextureType {
        return this._type;
    }

    /**
     * @en Get texture usage.
     * @zh 纹理使用方式。
     */
    public get usage (): GFXTextureUsage {
        return this._usage;
    }

    /**
     * @en Get texture format.
     * @zh 纹理格式。
     */
    public get format (): GFXFormat {
        return this._format;
    }

    /**
     * @en Get texture width.
     * @zh 纹理宽度。
     */
    public get width (): number {
        return this._width;
    }

    /**
     * @en Get texture height.
     * @zh 纹理高度。
     */
    public get height (): number {
        return this._height;
    }

    /**
     * @en Get texture depth.
     * @zh 纹理深度。
     */
    public get depth (): number {
        return this._depth;
    }

    /**
     * @en Get texture array layer.
     * @zh 纹理数组层数。
     */
    public get arrayLayer (): number {
        return this._arrayLayer;
    }

    /**
     * @en Get texture mip level.
     * @zh 纹理 mip 层级数。
     */
    public get mipLevel (): number {
        return this._mipLevel;
    }

    /**
     * @en Get texture samples.
     * @zh 纹理采样数。
     */
    public get samples (): GFXSampleCount {
        return this._samples;
    }

    /**
     * @en Get texture flags.
     * @zh 纹理标识位。
     */
    public get flags (): GFXTextureFlags {
        return this._flags;
    }

    /**
     * @en Get texture size.
     * @zh 纹理大小。
     */
    public get size (): number {
        return this._size;
    }

    /**
     * @en Get texture buffer.
     * @zh 纹理缓冲。
     */
    public get buffer (): ArrayBuffer | null {
        return this._buffer;
    }

    protected _device: GFXDevice;

    protected _type: GFXTextureType = GFXTextureType.TEX2D;

    protected _usage: GFXTextureUsage = GFXTextureUsageBit.NONE;

    protected _format: GFXFormat = GFXFormat.UNKNOWN;

    protected _width: number = 0;

    protected _height: number = 0;

    protected _depth: number = 1;

    protected _arrayLayer: number = 1;

    protected _mipLevel: number = 1;

    protected _samples: GFXSampleCount = GFXSampleCount.X1;

    protected _flags: GFXTextureFlags = GFXTextureFlagBit.NONE;

    protected _isPowerOf2: boolean = false;

    protected _size: number = 0;

    protected _buffer: ArrayBuffer | null = null;

    constructor (device: GFXDevice) {
        super(GFXObjectType.TEXTURE);
        this._device = device;
    }

    public initialize (info: IGFXTextureInfo) {
        this._type = info.type;
        this._usage = info.usage;
        this._format = info.format;
        this._width = info.width;
        this._height = info.height;

        if (info.depth !== undefined) {
            this._depth = info.depth;
        }

        if (info.arrayLayer !== undefined) {
            this._arrayLayer = info.arrayLayer;
        }

        if (info.mipLevel !== undefined) {
            this._mipLevel = info.mipLevel;
        }

        if (info.samples !== undefined) {
            this._samples = info.samples;
        }

        if (info.flags !== undefined) {
            this._flags = info.flags;
        }

        this._isPowerOf2 = IsPowerOf2(this._width) && IsPowerOf2(this._height);

        this._size = GFXFormatSurfaceSize(this._format, this.width, this.height,
            this.depth, this.mipLevel) * this._arrayLayer;

        if (this._flags & GFXTextureFlagBit.BAKUP_BUFFER) {
            this._buffer = new ArrayBuffer(this._size);
        }

        if (this._initialize(info)) {
            this._device.memoryStatus.textureSize += this._size;
            this._status = GFXStatus.SUCCESS;
            return true;
        } else {
            this._status = GFXStatus.FAILED;
            return false;
        }
    }

    public destroy () {
        if (this._status !== GFXStatus.SUCCESS) { return; }
        this._buffer = null;
        this._destroy();
        this._device.memoryStatus.textureSize -= this._size;
        this._status = GFXStatus.UNREADY;
    }

    public resize (width: number, height: number) {
        const oldSize = this._size;
        this._width = width;
        this._height = height;
        this._size = GFXFormatSurfaceSize(this._format, this.width, this.height,
            this.depth, this.mipLevel) * this._arrayLayer;
        this._resize(width, height);
        this._device.memoryStatus.textureSize -= oldSize;
        this._device.memoryStatus.textureSize += this._size;
    }

    protected abstract _initialize (info: IGFXTextureInfo): boolean;

    protected abstract _destroy (): void;

    /**
     * @en Resize texture.
     * @zh 重置纹理大小。
     * @param width The new width.
     * @param height The new height.
     */
    protected abstract _resize (width: number, height: number): void;
}
