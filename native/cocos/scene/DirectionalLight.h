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

#include "math/Vec3.h"
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

    inline const Vec3 &getDirection() const { return _dir; }
    inline float       getIlluminanceHDR() const { return _illuminanceHDR; }
    inline float       getIlluminanceLDR() const { return _illuminanceLDR; }

private:
    float _illuminanceHDR{0.F};
    float _illuminanceLDR{0.F};
    Vec3  _dir;
};

} // namespace scene
} // namespace cc
