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
 * @en
 * The raycast mode.
 * @zh
 * 射线检测模式。
 */
export enum ERaycastMode {

    /**
     * @en
     * Detect and record all data.
     * @zh
     * 检测并记录所有的数据。
     */
    ALL,

    /**
     * @en
     * Detect all, but record only the most recent data.
     * @zh
     * 检测所有，但只记录最近的数据。
     */
    CLOSEST,

    /**
     * @en
     * Once the test is successful, the test is stopped and the data is recorded only once.
     * @zh
     * 一旦检测成功就停止检测，只会记录一次数据。
     */
    ANY,
}

/**
 * @en
 * The storage structure of the raycast results.
 * @zh
 * 射线检测结果的存储结构。
 */
export interface IRaySubMeshResult {

    /**
     * @en
     * The distance between the hit point and the ray.
     * @zh
     * 击中点和射线的距离。
     */
    distance: number;

    /**
     * @en
     * The index of the triangle vertex 0。
     * @zh
     * 三角形顶点0的索引。
     */
    vertexIndex0: number;

    /**
     * @en
     * The index of the triangle vertex 1。
     * @zh
     * 三角形顶点1的索引
     */
    vertexIndex1: number;

    /**
     * @en
     * The index of the triangle vertex 2。
     * @zh
     * 三角形顶点2的索引
     */
    vertexIndex2: number;
}

/**
 * @en
 * The optional param structure of the `raySubMesh`.
 * @zh
 * `raySubMesh`的可选参数结构。
 */
export interface IRaySubMeshOptions {

    /**
     * @en
     * The raycast mode，`ANY` by default.
     * @zh
     * 射线检测模式：[0, 1, 2]=>[`ALL`, `CLOSEST`, `ANY`]
     */
    mode: ERaycastMode;

    /**
     * @en
     * The maximum distance of the raycast, `Infinity` by default.
     * @zh
     * 射线检测的最大距离，默认为`Infinity`。
     */
    distance: number;

    /**
     * @en
     * An array used to store the results of a ray detection.
     * @zh
     * 用于存储射线检测结果的数组。
     */
    result?: IRaySubMeshResult[];

    /**
     * @en
     * Whether to detect the double-sided or not，`false` by default.
     * @zh
     * 是否检测双面，默认为`false`。
     */
    doubleSided?: boolean;
}

/**
 * @en
 * The optional param structure of the `rayMesh`.
 * @zh
 * `rayMesh`的可选参数结构。
 */
export interface IRayMeshOptions extends IRaySubMeshOptions {

    /**
     * @en
     * The index of the sub mesh.
     * @zh
     * 子网格的索引。
     */
    subIndices?: number[];
}

/**
 * @en
 * The optional param structure of the `rayModel`.
 * @zh
 * `rayModel`的可选参数结构。
 */
export type IRayModelOptions = IRayMeshOptions
