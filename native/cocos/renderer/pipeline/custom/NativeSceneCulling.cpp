#include "NativePipelineTypes.h"
#include "LayoutGraphGraphs.h"
#include "RenderGraphGraphs.h"
#include "NativeUtils.h"
#include "details/Range.h"
#include "details/GslUtils.h"

namespace cc {

namespace render {

void NativeRenderQueue::clear() noexcept {
    opaqueQueue.instances.clear();
    transparentQueue.instances.clear();
    opaqueInstancingQueue.batches.clear();
    opaqueInstancingQueue.sortedBatches.clear();
    sceneFlags = SceneFlags::NONE;
    subpassOrPassLayoutID = 0xFFFFFFFF;
}

void SceneCulling::buildRenderQueues(const RenderGraph& rg, const LayoutGraphData& lg) {
    std::ignore = lg;
    for (const auto vertID : makeRange(vertices(rg))) {
        if (!holds<SceneTag>(vertID, rg)) {
            continue;
        }
        const auto& sceneData = get(SceneTag{}, vertID, rg);
        const auto* const scene = sceneData.scene;
        if (!scene) {
            CC_EXPECTS(false);
            continue;
        }
        auto& queries = sceneQueries[scene];
        const auto key = CullingKey{ sceneData.camera, sceneData.light.light.get() };
        const auto iter = queries.culledResultIndex.find(key);
        if (iter == queries.culledResultIndex.end()) {
            // const auto sourceID = 
        }


    }
}

void SceneCulling::clear() noexcept {
    for (auto& c : culledResults) {
        c.clear();
    }
    for (auto& q : renderQueues) {
        q.clear();
    }
    numCullingQueries = 0;
    numRenderQueues = 0;
}

} // namespace render

} // namespace cc
