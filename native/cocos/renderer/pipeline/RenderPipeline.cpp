#include "RenderPipeline.h"
#include "RenderFlow.h"
#include "RenderView.h"
#include "gfx/GFXCommandBuffer.h"
#include "renderer/core/gfx/GFXDevice.h"

namespace cc {
namespace pipeline {

RenderPipeline::~RenderPipeline() {
    destroy();
}

bool RenderPipeline::initialize(const RenderPipelineInfo *info) {
    if (info) {
        _flows = std::move(info->flows);
        _tag = info->tag;
    }

    return true;
}

bool RenderPipeline::activate() {
    for (const auto &flow : _flows)
        flow->activate(this);

    return true;
}

void RenderPipeline::render(RenderView *view) {
    for (const auto flow : view->getFlows())
        flow->render(view);
}

void RenderPipeline::destroy() {
    for (auto flow : _flows) {
        CC_SAFE_DELETE(flow);
    }
    _flows.clear();

    for (auto cmdBuffer : _commandBuffers) {
        CC_SAFE_DELETE(cmdBuffer);
    }
    _commandBuffers.clear();
}

} // namespace pipeline
} // namespace cc
