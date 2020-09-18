#include "RenderPipeline.h"
#include "RenderFlow.h"
#include "RenderView.h"
#include "gfx/GFXCommandBuffer.h"
#include "gfx/GFXDescriptorSet.h"
#include "gfx/GFXDescriptorSetLayout.h"
#include "gfx/GFXDevice.h"

namespace cc {
namespace pipeline {
RenderPipeline *RenderPipeline::_instance = nullptr;

RenderPipeline *RenderPipeline::getInstance() {
    return RenderPipeline::_instance;
}

RenderPipeline::RenderPipeline()
: _device(gfx::Device::getInstance()) {
    RenderPipeline::_instance = this;
    
    setDescriptorSetLayout();
}

RenderPipeline::~RenderPipeline() {
}

void RenderPipeline::setDescriptorSetLayout() {
    globalDescriptorSetLayout.bindings.resize(static_cast<size_t>(PipelineGlobalBindings::COUNT));
    globalDescriptorSetLayout.bindings[UBOGlobal::BLOCK.binding] = UBOGlobal::BLOCK;
    globalDescriptorSetLayout.bindings[UBOShadow::BLOCK.binding] = UBOShadow::BLOCK;
    globalDescriptorSetLayout.bindings[UNIFORM_SHADOWMAP.binding] = UNIFORM_SHADOWMAP;
    globalDescriptorSetLayout.bindings[UNIFORM_ENVIRONMENT.binding] = UNIFORM_ENVIRONMENT;
    
    localDescriptorSetLayout.bindings.resize(static_cast<size_t>(ModelLocalBindings::COUNT));
    localDescriptorSetLayout.bindings[UBOLocal::BLOCK.binding] = UBOLocal::BLOCK;
    localDescriptorSetLayout.bindings[UBOLocalBatched::BLOCK.binding] = UBOLocalBatched::BLOCK;
    localDescriptorSetLayout.bindings[UBOForwardLight::BLOCK.binding] = UBOForwardLight::BLOCK;
    localDescriptorSetLayout.bindings[UBOSkinningTexture::BLOCK.binding] = UBOSkinningTexture::BLOCK;
    localDescriptorSetLayout.bindings[UBOSkinningAnimation::BLOCK.binding] = UBOSkinningAnimation::BLOCK;
    localDescriptorSetLayout.bindings[UBOSkinning::BLOCK.binding] = UBOSkinning::BLOCK;
    localDescriptorSetLayout.bindings[UBOMorph::BLOCK.binding] = UBOMorph::BLOCK;
    
    localDescriptorSetLayout.bindings[UniformJointTexture.binding] = UniformJointTexture;
    localDescriptorSetLayout.bindings[UniformPositionMorphTexture.binding] = UniformPositionMorphTexture;
    localDescriptorSetLayout.bindings[UniformNormalMorphTexture.binding] = UniformNormalMorphTexture;
    localDescriptorSetLayout.bindings[UniformTangentMorphTexture.binding] = UniformTangentMorphTexture;
    localDescriptorSetLayout.bindings[UniformLightingMapSampler.binding] = UniformLightingMapSampler;
    localDescriptorSetLayout.bindings[UniformSpriteSampler.binding] = UniformSpriteSampler;
}

bool RenderPipeline::initialize(const RenderPipelineInfo &info) {
    _flows = info.flows;
    _tag = info.tag;
    return true;
}

bool RenderPipeline::activate() {
    if (_descriptorSetLayout) {
        CC_DELETE(_descriptorSetLayout);
    }
    _descriptorSetLayout = _device->createDescriptorSetLayout({globalDescriptorSetLayout.bindings});

    if (_descriptorSet) {
        CC_DELETE(_descriptorSet);
    }
    _descriptorSet = _device->createDescriptorSet({_descriptorSetLayout});

    for (const auto flow : _flows)
        flow->activate(this);

    return true;
}

void RenderPipeline::render(const vector<RenderView *> &views) {
    for (const auto view : views) {
        for (const auto flow : view->getFlows()) {
            flow->render(view);
        }
    }
}

void RenderPipeline::destroy() {
    for (auto flow : _flows) {
        flow->destroy();
    }
    _flows.clear();

    CC_SAFE_DESTROY(_descriptorSetLayout);
    CC_SAFE_DESTROY(_descriptorSet);

    for (const auto cmdBuffer : _commandBuffers) {
        cmdBuffer->destroy();
    }
    _commandBuffers.clear();
}

} // namespace pipeline
} // namespace cc
