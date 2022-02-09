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
#include "scene/Ambient.h"
#include "scene/Light.h"

namespace cc {
namespace scene {

class DirectionalLight final : public Light {
public:
    DirectionalLight();
    ~DirectionalLight() override;

    void initialize() override;
    void update() override;

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

    inline bool  getShadowEnabled() const { return _shadowEnabled; }
    inline float getShadowPcf() const { return _shadowPcf; }
    inline float getShadowBias() const { return _shadowBias; }
    inline float getShadowNormalBias() const { return _shadowNormalBias; }
    inline float getShadowSaturation() const { return _shadowSaturation; }
    inline float getShadowDistance() const { return _shadowDistance; }
    inline float getShadowInvisibleOcclusionRange() const { return _shadowInvisibleOcclusionRange; }
    inline bool  getShadowFixedArea() const { return _shadowFixedArea; }
    inline float getShadowNear() const { return _shadowNear; }
    inline float getShadowFar() const { return _shadowFar; }
    inline float getShadowOrthoSize() const { return _shadowOrthoSize; }

    inline const Vec3 &getDirection() const { return _dir; }
    inline void        setDirection(const Vec3 &dir) { _dir = dir; }
    inline void        setIlluminanceHDR(float value) { _illuminanceHDR = value; }
    inline void        setIlluminanceLDR(float value) { _illuminanceLDR = value; }
    inline float       getIlluminanceHDR() const { return _illuminanceHDR; }
    inline float       getIlluminanceLDR() const { return _illuminanceLDR; }
    float              getIlluminance() const;
    void               setIlluminance(float value);

private:
    float _illuminanceHDR{Ambient::SUN_ILLUM};
    float _illuminanceLDR{1.F};
    Vec3  _dir{1.0F, -1.0F, -1.0F};

    // shadow info
    bool _shadowEnabled{false};
    //TODO(minggo): use PCFType.HARD instead
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

    CC_DISALLOW_COPY_MOVE_ASSIGN(DirectionalLight);
};

} // namespace scene
} // namespace cc
