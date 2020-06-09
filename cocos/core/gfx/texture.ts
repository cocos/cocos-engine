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

export interface IGFXTextureViewInfo {
    texture: GFXTexture;
    type: GFXTextureType;
    format: GFXFormat;
    baseLevel?: number;
    levelCount?: number;
    baseLayer?: number;
    layerCount?: number;
}

export function IsPowerOf2 (x: number): boolean{
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
    get type (): GFXTextureType {
        return this._type;
    }

    /**
     * @en Get texture usage.
     * @zh 纹理使用方式。
     */
    get usage (): GFXTextureUsage {
        return this._usage;
    }

    /**
     * @en Get texture format.
     * @zh 纹理格式。
     */
    get format (): GFXFormat {
        return this._format;
    }

    /**
     * @en Get texture width.
     * @zh 纹理宽度。
     */
    get width (): number {
        return this._width;
    }

    /**
     * @en Get texture height.
     * @zh 纹理高度。
     */
    get height (): number {
        return this._height;
    }

    /**
     * @en Get texture depth.
     * @zh 纹理深度。
     */
    get depth (): number {
        return this._depth;
    }

    /**
     * @en Get texture array layer.
     * @zh 纹理数组层数。
     */
    get arrayLayer (): number {
        return this._arrayLayer;
    }

    /**
     * @en Get texture mip level.
     * @zh 纹理 mip 层级数。
     */
    get mipLevel (): number {
        return this._mipLevel;
    }

    /**
     * @en Get texture samples.
     * @zh 纹理采样数。
     */
    get samples (): GFXSampleCount {
        return this._samples;
    }

    /**
     * @en Get texture flags.
     * @zh 纹理标识位。
     */
    get flags (): GFXTextureFlags {
        return this._flags;
    }

    /**
     * @en Get texture size.
     * @zh 纹理大小。
     */
    get size (): number {
        return this._size;
    }

    /**
     * @en Get texture buffer.
     * @zh 纹理缓冲。
     */
    get buffer (): ArrayBuffer | null {
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

    public abstract initialize (info: IGFXTextureInfo): boolean;

    public abstract destroy (): void;

    /**
     * @en Resize texture.
     * @zh 重置纹理大小。
     * @param width The new width.
     * @param height The new height.
     */
    public abstract resize (width: number, height: number): void;
}
