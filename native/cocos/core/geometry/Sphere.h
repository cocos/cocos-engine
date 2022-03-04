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

#include "core/geometry/Enums.h"
#include "core/geometry/Frustum.h"
#include "math/Utils.h"
#include "math/Vec3.h"

namespace cc {
namespace geometry {

class AABB;

class Sphere final : public ShapeBase {
public:
    /**
     * @en
     * create a new sphere
     * @zh
     * 创建一个新的 sphere 实例。
     * @param cx 形状的相对于原点的 X 坐标。
     * @param cy 形状的相对于原点的 Y 坐标。
     * @param cz 形状的相对于原点的 Z 坐标。
     * @param r 球体的半径
     * @return {Sphere} 返回一个 sphere。
     */
    static Sphere *create(float cx, float cy, float cz, float radius);

    /**
     * @en
     * clone a new sphere
     * @zh
     * 克隆一个新的 sphere 实例。
     * @param {Sphere} p 克隆的目标。
     * @return {Sphere} 克隆出的示例。
     */
    static Sphere *clone(const Sphere &p);
    /**
     * @en
     * copy the values from one sphere to another
     * @zh
     * 将从一个 sphere 的值复制到另一个 sphere。
     * @param {Sphere} out 接受操作的 sphere。
     * @param {Sphere} a 被复制的 sphere。
     * @return {Sphere} out 接受操作的 sphere。
     */
    static Sphere *copy(Sphere *out, const Sphere &p);

    /**
     * @en
     * create a new bounding sphere from two corner points
     * @zh
     * 从两个点创建一个新的 sphere。
     * @param out - 接受操作的 sphere。
     * @param minPos - sphere 的最小点。
     * @param maxPos - sphere 的最大点。
     * @returns {Sphere} out 接受操作的 sphere。
     */
    static Sphere *fromPoints(Sphere *out, const Vec3 &minPos, const Vec3 &maxPos);

    /**
     * @en
     * Set the components of a sphere to the given values
     * @zh
     * 将球体的属性设置为给定的值。
     * @param {Sphere} out 接受操作的 sphere。
     * @param cx 形状的相对于原点的 X 坐标。
     * @param cy 形状的相对于原点的 Y 坐标。
     * @param cz 形状的相对于原点的 Z 坐标。
     * @param {number} r 半径。
     * @return {Sphere} out 接受操作的 sphere。
     * @function
     */
    static Sphere *set(Sphere *out, float cx, float cy, float cz, float r);
    /**
     * @zh
     * 球跟点合并
     */
    static Sphere *mergePoint(Sphere *out, const Sphere &s, const Vec3 &point);

    /**
     * @zh
     * 球跟立方体合并
     */
    static Sphere *mergeAABB(Sphere *out, const Sphere &s, const AABB &a);
    explicit Sphere(float cx = 0, float cy = 0, float cz = 0, float radius = 1.0F);

    Sphere(const Sphere &) = delete;
    Sphere(Sphere &&)      = delete;
    ~Sphere() override     = default;
    Sphere &operator=(const Sphere &) = delete;
    Sphere &operator=(Sphere &&) = delete;

    inline float       getRadius() const { return _radius; }
    inline const Vec3 &getCenter() const { return _center; }
    inline void        setCenter(const Vec3 &val) { _center = val; }
    inline void        setRadius(float val) { _radius = val; }

    inline Sphere *clone() const {
        return Sphere::clone(*this);
    }

    inline Sphere *copy(Sphere *out) const {
        return Sphere::copy(out, *this);
    }

    void        define(const AABB &aabb);
    void        mergeAABB(const AABB *aabb);
    void        mergePoint(const Vec3 &point);
    void        mergeFrustum(const Frustum &frustum);
    inline void merge(const AABB *aabb) { mergeAABB(aabb); }
    inline void merge(const Vec3 &point) { mergePoint(point); }
    void        merge(const std::vector<Vec3> &points);
    inline void merge(const Frustum &frustum) { mergeFrustum(frustum); }
    bool        interset(const Frustum &frustum) const;
    int         interset(const Plane &plane) const;
    int         spherePlane(const Plane &plane);
    bool        sphereFrustum(const Frustum &frustum) const;

    /**
     * @en
     * Get the bounding points of this shape
     * @zh
     * 获取此形状的边界点。
     * @param {Vec3} minPos 最小点。
     * @param {Vec3} maxPos 最大点。
     */
    void getBoundary(Vec3 *minPos, Vec3 *maxPos) const;

    /**
     * @en
     * Transform this shape
     * @zh
     * 将 out 根据这个 sphere 的数据进行变换。
     * @param m 变换的矩阵。
     * @param pos 变换的位置部分。
     * @param rot 变换的旋转部分。
     * @param scale 变换的缩放部分。
     * @param out 变换的目标。
     */
    void transform(const Mat4 &m,
                   const Vec3 & /*pos*/,
                   const Quaternion & /*rot*/,
                   const Vec3 &scale,
                   Sphere *    out) const;

    /**
     * @en
     * Translate and rotate this sphere.
     * @zh
     * 将 out 根据这个 sphere 的数据进行变换。
     * @param m 变换的矩阵。
     * @param rot 变换的旋转部分。
     * @param out 变换的目标。
     */
    inline void translateAndRotate(const Mat4 &m, const Quaternion & /*rot*/, Sphere *out) const {
        Vec3::transformMat4(_center, m, &out->_center);
    }

    /**
     * @en
     * Scaling this sphere.
     * @zh
     * 将 out 根据这个 sphere 的数据进行缩放。
     * @param scale 缩放值。
     * @param out 缩放的目标。
     */
    inline void setScale(const Vec3 &scale, Sphere *out) const {
        out->_radius = _radius * mathutils::maxComponent(scale);
    }

private:
    float _radius{-1.0};
    Vec3  _center;
};

} // namespace geometry
} // namespace cc
