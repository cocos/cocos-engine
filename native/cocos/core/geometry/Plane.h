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

#include "cocos/core/geometry/Enums.h"
#include "cocos/math/Mat4.h"
#include "cocos/math/Vec3.h"
#include "cocos/math/Vec4.h"

namespace cc {
namespace geometry {
/**
 * @en
 * Basic Geometry: Plane.
 * @zh
 * 基础几何 Plane。
 */
class Plane final : public ShapeBase {
    /**
     * @en
     * create a new plane
     * @zh
     * 创建一个新的 plane。
     * @param nx 法向分量的 x 部分。
     * @param ny 法向分量的 y 部分。
     * @param nz 法向分量的 z 部分。
     * @param d 与原点的距离。
     * @return
     */
public:
    static Plane *create(float nx, float ny, float nz, float d);

    /**
     * @en
     * clone a new plane
     * @zh
     * 克隆一个新的 plane。
     * @param p 克隆的来源。
     * @return 克隆出的对象。
     */
    static Plane *clone(const Plane &p);

    /**
     * @en
     * copy the values from one plane to another
     * @zh
     * 复制一个平面的值到另一个。
     * @param out 接受操作的对象。
     * @param p 复制的来源。
     * @return 接受操作的对象。
     */

    static Plane *copy(Plane *out, const Plane &p);

    /**
     * @en
     * create a plane from three points
     * @zh
     * 用三个点创建一个平面。
     * @param out 接受操作的对象。
     * @param a 点 a。
     * @param b 点 b。
     * @param c 点 c。
     * @return out 接受操作的对象。
     */
    static Plane *fromPoints(Plane *out,
                             const Vec3 &a,
                             const Vec3 &b,
                             const Vec3 &c);

    /**
     * @en
     * Set the components of a plane to the given values
     * @zh
     * 将给定平面的属性设置为给定值。
     * @param out 接受操作的对象。
     * @param nx 法向分量的 x 部分。
     * @param ny 法向分量的 y 部分。
     * @param nz 法向分量的 z 部分。
     * @param d 与原点的距离。
     * @return out 接受操作的对象。
     */
    static Plane *set(Plane *out, float nx, float ny, float nz, float d);

    /**
     * @en
     * create plane from normal and point
     * @zh
     * 用一条法线和一个点创建平面。
     * @param out 接受操作的对象。
     * @param normal 平面的法线。
     * @param point 平面上的一点。
     * @return out 接受操作的对象。
     */
    static Plane *fromNormalAndPoint(Plane *out, const Vec3 &normal, const Vec3 &point);

    /**
     * @en
     * normalize a plane
     * @zh
     * 归一化一个平面。
     * @param out 接受操作的对象。
     * @param a 操作的源数据。
     * @return out 接受操作的对象。
     */
    static Plane *normalize(Plane *out, const Plane &a);

    // compatibility with vector interfaces
    inline void setX(float val) { n.x = val; }
    inline float getX() const { return n.x; }
    inline void setY(float val) { n.y = val; }
    inline float getY() const { return n.y; }
    inline void setZ(float val) { n.z = val; }
    inline float getZ() const { return n.z; }
    inline void setW(float val) { d = val; }
    inline float getW() const { return d; }

    /**
     * @en
     * Construct a plane.
     * @zh
     * 构造一个平面。
     * @param nx 法向分量的 x 部分。
     * @param ny 法向分量的 y 部分。
     * @param nz 法向分量的 z 部分。
     * @param d 与原点的距离。
     */
    explicit Plane(float nx, float ny, float nz, float d);

    Plane() : ShapeBase(ShapeEnum::SHAPE_PLANE) {}
    // Plane(const Plane& other) = default;
    // Plane(Plane&& other)      = default;
    // Plane& operator=(const Plane& other) = default;
    // Plane& operator=(Plane&& other) = default;
    // ~Plane()                        = default;

    /**
     * @en
     * transform this plane.
     * @zh
     * 变换一个平面。
     * @param mat
     */
    void transform(const Mat4 &mat);

    /**
     * @en
     * The normal of the plane.
     * @zh
     * 法线向量。
     */
    Vec3 n{0.0F, 1.0F, 0.0F};

    /**
     * @en
     * The distance from the origin to the plane.
     * @zh
     * 原点到平面的距离。
     */
    float d{0.0F};

    void define(const Vec3 &v0, const Vec3 &v1, const Vec3 &v2);
    void define(const Vec3 &normal, const Vec3 &point);
    float distance(const Vec3 &point) const;
    Plane clone() const;
};

} // namespace geometry
} // namespace cc
