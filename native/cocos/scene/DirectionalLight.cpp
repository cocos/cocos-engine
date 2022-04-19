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

#include "scene/DirectionalLight.h"
#include "core/Root.h"
#include "core/scene-graph/Node.h"
#include "renderer/pipeline/custom/RenderInterfaceTypes.h"
#include "renderer/pipeline/PipelineSceneData.h"
#include "renderer/pipeline/RenderPipeline.h"

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

} // namespace scene
} // namespace cc
