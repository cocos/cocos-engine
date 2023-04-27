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

#include "scene/RangedDirectionalLight.h"
#include "core/Root.h"
#include "core/scene-graph/Node.h"
#include "renderer/pipeline/PipelineSceneData.h"
#include "renderer/pipeline/custom/RenderInterfaceTypes.h"

namespace cc {
namespace scene {

RangedDirectionalLight::RangedDirectionalLight() { _type = LightType::RANGED_DIRECTIONAL; }

RangedDirectionalLight::~RangedDirectionalLight() = default;

void RangedDirectionalLight::initialize() {
    Light::initialize();

    setIlluminance(Ambient::SUN_ILLUM);
}

void RangedDirectionalLight::update() {
    if (_node && (_node->getChangedFlags())) {
        _pos = _node->getWorldPosition();
        _dir.set(0.0F, 0.0F, -1.0F);
        _dir.transformQuat(_node->getWorldRotation());
        _right.set(1.0F, 0.0F, 0.0F);
        _right.transformQuat(_node->getWorldRotation());
        _scale = _node->getWorldScale();
    }
}

float RangedDirectionalLight::getIlluminance() const {
    const bool isHDR = Root::getInstance()->getPipeline()->getPipelineSceneData()->isHDR();
    if (isHDR) {
        return _illuminanceHDR;
    }
    return _illuminanceLDR;
}

void RangedDirectionalLight::setIlluminance(float value) {
    const bool isHDR = Root::getInstance()->getPipeline()->getPipelineSceneData()->isHDR();
    if (isHDR) {
        _illuminanceHDR = value;
    } else {
        _illuminanceLDR = value;
    }
}

} // namespace scene
} // namespace cc
