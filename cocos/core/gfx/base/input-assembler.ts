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

import { Buffer } from './buffer';
import { Device } from './device';
import { murmurhash2_32_gc } from '../../utils/murmurhash2_gc';
import { Attribute, Obj, ObjectType, InputAssemblerInfo, DrawInfo } from './define';

/**
 * @en GFX input assembler.
 * @zh GFX 输入汇集器。
 */
export abstract class InputAssembler extends Obj {
    /**
     * @en Get current attributes.
     * @zh 顶点属性数组。
     */
    get attributes (): Attribute[] {
        return this._attributes;
    }

    /**
     * @en Get current vertex buffers.
     * @zh 顶点缓冲数组。
     */
    get vertexBuffers (): Buffer[] {
        return this._vertexBuffers;
    }

    /**
     * @en Get current index buffer.
     * @zh 索引缓冲。
     */
    get indexBuffer (): Buffer | null {
        return this._indexBuffer;
    }

    /**
     * @en Get the indirect buffer, if present.
     * @zh 间接绘制缓冲。
     */
    get indirectBuffer (): Buffer | null {
        return this._indirectBuffer;
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
    set vertexCount (count: number) {
        this._drawInfo.vertexCount = count;
    }

    /**
     * @en Get starting vertex.
     * @zh 起始顶点。
     */
    set firstVertex (first: number) {
        this._drawInfo.firstVertex = first;
    }

    /**
     * @en Get current index count.
     * @zh 索引数量。
     */
    set indexCount (count: number) {
        this._drawInfo.indexCount = count;
    }

    /**
     * @en Get starting index.
     * @zh 起始索引。
     */
    set firstIndex (first: number) {
        this._drawInfo.firstIndex = first;
    }

    /**
     * @en Get current vertex offset.
     * @zh 顶点偏移量。
     */
    set vertexOffset (offset: number) {
        this._drawInfo.vertexOffset = offset;
    }

    /**
     * @en Get current instance count.
     * @zh 实例数量。
     */
    set instanceCount (count: number) {
        this._drawInfo.instanceCount = count;
    }

    /**
     * @en Get starting instance.
     * @zh 起始实例。
     */
    set firstInstance (first: number) {
        this._drawInfo.firstInstance = first;
    }

    get drawInfo (): Readonly<DrawInfo> {
        return this._drawInfo;
    }

    protected _device: Device;
    protected _attributes: Attribute[] = [];
    protected _attributesHash = 0;

    protected _vertexBuffers: Buffer[] = [];
    protected _indexBuffer: Buffer | null = null;
    protected _indirectBuffer: Buffer | null = null;

    protected _drawInfo = new DrawInfo();

    constructor (device: Device) {
        super(ObjectType.INPUT_ASSEMBLER);
        this._device = device;
    }

    /**
     * @en Get the specified vertex buffer.
     * @zh 获取顶点缓冲。
     * @param stream The stream index of the vertex buffer.
     */
    public getVertexBuffer (stream = 0): Buffer | null {
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

    public abstract initialize (info: InputAssemblerInfo): boolean;
    public abstract destroy (): void;
}
