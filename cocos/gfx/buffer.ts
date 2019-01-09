import { GFXBufferUsage, GFXBufferUsageBit, GFXMemoryUsage, GFXMemoryUsageBit } from './define';
import { GFXDevice } from './device';

export interface IGFXBufferInfo {
    usage: GFXBufferUsage;
    memUsage: GFXMemoryUsage;
    size: number;
    stride?: number;
}

export abstract class GFXBuffer {

    public get usage (): GFXBufferUsage {
        return this._usage;
    }

    public get memUsage (): GFXMemoryUsage {
        return this._memUsage;
    }

    public get size (): number {
        return this._size;
    }

    public get stride (): number {
        return this._stride;
    }

    public get buffer (): ArrayBuffer | null {
        return this._buffer;
    }

    protected _device: GFXDevice;
    protected _usage: GFXBufferUsage = GFXBufferUsageBit.NONE;
    protected _memUsage: GFXMemoryUsage = GFXMemoryUsageBit.NONE;
    protected _size: number = 0;
    protected _stride: number = 1;
    protected _buffer: ArrayBuffer | null = null;
    protected _bufferView: Uint8Array | null = null;

    constructor (device: GFXDevice) {
        this._device = device;
    }

    public abstract initialize (info: IGFXBufferInfo): boolean;
    public abstract destroy (): void;
    public abstract update (buffer: ArrayBuffer, offset?: number);
}
