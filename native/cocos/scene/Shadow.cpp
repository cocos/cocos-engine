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

#include "scene/Shadow.h"
#include <cmath>
#include "core/Root.h"
#include "core/scene-graph/Node.h"
#include "scene/Pass.h"

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

void ShadowsInfo::setNormal(const Vec3 &val) {
    _normal = val;
    if (_resource != nullptr) {
        _resource->setNormal(val);
    }
}

void ShadowsInfo::setDistance(float val) {
    _distance = val;
    if (_resource != nullptr) {
        _resource->setDistance(val);
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

void ShadowsInfo::setPlaneFromNode(Node *node) {
    const auto &qt = node->getWorldRotation();
    _normal        = Vec3::UNIT_Y;
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
    setNormal(shadowsInfo.getNormal());
    setDistance(shadowsInfo.getDistance());
    setMaxReceived(shadowsInfo.getMaxReceived());
    setSize(shadowsInfo.getSize());
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

gfx::Shader *Shadows::getPlanarShader(const std::vector<IMacroPatch> &patches) {
    if (!_material) {
        createMaterial();
    }

    const auto &passes = *_material->getPasses();
    return passes[0]->getShaderVariant(patches);
}

gfx::Shader *Shadows::getPlanarInstanceShader(const std::vector<IMacroPatch> &patches) {
    if (!_instancingMaterial) {
        createInstanceMaterial();
    }

    const auto &passes = *_instancingMaterial->getPasses();
    return passes[0]->getShaderVariant(patches);
}

void Shadows::activate() {
    if (_enabled) {
        if (_type == ShadowType::PLANAR) {
            updatePlanarInfo();
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
}

void Shadows::createInstanceMaterial() {
    _instancingMaterial = new Material();

    IMaterialInfo materialInfo;
    materialInfo.effectName = "planar-shadow";
    MacroRecord microRecord{{"USE_INSTANCING", true}};
    materialInfo.defines = microRecord;
    _instancingMaterial->initialize(materialInfo);
}

void Shadows::createMaterial() {
    _material = new Material();

    IMaterialInfo materialInfo;
    materialInfo.effectName = "planar-shadow";
    _material->initialize(materialInfo);
}

} // namespace scene
} // namespace cc
