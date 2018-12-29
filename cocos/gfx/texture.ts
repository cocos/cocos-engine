import { GFXFormat, GFXFormatInfo } from './define';
import { GFXDevice } from './device';

export enum GFXTextureType {
    TEX1D,
    TEX2D,
    TEX3D,
};

export enum GFXTextureUsageBit {
    NONE = 0,
    TRANSFER_SRC = 0x1,
    TRANSFER_DST = 0x2,
    SAMPLED = 0x4,
    STORAGE = 0x8,
    COLOR_ATTACHMENT = 0x10,
    DEPTH_STENCIL_ATTACHMENT = 0x20,
    TRANSIENT_ATTACHMENT = 0x40,
    INPUT_ATTACHMENT = 0x80,
};

export type GFXTextureUsage = GFXTextureUsageBit;

export enum GFXTextureFlagBit {
    NONE = 0,
    GEN_MIPMAP = 0x1,
    CUBEMAP = 0x2,
    BAKUP_BUFFER = 0x4,
};

export type GFXTextureFlags = GFXTextureFlagBit;

export interface GFXTextureInfo {
    type: GFXTextureType;
    usage: GFXTextureUsage;
    format: GFXFormat;
    width: number;
    height: number;
    depth?: number;
    arrayLayer?: number;
    mipLevel?: number;
    flags?: GFXTextureFlags;
};

export abstract class GFXTexture {

    constructor(device: GFXDevice) {
        this._device = device;
    }

    public abstract initialize(info: GFXTextureInfo): boolean;
    public abstract destroy(): void;

    public get type(): GFXTextureType {
        return this._type;
    }

    public get usage(): GFXTextureUsage {
        return this._usage;
    }

    public get format(): GFXFormat {
        return this._format;
    }

    public get width(): number {
        return this._width;
    }

    public get height(): number {
        return this._height;
    }

    public get depth(): number {
        return this._depth;
    }

    public get arrayLayer(): number {
        return this._arrayLayer;
    }

    public get mipLevel(): number {
        return this._mipLevel;
    }

    public get flags(): GFXTextureFlags {
        return this._flags;
    }

    public get size(): number {
        return this._size;
    }

    public get buffer(): ArrayBuffer | null {
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
    protected _flags: GFXTextureFlags = GFXTextureFlagBit.NONE;
    protected _size: number = 0;
    protected _buffer: ArrayBuffer | null = null;
};
