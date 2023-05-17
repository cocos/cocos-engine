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
 * Basic Geometry: Triangle.
 * @zh
 * 基础几何 三角形。
 */

class Triangle final : public ShapeBase {
public:
    /**
     * @en
     * create a new triangle
     * @zh
     * 创建一个新的 triangle。
     * @param {number} ax a 点的 x 部分。
     * @param {number} ay a 点的 y 部分。
     * @param {number} az a 点的 z 部分。
     * @param {number} bx b 点的 x 部分。
     * @param {number} by b 点的 y 部分。
     * @param {number} bz b 点的 z 部分。
     * @param {number} cx c 点的 x 部分。
     * @param {number} cy c 点的 y 部分。
     * @param {number} cz c 点的 z 部分。
     * @return {Triangle} 一个新的 triangle。
     */
    static Triangle *create(float ax = 1, float ay = 0, float az = 0,
                            float bx = 0, float by = 0, float bz = 0,
                            float cx = 0, float cy = 0, float cz = 1);

    /**
     * @en
     * clone a new triangle
     * @zh
     * 克隆一个新的 triangle。
     * @param {Triangle} t 克隆的目标。
     * @return {Triangle} 克隆出的新对象。
     */

    static Triangle *clone(const Triangle &t);

    /**
     * @en
     * copy the values from one triangle to another
     * @zh
     * 将一个 triangle 的值复制到另一个 triangle。
     * @param {Triangle} out 接受操作的 triangle。
     * @param {Triangle} t 被复制的 triangle。
     * @return {Triangle} out 接受操作的 triangle。
     */

    static Triangle *copy(Triangle *out, const Triangle &t);

    /**
     * @en
     * Create a triangle from three points
     * @zh
     * 用三个点创建一个 triangle。
     * @param {Triangle} out 接受操作的 triangle。
     * @param {Vec3} a a 点。
     * @param {Vec3} b b 点。
     * @param {Vec3} c c 点。
     * @return {Triangle} out 接受操作的 triangle。
     */
    static Triangle *fromPoints(Triangle *out, const Vec3 &a,
                                const Vec3 &b,
                                const Vec3 &c);

    /**
     * @en
     * Set the components of a triangle to the given values
     * @zh
     * 将给定三角形的属性设置为给定值。
     * @param {Triangle} out 给定的三角形。
     * @param {number} ax a 点的 x 部分。
     * @param {number} ay a 点的 y 部分。
     * @param {number} az a 点的 z 部分。
     * @param {number} bx b 点的 x 部分。
     * @param {number} by b 点的 y 部分。
     * @param {number} bz b 点的 z 部分。
     * @param {number} cx c 点的 x 部分。
     * @param {number} cy c 点的 y 部分。
     * @param {number} cz c 点的 z 部分。
     * @return {Triangle}
     * @function
     */
    static Triangle *set(Triangle *out,
                         float ax, float ay, float az,
                         float bx, float by, float bz,
                         float cx, float cy, float cz);

    /**
     * @en
     * Point a.
     * @zh
     * 点 a。
     */

    Vec3 a;

    /**
     * @en
     * Point b.
     * @zh
     * 点 b。
     */
    Vec3 b;

    /**
     * @en
     * Point c.
     * @zh
     * 点 c。
     */
    Vec3 c;
    /**
     * @en
     * Construct a triangle.
     * @zh
     * 构造一个三角形。
     * @param {number} ax a 点的 x 部分。
     * @param {number} ay a 点的 y 部分。
     * @param {number} az a 点的 z 部分。
     * @param {number} bx b 点的 x 部分。
     * @param {number} by b 点的 y 部分。
     * @param {number} bz b 点的 z 部分。
     * @param {number} cx c 点的 x 部分。
     * @param {number} cy c 点的 y 部分。
     * @param {number} cz c 点的 z 部分。
     */
    explicit Triangle(float ax = 0, float ay = 0, float az = 0,
                      float bx = 1, float by = 0, float bz = 0,
                      float cx = 0, float cy = 1, float cz = 0);

    Triangle(const Triangle &) = default;
    Triangle(Triangle &&) = default;
    ~Triangle() override = default;
    Triangle &operator=(const Triangle &) = default;
    Triangle &operator=(Triangle &&) = default;

}; // namespace geometry

} // namespace geometry
} // namespace cc
