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

#include "scene/SubModel.h"
#include "core/Root.h"
#include "core/platform/Debug.h"
#include "pipeline/Define.h"
#include "renderer/pipeline/forward/ForwardPipeline.h"
#include "scene/Model.h"
#include "scene/Pass.h"
#include "scene/Shadow.h"

namespace cc {
namespace scene {

SubModel::SubModel() {
    _id = generateId();
}

const static uint32_t  MAX_PASS_COUNT = 8;
gfx::DescriptorSetInfo dsInfo         = gfx::DescriptorSetInfo();

void SubModel::update() {
    const auto &passes = *_passes;
    for (Pass *pass : passes) {
        pass->update();
    }
    _descriptorSet->update();
    _worldBoundDescriptorSet->update();
}

void SubModel::setPasses(const std::shared_ptr<std::vector<IntrusivePtr<Pass>>> &pPasses) {
    if (!pPasses || pPasses->size() > MAX_PASS_COUNT) {
        debug::errorID(12004, MAX_PASS_COUNT); 
        return;
    }

    _passes = pPasses;
    flushPassInfo();

    const auto &passes = *_passes;
    if (passes[0]->getBatchingScheme() == BatchingSchemes::VB_MERGING) {
        _subMesh->genFlatBuffers();
    }
    // DS layout might change too
    if (_descriptorSet) {
        _descriptorSet->destroy();
        dsInfo.layout  = passes[0]->getLocalSetLayout();
        _descriptorSet = _device->createDescriptorSet(dsInfo);
    }
}

gfx::Shader *SubModel::getShader(uint index) const {
    if (index >= _shaders.size()) {
        return nullptr;
    }

    return _shaders[index];
}

Pass *SubModel::getPass(uint index) const {
    auto &passes = *_passes;
    if (index >= passes.size()) {
        return nullptr;
    }

    return passes[index];
}

void SubModel::initialize(RenderingSubMesh *subMesh, const std::shared_ptr<std::vector<IntrusivePtr<Pass>>> &pPasses, const std::vector<IMacroPatch> &patches) {
    _device = Root::getInstance()->getDevice();
    if (!pPasses->empty()) {
        dsInfo.layout = (*pPasses)[0]->getLocalSetLayout();
    }
    _inputAssembler                          = _device->createInputAssembler(subMesh->getIaInfo());
    _descriptorSet                           = _device->createDescriptorSet(dsInfo);
    const auto *               pipeline      = Root::getInstance()->getPipeline();
    const auto *               occlusionPass = pipeline->getPipelineSceneData()->getOcclusionQueryPass();
    cc::gfx::DescriptorSetInfo occlusionDSInfo;
    occlusionDSInfo.layout   = occlusionPass->getLocalSetLayout();
    _worldBoundDescriptorSet = _device->createDescriptorSet(occlusionDSInfo);
    _subMesh                 = subMesh;
    _patches                 = patches;
    _passes                  = pPasses;

    flushPassInfo();

    const auto &passes = *_passes;
    if (passes[0]->getBatchingScheme() == BatchingSchemes::VB_MERGING) {
        subMesh->genFlatBuffers();
    }
    _priority = pipeline::RenderPriority::DEFAULT;

    // initialize resources for reflection material
    if (passes[0]->getPhase() == pipeline::getPhaseID("reflection")) {
        const auto *   mainWindow = Root::getInstance()->getMainWindow();
        uint32_t       texWidth   = mainWindow->getWidth();
        uint32_t       texHeight  = mainWindow->getHeight();
        const uint32_t minSize    = 512;
        if (texHeight < texWidth) {
            texWidth  = minSize * texWidth / texHeight;
            texHeight = minSize;
        } else {
            texWidth  = minSize;
            texHeight = minSize * texHeight / texWidth;
        }
        _reflectionTex = _device->createTexture(gfx::TextureInfo{
            gfx::TextureType::TEX2D,
            gfx::TextureUsageBit::STORAGE | gfx::TextureUsageBit::TRANSFER_SRC | gfx::TextureUsageBit::SAMPLED,
            gfx::Format::RGBA8,
            texWidth,
            texHeight,
        });
        _descriptorSet->bindTexture(pipeline::REFLECTIONTEXTURE::BINDING, _reflectionTex);

        const gfx::SamplerInfo samplerInfo{
            gfx::Filter::LINEAR,
            gfx::Filter::LINEAR,
            gfx::Filter::NONE,
            gfx::Address::CLAMP,
            gfx::Address::CLAMP,
            gfx::Address::CLAMP,
        };
        _reflectionSampler = _device->getSampler(samplerInfo);
        _descriptorSet->bindSampler(pipeline::REFLECTIONTEXTURE::BINDING, _reflectionSampler);
        _descriptorSet->bindTexture(pipeline::REFLECTIONTEXTURE::BINDING, _reflectionTex);
    }
}

// TODO():
// This is a temporary solution
// It should not be written in a fixed way, or modified by the user
void SubModel::initPlanarShadowShader() {
    const auto *pipeline   = static_cast<pipeline::ForwardPipeline *>(Root::getInstance()->getPipeline());
    Shadows *   shadowInfo = pipeline->getPipelineSceneData()->getShadows();
    if (shadowInfo != nullptr) {
        _planarShader = shadowInfo->getPlanarShader(_patches);
    } else {
        _planarShader = nullptr;
    }
}

// TODO():
// This is a temporary solution
// It should not be written in a fixed way, or modified by the user
void SubModel::initPlanarShadowInstanceShader() {
    const auto *pipeline   = static_cast<pipeline::ForwardPipeline *>(Root::getInstance()->getPipeline());
    Shadows *   shadowInfo = pipeline->getPipelineSceneData()->getShadows();
    if (shadowInfo != nullptr) {
        _planarInstanceShader = shadowInfo->getPlanarInstanceShader(_patches);
    } else {
        _planarInstanceShader = nullptr;
    }
}

void SubModel::destroy() {
    CC_SAFE_DESTROY_NULL(_descriptorSet);
    CC_SAFE_DESTROY_NULL(_inputAssembler);
    CC_SAFE_DESTROY_NULL(_worldBoundDescriptorSet);

    _priority = pipeline::RenderPriority::DEFAULT;

    _patches.clear();
    _subMesh = nullptr;
    _passes.reset();
    _shaders.clear();

    CC_SAFE_DESTROY_NULL(_reflectionTex);
    _reflectionSampler = nullptr;
}

void SubModel::onPipelineStateChanged() {
    const auto &passes = *_passes;
    if (passes.empty()) return;

    for (Pass *pass : passes) {
        pass->beginChangeStatesSilently();
        pass->tryCompile(); // force update shaders
        pass->endChangeStatesSilently();
    }
    flushPassInfo();
}

void SubModel::onMacroPatchesStateChanged(const std::vector<IMacroPatch> &patches) {
    _patches           = patches;
    const auto &passes = *_passes;
    if (passes.empty()) return;
    for (Pass *pass : passes) {
        pass->beginChangeStatesSilently();
        pass->tryCompile(); // force update shaders
        pass->endChangeStatesSilently();
    }
    flushPassInfo();
}

void SubModel::flushPassInfo() {
    const auto &passes = *_passes;
    if (passes.empty()) return;
    if (!_shaders.empty()) {
        _shaders.clear();
    }
    _shaders.resize(passes.size());
    for (uint i = 0; i < passes.size(); ++i) {
        _shaders[i] = passes[i]->getShaderVariant(_patches);
    }
}

void SubModel::setSubMesh(RenderingSubMesh *subMesh) {
    const auto &passes = *_passes;
    _inputAssembler->destroy();
    _inputAssembler->initialize(subMesh->getIaInfo());
    if (passes[0]->getBatchingScheme() == BatchingSchemes::VB_MERGING) {
        subMesh->genFlatBuffers();
    }
    _subMesh = subMesh;
}

} // namespace scene
} // namespace cc
