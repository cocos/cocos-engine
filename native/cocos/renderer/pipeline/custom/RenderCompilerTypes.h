// clang-format off
#pragma once
#include "renderer/pipeline/custom/LayoutGraphTypes.h"
#include "renderer/pipeline/custom/RenderCompilerFwd.h"
#include "renderer/pipeline/custom/RenderGraphTypes.h"
#include "renderer/pipeline/custom/String.h"

namespace cc {

namespace render {

struct RenderCompiler {
    RenderCompiler(ResourceGraph& resourceGraph, RenderGraph& graph, LayoutGraph& layoutGraph, boost::container::pmr::memory_resource* scratch) noexcept
    : mResourceGraph(resourceGraph),
      mGraph(graph),
      mLayoutGraph(layoutGraph),
      mScratch(scratch) {}
    RenderCompiler(RenderCompiler&& rhs)      = delete;
    RenderCompiler(RenderCompiler const& rhs) = delete;
    RenderCompiler& operator=(RenderCompiler&& rhs) = delete;
    RenderCompiler& operator=(RenderCompiler const& rhs) = delete;

    int compile();

    ResourceGraph&                          mResourceGraph;
    RenderGraph&                            mGraph;
    LayoutGraph&                            mLayoutGraph;
    boost::container::pmr::memory_resource* mScratch = nullptr;
};

} // namespace render

} // namespace cc
