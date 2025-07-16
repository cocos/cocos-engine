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

#include "scene/Skybox.h"
#include "3d/misc/CreateMesh.h"
#include "core/Root.h"
#include "core/builtin/BuiltinResMgr.h"
#include "core/platform/Debug.h"
#include "core/scene-graph/SceneGlobals.h"
#include "pipeline/GlobalDescriptorSetManager.h"
#include "primitive/Primitive.h"
#include "renderer/core/MaterialInstance.h"
#include "renderer/core/PassUtils.h"
#include "renderer/gfx-base/GFXDevice.h"
#include "renderer/pipeline/PipelineSceneData.h"
#include "renderer/pipeline/custom/RenderInterfaceTypes.h"
#include "scene/Ambient.h"
#include "scene/Model.h"
#include "scene/Pass.h"

namespace cc {
namespace scene {

SkyboxInfo::SkyboxInfo(/* args */) = default;
SkyboxInfo::~SkyboxInfo() = default;

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
    if (!getEnvmap() && EnvironmentLightingType::HEMISPHERE_DIFFUSE != val) {
        setUseIBL(false);
        setApplyDiffuseMap(false);
        _envLightingType = EnvironmentLightingType::HEMISPHERE_DIFFUSE;
        debug::warnID(15001);
    } else {
        if (EnvironmentLightingType::HEMISPHERE_DIFFUSE == val) {
            setUseIBL(false);
            setApplyDiffuseMap(false);
        } else if (EnvironmentLightingType::AUTOGEN_HEMISPHERE_DIFFUSE_WITH_REFLECTION == val) {
            setUseIBL(true);
            setApplyDiffuseMap(false);
        } else if (EnvironmentLightingType::DIFFUSEMAP_WITH_REFLECTION == val) {
            setUseIBL(true);
            setApplyDiffuseMap(true);
        }
        _envLightingType = val;
    }
}
void SkyboxInfo::setUseHDR(bool val) {
    Root::getInstance()->getPipeline()->getPipelineSceneData()->setHDR(val);
    _useHDR = val;

    // Switch UI to and from LDR/HDR textures depends on HDR state
    if (_resource) {
        setEnvmap(_resource->getEnvmap());
        setDiffuseMap(_resource->getDiffuseMap());
        setReflectionMap(_resource->getReflectionMap());

        if (_envLightingType == EnvironmentLightingType::DIFFUSEMAP_WITH_REFLECTION) {
            auto *diffuseMap = getDiffuseMap();
            if (!diffuseMap) {
                _envLightingType = EnvironmentLightingType::AUTOGEN_HEMISPHERE_DIFFUSE_WITH_REFLECTION;
                debug::warnID(15000);
            } else if (diffuseMap->isDefault()) {
                debug::warnID(15002);
            }
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
        _reflectionHDR = nullptr;
    } else {
        _envmapLDR = val;
        _reflectionLDR = nullptr;
    }

    if (!val) {
        if (isHDR) {
            _diffuseMapHDR = nullptr;
        } else {
            _diffuseMapLDR = nullptr;
        }
        setApplyDiffuseMap(false);
        setUseIBL(false);
        setEnvLightingType(EnvironmentLightingType::HEMISPHERE_DIFFUSE);
        debug::warnID(15001);
    }

    if (_resource) {
        _resource->setEnvMaps(_envmapHDR, _envmapLDR);
        _resource->setDiffuseMaps(_diffuseMapHDR, _diffuseMapLDR);
        _resource->setReflectionMaps(_reflectionHDR, _reflectionLDR);
        _resource->setUseDiffuseMap(isApplyDiffuseMap());
        _resource->setEnvmap(val);
    }
}

TextureCube *SkyboxInfo::getEnvmap() const {
    const bool isHDR = Root::getInstance()->getPipeline()->getPipelineSceneData()->isHDR();
    return isHDR ? _envmapHDR : _envmapLDR;
}

void SkyboxInfo::setRotationAngle(float val) {
    _rotationAngle = val;
    if (_resource != nullptr) {
        _resource->setRotationAngle(_rotationAngle);
    }
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

void SkyboxInfo::setReflectionMap(TextureCube *val) {
    const bool isHDR = Root::getInstance()->getPipeline()->getPipelineSceneData()->isHDR();
    if (isHDR) {
        _reflectionHDR = val;
    } else {
        _reflectionLDR = val;
    }

    if (_resource) {
        _resource->setReflectionMaps(_reflectionHDR, _reflectionLDR);
    }
}

TextureCube *SkyboxInfo::getReflectionMap() const {
    const bool isHDR = Root::getInstance()->getPipeline()->getPipelineSceneData()->isHDR();
    if (isHDR) {
        return _reflectionHDR;
    }
    return _reflectionLDR;
}

void SkyboxInfo::setSkyboxMaterial(Material *val) {
    _editableMaterial = val;
    if (_resource != nullptr) {
        _resource->setSkyboxMaterial(val);
    }
}

void SkyboxInfo::setMaterialProperty(const ccstd::string &name, const MaterialPropertyVariant &val, index_t passIdx /* = CC_INVALID_INDEX */) const {
    if (_resource == nullptr) return;
    auto *skyboxMat = _resource->getSkyboxMaterial();
    if (_resource->isEnabled() && skyboxMat != nullptr) {
        skyboxMat->setProperty(name, val, passIdx);
        auto &passs = skyboxMat->getPasses();
        for (const auto &pass : *passs) {
            pass->update();
        }
    }
}

void SkyboxInfo::updateEnvMap(TextureCube *val) {
    if (!val) {
        setApplyDiffuseMap(false);
        setUseIBL(false);
        setEnvLightingType(EnvironmentLightingType::HEMISPHERE_DIFFUSE);
    }
    if (_resource) {
        _resource->setEnvMaps(_envmapHDR, _envmapLDR);
        _resource->setDiffuseMaps(_diffuseMapHDR, _diffuseMapLDR);
        _resource->setReflectionMaps(_reflectionHDR, _reflectionLDR);
        _resource->setEnvmap(val);
    }
}

void SkyboxInfo::activate(Skybox *resource) {
    _resource = resource; // weak reference
    Root::getInstance()->getPipeline()->getPipelineSceneData()->setHDR(_useHDR);
    if (_resource != nullptr) {
        _resource->initialize(*this);
        setEnvLightingType(this->_envLightingType);
        _resource->setEnvMaps(_envmapHDR, _envmapLDR);
        _resource->setDiffuseMaps(_diffuseMapHDR, _diffuseMapLDR);
        _resource->setReflectionMaps(_reflectionHDR, _reflectionLDR);
        _resource->setSkyboxMaterial(_editableMaterial);
        _resource->setRotationAngle(_rotationAngle);
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

bool Skybox::isUsingConvolutionMap() const {
    auto *reflectionMap = getReflectionMap();
    if (reflectionMap) {
        return reflectionMap->isUsingOfflineMipmaps();
    }
    auto *envmap = getEnvmap();
    if (envmap) {
        return envmap->isUsingOfflineMipmaps();
    }
    return false;
}

TextureCube *Skybox::getDiffuseMap() const {
    const bool isHDR = Root::getInstance()->getPipeline()->getPipelineSceneData()->isHDR();
    return isHDR ? _diffuseMapHDR : _diffuseMapLDR;
}
void Skybox::setDiffuseMap(TextureCube *val) {
    const bool isHDR = Root::getInstance()->getPipeline()->getPipelineSceneData()->isHDR();
    if (isHDR) {
        setDiffuseMaps(val, _diffuseMapLDR);
    } else {
        setDiffuseMaps(_diffuseMapHDR, val);
    }
}

void Skybox::initialize(const SkyboxInfo &skyboxInfo) {
    _activated = false;
    _enabled = skyboxInfo.isEnabled();
    _useIBL = skyboxInfo.isUseIBL();
    _useDiffuseMap = skyboxInfo.isApplyDiffuseMap();
    _useHDR = skyboxInfo.isUseHDR();
}

void Skybox::setEnvMaps(TextureCube *envmapHDR, TextureCube *envmapLDR) {
    _envmapHDR = envmapHDR;
    _envmapLDR = envmapLDR;
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

TextureCube *Skybox::getReflectionMap() const {
    const bool isHDR = Root::getInstance()->getPipeline()->getPipelineSceneData()->isHDR();
    return isHDR ? _reflectionHDR : _reflectionLDR;
}
void Skybox::setReflectionMaps(TextureCube *reflectionHDR, TextureCube *reflectionLDR) {
    _reflectionHDR = reflectionHDR;
    _reflectionLDR = reflectionLDR;
    updateGlobalBinding();
    updatePipeline();
}

void Skybox::setSkyboxMaterial(Material *skyboxMat) {
    _editableMaterial = skyboxMat;
}

void Skybox::setRotationAngle(float angle) {
    _rotationAngle = angle;
}

void Skybox::activate() {
    auto *pipeline = Root::getInstance()->getPipeline();
    _globalDSManager = pipeline->getGlobalDSManager();
    _default = BuiltinResMgr::getInstance()->get<TextureCube>("default-cube-texture");

    if (!_model) {
        _model = Root::getInstance()->createModel<scene::Model>();
        //The skybox material has added properties of 'environmentMap' that need local ubo
        //_model->initLocalDescriptors(CC_INVALID_INDEX);
        //_model->initWorldBoundDescriptors(CC_INVALID_INDEX);
    }
    auto *envmap = getEnvmap();
    bool isRGBE = envmap != nullptr ? envmap->isRGBE : _default->isRGBE;

    bool isUseConvolutionMap = envmap != nullptr ? envmap->isUsingOfflineMipmaps() : _default->isUsingOfflineMipmaps();
    if (!_material) {
        auto *mat = _editableMaterial ? _editableMaterial.get() : ccnew Material();
        MacroRecord defines{{"USE_RGBE_CUBEMAP", isRGBE}};
        IMaterialInfo matInfo;
        matInfo.effectName = ccstd::string{"pipeline/skybox"};
        matInfo.defines = IMaterialInfo::DefinesType{defines};
        mat->initialize({matInfo});
        IMaterialInstanceInfo matInstInfo;
        matInstInfo.parent = mat;
        _material = ccnew MaterialInstance(matInstInfo);
    }

    if (_enabled) {
        if (!_mesh) {
            IBoxOptions options;
            options.width = 2;
            options.height = 2;
            options.length = 2;

            _mesh = MeshUtils::createMesh(
                createGeometry(
                    PrimitiveType::BOX,
                    PrimitiveOptions{options}));
        }
        _model->initSubModel(0, _mesh->getRenderingSubMeshes()[0], _material);
    }

    if (!getEnvmap()) {
        setEnvmap(_default.get());
    }

    if (!getDiffuseMap()) {
        setDiffuseMap(_default.get());
    }

    updateGlobalBinding();
    updatePipeline();

    _activated = true;
}

void Skybox::setUseHDR(bool val) {
    Root::getInstance()->getPipeline()->getPipelineSceneData()->setHDR(val);
    _useHDR = val;
    setEnvMaps(_envmapHDR, _envmapLDR);
}

void Skybox::updatePipeline() const {
    if (isEnabled() && _material != nullptr) {
        auto *envmap = getEnvmap();
        if (!envmap) {
            envmap = _default.get();
        }
        _material->setProperty("environmentMap", envmap);
        _material->recompileShaders({{"USE_RGBE_CUBEMAP", isRGBE()}});

        if (_model != nullptr) {
            _model->setSubModelMaterial(0, _material);
            updateSubModes();
        }
    }

    Root *root = Root::getInstance();
    auto *pipeline = root->getPipeline();

    const bool useRGBE = isRGBE();
    const int32_t useIBLValue = isUseIBL() ? (useRGBE ? 2 : 1) : 0;
    const int32_t useDiffuseMapValue = (isUseIBL() && isUseDiffuseMap() && getDiffuseMap() != nullptr) ? (useRGBE ? 2 : 1) : 0;
    const bool useHDRValue = isUseHDR();
    const bool useConvMapValue = isUsingConvolutionMap();

    bool valueChanged = false;
    auto iter = pipeline->getMacros().find("CC_USE_IBL");
    if (iter != pipeline->getMacros().end()) {
        const MacroValue &macroIBL = iter->second;
        const int32_t *macroIBLPtr = ccstd::get_if<int32_t>(&macroIBL);
        if (macroIBLPtr != nullptr && (*macroIBLPtr != useIBLValue)) {
            pipeline->setValue("CC_USE_IBL", useIBLValue);
            valueChanged = true;
        }
    } else {
        pipeline->setValue("CC_USE_IBL", useIBLValue);
        valueChanged = true;
    }

    auto iterDiffuseMap = pipeline->getMacros().find("CC_USE_DIFFUSEMAP");
    if (iterDiffuseMap != pipeline->getMacros().end()) {
        const MacroValue &macroDIFFUSEMAP = iterDiffuseMap->second;
        const int32_t *macroDIFFUSEMAPPtr = ccstd::get_if<int32_t>(&macroDIFFUSEMAP);
        if (macroDIFFUSEMAPPtr != nullptr && ((*macroDIFFUSEMAPPtr != 0) != useDiffuseMapValue)) {
            pipeline->setValue("CC_USE_DIFFUSEMAP", useDiffuseMapValue);
            valueChanged = true;
        }
    } else {
        pipeline->setValue("CC_USE_DIFFUSEMAP", useDiffuseMapValue);
        valueChanged = true;
    }

    auto iterUseHDR = pipeline->getMacros().find("CC_USE_HDR");
    if (iterUseHDR != pipeline->getMacros().end()) {
        const MacroValue &macroHDR = iterUseHDR->second;
        const bool *macroHDRPtr = ccstd::get_if<bool>(&macroHDR);
        if (macroHDRPtr != nullptr && (*macroHDRPtr != useHDRValue)) {
            pipeline->setValue("CC_USE_HDR", useHDRValue);
            valueChanged = true;
        }
    } else {
        pipeline->setValue("CC_USE_HDR", useHDRValue);
        valueChanged = true;
    }

    auto iterUseConvMap = pipeline->getMacros().find("CC_IBL_CONVOLUTED");
    if (iterUseConvMap != pipeline->getMacros().end()) {
        const MacroValue &macroConvMap = iterUseConvMap->second;
        const bool *macroConvMaptr = ccstd::get_if<bool>(&macroConvMap);
        if (macroConvMaptr != nullptr && (*macroConvMaptr != useConvMapValue)) {
            pipeline->setValue("CC_IBL_CONVOLUTED", useConvMapValue);
            valueChanged = true;
        }
    } else {
        pipeline->setValue("CC_IBL_CONVOLUTED", useConvMapValue);
        valueChanged = true;
    }

    if (isEnabled() && _model != nullptr && _material != nullptr) {
        _model->setSubModelMaterial(0, _material);
    }

    if (valueChanged && _activated) {
        root->onGlobalPipelineStateChanged();
    }
}

void Skybox::updateGlobalBinding() {
    if (_globalDSManager != nullptr) {
        auto *device = Root::getInstance()->getDevice();

        auto *convolutonMap = getReflectionMap();
        if (convolutonMap != nullptr) {
            auto *texture = convolutonMap->getGFXTexture();
            auto *sampler = device->getSampler(convolutonMap->getSamplerInfo());
            _globalDSManager->bindSampler(pipeline::ENVIRONMENT::BINDING, sampler);
            _globalDSManager->bindTexture(pipeline::ENVIRONMENT::BINDING, texture);
        } else {
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
        }

        auto *diffuseMap = getDiffuseMap();
        if (!diffuseMap) {
            diffuseMap = _default.get();
        }
        if (diffuseMap != nullptr) {
            auto *texture = diffuseMap->getGFXTexture();
            auto *sampler = device->getSampler(diffuseMap->getSamplerInfo());
            _globalDSManager->bindSampler(pipeline::DIFFUSEMAP::BINDING, sampler);
            _globalDSManager->bindTexture(pipeline::DIFFUSEMAP::BINDING, texture);
        }
        _globalDSManager->update();
    }
}

void Skybox::updateSubModes() const {
    if (_model) {
        const auto &subModels = _model->getSubModels();
        for (const auto &subModel : subModels) {
            subModel->update();
        }
    }
}

} // namespace scene
} // namespace cc
