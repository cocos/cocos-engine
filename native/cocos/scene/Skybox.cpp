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

#include "scene/Skybox.h"
#include "3d/assets/Mesh.h"
#include "3d/misc/CreateMesh.h"
#include "cocos/bindings/event/CustomEventTypes.h"
#include "cocos/bindings/event/EventDispatcher.h"
#include "core/Root.h"
#include "core/builtin/BuiltinResMgr.h"
#include "core/scene-graph/SceneGlobals.h"
#include "pipeline/GlobalDescriptorSetManager.h"
#include "primitive/Primitive.h"
#include "renderer/core/MaterialInstance.h"
#include "renderer/core/PassUtils.h"
#include "renderer/gfx-base/GFXDevice.h"
#include "renderer/pipeline/PipelineSceneData.h"
#include "scene/Ambient.h"
#include "scene/Model.h"

namespace {
cc::Mesh *    skyboxMesh{nullptr}; // TODO(cjh): How to release ?
cc::Material *skyboxMaterial{nullptr};
} // namespace
namespace cc {
namespace scene {

SkyboxInfo::SkyboxInfo(/* args */) = default;
SkyboxInfo::~SkyboxInfo()          = default;

void SkyboxInfo::setEnabled(bool val) {
    _enabled = val;
    if (_resource != nullptr) {
        _resource->setEnabled(_enabled);
    }
}

void SkyboxInfo::setUseIBL(bool val) const {
    if (_resource != nullptr) {
        _resource->setUseIBL(val);
    }
}

void SkyboxInfo::setApplyDiffuseMap(bool val) const {
    if (_resource != nullptr) {
        _resource->setUseDiffuseMap(val);
    }
}
void SkyboxInfo::setEnvLightingType(EnvironmentLightingType val) {
    if (EnvironmentLightingType::HEMISPHERE_DIFFUSE == val) {
        setUseIBL(false);
    } else if (EnvironmentLightingType::AUTOGEN_HEMISPHERE_DIFFUSE_WITH_REFLECTION == val) {
        setUseIBL(true);
        setApplyDiffuseMap(false);
    } else if (EnvironmentLightingType::DIFFUSEMAP_WITH_REFLECTION == val) {
        setUseIBL(true);
        setApplyDiffuseMap(true);
    }
    _envLightingType = val;
}
void SkyboxInfo::setUseHDR(bool val) {
    Root::getInstance()->getPipeline()->getPipelineSceneData()->setHDR(val);
    _useHDR = val;

    // Switch UI to and from LDR/HDR textures depends on HDR state
    if (_resource) {
        setEnvmap(_resource->getEnvmap());
        setDiffuseMap(_resource->getDiffuseMap());

        if (getDiffuseMap() == nullptr) {
            setApplyDiffuseMap(false);
        }
    }

    if (_resource) {
        _resource->setUseHDR(_useHDR);
    }
}

bool SkyboxInfo::isUseHDR() const {
    const bool isHDR = Root::getInstance()->getPipeline()->getPipelineSceneData()->isHDR();
    return _useHDR;
}

void SkyboxInfo::setEnvmap(TextureCube *val) {
    const bool isHDR = Root::getInstance()->getPipeline()->getPipelineSceneData()->isHDR();
    if (isHDR) {
        _envmapHDR = val;
    } else {
        _envmapLDR = val;
    }

    if (!_envmapHDR) {
        _diffuseMapHDR = nullptr;
        setApplyDiffuseMap(false);
        setUseIBL(false);
        setEnvLightingType(EnvironmentLightingType::HEMISPHERE_DIFFUSE);
    }

    if (_resource) {
        _resource->setEnvMaps(_envmapHDR, _envmapLDR);
        _resource->setDiffuseMaps(_diffuseMapHDR, _diffuseMapLDR);
        _resource->setUseDiffuseMap(isApplyDiffuseMap());
        _resource->setEnvmap(val);
    }
}

TextureCube *SkyboxInfo::getEnvmap() const {
    const bool isHDR = Root::getInstance()->getPipeline()->getPipelineSceneData()->isHDR();
    return isHDR ? _envmapHDR : _envmapLDR;
}

void SkyboxInfo::setDiffuseMap(TextureCube *val) {
    const bool isHDR = Root::getInstance()->getPipeline()->getPipelineSceneData()->isHDR();
    if (isHDR) {
        _diffuseMapHDR = val;
    } else {
        _diffuseMapHDR = val;
    }

    if (_resource) {
        _resource->setDiffuseMaps(_diffuseMapHDR, _diffuseMapLDR);
    }
}

TextureCube *SkyboxInfo::getDiffuseMap() const {
    const bool isHDR = Root::getInstance()->getPipeline()->getPipelineSceneData()->isHDR();
    return isHDR ? _diffuseMapHDR : _diffuseMapLDR;
}

void SkyboxInfo::activate(Skybox *resource) {
    _resource = resource; // weak reference
    setEnvLightingType(this->_envLightingType);
    if (_resource != nullptr) {
        _resource->initialize(*this);
        _resource->setEnvMaps(_envmapHDR, _envmapLDR);
        _resource->setDiffuseMaps(_diffuseMapHDR, _diffuseMapLDR);
        _resource->activate(); // update global DS first
    }
}

TextureCube *Skybox::getEnvmap() const {
    const bool isHDR = Root::getInstance()->getPipeline()->getPipelineSceneData()->isHDR();
    return isHDR ? _envmapHDR : _envmapLDR;
}

void Skybox::setEnvmap(TextureCube *val) {
    const bool isHDR = Root::getInstance()->getPipeline()->getPipelineSceneData()->isHDR();
    if (isHDR) {
        setEnvMaps(val, _envmapLDR);
    } else {
        setEnvMaps(_envmapHDR, val);
    }
}

bool Skybox::isRGBE() const {
    auto *envmap = getEnvmap();
    return envmap != nullptr ? envmap->isRGBE : false;
}

TextureCube *Skybox::getDiffuseMap() const {
    const bool isHDR = Root::getInstance()->getPipeline()->getPipelineSceneData()->isHDR();
    return isHDR ? _diffuseMapHDR.get() : _diffuseMapLDR.get();
}
void Skybox::setDiffuseMap(TextureCube *val) {
    const bool isHDR = Root::getInstance()->getPipeline()->getPipelineSceneData()->isHDR();
    if (isHDR) {
        setDiffuseMaps(val, _envmapLDR);
    } else {
        setDiffuseMaps(_envmapHDR, val);
    }
}

void Skybox::initialize(const SkyboxInfo &skyboxInfo) {
    _enabled       = skyboxInfo.isEnabled();
    _useIBL        = skyboxInfo.isUseIBL();
    _useDiffuseMap = skyboxInfo.isApplyDiffuseMap();
    _useHDR        = skyboxInfo.isUseHDR();
}

void Skybox::setEnvMaps(TextureCube *envmapHDR, TextureCube *envmapLDR) {
    _envmapHDR       = envmapHDR;
    _envmapLDR       = envmapLDR;
    const bool isHDR = Root::getInstance()->getPipeline()->getPipelineSceneData()->isHDR();
    if (isHDR) {
        if (envmapHDR) {
            Root::getInstance()->getPipeline()->getPipelineSceneData()->getAmbient()->setMipmapCount(envmapHDR->mipmapLevel());
        }
    } else if (envmapLDR) {
        Root::getInstance()->getPipeline()->getPipelineSceneData()->getAmbient()->setMipmapCount(envmapLDR->mipmapLevel());
    }

    updateGlobalBinding();
    updatePipeline();
}

void Skybox::setDiffuseMaps(TextureCube *diffuseMapHDR, TextureCube *diffuseMapLDR) {
    _diffuseMapHDR = diffuseMapHDR;
    _diffuseMapLDR = diffuseMapLDR;
    updateGlobalBinding();
    updatePipeline();
}

void Skybox::activate() {
    auto *pipeline   = Root::getInstance()->getPipeline();
    _globalDSManager = pipeline->getGlobalDSManager();
    _default         = BuiltinResMgr::getInstance()->get<TextureCube>("default-cube-texture");

    if (!_model) {
        _model = Root::getInstance()->createModel<scene::Model>();
        _model->initLocalDescriptors(CC_INVALID_INDEX);
        _model->initWorldBoundDescriptors(CC_INVALID_INDEX);
    }
    auto *envmap = getEnvmap();
    bool  isRGBE = envmap != nullptr ? envmap->isRGBE : _default->isRGBE;

    if (!skyboxMaterial) {
        auto *        mat = new Material();
        MacroRecord   defines{{"USE_RGBE_CUBEMAP", isRGBE}};
        IMaterialInfo matInfo;
        matInfo.effectName = std::string{"skybox"};
        matInfo.defines    = IMaterialInfo::DefinesType{defines};
        mat->initialize({matInfo});
        IMaterialInstanceInfo matInstInfo;
        matInstInfo.parent = mat;
        skyboxMaterial     = new MaterialInstance(matInstInfo);
        skyboxMaterial->addRef();
        EventDispatcher::addCustomEventListener(EVENT_CLOSE, [](const CustomEvent & /*unused*/) {
            skyboxMaterial->release();
            skyboxMaterial = nullptr;
        });
    }

    if (_enabled) {
        if (!skyboxMesh) {
            IBoxOptions options;
            options.width  = 2;
            options.height = 2;
            options.length = 2;
            skyboxMesh     = createMesh(
                createGeometry(
                    PrimitiveType::BOX,
                    PrimitiveOptions{options}));
        }
        _model->initSubModel(0, skyboxMesh->getRenderingSubMeshes()[0], skyboxMaterial);
    }

    if (!getEnvmap()) {
        setEnvmap(_default.get());
    }

    if (!getDiffuseMap()) {
        setDiffuseMap(_default.get());
    }

    updateGlobalBinding();
    updatePipeline();
}

void Skybox::updatePipeline() const {
    if (isEnabled() && skyboxMaterial != nullptr) {
        skyboxMaterial->recompileShaders({{"USE_RGBE_CUBEMAP", isRGBE()}});
    }

    if (_model != nullptr && skyboxMaterial != nullptr) {
        _model->setSubModelMaterial(0, skyboxMaterial);
    }

    Root *                    root     = Root::getInstance();
    pipeline::RenderPipeline *pipeline = root->getPipeline();

    const bool    useRGBE            = isRGBE();
    const int32_t useIBLValue        = isUseIBL() ? (useRGBE ? 2 : 1) : 0;
    const int32_t useDiffuseMapValue = (isUseIBL() && isUseDiffuseMap() && getDiffuseMap() != nullptr) ? (useRGBE ? 2 : 1) : 0;
    const bool    useHDRValue        = isUseHDR();

    bool valueChanged = false;
    auto iter = pipeline->getMacros().find("CC_USE_IBL");
    if (iter != pipeline->getMacros().end()) {
        const MacroValue &macroIBL    = iter->second;
        const int32_t *   macroIBLPtr = cc::get_if<int32_t>(&macroIBL);
        if (macroIBLPtr != nullptr && (*macroIBLPtr != useIBLValue)) {
            pipeline->setValue("CC_USE_IBL", useIBLValue);
            valueChanged = true;
        }
    }

    auto iterDiffuseMap = pipeline->getMacros().find("CC_USE_DIFFUSEMAP");
    if (iterDiffuseMap != pipeline->getMacros().end()) {
        const MacroValue &macroDIFFUSEMAP    = iterDiffuseMap->second;
        const int32_t *   macroDIFFUSEMAPPtr = cc::get_if<int32_t>(&macroDIFFUSEMAP);
        if (macroDIFFUSEMAPPtr != nullptr && ((*macroDIFFUSEMAPPtr != 0) != useDiffuseMapValue)) {
            pipeline->setValue("CC_USE_DIFFUSEMAP", useDiffuseMapValue);
            valueChanged = true;
        }
    }

    auto iterUseHDR = pipeline->getMacros().find("CC_USE_HDR");
    if (iterUseHDR != pipeline->getMacros().end()) {
        const MacroValue &macroHDR    = iterUseHDR->second;
        const int32_t *   macroHDRPtr = cc::get_if<int32_t>(&macroHDR);
        if (macroHDRPtr != nullptr && ((*macroHDRPtr != 0) != useHDRValue)) {
            pipeline->setValue("CC_USE_HDR", useHDRValue);
            valueChanged = true;
        }
    }

    if (valueChanged) {
        root->onGlobalPipelineStateChanged();
    }  
}

void Skybox::updateGlobalBinding() {
    if (_globalDSManager != nullptr) {
        auto *device = Root::getInstance()->getDevice();
        auto *envmap = getEnvmap();
        if (!envmap) {
            envmap = _default.get();
        }
        if (envmap != nullptr) {
            auto *texture = envmap->getGFXTexture();
            auto *sampler = device->getSampler(envmap->getSamplerInfo());
            _globalDSManager->bindSampler(pipeline::ENVIRONMENT::BINDING, sampler);
            _globalDSManager->bindTexture(pipeline::ENVIRONMENT::BINDING, texture);
        }

        auto *diffuseMap = getDiffuseMap();
        if (!diffuseMap) {
            diffuseMap = _default.get();
        }
        if (diffuseMap != nullptr) {
            auto *texture = diffuseMap->getGFXTexture();
            auto *sampler = device->getSampler(envmap->getSamplerInfo());
            _globalDSManager->bindSampler(pipeline::DIFFUSEMAP::BINDING, sampler);
            _globalDSManager->bindTexture(pipeline::DIFFUSEMAP::BINDING, texture);
        }
        _globalDSManager->update();
    }
}

} // namespace scene
} // namespace cc
