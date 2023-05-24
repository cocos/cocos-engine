/****************************************************************************
 Copyright (c) 2023 Xiamen Yaji Software Co., Ltd.
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
#include "scene/Shadow.h"

namespace cc {
namespace scene {

class RangedDirectionalLight final : public Light {
public:
    RangedDirectionalLight();
    ~RangedDirectionalLight() override;

    void initialize() override;
    void update() override;

    inline const Vec3 &getDirection() const { return _dir; }
    inline const Vec3 &getPosition() const { return _pos; }
    inline const Vec3 &getScale() const { return _scale; }
    inline const Vec3 &getRight() const { return _right; }
    inline void setIlluminanceHDR(float value) { _illuminanceHDR = value; }
    inline void setIlluminanceLDR(float value) { _illuminanceLDR = value; }
    inline float getIlluminanceHDR() const { return _illuminanceHDR; }
    inline float getIlluminanceLDR() const { return _illuminanceLDR; }
    float getIlluminance() const;
    void setIlluminance(float value);

private:
    float _illuminanceHDR{Ambient::SUN_ILLUM};
    float _illuminanceLDR{1.F};
    Vec3 _dir{0.0F, 0.0F, -1.0F};
    Vec3 _pos{0.0F, 0.0F, 0.0F};
    Vec3 _scale{1.0F, 1.0F, 1.0F};
    Vec3 _right{1.0F, 0.0F, 0.0F};

    CC_DISALLOW_COPY_MOVE_ASSIGN(RangedDirectionalLight);
};

} // namespace scene
} // namespace cc
