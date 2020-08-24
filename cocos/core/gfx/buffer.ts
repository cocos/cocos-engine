/**
 * @category gfx
 */

import {
    GFXBufferFlagBit,
    GFXBufferFlags,
    GFXBufferUsage,
    GFXBufferUsageBit,
    GFXMemoryUsage,
    GFXMemoryUsageBit,
    GFXObject,
    GFXObjectType,
} from './define';
import { GFXDevice } from './device';

export interface IGFXDrawInfo {
    vertexCount: number;
    firstVertex: number;
    indexCount: number;
    firstIndex: number;
    vertexOffset: number;
    instanceCount: number;
    firstInstance: number;
}

export const GFX_DRAW_INFO_SIZE: number = 28;

export interface IGFXIndirectBuffer {
    drawInfos: IGFXDrawInfo[];
}

export type GFXBufferSource = ArrayBuffer | IGFXIndirectBuffer;

export interface IGFXBufferInfo {
    usage: GFXBufferUsage;
    memUsage: GFXMemoryUsage;
    size: number;

    /**
     * In bytes.
     */
    stride?: number;
    flags?: GFXBufferFlags;
}

export interface IGFXBufferViewInfo {
    buffer: GFXBuffer;
    offset: number;
    range: number;
}

/**
 * @en GFX buffer.
 * @zh GFX 缓冲。
 */
export abstract class GFXBuffer extends GFXObject {

    /**
     * @en Usage type of the buffer.
     * @zh 缓冲使用方式。
     */
    get usage (): GFXBufferUsage {
        return this._usage;
    }

    /**
     * @en Memory usage of the buffer.
     * @zh 缓冲的内存使用方式。
     */
    get memUsage (): GFXMemoryUsage {
        return this._memUsage;
    }

    /**
     * @en Size of the buffer.
     * @zh 缓冲大小。
     */
    get size (): number {
        return this._size;
    }

    /**
     * @en Stride of the buffer.
     * @zh 缓冲步长。
     */
    get stride (): number {
        return this._stride;
    }

    /**
     * @en Count of the buffer wrt. stride.
     * @zh 缓冲条目数量。
     */
    get count (): number {
        return this._count;
    }

    get flags (): GFXBufferFlags {
        return this._flags;
    }

    /**
     * @en View of the back-up buffer, if specified.
     * @zh 备份缓冲视图。
     */
    get backupBuffer (): Uint8Array | null {
        return this._bakcupBuffer;
    }

    /**
     * @en Whether this buffer instance is only a view on top of another buffer.
     * @zh 此缓冲实例是否只是另一份缓冲的视图。
     */
    get isBufferView () {
        return this._isBufferView;
    }

    protected _device: GFXDevice;
    protected _usage: GFXBufferUsage = GFXBufferUsageBit.NONE;
    protected _memUsage: GFXMemoryUsage = GFXMemoryUsageBit.NONE;
    protected _size: number = 0;
    protected _stride: number = 1;
    protected _count: number = 0;
    protected _flags: GFXBufferFlags = GFXBufferFlagBit.NONE;
    protected _bakcupBuffer: Uint8Array | null = null;
    protected _indirectBuffer: IGFXIndirectBuffer | null = null;
    protected _isBufferView = false;

    constructor (device: GFXDevice) {
        super(GFXObjectType.BUFFER);
        this._device = device;
    }

    public abstract initialize (info: IGFXBufferInfo | IGFXBufferViewInfo): boolean;

    public abstract destroy (): void;

    /**
     * @en Resize the buffer.
     * @zh 重置缓冲大小。
     * @param size The new buffer size.
     */
    public abstract resize (size: number): void;

    /**
     * @en Update the buffer data.
     * @zh 更新缓冲内容。
     * @param buffer The new buffer data.
     * @param offset Offset into the buffer.
     * @param size Size of the data to be updated.
     */
    public abstract update (buffer: GFXBufferSource, offset?: number, size?: number): void;
}
