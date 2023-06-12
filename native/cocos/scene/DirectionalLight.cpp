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

#include "scene/DirectionalLight.h"
#include "core/Root.h"
#include "core/scene-graph/Node.h"
#include "renderer/pipeline/PipelineSceneData.h"
#include "renderer/pipeline/RenderPipeline.h"
#include "renderer/pipeline/custom/RenderInterfaceTypes.h"

namespace cc {
namespace scene {

DirectionalLight::DirectionalLight() { _type = LightType::DIRECTIONAL; }

DirectionalLight::~DirectionalLight() = default;

void DirectionalLight::initialize() {
    Light::initialize();

    setIlluminance(Ambient::SUN_ILLUM);
    _dir.set(1.0F, -1.0F, -1.0F);
}

void DirectionalLight::update() {
    if (_node && _node->getChangedFlags()) {
        _dir = _forward;
        _node->updateWorldTransform();
        _dir.transformQuat(_node->getWorldRotation());
    }
}

float DirectionalLight::getIlluminance() const {
    const bool isHDR = Root::getInstance()->getPipeline()->getPipelineSceneData()->isHDR();
    if (isHDR) {
        return _illuminanceHDR;
    }
    return _illuminanceLDR;
}

void DirectionalLight::setIlluminance(float value) {
    const bool isHDR = Root::getInstance()->getPipeline()->getPipelineSceneData()->isHDR();
    if (isHDR) {
        _illuminanceHDR = value;
    } else {
        _illuminanceLDR = value;
    }
}

void DirectionalLight::activate() const {
    auto *pipeline = Root::getInstance()->getPipeline();
    if (pipeline) {
        if (_shadowEnabled) {
            if (_shadowFixedArea || !pipeline->getPipelineSceneData()->getCSMSupported()) {
                pipeline->setValue("CC_DIR_LIGHT_SHADOW_TYPE", 1);
            } else if (_csmLevel > CSMLevel::LEVEL_1 && pipeline->getPipelineSceneData()->getCSMSupported()) {
                pipeline->setValue("CC_DIR_LIGHT_SHADOW_TYPE", 2);
                pipeline->setValue("CC_CASCADED_LAYERS_TRANSITION", _csmLayersTransition);
            } else {
                pipeline->setValue("CC_DIR_LIGHT_SHADOW_TYPE", 1);
            }
            pipeline->setValue("CC_DIR_SHADOW_PCF_TYPE", static_cast<int32_t>(_shadowPcf));
        } else {
            pipeline->setValue("CC_DIR_LIGHT_SHADOW_TYPE", 0);
        }
    }
}

} // namespace scene
} // namespace cc
