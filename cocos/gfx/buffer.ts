import {
    GFXBufferUsage,
    GFXBufferUsageBit,
    GFXMemoryUsage,
    GFXMemoryUsageBit,
    GFXObject,
    GFXObjectType,
    GFXType,
} from './define';
import { GFXDevice } from './device';

export interface IGFXUniformInfo {
    name: string;
    type: GFXType;
    count: number;
}

export interface IGFXDrawInfo {
    vertexCount: number;
    firstVertex: number;
    indexCount: number;
    firstIndex: number;
    vertexOffset: number;
    instanceCount: number;
    firstInstance: number;
}

export const GFX_DRAW_INFO_SIZE: number = 56;

export interface IGFXIndirectBuffer {
    drawInfos: IGFXDrawInfo[];
}

export type GFXBufferSource = ArrayBuffer | IGFXIndirectBuffer;

export interface IGFXBufferInfo {
    usage: GFXBufferUsage;
    memUsage: GFXMemoryUsage;
    size: number;
    stride?: number;
}

export abstract class GFXBuffer extends GFXObject {

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

    public get count (): number {
        return this._count;
    }

    public get buffer (): GFXBufferSource | null {
        return this._buffer;
    }

    protected _device: GFXDevice;
    protected _usage: GFXBufferUsage = GFXBufferUsageBit.NONE;
    protected _memUsage: GFXMemoryUsage = GFXMemoryUsageBit.NONE;
    protected _size: number = 0;
    protected _stride: number = 1;
    protected _count: number = 0;
    protected _buffer: GFXBufferSource | null = null;
    protected _uniforms: GFXBufferSource | null = null;

    constructor (device: GFXDevice) {
        super(GFXObjectType.BUFFER);
        this._device = device;
    }

    public abstract initialize (info: IGFXBufferInfo): boolean;
    public abstract destroy (): void;
    public abstract resize (size: number);
    public abstract update (buffer: GFXBufferSource, offset?: number, size?: number);
}
