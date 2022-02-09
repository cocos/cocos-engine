/****************************************************************************
 Copyright (c) 2021-2022 Xiamen Yaji Software Co., Ltd.

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

#include "math/Vec3.h"
#include "scene/AABB.h"
#include "scene/Frustum.h"

namespace cc {
namespace scene {

class Sphere {
public:
    Sphere()               = default;
    Sphere(const Sphere &) = delete;
    Sphere(Sphere &&)      = delete;
    ~Sphere()              = default;
    Sphere &operator=(const Sphere &) = delete;
    Sphere &operator=(Sphere &&) = delete;

    inline float       getRadius() const { return _radius; }
    inline const Vec3 &getCenter() const { return _center; }
    inline void        setCenter(const Vec3 &val) { _center = val; }
    inline void        setRadius(float val) { _radius = val; }

    void define(const AABB &aabb);
    void merge(const AABB *aabb);
    void merge(const Vec3 &point);
    bool interset(const Frustum &frustum) const;
    int  interset(const Plane &plane) const;
    int  spherePlane(const Plane &plane);
    bool sphereFrustum(const Frustum &frustum) const;
    void merge(const Frustum &frustum);

private:
    float _radius{-1.0F};
    Vec3  _center;
};

} // namespace scene
} // namespace cc
