#pragma once
#include "cocos/renderer/pipeline/custom/RenderGraphFwd.h"

namespace cc {

namespace render {

class NativePipeline;
void executeRenderGraph(NativePipeline& ppl, const RenderGraph& rg);

} // namespace render

} // namespace cc
