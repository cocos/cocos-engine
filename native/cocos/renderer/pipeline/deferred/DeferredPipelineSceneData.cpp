#include "renderer/pipeline/deferred/DeferredPipelineSceneData.h"
#include "renderer/pipeline/RenderPipeline.h"
#include "renderer/pipeline/deferred/BloomStage.h"
#include "scene/Shadow.h"

namespace cc {
namespace pipeline {

void DeferredPipelineSceneData::activate(gfx::Device *device, RenderPipeline *pipeline) {
    PipelineSceneData::activate(device, pipeline);
    initPipelinePassInfo();
}

void DeferredPipelineSceneData::onGlobalPipelineStateChanged() {
    updatePipelinePassInfo();
}

void DeferredPipelineSceneData::initPipelinePassInfo() {
    // builtin deferred material
    _lightingMaterial = new Material();
    _lightingMaterial->setUuid("builtin-deferred-material");
    IMaterialInfo materialInfo;
    materialInfo.effectName = "deferred-lighting";
    _lightingMaterial->initialize(materialInfo);
    for (const auto &pass : *_lightingMaterial->getPasses()) {
        pass->tryCompile();
    }

    _bloomMaterial = new Material();
    _bloomMaterial->setUuid("builtin-bloom-material");
    materialInfo.effectName = "bloom";
    _bloomMaterial->initialize(materialInfo);
    for (const auto &pass : *_bloomMaterial->getPasses()) {
        pass->tryCompile();
    }

    _postProcessMaterial = new Material();
    _postProcessMaterial->setUuid("builtin-post-process-material");
#if ENABLE_ANTIALIAS_FXAA > 0
    _antiAliasing = AntiAliasing::FXAA;
#endif
    materialInfo.effectName = "post-process";
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
        auto *        renderMat = new Material();
        IMaterialInfo materialInfo;
        materialInfo.effectAsset = _postProcessMaterial->getEffectAsset();
        materialInfo.defines     = defines;
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

    auto &bloomPasses   = *_bloomMaterial->getPasses();
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

    _bloomUpSamplePassShader   = bloomPasses[BLOOM_UPSAMPLEPASS_INDEX]->getShaderVariant();
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
    if (_shadow->isEnabled()) {
        _pipeline->setValue("CC_RECEIVE_SHADOW", 1);
    }

    _lightPass = (*_lightingMaterial->getPasses())[0];
    _lightPass->beginChangeStatesSilently();
    _lightPass->tryCompile();
    _lightPass->endChangeStatesSilently();

    _lightPassShader = _lightPass->getShaderVariant();
}

} // namespace pipeline
} // namespace cc
