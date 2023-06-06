#include "NativePipelineTypes.h"
#include "LayoutGraphGraphs.h"
#include "RenderGraphGraphs.h"
#include "NativeUtils.h"
#include "details/Range.h"
#include "details/GslUtils.h"
#include "pipeline/custom/LayoutGraphTypes.h"
#include "pipeline/custom/NativeUtils.h"
#include "cocos/scene/RenderScene.h"
#include "cocos/scene/Octree.h"
#include "cocos/scene/SpotLight.h"

namespace cc {

namespace render {

void NativeRenderQueue::clear() noexcept {
    opaqueQueue.instances.clear();
    transparentQueue.instances.clear();
    opaqueInstancingQueue.batches.clear();
    opaqueInstancingQueue.sortedBatches.clear();
    transparentInstancingQueue.batches.clear();
    transparentInstancingQueue.sortedBatches.clear();
    sceneFlags = SceneFlags::NONE;
    subpassOrPassLayoutID = 0xFFFFFFFF;
}

bool NativeRenderQueue::empty() const noexcept {
    return opaqueQueue.instances.empty() &&
           transparentQueue.instances.empty() &&
           opaqueInstancingQueue.batches.empty() &&
           opaqueInstancingQueue.sortedBatches.empty() &&
           transparentInstancingQueue.batches.empty() &&
           transparentInstancingQueue.sortedBatches.empty();
}

uint32_t SceneCulling::getOrCreateSceneCullingQuery(const SceneData& sceneData) {
    const auto* const scene = sceneData.scene;
    // get or add scene to queries
    auto& queries = sceneQueries[scene];

    // get or create query source
    // make query key
    const auto key = CullingKey{ sceneData.camera, sceneData.light.light.get() };

    // find query source
    auto iter = queries.culledResultIndex.find(key);
    if (iter == queries.culledResultIndex.end()) {
        // create query source
        // make query source id
        const auto sourceID = numCullingQueries++;
        if (numCullingQueries > culledResults.size()) {
            // space is not enough, create query source
            CC_EXPECTS(numCullingQueries == culledResults.size() + 1);
            culledResults.emplace_back();
        }
        // add query source to query index
        bool added = false;
        std::tie(iter, added) = queries.culledResultIndex.emplace(key, sourceID);
        CC_ENSURES(added);
    }
    return iter->second;
}

uint32_t SceneCulling::createRenderQueue(
    SceneFlags sceneFlags, LayoutGraphData::vertex_descriptor subpassOrPassLayoutID) {
    const auto targetID = numRenderQueues++;
    if (numRenderQueues > renderQueues.size()) {
        CC_EXPECTS(numRenderQueues == renderQueues.size() + 1);
        renderQueues.emplace_back();
    }
    CC_ENSURES(targetID < renderQueues.size());
    auto& rq = renderQueues[targetID];
    CC_EXPECTS(rq.empty());
    CC_EXPECTS(rq.sceneFlags == SceneFlags::NONE);
    CC_EXPECTS(rq.subpassOrPassLayoutID == 0xFFFFFFFF);
    rq.sceneFlags = sceneFlags;
    rq.subpassOrPassLayoutID = subpassOrPassLayoutID;
    return targetID;
}

void SceneCulling::collectCullingQueries(const RenderGraph& rg, const LayoutGraphData& lg) {
    for (const auto vertID : makeRange(vertices(rg))) {
        if (!holds<SceneTag>(vertID, rg)) {
            continue;
        }
        const auto& sceneData = get(SceneTag{}, vertID, rg);
        if (!sceneData.scene) {
            CC_EXPECTS(false);
            continue;
        }
        const auto sourceID = getOrCreateSceneCullingQuery(sceneData);
        const auto layoutID = getSubpassOrPassID(vertID, rg, lg);
        const auto targetID = createRenderQueue(sceneData.flags, layoutID);
        const auto lightType = sceneData.light.light ? 
            sceneData.light.light->getType()  : scene::LightType::UNKNOWN;

        // add render queue to query source
        sceneQueryIndex.emplace(vertID, NativeRenderQueueDesc(sourceID, targetID, lightType));
    }
}

namespace {

bool isNodeVisible(const Node* node, uint32_t visibility) {
    return node && ((visibility & node->getLayer()) == node->getLayer());
}

uint32_t isModelVisible(const scene::Model& model, uint32_t visibility) {
    return visibility & static_cast<uint32_t>(model.getVisFlags());
}

bool isFrustumVisible(const scene::Model& model, const geometry::Frustum& frustum) {
    const auto* const modelWorldBounds = model.getWorldBounds();
    return !modelWorldBounds || modelWorldBounds->aabbFrustum(frustum);
}

//bool isPointInstanceAndNotSkybox(const scene::Model& model, const scene::Skybox* skyBox) {
//    const auto* modelWorldBounds = model.getWorldBounds();
//    return !modelWorldBounds && (skyBox == nullptr || skyBox->getModel() != &model);
//}

void bruteForceCulling(
    const scene::RenderScene& scene,
    const scene::Camera& camera,
    const geometry::Frustum& cameraOrLightFrustum,
    bool bCastShadow,
    ccstd::vector<const scene::Model*>& models) {
    const auto visibility = camera.getVisibility();
    for (const auto& pModel : scene.getModels()) {
        CC_EXPECTS(pModel);
        const auto& model = *pModel;
        if (!model.isEnabled()) {
            continue;
        }
        if (bCastShadow && !model.isCastShadow()) {
            continue;
        }
        // filter model by view visibility
        if (isNodeVisible(model.getNode(), visibility) || isModelVisible(model, visibility)) {
            if (!isFrustumVisible(model, cameraOrLightFrustum)) {
                continue;
            }
            if (scene.isCulledByLod(&camera, &model)) {
                continue;
            }
            models.emplace_back(&model);
        }
    }
}

void sceneCulling(
    const scene::RenderScene& scene,
    const scene::Camera& camera,
    const geometry::Frustum& cameraOrLightFrustum,
    bool bCastShadow,
    ccstd::vector<const scene::Model*>& models) {
    const auto* const octree = scene.getOctree();
    if (octree && octree->isEnabled()) {
        octree->queryVisibility(&camera, cameraOrLightFrustum, bCastShadow, models);
        // TODO(zhouzhenglong): move lod culling into octree query
        auto iter = std::remove_if(models.begin(), models.end(),
            [&](const scene::Model* model) {
                return scene.isCulledByLod(&camera, model);
            });
        models.erase(iter, models.end());
    } else {
        bruteForceCulling(scene, camera, cameraOrLightFrustum, bCastShadow, models);
    }
}

} // namespace

void SceneCulling::batchCulling() {
    for (const auto& [scene, queries] : sceneQueries) {
        CC_ENSURES(scene);
        for (const auto& [key, sourceID] : queries.culledResultIndex) {
            CC_EXPECTS(key.camera);
            CC_EXPECTS(key.camera->getScene() == scene);
            const auto& camera = *key.camera;
            const auto* light = key.light;

            CC_EXPECTS(sourceID < culledResults.size());
            auto& models = culledResults[sourceID];

            if (light) {
                switch (light->getType()) {
                case scene::LightType::SPOT:
                    sceneCulling(
                        *scene, camera,
                        dynamic_cast<const scene::SpotLight*>(light)->getFrustum(),
                        true,
                        models);
                    break;
                case scene::LightType::DIRECTIONAL:
                    sceneCulling(
                        *scene, camera,
                        camera.getFrustum(),
                        true,
                        models);
                    break;
                default:
                    // noop
                    break;
                }
            } else {
                sceneCulling(
                    *scene, camera,
                    camera.getFrustum(),
                    true,
                    models);
            }
        }
    }
}

namespace {

bool isBlend(const scene::Pass& pass) {
    bool bBlend = false;
    for (const auto& target : pass.getBlendState()->targets) {
        if (target.blend) {
            bBlend = true;
        }
    }
    return bBlend;
}

float computeSortingDepth(const scene::Camera& camera, const scene::Model& model) {
    float depth = 0;
    if (model.getNode()) {
        const auto* node = model.getTransform();
        Vec3 position;
        Vec3::subtract(node->getWorldPosition(), camera.getPosition(), &position);
        depth = position.dot(camera.getForward());
    }
    return depth;
}

void addRenderObject(
    LayoutGraphData::vertex_descriptor phaseLayoutID,
    const bool bDrawOpaqueOrMask,
    const bool bDrawBlend,
    const scene::Camera& camera,
    const scene::Model& model,
    NativeRenderQueue& queue) {

    const auto& subModels = model.getSubModels();
    const auto subModelCount = subModels.size();
    for (uint32_t subModelIdx = 0; subModelIdx < subModelCount; ++subModelIdx) {
        const auto& subModel = subModels[subModelIdx];
        const auto& passes = *(subModel->getPasses());
        const auto passCount = passes.size();
        for (uint32_t passIdx = 0; passIdx < passCount; ++passIdx) {
            auto& pass = *passes[passIdx];
            // check phase
            const bool bRenderPhaseAllowed =
                phaseLayoutID == LayoutGraphData::null_vertex() ||
                phaseLayoutID == pass.getPhaseID();
            if (!bRenderPhaseAllowed) {
                continue;
            }

            // check scene flags
            const bool bBlend = isBlend(pass);
            const bool bOpaqueOrMask = !bBlend;
            if (!bDrawBlend && bBlend) {
                // skip transparent object
                continue;
            }
            if (!bDrawOpaqueOrMask && bOpaqueOrMask) {
                // skip opaque object
                continue;
            }

            // add object to queue
            if (pass.getBatchingScheme() == scene::BatchingSchemes::INSTANCING) {
                auto& instancedBuffer = *pass.getInstancedBuffer();
                instancedBuffer.merge(subModel, passIdx);
                if (bBlend) {
                    queue.transparentInstancingQueue.add(instancedBuffer);
                } else {
                    queue.opaqueInstancingQueue.add(instancedBuffer);
                }
            } else {
                // TODO(zhouzhenglong): change camera to frustum
                const float depth = computeSortingDepth(camera, model);
                if (bBlend) {
                    queue.transparentQueue.add(model, depth, subModelIdx, passIdx);
                } else {
                    queue.opaqueQueue.add(model, depth, subModelIdx, passIdx);
                }
            }
        }
    }
}

} // namespace

void SceneCulling::fillRenderQueues(const RenderGraph& rg) {
    bool mainLightAdded = false;
    for (auto&& [sceneID, desc] : sceneQueryIndex) {
        CC_EXPECTS(holds<SceneTag>(sceneID, rg));
        const auto sourceID = desc.culledSource;
        const auto targetID = desc.renderQueueTarget;
        const auto& sceneData = get(SceneTag{}, sceneID, rg);

        // check shadow caster
        if (desc.lightType != scene::LightType::UNKNOWN &&
            !any(sceneData.flags & SceneFlags::SHADOW_CASTER)) {
            // rendering to shadow map, but scene is not casting shadow
            continue;
        }

        // check scene flags
        const bool bDrawBlend = any(sceneData.flags & SceneFlags::TRANSPARENT_OBJECT);
        const bool bDrawOpaqueOrMask = any(sceneData.flags & (SceneFlags::OPAQUE_OBJECT | SceneFlags::CUTOUT_OBJECT));
        if (!bDrawBlend && !bDrawOpaqueOrMask) {
            // nothing to draw
            continue;
        }

        // render queue info
        const auto renderQueueID = parent(sceneID, rg);
        CC_EXPECTS(holds<QueueTag>(renderQueueID, rg));
        const auto& renderQueue = get(QueueTag{}, renderQueueID, rg);
        const auto phaseLayoutID = renderQueue.phaseID;

        // culling source
        CC_EXPECTS(sourceID < culledResults.size());
        const auto& sourceModels = culledResults[sourceID];

        // native queue target
        CC_EXPECTS(targetID < renderQueues.size());
        auto& nativeQueue = renderQueues[targetID];
        CC_EXPECTS(nativeQueue.empty());

        // try fill directional csm
        if (desc.lightType == scene::LightType::DIRECTIONAL && !mainLightAdded) {
            // TODO(zhouzhenglong): add CSM
            mainLightAdded = true;
            continue;
        }

        // fill native queue
        for (const auto* const model : sourceModels) {
            addRenderObject(phaseLayoutID, bDrawOpaqueOrMask, bDrawBlend,
                *sceneData.camera, *model, nativeQueue);
        }

        // post-processing
        nativeQueue.sort();
    }
}

void SceneCulling::buildRenderQueues(const RenderGraph& rg, const LayoutGraphData& lg) {
    collectCullingQueries(rg, lg);
    batchCulling();
    fillRenderQueues(rg);
}

void SceneCulling::clear() noexcept {
    sceneQueries.clear();
    for (auto& c : culledResults) {
        c.clear();
    }
    for (auto& q : renderQueues) {
        q.clear();
    }
    sceneQueryIndex.clear();
    numCullingQueries = 0;
    numRenderQueues = 0;
}

} // namespace render

} // namespace cc
