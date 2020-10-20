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
    globalDescriptorSetLayout.bindings[UBOGlobal::BLOCK.layout.binding] = UBOGlobal::BLOCK.bindings;
    globalDescriptorSetLayout.bindings[UBOShadow::BLOCK.layout.binding] = UBOShadow::BLOCK.bindings;
    globalDescriptorSetLayout.bindings[UNIFORM_SHADOWMAP.layout.binding] = UNIFORM_SHADOWMAP.bindings;
    globalDescriptorSetLayout.bindings[UNIFORM_ENVIRONMENT.layout.binding] = UNIFORM_ENVIRONMENT.bindings;
    
    localDescriptorSetLayout.bindings.resize(static_cast<size_t>(ModelLocalBindings::COUNT));
    localDescriptorSetLayout.bindings[UBOLocal::BLOCK.layout.binding] = UBOLocal::BLOCK.bindings;
    localDescriptorSetLayout.bindings[UBOLocalBatched::BLOCK.layout.binding] = UBOLocalBatched::BLOCK.bindings;
    localDescriptorSetLayout.bindings[UBOForwardLight::BLOCK.layout.binding] = UBOForwardLight::BLOCK.bindings;
    localDescriptorSetLayout.bindings[UBOSkinningTexture::BLOCK.layout.binding] = UBOSkinningTexture::BLOCK.bindings;
    localDescriptorSetLayout.bindings[UBOSkinningAnimation::BLOCK.layout.binding] = UBOSkinningAnimation::BLOCK.bindings;
    localDescriptorSetLayout.bindings[UBOSkinning::BLOCK.layout.binding] = UBOSkinning::BLOCK.bindings;
    localDescriptorSetLayout.bindings[UBOMorph::BLOCK.layout.binding] = UBOMorph::BLOCK.bindings;
    
    localDescriptorSetLayout.bindings[UniformJointTexture.layout.binding] = UniformJointTexture.bindings;
    localDescriptorSetLayout.bindings[UniformPositionMorphTexture.layout.binding] = UniformPositionMorphTexture.bindings;
    localDescriptorSetLayout.bindings[UniformNormalMorphTexture.layout.binding] = UniformNormalMorphTexture.bindings;
    localDescriptorSetLayout.bindings[UniformTangentMorphTexture.layout.binding] = UniformTangentMorphTexture.bindings;
    localDescriptorSetLayout.bindings[UniformLightingMapSampler.layout.binding] = UniformLightingMapSampler.bindings;
    localDescriptorSetLayout.bindings[UniformSpriteSampler.layout.binding] = UniformSpriteSampler.bindings;
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
