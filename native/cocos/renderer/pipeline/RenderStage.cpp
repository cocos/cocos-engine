#include "RenderStage.h"
#include "RenderQueue.h"
#include "gfx/GFXDevice.h"
namespace cc {
namespace pipeline {
RenderStage::RenderStage()
:_device(gfx::Device::getInstance()){
    
}

RenderStage::~RenderStage() {
}

bool RenderStage::initialize(const RenderStageInfo &info) {
    _name = info.name;
    _priority = info.priority;
    _tag = info.tag;

    return true;
}

void RenderStage::activate(RenderPipeline *pipeline, RenderFlow *flow) {
    _pipeline = pipeline;
    _flow = flow;
}

void RenderStage::destroy() {
    for (auto renderQueue : _renderQueues) {
        CC_SAFE_DELETE(renderQueue);
    }
    _renderQueues.clear();
    _renderQueueDescriptors.clear();
}
} // namespace pipeline
} // namespace cc
