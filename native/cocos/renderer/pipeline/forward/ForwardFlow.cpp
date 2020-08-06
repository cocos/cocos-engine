#include "ForwardFlow.h"
#include "ForwardStage.h"
#include "ForwardPipeline.h"

namespace cc {
namespace pipeline {

ForwardFlow::~ForwardFlow() {
    destroy();
}

bool ForwardFlow::initialize(const RenderFlowInfo &info) {
    RenderFlow::initialize(info);
    
    _forwardStage = CC_NEW(ForwardStage);
    _stages.emplace_back(_forwardStage);
    
    return true;
}

void ForwardFlow::destroy() {
    CC_SAFE_DELETE(_forwardStage);
}

void ForwardFlow::render(RenderView *view) {
    auto pipeline = static_cast<ForwardPipeline *>(_pipeline);
    
}

} // namespace pipeline
} // namespace cc
