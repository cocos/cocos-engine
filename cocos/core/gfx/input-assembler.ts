/**
 * @category gfx
 */

import { GFXBuffer } from './buffer';
import { GFXFormat, GFXObject, GFXObjectType } from './define';
import { GFXDevice } from './device';
import { murmurhash2_32_gc } from '../utils/murmurhash2_gc';

export interface IGFXAttribute {
    name: string;
    format: GFXFormat;
    isNormalized?: boolean;
    stream?: number;
    isInstanced?: boolean;
    location?: number;
}

export interface IGFXInputAssemblerInfo {
    attributes: IGFXAttribute[];
    vertexBuffers: GFXBuffer[];
    indexBuffer?: GFXBuffer;
    indirectBuffer?: GFXBuffer;
}

/**
 * @en GFX input assembler.
 * @zh GFX 输入汇集器。
 */
export abstract class GFXInputAssembler extends GFXObject {

    /**
     * @en Get current vertex buffers.
     * @zh 顶点缓冲数组。
     */
    get vertexBuffers (): GFXBuffer[] {
        return this._vertexBuffers;
    }

    /**
     * @en Get current index buffer.
     * @zh 索引缓冲。
     */
    get indexBuffer (): GFXBuffer | null {
        return this._indexBuffer;
    }

    /**
     * @en Get current attributes.
     * @zh 顶点属性数组。
     */
    get attributes (): IGFXAttribute[] {
        return this._attributes;
    }

    /**
     * @en Get hash of current attributes.
     * @zh 获取顶点属性数组的哈希值。
     */
    get attributesHash (): number {
        return this._attributesHash;
    }

    /**
     * @en Get current vertex count.
     * @zh 顶点数量。
     */
    get vertexCount (): number {
        return this._vertexCount;
    }

    set vertexCount (count: number) {
        this._vertexCount = count;
    }

    /**
     * @en Get starting vertex.
     * @zh 起始顶点。
     */
    get firstVertex (): number {
        return this._firstVertex;
    }

    set firstVertex (first: number) {
        this._firstVertex = first;
    }

    /**
     * @en Get current index count.
     * @zh 索引数量。
     */
    get indexCount (): number {
        return this._indexCount;
    }

    set indexCount (count: number) {
        this._indexCount = count;
    }

    /**
     * @en Get starting index.
     * @zh 起始索引。
     */
    get firstIndex (): number {
        return this._firstIndex;
    }

    set firstIndex (first: number) {
        this._firstIndex = first;
    }

    /**
     * @en Get current vertex offset.
     * @zh 顶点偏移量。
     */
    get vertexOffset (): number {
        return this._vertexOffset;
    }

    set vertexOffset (offset: number) {
        this._vertexOffset = offset;
    }

    /**
     * @en Get current instance count.
     * @zh 实例数量。
     */
    get instanceCount (): number {
        return this._instanceCount;
    }

    set instanceCount (count: number) {
        this._instanceCount = count;
    }

    /**
     * @en Get starting instance.
     * @zh 起始实例。
     */
    get firstInstance (): number {
        return this._firstInstance;
    }

    set firstInstance (first: number) {
        this._firstInstance = first;
    }

    /**
     * @en Is the assembler an indirect command?
     * @zh 是否间接绘制。
     */
    get isIndirect (): boolean {
        return this._isIndirect;
    }

    /**
     * @en Get the indirect buffer, if present.
     * @zh 间接绘制缓冲。
     */
    get indirectBuffer (): GFXBuffer | null {
        return this._indirectBuffer;
    }

    protected _device: GFXDevice;

    protected _attributes: IGFXAttribute[] = [];

    protected _vertexBuffers: GFXBuffer[] = [];

    protected _indexBuffer: GFXBuffer | null = null;

    protected _vertexCount: number = 0;

    protected _firstVertex: number = 0;

    protected _indexCount: number = 0;

    protected _firstIndex: number = 0;

    protected _vertexOffset: number = 0;

    protected _instanceCount: number = 0;

    protected _firstInstance: number = 0;

    protected _isIndirect: boolean = false;
    protected _attributesHash: number = 0;

    protected _indirectBuffer: GFXBuffer | null = null;

    constructor (device: GFXDevice) {
        super(GFXObjectType.INPUT_ASSEMBLER);
        this._device = device;
    }

    public abstract initialize (info: IGFXInputAssemblerInfo): boolean;
    public abstract destroy (): void;

    /**
     * @en Get the specified vertex buffer.
     * @zh 获取顶点缓冲。
     * @param stream The stream index of the vertex buffer.
     */
    public getVertexBuffer (stream: number = 0): GFXBuffer | null {
        if (stream < this._vertexBuffers.length) {
            return this._vertexBuffers[stream];
        } else {
            return null;
        }
    }

    protected computeAttributesHash (): number {
        let res = 'attrs';
        for (let i = 0; i < this.attributes.length; ++i) {
            const at = this.attributes[i];
            res += `,${at.name},${at.format},${at.isNormalized},${at.stream},${at.isInstanced}`;
        }
        return murmurhash2_32_gc(res, 666);
    }
}
