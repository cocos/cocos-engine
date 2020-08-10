
#include "ShadowFlow.h"
#include "../Define.h"

namespace cc {
namespace pipeline {
RenderFlowInfo ShadowFlow::_initInfo = {
    "ShadowFlow",
    static_cast<uint>(ForwardFlowPriority::SHADOW),
    static_cast<uint>(RenderFlowTag::SCENE)};
const RenderFlowInfo &ShadowFlow::getInitializeInfo() { return ShadowFlow::_initInfo; }

ShadowFlow::~ShadowFlow() {
    destroy();
}

bool ShadowFlow::initialize(const RenderFlowInfo &info) {
    RenderFlow::initialize(info);

    return true;
}

void ShadowFlow::activate(RenderPipeline *pipeline) {
}

void ShadowFlow::render(RenderView *view) {
}

void ShadowFlow::destroy() {
}

} // namespace pipeline
} // namespace cc
