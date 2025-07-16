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

#include "core/geometry/Enums.h"
#include "math/Vec3.h"

namespace cc {
namespace geometry {

/**
 * @en
 * Basic Geometry: ray.
 * @zh
 * 基础几何 射线。
 */

class Ray final : public ShapeBase {
public:
    /**
     * @en
     * create a new ray
     * @zh
     * 创建一条射线。
     * @param {number} ox 起点的 x 部分。
     * @param {number} oy 起点的 y 部分。
     * @param {number} oz 起点的 z 部分。
     * @param {number} dx 方向的 x 部分。
     * @param {number} dy 方向的 y 部分。
     * @param {number} dz 方向的 z 部分。
     * @return {Ray} 射线。
     */
    static Ray *create(float ox = 0, float oy = 0, float oz = 0, float dx = 0, float dy = 0, float dz = 1);

    /**
     * @en
     * Creates a new ray initialized with values from an existing ray
     * @zh
     * 从一条射线克隆出一条新的射线。
     * @param {Ray} a 克隆的目标。
     * @return {Ray} 克隆出的新对象。
     */
    static Ray *clone(const Ray &a);
    /**
     * @en
     * Copy the values from one ray to another
     * @zh
     * 将从一个 ray 的值复制到另一个 ray。
     * @param {Ray} out 接受操作的 ray。
     * @param {Ray} a 被复制的 ray。
     * @return {Ray} out 接受操作的 ray。
     */
    static Ray *copy(Ray *out, const Ray &a);

    /**
     * @en
     * create a ray from two points
     * @zh
     * 用两个点创建一条射线。
     * @param {Ray} out 接受操作的射线。
     * @param {Vec3} origin 射线的起点。
     * @param {Vec3} target 射线上的一点。
     * @return {Ray} out 接受操作的射线。
     */
    static Ray *fromPoints(Ray *out, const Vec3 &origin, const Vec3 &target);

    /**
     * @en
     * Set the components of a ray to the given values
     * @zh
     * 将给定射线的属性设置为给定的值。
     * @param {Ray} out 接受操作的射线。
     * @param {number} ox 起点的 x 部分。
     * @param {number} oy 起点的 y 部分。
     * @param {number} oz 起点的 z 部分。
     * @param {number} dx 方向的 x 部分。
     * @param {number} dy 方向的 y 部分。
     * @param {number} dz 方向的 z 部分。
     * @return {Ray} out 接受操作的射线。
     */

    static Ray *set(Ray *out, float ox, float oy,
                    float oz,
                    float dx,
                    float dy,
                    float dz);

    /**
     * @en
     * The origin of the ray.
     * @zh
     * 起点。
     */
    Vec3 o;

    /**
     * @en
     * The direction of the ray.
     * @zh
     * 方向。
     */
    Vec3 d;

    /**
     * @en
     * Construct a ray;
     * @zh
     * 构造一条射线。
     * @param {number} ox 起点的 x 部分。
     * @param {number} oy 起点的 y 部分。
     * @param {number} oz 起点的 z 部分。
     * @param {number} dx 方向的 x 部分。
     * @param {number} dy 方向的 y 部分。
     * @param {number} dz 方向的 z 部分。
     */
    explicit Ray(float ox = 0, float oy = 0, float oz = 0,
                 float dx = 0, float dy = 0, float dz = -1);

    Ray(const Ray &) = default;
    Ray &operator=(const Ray &) = default;
    Ray &operator=(Ray &&) = default;
    Ray(Ray &&) = default;
    ~Ray() override = default;

    /**
     * @en
     * Compute a point with the distance between the origin.
     * @zh
     * 根据给定距离计算出射线上的一点。
     * @param out 射线上的另一点。
     * @param distance 给定距离。
     */

    void computeHit(Vec3 *out, float distance) const;
};

} // namespace geometry
} // namespace cc