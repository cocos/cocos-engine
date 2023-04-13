/****************************************************************************
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

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
****************************************************************************/

#pragma once

#include <cfloat>
#include <cstdint>

#include "base/std/container/vector.h"
#include "base/std/optional.h"

namespace cc {
namespace geometry {

/**
 * @en
 * The raycast mode.
 * @zh
 * 射线检测模式。
 */
enum class ERaycastMode {

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
};

/**
 * @en
 * The storage structure of the raycast results.
 * @zh
 * 射线检测结果的存储结构。
 */
struct IRaySubMeshResult {
    /**
     * @en
     * The distance between the hit point and the ray.
     * @zh
     * 击中点和射线的距离。
     */
    float distance{0.0F};

    /**
     * @en
     * The index of the triangle vertex 0。
     * @zh
     * 三角形顶点0的索引。
     */
    uint32_t vertexIndex0{0};

    /**
     * @en
     * The index of the triangle vertex 1。
     * @zh
     * 三角形顶点1的索引
     */
    uint32_t vertexIndex1{0};

    /**
     * @en
     * The index of the triangle vertex 2。
     * @zh
     * 三角形顶点2的索引
     */
    uint32_t vertexIndex2{0};
};

/**
 * @en
 * The optional param structure of the `raySubMesh`.
 * @zh
 * `raySubMesh`的可选参数结构。
 */
struct IRaySubMeshOptions {
    /**
     * @en
     * The raycast mode，`ANY` by default.
     * @zh
     * 射线检测模式：[0, 1, 2]=>[`ALL`, `CLOSEST`, `ANY`]
     */
    ERaycastMode mode;

    /**
     * @en
     * The maximum distance of the raycast, `Infinity` by default.
     * @zh
     * 射线检测的最大距离，默认为`Infinity`。
     */
    float distance = FLT_MAX;

    /**
     * @en
     * An array used to store the results of a ray detection.
     * @zh
     * 用于存储射线检测结果的数组。
     */
    ccstd::optional<ccstd::vector<IRaySubMeshResult>> result{};

    /**
     * @en
     * Whether to detect the double-sided or not，`false` by default.
     * @zh
     * 是否检测双面，默认为`false`。
     */
    bool doubleSided{false};
};

/**
 * @en
 * The optional param structure of the `rayMesh`.
 * @zh
 * `rayMesh`的可选参数结构。
 */
struct IRayMeshOptions : public IRaySubMeshOptions {
    /**
     * @en
     * The index of the sub mesh.
     * @zh
     * 子网格的索引。
     */
    ccstd::optional<ccstd::vector<uint32_t>> subIndices{};
};

/**
 * @en
 * The optional param structure of the `rayModel`.
 * @zh
 * `rayModel`的可选参数结构。
 */
using IRayModelOptions = IRayMeshOptions;

} // namespace geometry
} // namespace cc
