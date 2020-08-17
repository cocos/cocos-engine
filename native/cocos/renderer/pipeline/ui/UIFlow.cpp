
#include "UIFlow.h"
#include "../Define.h"
#include "../forward/ForwardPipeline.h"
#include "UIStage.h"

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

    auto uiStage = CC_NEW(UIStage);
    _stages.emplace_back(uiStage);

    return true;
}

void UIFlow::render(RenderView *view) {
    auto pipeline = static_cast<ForwardPipeline *>(_pipeline);
    //TODO coulsonwang
    //view.camera.update();
    //sceneCullin(pipeline,view);

    pipeline->updateUBOs(view);
    RenderFlow::render(view);
}

void UIFlow::destroy() {
    RenderFlow::destroy();
}

} // namespace pipeline
} // namespace cc
