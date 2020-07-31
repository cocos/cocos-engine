#include "RenderPipeline.h"
#include "RenderFlow.h"
#include "RenderView.h"
#include "renderer/core/gfx/GFXDevice.h"

namespace cc {
namespace pipeline {

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
    for (auto flow : _flows)
        flow->destroy();

    _flows.clear();
}

} // namespace pipeline
} // namespace cc
