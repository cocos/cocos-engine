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
#include "math/Vec2.h"
#include "scene/Light.h"

namespace cc {
namespace scene {

class DirectionalLight : public Light {
public:
    DirectionalLight()                         = default;
    DirectionalLight(const DirectionalLight &) = delete;
    DirectionalLight(DirectionalLight &&)      = delete;
    ~DirectionalLight() override               = default;
    DirectionalLight &operator=(const DirectionalLight &) = delete;
    DirectionalLight &operator=(DirectionalLight &&) = delete;

    void update() override;

    inline void setDirection(const Vec3 &dir) { _dir = dir; }
    inline void setIlluminanceHDR(float illum) { _illuminanceHDR = illum; }
    inline void setIlluminanceLDR(float illum) { _illuminanceLDR = illum; }
    inline void setShadowEnabled(bool enabled) { _shadowEnabled = enabled; }
    inline void setShadowPcf(float pcf) { _shadowPcf = pcf; }
    inline void setShadowBias(float bias) { _shadowBias = bias; }
    inline void setShadowNormalBias(float normalBias) { _shadowNormalBias = normalBias; }
    inline void setShadowSaturation(float saturation) { _shadowSaturation = saturation; }
    inline void setShadowDistance(float distance) { _shadowDistance = distance; }
    inline void setShadowInvisibleOcclusionRange(float invisibleOcclusionRange) { _shadowInvisibleOcclusionRange = invisibleOcclusionRange; }
    inline void setShadowFixedArea(bool fixedArea) { _shadowFixedArea = fixedArea; }
    inline void setShadowNear(float nearValue) { _shadowNear = nearValue; }
    inline void setShadowFar(float farValue) { _shadowFar = farValue; }
    inline void setShadowOrthoSize(float orthoSize) { _shadowOrthoSize = orthoSize; }
    inline void setShadowCSMLevel(float level) { _shadowCSMLevel = level; }
    inline void setShadowCSMLambda(float lambda) { _shadowCSMLambda = lambda; }
    inline void setShadowFrustumItem(const Vec2 &val, const Vec2 &val1, const Vec2 &val2, const Vec2 &val3) {
        _shadowFrustumItem[0].set(val);
        _shadowFrustumItem[1].set(val1);
        _shadowFrustumItem[2].set(val2);
        _shadowFrustumItem[3].set(val3);
    }

    inline const Vec3 & getDirection() const { return _dir; }
    inline float        getIlluminanceHDR() const { return _illuminanceHDR; }
    inline float        getIlluminanceLDR() const { return _illuminanceLDR; }
    inline bool         getShadowEnabled() const { return _shadowEnabled; }
    inline float        getShadowPcf() const { return _shadowPcf; }
    inline float        getShadowBias() const { return _shadowBias; }
    inline float        getShadowNormalBias() const { return _shadowNormalBias; }
    inline float        getShadowSaturation() const { return _shadowSaturation; }
    inline float        getShadowDistance() const { return _shadowDistance; }
    inline float        getShadowInvisibleOcclusionRange() const { return _shadowInvisibleOcclusionRange; }
    inline bool         getShadowFixedArea() const { return _shadowFixedArea; }
    inline float        getShadowNear() const { return _shadowNear; }
    inline float        getShadowFar() const { return _shadowFar; }
    inline float        getShadowOrthoSize() const { return _shadowOrthoSize; }
    inline float        getShadowCSMLevel() const { return _shadowCSMLevel; }
    inline float        getShadowCSMLambda() const { return _shadowCSMLambda; }
    inline const Vec2*  getShadowFrustumItem() const { return _shadowFrustumItem; }

private:
    float _illuminanceHDR{0.F};
    float _illuminanceLDR{0.F};
    Vec3  _dir;

    // shadow info
    bool  _shadowEnabled{false};
    float _shadowPcf{0.0F};
    float _shadowBias{0.0F};
    float _shadowNormalBias{0.0F};
    float _shadowSaturation{0.75F};
    float _shadowDistance{100.0F};
    float _shadowInvisibleOcclusionRange{200.0F};
    bool  _shadowFixedArea{false};
    float _shadowNear{0.1F};
    float _shadowFar{10.0F};
    float _shadowOrthoSize{1.0F};
    float _shadowCSMLevel{3.0F};
    float _shadowCSMLambda{0.75};
    Vec2  _shadowFrustumItem[4];
};

} // namespace scene
} // namespace cc
