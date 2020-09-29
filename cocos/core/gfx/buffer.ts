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

export class GFXDrawInfo {
    declare private token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public vertexCount: number = 0,
        public firstVertex: number = 0,
        public indexCount: number = 0,
        public firstIndex: number = 0,
        public vertexOffset: number = 0,
        public instanceCount: number = 0,
        public firstInstance: number = 0,
    ) {}
}

export const GFX_DRAW_INFO_SIZE: number = 28;

export class GFXIndirectBuffer {
    declare private token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public drawInfos: GFXDrawInfo[] = [],
    ) {}
}

export type GFXBufferSource = ArrayBuffer | GFXIndirectBuffer;

export class GFXBufferInfo {
    declare private token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public usage: GFXBufferUsage,
        public memUsage: GFXMemoryUsage,
        public size: number = 0,
        public stride: number = 0, // in bytes
        public flags: GFXBufferFlags = GFXBufferFlagBit.NONE,
    ) {}
}

export class GFXBufferViewInfo {
    declare private token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public buffer: GFXBuffer,
        public offset: number = 0,
        public range: number = 0,
    ) {}
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

    protected _device: GFXDevice;
    protected _usage: GFXBufferUsage = GFXBufferUsageBit.NONE;
    protected _memUsage: GFXMemoryUsage = GFXMemoryUsageBit.NONE;
    protected _size: number = 0;
    protected _stride: number = 1;
    protected _count: number = 0;
    protected _flags: GFXBufferFlags = GFXBufferFlagBit.NONE;
    protected _bakcupBuffer: Uint8Array | null = null;
    protected _indirectBuffer: GFXIndirectBuffer | null = null;
    protected _isBufferView = false;

    constructor (device: GFXDevice) {
        super(GFXObjectType.BUFFER);
        this._device = device;
    }

    public abstract initialize (info: GFXBufferInfo | GFXBufferViewInfo): boolean;

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
