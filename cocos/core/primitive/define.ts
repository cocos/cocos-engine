/**
 * @category 3d/primitive
 */

import { GFXPrimitiveMode } from '../gfx/define';
import { IGFXAttribute } from '../gfx/input-assembler';

/**
 * @en
 * The definition of the parameter for building a primitive geometry.
 * @zh
 * 几何体参数选项。
 */
export interface IGeometryOptions {
    /**
     * @en
     * Whether to include normal. Default to true.
     * @zh
     * 是否包含法线。默认为true。
     */
    includeNormal: boolean;

    /**
     * @en
     * Whether to include uv. Default to true.
     * @zh
     * 是否包含UV。默认为true。
     */
    includeUV: boolean;
}

/**
 * @en
 * Apply the options to default.
 * @zh
 * 应用默认的几何参数选项。
 */
export function applyDefaultGeometryOptions<GeometryOptions = IGeometryOptions> (
    options?: RecursivePartial<IGeometryOptions>): GeometryOptions {
    options = options || {};
    if (options.includeNormal === undefined) {
        options.includeNormal = true;
    }
    if (options.includeUV === undefined) {
        options.includeUV = true;
    }
    return options as GeometryOptions;
}

/**
 * @en
 * The definition of the geometry, this struct can build a mesh.
 * @zh
 * 几何体信息。
 */
export interface IGeometry {
    /**
     * @en
     * Vertex positions.
     * @zh
     * 顶点位置。
     */
    positions: number[];

    /**
     * @en
     * Vertex normals.
     * @zh
     * 顶点法线。
     */
    normals?: number[];

    /**
     * @en
     * Texture coordinates.
     * @zh
     * 纹理坐标。
     */
    uvs?: number[];

    /**
     * @en
     * Vertex Tangents.
     * @zh
     * 顶点切线。
     */
    tangents?: number[];

    /**
     * @en
     * Vertex colors.
     * @zh
     * 顶点颜色。
     */
    colors?: number[];

    /**
     * @en
     * specify vertex attributes, use (positions|normals|uvs|colors) as keys
     * @zh
     * 顶点属性。
     */
    attributes?: IGFXAttribute[];

    customAttributes?: {
        attr: IGFXAttribute,
        values: number[],
    }[];

    /**
     * @en
     * Bounding sphere radius.
     * @zh
     * 包围球半径。
     */
    boundingRadius?: number;

    /**
     * @en
     * Min position.
     * @zh
     * 最小位置。
     */
    minPos?: {
        x: number;
        y: number;
        z: number;
    };

    /**
     * @en
     * Max position.
     * @zh
     * 最大位置。
     */
    maxPos?: {
        x: number;
        y: number;
        z: number;
    };

    /**
     * @en
     * Geometry indices, if one needs indexed-draw.
     * @zh
     * 几何索引，当使用索引绘制时。
     */
    indices?: number[];

    /**
     * @en
     * Topology of the geometry vertices. Default is TRIANGLE_LIST.
     * @zh
     * 几何顶点的拓扑图元。默认值是TRIANGLE_LIST。
     */
    primitiveMode?: GFXPrimitiveMode;

    /**
     * @en
     * whether rays casting from the back face of this geometry could collide with it
     * @zh
     * 是否是双面，用于判断来自于几何体背面的射线检测。
     */
    doubleSided?: boolean;
}
