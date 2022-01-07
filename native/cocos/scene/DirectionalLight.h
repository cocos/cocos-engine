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

#include "core/Root.h"
#include "math/Vec3.h"
#include "scene/Ambient.h"
#include "scene/Light.h"

namespace cc {
namespace scene {

class DirectionalLight final : public Light {
public:
    DirectionalLight() { _type = LightType::DIRECTIONAL; }
    ~DirectionalLight() override = default;

    void initialize() override;
    void update() override;

    inline const Vec3 &getDirection() const { return _dir; }
    inline void        setDirection(const Vec3 &dir) { _dir = dir; }
    inline void        setIlluminanceHDR(float value) { _illuminanceHDR = value; }
    inline void        setIlluminanceLDR(float value) { _illuminanceLDR = value; }
    inline float       getIlluminanceHDR() const { return _illuminanceHDR; }
    inline float       getIlluminanceLDR() const { return _illuminanceLDR; }
    inline float       getIlluminance() const {
        const bool isHDR = Root::getInstance()->getPipeline()->getPipelineSceneData()->isHDR();
        if (isHDR) {
            return _illuminanceHDR;
        }
        return _illuminanceLDR;
    }
    inline void setIlluminance(float value) {
        const bool isHDR = Root::getInstance()->getPipeline()->getPipelineSceneData()->isHDR();
        if (isHDR) {
            _illuminanceHDR = value;
        } else {
            _illuminanceLDR = value;
        }
    }

private:
    float _illuminanceHDR{Ambient::SUN_ILLUM};
    float _illuminanceLDR{1.F};
    Vec3  _dir{1.0F, -1.0F, -1.0F};

    CC_DISALLOW_COPY_MOVE_ASSIGN(DirectionalLight);
};

} // namespace scene
} // namespace cc
