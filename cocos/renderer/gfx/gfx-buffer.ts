import { GFXDevice } from './gfx-device';
import { BufferView } from './gfx-define';

export enum GFXBufferUsageBit {
    NONE = 0,
    TRANSFER_SRC = 0x1,
    TRANSFER_DST = 0x2,
    INDEX = 0x4,
    VERTEX = 0x8,
    UNIFORM = 0x10,
    STORAGE = 0x20,
};

export type GFXBufferUsage = GFXBufferUsageBit;

export enum GFXMemoryUsageBit {
    NONE = 0,
    DEVICE = 0x1,
    HOST = 0x2,
};

export type GFXMemoryUsage = GFXMemoryUsageBit;

export enum GFXBufferAccessBit {
    NONE = 0,
    READ = 0x1,
    WRITE = 0x2,
};

export type GFXBufferAccess = GFXBufferAccessBit;

export interface GFXBufferInfo {
    usage: GFXBufferUsage;
    memUsage: GFXMemoryUsage;
    size: number;
    stride?: number;
};

export abstract class GFXBuffer {

    constructor(device: GFXDevice) {
        this._device = device;
    }

    public abstract initialize(info: GFXBufferInfo): boolean;
    public abstract destroy(): void;
    public abstract update(buffer: Buffer, offset: number);

    public get usage(): GFXBufferUsage {
        return this._usage;
    }

    public get memUsage(): GFXMemoryUsage {
        return this._memUsage;
    }

    public get size(): number {
        return this._size;
    }

    public get stride(): number {
        return this._stride;
    }

    public get buffer(): ArrayBuffer | null {
        return this._buffer;
    }

    protected _device: GFXDevice;
    protected _usage: GFXBufferUsage = GFXBufferUsageBit.NONE;
    protected _memUsage: GFXMemoryUsage = GFXMemoryUsageBit.NONE;
    protected _size: number = 0;
    protected _stride: number = 1;
    protected _buffer: ArrayBuffer | null = null;
    protected _bufferView: BufferView | null = null;
};
