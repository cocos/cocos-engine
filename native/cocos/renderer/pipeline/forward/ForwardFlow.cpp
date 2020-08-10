#include "ForwardFlow.h"
#include "ForwardPipeline.h"
#include "ForwardStage.h"

namespace cc {
namespace pipeline {
RenderFlowInfo ForwardFlow::_initInfo = {
    "ForwardFlow",
    static_cast<uint>(ForwardFlowPriority::FORWARD),
    static_cast<uint>(RenderFlowTag::SCENE)};
const RenderFlowInfo &ForwardFlow::getInitializeInfo() { return ForwardFlow::_initInfo; };

ForwardFlow::~ForwardFlow() {
    destroy();
}

bool ForwardFlow::initialize(const RenderFlowInfo &info) {
    RenderFlow::initialize(info);

    _forwardStage = CC_NEW(ForwardStage);
    _forwardStage->initialize(ForwardStage::getInitializeInfo());
    _stages.emplace_back(_forwardStage);

    return true;
}

void ForwardFlow::destroy() {
    CC_SAFE_DELETE(_forwardStage);
}

void ForwardFlow::render(RenderView *view) {
    auto pipeline = static_cast<ForwardPipeline *>(_pipeline);

    //    TODO coulsonwang
    //    view.camera.update();
    //    sceneCulling(pipeline, view);

    pipeline->updateUBOs(view);
    RenderFlow::render(view);
}

} // namespace pipeline
} // namespace cc
