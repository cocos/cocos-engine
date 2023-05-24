/****************************************************************************
 Copyright (c) 2023 Xiamen Yaji Software Co., Ltd.

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
#include "math/Vec3.h"
#include "scene/Light.h"

namespace cc {
namespace scene {

class PointLight final : public Light {
public:
    PointLight();
    ~PointLight() override = default;

    void initialize() override;
    void update() override;

    inline const Vec3 &getPosition() const { return _pos; }
    inline void setPosition(const Vec3 &pos) { _pos = pos; }

    inline float getRange() const { return _range; }
    inline void setRange(float range) {
        _range = range;
        _needUpdate = true;
    }

    float getLuminance() const;
    void setLuminance(float);

    inline void setLuminanceHDR(float illum) { _luminanceHDR = illum; }
    inline float getLuminanceHDR() const { return _luminanceHDR; }

    inline void setLuminanceLDR(float illum) { _luminanceLDR = illum; }
    inline float getLuminanceLDR() const { return _luminanceLDR; }

    inline const geometry::AABB &getAABB() const { return _aabb; }

private:
    bool _needUpdate{false};

    float _luminanceHDR{0.F};
    float _luminanceLDR{0.F};
    float _range{0.F};

    Vec3 _pos;

    geometry::AABB _aabb;

    CC_DISALLOW_COPY_MOVE_ASSIGN(PointLight);
};

} // namespace scene
} // namespace cc
