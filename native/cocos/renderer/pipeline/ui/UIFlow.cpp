
#include "UIFlow.h"
#include "../Define.h"

namespace cc {
namespace pipeline {
RenderFlowInfo UIFlow::_initInfo = {
    "UIFlow",
    static_cast<uint>(ForwardFlowPriority::UI),
    static_cast<uint>(RenderFlowTag::UI)};
const RenderFlowInfo &UIFlow::getInitializeInfo() { return UIFlow::_initInfo; }

UIFlow::~UIFlow() {
    destroy();
}

bool UIFlow::initialize(const RenderFlowInfo &info) {
    RenderFlow::initialize(info);

    return true;
}

void UIFlow::activate(RenderPipeline *pipeline) {
}

void UIFlow::render(RenderView *view) {
}

void UIFlow::destroy() {
}

} // namespace pipeline
} // namespace cc
