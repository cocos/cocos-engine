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

/**
 * @zh
 * GFX Uniform信息
 */
export interface IGFXUniformInfo {
    name: string;
    type: GFXType;
    count: number;
}

/**
 * @zh
 * GFX绘制信息
 */
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

/**
 * @zh
 * GFX间接缓冲
 */
export interface IGFXIndirectBuffer {
    drawInfos: IGFXDrawInfo[];
}

/**
 * @zh
 * GFX缓冲数据源
 */
export type GFXBufferSource = ArrayBuffer | IGFXIndirectBuffer;

/**
 * @zh
 * GFX缓冲描述信息
 */
export interface IGFXBufferInfo {
    usage: GFXBufferUsage;
    memUsage: GFXMemoryUsage;
    size: number;
    stride?: number;
}

/**
 * @zh
 * GFX缓冲
 */
export abstract class GFXBuffer extends GFXObject {

    /**
     * @zh
     * 缓冲使用方式
     */
    public get usage (): GFXBufferUsage {
        return this._usage;
    }

    /**
     * @zh
     * 缓冲的内存使用方式
     */
    public get memUsage (): GFXMemoryUsage {
        return this._memUsage;
    }

    /**
     * @zh
     * 缓冲大小
     */
    public get size (): number {
        return this._size;
    }

    /**
     * @zh
     * 缓冲步长
     */
    public get stride (): number {
        return this._stride;
    }

    /**
     * @zh
     * 缓冲条目数量
     */
    public get count (): number {
        return this._count;
    }

    /*
    public get buffer (): GFXBufferSource | null {
        return this._buffer;
    }
    */

    /**
     * @zh
     * GFX设备
     */
    protected _device: GFXDevice;

    /**
     * @zh
     * 缓冲使用方式
     */
    protected _usage: GFXBufferUsage = GFXBufferUsageBit.NONE;

    /**
     * @zh
     * 缓冲的内存使用方式
     */
    protected _memUsage: GFXMemoryUsage = GFXMemoryUsageBit.NONE;

    /**
     * @zh
     * 缓冲大小
     */
    protected _size: number = 0;

    /**
     * @zh
     * 缓冲步长
     */
    protected _stride: number = 1;

    /**
     * @zh
     * 缓冲条目数量
     */
    protected _count: number = 0;
    // protected _buffer: GFXBufferSource | null = null;

    /**
     * @zh
     * 构造函数
     * @param device GFX设备
     */
    constructor (device: GFXDevice) {
        super(GFXObjectType.BUFFER);
        this._device = device;
    }

    /**
     * @zh
     * 初始化函数
     * @param info GFX缓冲描述信息
     */
    public abstract initialize (info: IGFXBufferInfo): boolean;

    /**
     * @zh
     * 销毁函数
     */
    public abstract destroy (): void;

    /**
     * @zh
     * 重置缓冲大小
     * @param size 缓冲大小
     */
    public abstract resize (size: number);

    /**
     * @zh
     * 更新缓冲内容
     * @param buffer 缓冲数据源
     * @param offset 目的缓冲的偏移量
     * @param size 更新的缓冲大小
     */
    public abstract update (buffer: GFXBufferSource, offset?: number, size?: number);
}
