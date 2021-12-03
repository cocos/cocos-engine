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

#include "scene/AABB.h"
#include "scene/Frustum.h"
#include "scene/Light.h"

namespace cc {
namespace scene {

class SpotLight : public Light {
public:
    SpotLight()                  = default;
    SpotLight(const SpotLight &) = delete;
    SpotLight(SpotLight &&)      = delete;
    ~SpotLight() override        = default;
    SpotLight &operator=(const SpotLight &) = delete;
    SpotLight &operator=(SpotLight &&) = delete;

    void update() override;

    inline void setAABB(AABB *aabb) { _aabb = aabb; }
    inline void setAngle(float angle) {
        _spotAngle  = angle;
        _angle      = acos(_spotAngle) * 2;
        _needUpdate = true;
    }
    inline void setAspect(float aspect) {
        _aspect     = aspect;
        _needUpdate = true;
    }
    inline void setDirection(const Vec3 &dir) { _dir = dir; }
    inline void setFrustum(Frustum frustum) { _frustum = std::move(frustum); }
    inline void setLuminanceHDR(float illu) { _luminanceHDR = illu; }
    inline void setLuminanceLDR(float illu) { _luminanceLDR = illu; }
    inline void setNeedUpdate(bool value) { _needUpdate = value; }
    inline void setRange(float range) {
        _range      = range;
        _needUpdate = true;
    }
    inline void setPosition(const Vec3 &pos) { _pos = pos; }
    inline void setSize(float size) { _size = size; }

    inline AABB *         getAABB() const { return _aabb; }
    inline float          getAngle() const { return _angle; }
    inline float          getSpotAngle() const { return _spotAngle; }
    inline float          getAspect() const { return _aspect; }
    inline const Vec3 &   getDirection() const { return _dir; }
    inline const Frustum &getFrustum() const { return _frustum; }
    inline float          getLuminanceHDR() const { return _luminanceHDR; }
    inline float          getLuminanceLDR() const { return _luminanceLDR; }
    inline bool           getNeedUpdate() const { return _needUpdate; }
    inline float          getRange() const { return _range; }
    inline const Vec3 &   getPosition() const { return _pos; }
    inline float          getSize() const { return _size; }

private:
    bool    _needUpdate{false};
    float   _luminanceHDR{0.F};
    float   _luminanceLDR{0.F};
    float   _range{0.F};
    float   _size{0.F};
    float   _angle{0.F};
    float   _spotAngle{0.F};
    float   _aspect{0.F};
    Vec3    _dir;
    Vec3    _pos;
    AABB *  _aabb{nullptr};
    Frustum _frustum;
};

} // namespace scene
} // namespace cc
