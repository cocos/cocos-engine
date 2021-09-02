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
#include "math/Mat3.h"
#include "math/Quaternion.h"
#include "math/Vec3.h"
#include "scene/Frustum.h"

namespace cc {
namespace scene {

struct AABBLayout {
    cc::Vec3 center;
    cc::Vec3 halfExtents{1, 1, 1};
};
class AABB final {
public:
    static void fromPoints(const Vec3 &minPos, const Vec3 &maxPos, AABB *dst);
    static void transformExtentM4(Vec3 *out, const Vec3 &extent, const Mat4 &m4);
    AABB();
    AABB(const AABB &) = delete;
    AABB(AABB &&)      = delete;
    ~AABB()            = default;
    AABB &operator=(const AABB &) = delete;
    AABB &operator=(AABB &&) = delete;

    void               initWithData(uint8_t *data);
    bool               aabbAabb(AABB *aabb) const;
    bool               aabbFrustum(const Frustum &) const;
    int                aabbPlane(const Plane &) const;
    void               getBoundary(cc::Vec3 *minPos, cc::Vec3 *maxPos) const;
    void               merge(const AABB &aabb);
    void               merge(const cc::Vec3 &point);
    void               merge(const Frustum &frustum);
    void               set(const cc::Vec3 &centerVal, const cc::Vec3 &halfExtentVal);
    void               transform(const Mat4 &m, AABB *out) const;
    inline void        setCenter(float x, float y, float z) { _aabbLayout->center.set(x, y, z); }
    inline void        setCenter(const Vec3 &center) { _aabbLayout->center.set(center); }
    inline void        setValid(bool isValid) { _isValid = isValid; }
    inline const Vec3 &getCenter() const { return _aabbLayout->center; }
    inline bool        getValid() const { return _isValid; }
    inline void        setHalfExtents(float x, float y, float z) { _aabbLayout->halfExtents.set(x, y, z); }
    inline void        setHalfExtents(const Vec3 &halfExtents) { _aabbLayout->halfExtents.set(halfExtents); }
    inline const Vec3 &getHalfExtents() const { return _aabbLayout->halfExtents; }
    inline AABBLayout *getLayout() { return _aabbLayout; }

private:
    AABBLayout  _embedLayout;
    AABBLayout *_aabbLayout{nullptr};
    bool        _isValid{true};
};

} // namespace scene
} // namespace cc
