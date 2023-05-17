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

#include "scene/SpotLight.h"
#include <cmath>
#include "core/Root.h"
#include "core/scene-graph/Node.h"
#include "math/Math.h"
#include "renderer/pipeline/PipelineSceneData.h"
#include "renderer/pipeline/RenderPipeline.h"
#include "renderer/pipeline/custom/RenderInterfaceTypes.h"

namespace cc {
namespace scene {
SpotLight::SpotLight() {
    _type = LightType::SPOT;
    _aabb = ccnew geometry::AABB();
    _aabb->addRef();
    _frustum = ccnew geometry::Frustum();
    _frustum->addRef();
}

SpotLight::~SpotLight() {
    _aabb->release();
    _frustum->release();
}

void SpotLight::initialize() {
    Light::initialize();

    _size = 0.15F;
    setLuminance(1700 / Light::nt2lm(_size));
    setLuminanceLDR(1.F);
    _range = cos(math::PI / 6);
    _dir.set(1.0, -1.0, -1.0);
}

float SpotLight::getLuminance() const {
    const bool isHDR = Root::getInstance()->getPipeline()->getPipelineSceneData()->isHDR();
    return isHDR ? _luminanceHDR : _luminanceLDR;
}

void SpotLight::setLuminance(float value) {
    const bool isHDR = Root::getInstance()->getPipeline()->getPipelineSceneData()->isHDR();
    if (isHDR) {
        setLuminanceHDR(value);
    } else {
        setLuminanceLDR(value);
    }
}

void SpotLight::update() {
    if (_node && (_node->getChangedFlags() || _needUpdate)) {
        Mat4 matView;
        Mat4 matProj;
        Mat4 matViewProj;
        Mat4 matViewProjInv;
        _pos = _node->getWorldPosition();
        _dir = _forward;
        _dir.transformQuat(_node->getWorldRotation());
        _dir.normalize();
        _aabb->set(_pos, {_range, _range, _range});
        matView = _node->getWorldRT();
        matView.inverse();

        Mat4::createPerspective(_angle, 1.0F, 0.001F, _range, &matProj);

        Mat4::multiply(matProj, matView, &matViewProj);

        _frustum->update(matViewProj, matViewProjInv);

        _needUpdate = false;
    }
}
} // namespace scene
} // namespace cc
