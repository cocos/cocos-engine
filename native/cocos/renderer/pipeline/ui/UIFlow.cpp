
#include "UIFlow.h"
#include "../Define.h"
#include "../forward/ForwardPipeline.h"
#include "../forward/SceneCulling.h"
#include "UIStage.h"

namespace cc {
namespace pipeline {
RenderFlowInfo UIFlow::_initInfo = {
    "UIFlow",
    static_cast<uint>(ForwardFlowPriority::UI),
    static_cast<uint>(RenderFlowTag::UI),
    {}
};
const RenderFlowInfo &UIFlow::getInitializeInfo() { return UIFlow::_initInfo; }

UIFlow::~UIFlow() {
}

bool UIFlow::initialize(const RenderFlowInfo &info) {
    RenderFlow::initialize(info);
    if (_stages.size() == 0) {
        auto uiStage = CC_NEW(UIStage);
        uiStage->initialize(UIStage::getInitializeInfo());
        _stages.emplace_back(uiStage);
    }
    return true;
}

void UIFlow::activate(RenderPipeline *pipeline) {
    RenderFlow::activate(pipeline);
}

void UIFlow::render(RenderView *view) {
    auto pipeline = static_cast<ForwardPipeline *>(_pipeline);
    pipeline->updateUBOs(view);
    RenderFlow::render(view);
}

void UIFlow::destroy() {
    RenderFlow::destroy();
}

} // namespace pipeline
} // namespace cc
