#include "ForwardFlow.h"
#include "ForwardPipeline.h"
#include "ForwardStage.h"
#include "SceneCulling.h"

namespace cc {
namespace pipeline {
RenderFlowInfo ForwardFlow::_initInfo = {
    "ForwardFlow",
    static_cast<uint>(ForwardFlowPriority::FORWARD),
    static_cast<uint>(RenderFlowTag::SCENE),
    {},
};
const RenderFlowInfo &ForwardFlow::getInitializeInfo() { return ForwardFlow::_initInfo; }

ForwardFlow::~ForwardFlow() {
}

bool ForwardFlow::initialize(const RenderFlowInfo &info) {
    RenderFlow::initialize(info);

    if (_stages.size() == 0) {
        auto forwardStage = CC_NEW(ForwardStage);
        forwardStage->initialize(ForwardStage::getInitializeInfo());
        _stages.emplace_back(forwardStage);
    }

    return true;
}

void ForwardFlow::activate(RenderPipeline *pipeline) {
    RenderFlow::activate(pipeline);
}

void ForwardFlow::render(Camera *camera) {
    auto pipeline = static_cast<ForwardPipeline *>(_pipeline);
    sceneCulling(pipeline, camera);
    pipeline->updateCameraUBO(camera);
    RenderFlow::render(camera);
}

void ForwardFlow::destroy() {
    RenderFlow::destroy();
}

} // namespace pipeline
} // namespace cc
