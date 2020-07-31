#include "RenderStage.h"

namespace cc {
namespace pipeline {

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

} // namespace pipeline
} // namespace cc
