#include "RenderPipeline.h"
#include "RenderFlow.h"
#include "RenderView.h"
#include "gfx/GFXCommandBuffer.h"
#include "renderer/core/gfx/GFXDevice.h"

namespace cc {
namespace pipeline {
RenderPipeline *RenderPipeline::_instance = nullptr;

RenderPipeline *RenderPipeline::getInstance() {
    return RenderPipeline::_instance;
}

RenderPipeline::RenderPipeline() {
    RenderPipeline::_instance = this;
}

RenderPipeline::~RenderPipeline() {
    destroy();
}

bool RenderPipeline::initialize(const RenderPipelineInfo &info) {
    _flows = info.flows;
    _tag = info.tag;
    return true;
}

bool RenderPipeline::activate() {
    //TODO coulsonwang
    //_device->createDescriptorSetLayout();
    
    for (const auto flow : _flows)
        flow->activate(this);

    return true;
}

void RenderPipeline::render(const vector<RenderView*>& views) {
    for (const auto view : views) {
        const auto &flows = view->getFlows();
        for (const auto flow : flows)
            flow->render(view);
    }
}

void RenderPipeline::destroy() {
    for (const auto flow : _flows) {
        flow->destroy();
    }
    _flows.clear();

    //TODO coulsonwang
    //destroy descritor set

    for (const auto cmdBuffer : _commandBuffers) {
        cmdBuffer->destroy();
    }
    _commandBuffers.clear();
}

} // namespace pipeline
} // namespace cc
