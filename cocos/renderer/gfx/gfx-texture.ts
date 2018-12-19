import { GFXFormat, GFXFormatInfo } from './gfx-define';
import { GFXDevice } from './gfx-device';

export const enum GFXTextureType {
    TEX1D,
    TEX2D,
    TEX3D,
};

export const enum GFXTextureUsageBit {
    NONE = 0,
    TRANSFER_SRC = 0x1,
    TRANSFER_DST = 0x2,
    SAMPLED = 0x4,
    STORAGE = 0x8,
    INPUT_ATTACHMENT = 0x10,
    OUTPUT_ATTACHMENT = 0x20,
    PRESENT = 0x30,
};

export type GFXTextureUsage = GFXTextureUsageBit;

export const enum GFXTextureFlagBit {
    NONE = 0,
    GEN_MIPMAP = 0x1,
    CUBEMAP = 0x2,
    BAKUP_BUFFER = 0x4,
};

export type GFXTextureFlags = GFXTextureFlagBit;

export class GFXTextureInfo {
    type : GFXTextureType = GFXTextureType.TEX2D;
    usage : GFXTextureUsage = GFXTextureUsageBit.NONE;
    format : GFXFormat = GFXFormat.UNKNOWN;
    width : number = 0;
    height : number = 0;
    depth : number = 1;
    arrayLayer : number = 1;
    mipLevel : number = 1;
    flags : GFXTextureFlags = GFXTextureFlagBit.NONE;
};

export abstract class GFXTexture {

    constructor(device : GFXDevice) {
        this._device = device;
    }

    public abstract initialize(info : GFXTextureInfo) : boolean;
    public abstract destroy() : void;

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

    protected _device : GFXDevice;
    protected _type : GFXTextureType = GFXTextureType.TEX2D;
    protected _usage : GFXTextureUsage = GFXTextureUsageBit.NONE;
    protected _format : GFXFormat = GFXFormat.UNKNOWN;
    protected _width : number = 0;
    protected _height : number = 0;
    protected _depth : number = 1;
    protected _arrayLayer : number = 1;
    protected _mipLevel : number = 1;
    protected _flags : GFXTextureFlags = GFXTextureFlagBit.NONE;
    protected _size : number = 0;
    protected _buffer : ArrayBuffer | null = null;
};
