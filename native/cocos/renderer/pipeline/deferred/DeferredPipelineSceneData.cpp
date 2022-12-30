/****************************************************************************
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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

#include "renderer/pipeline/deferred/DeferredPipelineSceneData.h"
#include "renderer/pipeline/RenderPipeline.h"
#include "renderer/pipeline/deferred/BloomStage.h"
#include "scene/Pass.h"
#include "scene/Shadow.h"

namespace cc {
namespace pipeline {

DeferredPipelineSceneData::DeferredPipelineSceneData() = default;
DeferredPipelineSceneData::~DeferredPipelineSceneData() = default;

void DeferredPipelineSceneData::activate(gfx::Device *device) {
    PipelineSceneData::activate(device);
    initPipelinePassInfo();
}

void DeferredPipelineSceneData::updatePipelineSceneData() {
    updatePipelinePassInfo();
}

void DeferredPipelineSceneData::initPipelinePassInfo() {
    // builtin deferred material
    _lightingMaterial = ccnew Material();
    _lightingMaterial->setUuid("builtin-deferred-material");
    IMaterialInfo materialInfo;
    materialInfo.effectName = "pipeline/deferred-lighting";
    _lightingMaterial->initialize(materialInfo);
    for (const auto &pass : *_lightingMaterial->getPasses()) {
        pass->tryCompile();
    }

    _bloomMaterial = ccnew Material();
    _bloomMaterial->setUuid("builtin-bloom-material");
    materialInfo.effectName = "pipeline/bloom";
    _bloomMaterial->initialize(materialInfo);
    for (const auto &pass : *_bloomMaterial->getPasses()) {
        pass->tryCompile();
    }

    _postProcessMaterial = ccnew Material();
    _postProcessMaterial->setUuid("builtin-post-process-material");
#if ENABLE_ANTIALIAS_FXAA > 0
    _antiAliasing = AntiAliasing::FXAA;
#endif
    materialInfo.effectName = "pipeline/post-process";
    MacroRecord record{{"ANTIALIAS_TYPE", static_cast<int32_t>(_antiAliasing)}};
    materialInfo.defines = record;
    _postProcessMaterial->initialize(materialInfo);
    for (const auto &pass : *_postProcessMaterial->getPasses()) {
        pass->tryCompile();
    }

    updatePipelinePassInfo();
}

void DeferredPipelineSceneData::setAntiAliasing(AntiAliasing value) {
    _antiAliasing = value;
    if (_postProcessMaterial) {
        auto &defines = (*_postProcessMaterial->getPasses())[0]->getDefines();
        defines.emplace("ANTIALIAS_TYPE", static_cast<int32_t>(value));
        auto *renderMat = ccnew Material();
        IMaterialInfo materialInfo;
        materialInfo.effectAsset = _postProcessMaterial->getEffectAsset();
        materialInfo.defines = defines;
        renderMat->initialize(materialInfo);
        for (const auto &pass : *renderMat->getPasses()) {
            pass->tryCompile();
        }
        _postProcessMaterial = renderMat;
    }
}

void DeferredPipelineSceneData::updateBloomPass() {
    if (!_bloomMaterial) {
        return;
    }

    auto &bloomPasses = *_bloomMaterial->getPasses();
    _bloomPrefilterPass = bloomPasses[BLOOM_PREFILTERPASS_INDEX];
    _bloomPrefilterPass->beginChangeStatesSilently();
    _bloomPrefilterPass->tryCompile();
    _bloomPrefilterPass->endChangeStatesSilently();
    _bloomPrefilterPassShader = _bloomPrefilterPass->getShaderVariant();

    for (uint32_t i = 0; i < MAX_BLOOM_FILTER_PASS_NUM; ++i) {
        scene::Pass *downsamplePass = bloomPasses[BLOOM_DOWNSAMPLEPASS_INDEX + i];
        downsamplePass->beginChangeStatesSilently();
        downsamplePass->tryCompile();
        downsamplePass->endChangeStatesSilently();

        scene::Pass *upsamplePass = bloomPasses[BLOOM_UPSAMPLEPASS_INDEX + i];
        upsamplePass->beginChangeStatesSilently();
        upsamplePass->tryCompile();
        upsamplePass->endChangeStatesSilently();

        _bloomUpSamplePasses.emplace_back(upsamplePass);
        _bloomDownSamplePasses.emplace_back(downsamplePass);
    }

    _bloomCombinePass = bloomPasses[BLOOM_COMBINEPASS_INDEX];
    _bloomCombinePass->beginChangeStatesSilently();
    _bloomCombinePass->tryCompile();
    _bloomCombinePass->endChangeStatesSilently();
    _bloomCombinePassShader = _bloomCombinePass->getShaderVariant();

    _bloomUpSamplePassShader = bloomPasses[BLOOM_UPSAMPLEPASS_INDEX]->getShaderVariant();
    _bloomDownSamplePassShader = bloomPasses[BLOOM_DOWNSAMPLEPASS_INDEX]->getShaderVariant();
}

void DeferredPipelineSceneData::updatePostProcessPass() {
    if (!_postProcessMaterial) {
        return;
    }

    _postPass = (*_postProcessMaterial->getPasses())[0];
    _postPass->beginChangeStatesSilently();
    _postPass->tryCompile();
    _postPass->endChangeStatesSilently();

    _postPassShader = _postPass->getShaderVariant();
}

void DeferredPipelineSceneData::updatePipelinePassInfo() {
    updateBloomPass();
    updatePostProcessPass();
    updateDeferredPassInfo();
}

void DeferredPipelineSceneData::updateDeferredPassInfo() {
    updateDeferredLightPass();
}

void DeferredPipelineSceneData::updateDeferredLightPass() {
    if (!_lightingMaterial) {
        return;
    }

    // It's temporary solution for main light shadowmap
    if (RenderPipeline::getInstance()) {
        RenderPipeline::getInstance()->setValue("CC_RECEIVE_SHADOW", 1);
    }

    _lightPass = (*_lightingMaterial->getPasses())[0];
    _lightPass->beginChangeStatesSilently();
    _lightPass->tryCompile();
    _lightPass->endChangeStatesSilently();

    _lightPassShader = _lightPass->getShaderVariant();
}

} // namespace pipeline
} // namespace cc
