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

#include "scene/Shadow.h"
#include <cmath>
#include "core/Root.h"
#include "core/scene-graph/Node.h"
#include "scene/Pass.h"
#include "cocos/renderer/pipeline/custom/RenderInterfaceTypes.h"

namespace cc {
namespace scene {

// ShadowInfo

void ShadowsInfo::setEnabled(bool val) {
    if (_enabled == val) {
        return;
    }

    _enabled = val;
    if (_resource != nullptr) {
        _resource->setEnabled(val);
        if (val) {
            _resource->setType(_type);
        }
    }
}

void ShadowsInfo::setType(ShadowType val) {
    _type = val;
    if (_resource != nullptr) {
        _resource->setType(val);
    }
}

void ShadowsInfo::setShadowColor(const Color &val) {
    _shadowColor.set(val);
    if (_resource != nullptr) {
        _resource->setShadowColor(val);
    }
}

void ShadowsInfo::setPlaneDirection(const Vec3 &val) {
    _normal = val;
    if (_resource != nullptr) {
        _resource->setNormal(val);
    }
}

void ShadowsInfo::setPlaneHeight(float val) {
    _distance = val;
    if (_resource != nullptr) {
        _resource->setDistance(val);
    }
}

void ShadowsInfo::setPlaneBias(float val) {
    _planeBias = val;
    if (_resource != nullptr) {
        _resource->setPlaneBias(val);
    }
}

void ShadowsInfo::setMaxReceived(uint32_t val) {
    _maxReceived = val;
    if (_resource != nullptr) {
        _resource->setMaxReceived(val);
    }
}

void ShadowsInfo::setShadowMapSize(float value) {
    _size.set(value, value);
    if (_resource != nullptr) {
        _resource->setShadowMapSize(value);
        _resource->setShadowMapDirty(true);
    }
}

void ShadowsInfo::setPlaneFromNode(const Node *node) {
    const auto &qt = node->getWorldRotation();
    _normal = Vec3::UNIT_Y;
    _normal.transformQuat(qt);
    _distance = _normal.dot(node->getWorldPosition());
}

void ShadowsInfo::activate(Shadows *resource) {
    _resource = resource;
    _resource->initialize(*this);
    _resource->activate();
}

//
const float Shadows::COEFFICIENT_OF_EXPANSION{2.0F * std::sqrt(3.0F)};

void Shadows::initialize(const ShadowsInfo &shadowsInfo) {
    setEnabled(shadowsInfo.isEnabled());
    setType(shadowsInfo.getType());
    setNormal(shadowsInfo.getPlaneDirection());
    setDistance(shadowsInfo.getPlaneHeight());
    setPlaneBias(shadowsInfo.getPlaneBias());
    setMaxReceived(shadowsInfo.getMaxReceived());
    if (fabsf(shadowsInfo.getShadowMapSize() - _size.x) > 0.1F) {
        setSize(Vec2(shadowsInfo.getShadowMapSize(), shadowsInfo.getShadowMapSize()));
        _shadowMapDirty = true;
    }

    setShadowColor(shadowsInfo.getShadowColor());
}

void Shadows::destroy() {
    if (_material) {
        _material->destroy();
        _material = nullptr;
    }

    if (_instancingMaterial) {
        _instancingMaterial->destroy();
        _instancingMaterial = nullptr;
    }
}

gfx::Shader *Shadows::getPlanarShader(const ccstd::vector<IMacroPatch> &patches) {
    if (!_material) {
        createMaterial();
    }

    const auto &passes = _material->getPasses();
    CC_ASSERT(passes && !passes->empty());
    return (passes && !passes->empty()) ? passes->at(0)->getShaderVariant(patches) : nullptr;
}

gfx::Shader *Shadows::getPlanarInstanceShader(const ccstd::vector<IMacroPatch> &patches) {
    if (!_instancingMaterial) {
        createInstanceMaterial();
    }

    const auto &passes = _instancingMaterial->getPasses();
    CC_ASSERT(passes && !passes->empty());
    return (passes && !passes->empty()) ? passes->at(0)->getShaderVariant(patches) : nullptr;
}

void Shadows::activate() {
    if (_enabled) {
        if (_type == ShadowType::PLANAR) {
            updatePlanarInfo();
        } else {
            auto *pipeline = Root::getInstance()->getPipeline();
            if (pipeline) {
                pipeline->setValue("CC_SHADOW_TYPE", 2);
            }
        }
    } else {
        auto *pipeline = Root::getInstance()->getPipeline();
        if (pipeline) {
            pipeline->setValue("CC_SHADOW_TYPE", 0);
        }
    }
}

void Shadows::updatePlanarInfo() {
    if (!_material) {
        createMaterial();
    }
    if (!_instancingMaterial) {
        createInstanceMaterial();
    }

    auto *pipeline = Root::getInstance()->getPipeline();
    if (pipeline) {
        pipeline->setValue("CC_SHADOW_TYPE", 1);
    }
}

void Shadows::createInstanceMaterial() {
    _instancingMaterial = ccnew Material();

    IMaterialInfo materialInfo;
    materialInfo.effectName = "pipeline/planar-shadow";
    MacroRecord microRecord{{"USE_INSTANCING", true}};
    materialInfo.defines = microRecord;
    _instancingMaterial->initialize(materialInfo);
}

void Shadows::createMaterial() {
    _material = ccnew Material();

    IMaterialInfo materialInfo;
    materialInfo.effectName = "pipeline/planar-shadow";
    _material->initialize(materialInfo);
}

} // namespace scene
} // namespace cc
