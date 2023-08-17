/****************************************************************************
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.
 
 http://www.cocos.com
 
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

#include "base/memory/Memory.h"
#include "base/std/container/array.h"
#include "core/geometry/AABB.h"
#include "core/geometry/Enums.h"
#include "core/geometry/Plane.h"
#include "math/Mat4.h"
#include "math/Vec3.h"

namespace cc {
namespace geometry {

class Frustum final : public ShapeBase {
public:
    /**
     * @en
     * Create a ortho frustum.
     * @zh
     * 创建一个正交视锥体。
     * @param out @en The result orthographic frustum. @zh 输出的正交视锥体。
     * @param width @en The width of the frustum. @zh 正交视锥体的宽度。
     * @param height @en The height of the frustum. @zh 正交视锥体的高度。
     * @param near @en The near plane of the frustum. @zh 正交视锥体的近平面值。
     * @param far @en The far plane of the frustum. @zh 正交视锥体的远平面值。
     * @param transform @en The transform matrix of the frustum. @zh 正交视锥体的变换矩阵。
     *
     * @deprecated since 3.8.0, please use [createOrthographic] instead of it.
     */
    static void createOrtho(Frustum *out, float width,
                            float height,
                            float near,
                            float far,
                            const Mat4 &transform);

    /**
     * @en
     * Create a ortho frustum.
     * @zh
     * 创建一个正交视锥体。
     * @param out @en The result orthographic frustum. @zh 输出的正交视锥体。
     * @param width @en The width of the frustum. @zh 正交视锥体的宽度。
     * @param height @en The height of the frustum. @zh 正交视锥体的高度。
     * @param near @en The near plane of the frustum. @zh 正交视锥体的近平面值。
     * @param far @en The far plane of the frustum. @zh 正交视锥体的远平面值。
     * @param transform @en The transform matrix of the frustum. @zh 正交视锥体的变换矩阵。
     */
    static void createOrthographic(Frustum *out, float width,
                                   float height,
                                   float near,
                                   float far,
                                   const Mat4 &transform);

    /**
     * @en
     * Create a perspective frustum.
     * @zh
     * 创建一个透视视锥体。
     * @param out @en The result perspective frustum. @zh 输出的透视视锥体。
     * @param fov @en The field of view of the frustum. @zh 视锥体的视野。
     * @param aspect @en The aspect ratio of the frustum. @zh 视锥体的宽高比。
     * @param near @en The near plane of the frustum. @zh 视锥体的近平面值。
     * @param far @en The far plane of the frustum. @zh 视锥体的远平面值。
     * @param transform @en The transform matrix of the frustum. @zh 视锥体的变换矩阵。
     */
    static void createPerspective(Frustum *out, float fov,
                                  float aspect,
                                  float near,
                                  float far,
                                  const Mat4 &transform);

    /**
     * @en Create a frustum from an AABB box.
     * @zh 从 AABB 包围盒中创建一个视锥体。
     * @param out @en The result frustum @zh 输出的视锥体对象。
     * @param aabb @en The AABB bounding box of the frustum @zh AABB 包围盒。
     * @return @en The out object @zh 返回视锥体.
     *
     * @deprecated since 3.8.0, please use [createOrthographic] instead of it.
     */
    static Frustum *createFromAABB(Frustum *out, const AABB &aabb);

    /**
     * @en
     * Create a ccnew frustum.
     * @zh
     * 创建一个新的截锥体。
     * @return @en An empty frustum. @zh 一个空截椎体
     */
    static Frustum *create() {
        return ccnew Frustum();
    }

    /**
     * @en
     * Clone a frustum.
     * @zh
     * 克隆一个截锥体。
     * @param f @en The frustum to clone from @zh 用于克隆的截锥体
     * @return @en The cloned frustum @zh 克隆出的新截锥体
     */
    static Frustum *clone(const Frustum &f) {
        return Frustum::copy(ccnew Frustum(), f);
    }

    /**
     * @en
     * Copy the values from one frustum to another.
     * @zh
     * 从一个视锥体拷贝到另一个视锥体。
     * @param out @en The result frustum @zh 用于存储拷贝数据的截锥体
     * @param f @en The frustum to copy from @zh 用于克隆的截锥体
     * @return @en The out object @zh 传入的 out 对象

     */
    static Frustum *copy(Frustum *out, const Frustum &f) {
        out->setType(f.getType());
        for (size_t i = 0; i < 6; ++i) { // NOLINT(modernize-loop-convert)
            Plane::copy(out->planes[i], *(f.planes[i]));
        }
        out->vertices = f.vertices;
        return out;
    }

    Frustum();
    Frustum(const Frustum &rhs);
    Frustum(Frustum &&rhs) = delete;
    ~Frustum() override;

    // Can remove these operator override functions if not using Plane* in planes array.
    Frustum &operator=(const Frustum &rhs);
    Frustum &operator=(Frustum &&rhs) = delete;

    /**
     * @en
     * Transform this frustum.
     * @zh
     * 变换此截锥体。
     * @param mat 变换矩阵。
     */
    void transform(const Mat4 &);

    void createOrtho(float width, float height, float near, float far, const Mat4 &transform);
    void createOrthographic(float width, float height, float near, float far, const Mat4 &transform);

    /**
     * @en
     * Set as a perspective frustum.
     * @zh
     * 设置为一个透视视锥体。
     * @param near @en The near plane of the frustum. @zh 视锥体的近平面值。
     * @param far @en The far plane of the frustum. @zh 视锥体的远平面值。
     * @param fov @en The field of view of the frustum. @zh 视锥体的视野。
     * @param aspect @en The aspect ratio of the frustum. @zh 视锥体的宽高比。
     * @param transform @en The transform matrix of the frustum. @zh 视锥体的变换矩阵。
     * 
     * @deprecated since 3.8.0, please use [createPerspective] instead of it.
     */
    void split(float near, float far, float aspect, float fov, const Mat4 &transform);
    void updatePlanes();
    void update(const Mat4 &m, const Mat4 &inv);

    /**
     * @en
     * Set whether to use accurate intersection testing function on this frustum.
     * @zh
     * 设置是否在此截锥体上使用精确的相交测试函数。
     * 
     * @deprecated since v3.8.0 no need to set accurate flag since it doesn't affect the calculation at all.
     */
    inline void setAccurate(bool accurate) {
        setType(accurate ? ShapeEnum::SHAPE_FRUSTUM_ACCURATE : ShapeEnum::SHAPE_FRUSTUM);
    }

    ccstd::array<Vec3, 8> vertices;
    ccstd::array<Plane *, 6> planes;

private:
    void init();
};

} // namespace geometry
} // namespace cc
