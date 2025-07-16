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

#include "core/geometry/AABB.h"
#include "core/geometry/Frustum.h"
#include "scene/Light.h"

namespace cc {
namespace scene {

class SpotLight final : public Light {
public:
    SpotLight();
    ~SpotLight() override;

    void initialize() override;
    void update() override;

    inline const Vec3 &getPosition() const { return _pos; }

    inline float getSize() const { return _size; }
    inline void setSize(float size) { _size = size; }

    inline float getRange() const { return _range; }
    inline void setRange(float range) {
        _range = range;
        _needUpdate = true;
    }

    inline void setLuminanceHDR(float value) { _luminanceHDR = value; }
    inline void setLuminanceLDR(float value) { _luminanceLDR = value; }

    float getLuminance() const;
    void setLuminance(float value);

    inline const Vec3 &getDirection() const { return _dir; }

    inline float getSpotAngle() const { return _spotAngle; }
    inline void setSpotAngle(float val) {
        _angle = val;
        _spotAngle = cos(val * 0.5F);
        _needUpdate = true;
    }

    inline float getAngleAttenuationStrength() const {
        return _angleAttenuationStrength;
    }
    inline void setAngleAttenuationStrength(float val) noexcept {
        _angleAttenuationStrength = val;
        _needUpdate = true;
    }

    inline float getAngle() const { return _angle; }

    inline const geometry::AABB &getAABB() const { return *_aabb; }

    inline const geometry::Frustum &getFrustum() const { return *_frustum; }
    inline float getLuminanceHDR() const { return _luminanceHDR; }
    inline float getLuminanceLDR() const { return _luminanceLDR; }

    inline void setFrustum(const geometry::Frustum &frustum) { *_frustum = frustum; }

    inline void setShadowEnabled(bool enabled) { _shadowEnabled = enabled; }
    inline bool isShadowEnabled() const { return _shadowEnabled; }

    inline float getShadowPcf() const { return _shadowPcf; }
    inline void setShadowPcf(float pcf) { _shadowPcf = pcf; }

    inline void setShadowBias(float bias) { _shadowBias = bias; }
    inline float getShadowBias() const { return _shadowBias; }

    inline void setShadowNormalBias(float normalBias) { _shadowNormalBias = normalBias; }
    inline float getShadowNormalBias() const { return _shadowNormalBias; }

private:
    bool _needUpdate{false};
    float _luminanceHDR{0.F};
    float _luminanceLDR{0.F};
    float _range{0.F};
    float _size{0.F};
    float _angle{0.F};
    float _spotAngle{0.F};
    float _angleAttenuationStrength{0.F};
    Vec3 _dir;
    Vec3 _pos;
    geometry::AABB *_aabb{nullptr};
    geometry::Frustum *_frustum{nullptr};

    // shadow info
    bool _shadowEnabled{false};
    // TODO(minggo): use PCTFType instead.
    float _shadowPcf{0.0F};
    float _shadowBias{0.00001F};
    float _shadowNormalBias{0.0F};

    CC_DISALLOW_COPY_MOVE_ASSIGN(SpotLight);
};

} // namespace scene
} // namespace cc
