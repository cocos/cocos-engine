import { ccclass } from "cc.decorator";
import {Vec3} from "../math";
import { Attribute, PrimitiveMode, Buffer } from "../gfx";

/**
 * @en Array views for index buffer
 * @zh 允许存储索引的数组视图。
 */
export type IBArray = Uint8Array | Uint16Array | Uint32Array;

/**
 * @en The interface of geometric information
 * @zh 几何信息。
 */
export interface IGeometricInfo {
    /**
     * @en Vertex positions
     * @zh 顶点位置。
     */
    positions: Float32Array;

    /**
     * @en Indices data
     * @zh 索引数据。
     */
    indices?: IBArray;

    /**
     * @en Whether the geometry is treated as double sided
     * @zh 是否将图元按双面对待。
     */
    doubleSided?: boolean;

    /**
     * @en The bounding box
     * @zh 此几何体的轴对齐包围盒。
     */
    boundingBox: { max: Vec3 | Readonly<Vec3>; min: Vec3 | Readonly<Vec3> };
}

/**
 * @en Flat vertex buffer
 * @zh 扁平化顶点缓冲区
 */
export interface IFlatBuffer {
    stride: number;
    count: number;
    buffer: Uint8Array;
}

export type RenderingSubMesh = jsb.RenderingSubMesh;
export const RenderingSubMesh = jsb.RenderingSubMesh;

const renderingSubMeshProto = RenderingSubMesh.prototype;

renderingSubMeshProto._ctor = function (vertexBuffers: Buffer[], attributes: Attribute[], primitiveMode: PrimitiveMode,
                                             indexBuffer: Buffer | null = null, indirectBuffer: Buffer | null = null) {
    this._attributes = attributes;
    this._vertexBuffers = vertexBuffers;
    this._indexBuffer = indexBuffer;
    this._indirectBuffer = indirectBuffer;
};

Object.defineProperty(renderingSubMeshProto, 'attributes', {
    configurable: true,
    enumerable: true,
    get () {
        // TODO: should remove it when using shared_ptr.
        if (!this._attributes) {
            this._attributes = this.getAttributes();
        }
        return this._attributes;
    }
});

Object.defineProperty(renderingSubMeshProto, 'vertexBuffers', {
    configurable: true,
    enumerable: true,
    get () {
        // TODO: should remove it when using shared_ptr.
        if (!this._vertexBuffers) {
            this._vertexBuffers = this.getVertexBuffers();
        }
        return this._vertexBuffers;
    }
});

Object.defineProperty(renderingSubMeshProto, 'indexBuffer', {
    configurable: true,
    enumerable: true,
    get () {
        // TODO: should remove it when using shared_ptr.
        if (!this._indexBuffer) {
            this._indexBuffer = this.getIndexBuffer();
        }
        return this._indexBuffer;
    }
});

Object.defineProperty(renderingSubMeshProto, 'indirectBuffer', {
    configurable: true,
    enumerable: true,
    get () {
        // TODO: should remove it when using shared_ptr.
        if (!this._indirectBuffer) {
            this._indirectBuffer = this.getIndexBuffer();
        }
        return this._indirectBuffer;
    }
});
