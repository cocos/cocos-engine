/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { PrimitiveMode, Attribute } from '../gfx';

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
    options?: RecursivePartial<IGeometryOptions>,
): GeometryOptions {
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
    attributes?: Attribute[];

    customAttributes?: {
        attr: Attribute,
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
    primitiveMode?: PrimitiveMode;

    /**
     * @en
     * whether rays casting from the back face of this geometry could collide with it
     * @zh
     * 是否是双面，用于判断来自于几何体背面的射线检测。
     */
    doubleSided?: boolean;
}

/**
 * @en
 * The definition of the dynamic geometry, this struct can build a dynamic mesh.
 * @zh
 * 几何体信息。
 */
export interface IDynamicGeometry {
    /**
     * @en
     * Vertex positions: 3 float components.
     * @zh
     * 顶点位置：3个float分量。
     */
    positions: Float32Array;

    /**
     * @en
     * Vertex normals: 3 float components.
     * @zh
     * 顶点法线：3个float分量。
     */
    normals?: Float32Array;

    /**
     * @en
     * Texture coordinates: 2 float components.
     * @zh
     * 纹理坐标：2个float分量。
     */
    uvs?: Float32Array;

    /**
     * @en
     * Vertex Tangents: 4 float components.
     * @zh
     * 顶点切线：4个float分量。
     */
    tangents?: Float32Array;

    /**
     * @en
     * Vertex colors: 4 float components.
     * @zh
     * 顶点颜色：4个float分量。
     */
    colors?: Float32Array;

    /**
     * @en
     * Custom attributes
     * @zh
     * 定制属性列表。
     */
    customAttributes?: {
        attr: Attribute,
        values: Float32Array,
    }[];

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
     * 16 bits Geometry indices, if one needs indexed-draw.
     * @zh
     * 16位几何索引，当使用索引绘制时。
     */
    indices16?: Uint16Array;

    /**
     * @en
     * 32 bits Geometry indices, if one needs indexed-draw.
     * @zh
     * 32位几何索引，当使用索引绘制时。
     */
    indices32?: Uint32Array;

    /**
     * @en
     * Topology of the geometry vertices. Default is TRIANGLE_LIST.
     * @zh
     * 几何顶点的拓扑图元。默认值是TRIANGLE_LIST。
     */
    primitiveMode?: PrimitiveMode;

    /**
     * @en
     * whether rays casting from the back face of this geometry could collide with it
     * @zh
     * 是否是双面，用于判断来自于几何体背面的射线检测。
     */
    doubleSided?: boolean;
}

export interface ICreateMeshOptions {
    /**
     * @en calculate mesh's aabb or not
     * @zh 是否计算模型的包围盒。
     */
    calculateBounds?: boolean;
}

export interface ICreateDynamicMeshOptions {
    /**
     * @en max sub mesh count
     * @zh 最大子模型个数。
     */
    maxSubMeshes: number;

    /**
     * @en max sub mesh vertex count
     * @zh 子模型最大顶点个数。
     */
    maxSubMeshVertices: number;

    /**
     * @en max sub mesh index count
     * @zh 子模型最大索引个数。
     */
    maxSubMeshIndices: number;
}
