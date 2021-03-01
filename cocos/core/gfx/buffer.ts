/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */

/**
 * @packageDocumentation
 * @module gfx
 */

import { Device } from './device';
import {
    BufferFlagBit,
    BufferFlags,
    BufferUsage,
    BufferUsageBit,
    MemoryUsage,
    MemoryUsageBit,
    Obj,
    ObjectType,
} from './define';

export class DrawInfo {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

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

export const DRAW_INFO_SIZE = 28;

export class IndirectBuffer {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public drawInfos: DrawInfo[] = [],
    ) {}
}

export type BufferSource = ArrayBuffer | IndirectBuffer;

export class BufferInfo {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public usage: BufferUsage,
        public memUsage: MemoryUsage,
        public size: number = 0,
        public stride: number = 0, // in bytes
        public flags: BufferFlags = BufferFlagBit.NONE,
    ) {}
}

export class BufferViewInfo {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public buffer: Buffer,
        public offset: number = 0,
        public range: number = 0,
    ) {}
}

/**
 * @en GFX buffer.
 * @zh GFX 缓冲。
 */
export abstract class Buffer extends Obj {
    /**
     * @en Usage type of the buffer.
     * @zh 缓冲使用方式。
     */
    get usage (): BufferUsage {
        return this._usage;
    }

    /**
     * @en Memory usage of the buffer.
     * @zh 缓冲的内存使用方式。
     */
    get memUsage (): MemoryUsage {
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

    get flags (): BufferFlags {
        return this._flags;
    }

    protected _device: Device;
    protected _usage: BufferUsage = BufferUsageBit.NONE;
    protected _memUsage: MemoryUsage = MemoryUsageBit.NONE;
    protected _size = 0;
    protected _stride = 1;
    protected _count = 0;
    protected _flags: BufferFlags = BufferFlagBit.NONE;
    protected _indirectBuffer: IndirectBuffer | null = null;
    protected _isBufferView = false;

    constructor (device: Device) {
        super(ObjectType.BUFFER);
        this._device = device;
    }

    public abstract initialize (info: BufferInfo | BufferViewInfo): boolean;

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
     * @param size Size in bytes to be updated.
     */
    public abstract update (buffer: BufferSource, size?: number): void;
}
