// clang-format off
#pragma once
#include "cocos/renderer/pipeline/custom/LayoutGraphTypes.h"
#include "cocos/renderer/pipeline/custom/RenderCompilerFwd.h"
#include "cocos/renderer/pipeline/custom/RenderGraphTypes.h"
#include "cocos/renderer/pipeline/custom/String.h"

namespace cc {

namespace render {

struct RenderCompiler {
    RenderCompiler(ResourceGraph& resourceGraphIn, RenderGraph& graphIn, LayoutGraph& layoutGraphIn, boost::container::pmr::memory_resource* scratchIn) noexcept
    : resourceGraph(resourceGraphIn),
      graph(graphIn),
      layoutGraph(layoutGraphIn),
      scratch(scratchIn) {}
    RenderCompiler(RenderCompiler&& rhs)      = delete;
    RenderCompiler(RenderCompiler const& rhs) = delete;
    RenderCompiler& operator=(RenderCompiler&& rhs) = delete;
    RenderCompiler& operator=(RenderCompiler const& rhs) = delete;

    int compile();

    ResourceGraph&                          resourceGraph;
    RenderGraph&                            graph;
    LayoutGraph&                            layoutGraph;
    boost::container::pmr::memory_resource* scratch = nullptr;
};

} // namespace render

} // namespace cc
