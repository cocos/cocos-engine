/****************************************************************************
 Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.
 
 http://www.cocos.com
 
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
 ****************************************************************************/

#pragma once

#include <algorithm>
#include <vector>
#include "core/geometry/Enums.h"
#include "math/Mat3.h"
#include "math/Quaternion.h"
#include "math/Vec3.h"

namespace cc {
namespace geometry {

class Sphere;
class Frustum;
class Plane;

class AABB final : public ShapeBase {
public:
    /**
      * @en
      * create a new AABB
      * @zh
      * 创建一个新的 AABB 实例。
      * @param px - AABB 的原点的 X 坐标。
      * @param py - AABB 的原点的 Y 坐标。
      * @param pz - AABB 的原点的 Z 坐标。
      * @param hw - AABB 宽度的一半。
      * @param hh - AABB 高度的一半。
      * @param hl - AABB 长度的一半。
      * @returns 返回新创建的 AABB 实例。
      */
    static AABB *create(float px, float py, float pz, float hw, float hh, float hl) {
        return new AABB(px, py, pz, hw, hh, hl);
    }

    /**
      * @en
      * Set the components of a AABB to the given values
      * @zh
      * 将 AABB 的属性设置为给定的值。
      * @param {AABB} out 接受操作的 AABB。
      * @param px - AABB 的原点的 X 坐标。
      * @param py - AABB 的原点的 Y 坐标。
      * @param pz - AABB 的原点的 Z 坐标。
      * @param hw - AABB 宽度的一半。
      * @param hh - AABB 高度的一半。
      * @param hl - AABB 长度度的一半。
      * @return {AABB} out 接受操作的 AABB。
      */

    static AABB *set(AABB *out, float px, float py,
                     float pz,
                     float hw,
                     float hh,
                     float hl) {
        out->setCenter(px, py, pz);
        out->setHalfExtents(hw, hh, hl);
        return out;
    }

    /**
      * @en
      * Merge tow AABB.
      * @zh
      * 合并两个 AABB 到 out。
      * @param out 接受操作的 AABB。
      * @param a 输入的 AABB。
      * @param b 输入的 AABB。
      * @returns {AABB} out 接受操作的 AABB。
      */
    static AABB *merge(AABB *out, const AABB &a, const AABB &b);

    /**
      * @en
      * AABB to sphere
      * @zh
      * 包围盒转包围球
      * @param out 接受操作的 sphere。
      * @param a 输入的 AABB。
      */

    static Sphere *toBoundingSphere(Sphere *out, const AABB &a);

    static AABB *fromPoints(const Vec3 &minPos, const Vec3 &maxPos, AABB *dst);
    static void  transformExtentM4(Vec3 *out, const Vec3 &extent, const Mat4 &m4);

    AABB(float px, float py, float pz, float hw, float hh, float hl);
    AABB();
    ~AABB() override = default;

    /**
     * @en
     * aabb-plane intersect detect.
     * @zh
     * 轴对齐包围盒和平面的相交性检测。
     * @param {AABB} aabb 轴对齐包围盒
     * @param {Plane} plane 平面
     * @return {number} inside(back) = -1, outside(front) = 0, intersect = 1
     */
    bool aabbAabb(const AABB &aabb) const;

    /**
     * @en
     * aabb-frustum intersect detect, faster but has false positive corner cases.
     * @zh
     * 轴对齐包围盒和锥台相交性检测，速度快，但有错误情况。
     * @param {AABB} aabb 轴对齐包围盒
     * @param {Frustum} frustum 锥台
     * @return {number} 0 或 非0
     */
    bool aabbFrustum(const Frustum &) const;

    int                aabbPlane(const Plane &) const;
    void               getBoundary(cc::Vec3 *minPos, cc::Vec3 *maxPos) const;
    void               merge(const AABB &aabb);
    void               merge(const cc::Vec3 &point);
    void               merge(const std::vector<cc::Vec3> &points);
    void               merge(const Frustum &frustum);
    void               set(const cc::Vec3 &centerVal, const cc::Vec3 &halfExtentVal);
    void               transform(const Mat4 &m, AABB *out) const;
    bool               contain(const cc::Vec3 &point) const;
    inline void        setCenter(float x, float y, float z) { center.set(x, y, z); }
    inline void        setCenter(const Vec3 &center) { this->center.set(center); }
    inline void        setValid(bool isValid) { _isValid = isValid; }
    inline const Vec3 &getCenter() const { return center; }
    inline bool        isValid() const { return _isValid; }
    inline void        setHalfExtents(float x, float y, float z) { halfExtents.set(x, y, z); }
    inline void        setHalfExtents(const Vec3 &halfExtents) { this->halfExtents.set(halfExtents); }
    inline const Vec3 &getHalfExtents() const { return halfExtents; }

    cc::Vec3 center;
    cc::Vec3 halfExtents{1, 1, 1};

private:
    bool _isValid{true};
};

} // namespace geometry
} // namespace cc
