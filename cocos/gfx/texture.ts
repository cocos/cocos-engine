import {
    GFXFormat,
    GFXObject,
    GFXObjectType,
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
    flags?: GFXTextureFlags;
}

export abstract class GFXTexture extends GFXObject {

    public get type (): GFXTextureType {
        return this._type;
    }

    public get usage (): GFXTextureUsage {
        return this._usage;
    }

    public get format (): GFXFormat {
        return this._format;
    }

    public get width (): number {
        return this._width;
    }

    public get height (): number {
        return this._height;
    }

    public get depth (): number {
        return this._depth;
    }

    public get arrayLayer (): number {
        return this._arrayLayer;
    }

    public get mipLevel (): number {
        return this._mipLevel;
    }

    public get flags (): GFXTextureFlags {
        return this._flags;
    }

    public get size (): number {
        return this._size;
    }

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
}
