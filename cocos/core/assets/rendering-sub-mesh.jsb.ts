import { ccclass } from "cc.decorator";
import {Vec3} from "../math";

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
