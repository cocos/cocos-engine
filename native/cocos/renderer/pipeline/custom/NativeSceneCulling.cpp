#include "LayoutGraphGraphs.h"
#include "NativePipelineTypes.h"
#include "NativeUtils.h"
#include "RenderGraphGraphs.h"
#include "cocos/scene/Octree.h"
#include "cocos/scene/RenderScene.h"
#include "cocos/scene/Skybox.h"
#include "cocos/scene/SpotLight.h"
#include "details/GslUtils.h"
#include "details/Range.h"
#include "pipeline/custom/LayoutGraphTypes.h"
#include "pipeline/custom/NativeUtils.h"
#include "pipeline/custom/RenderCommonTypes.h"

namespace cc {

namespace render {

void NativeRenderQueue::clear() noexcept {
    opaqueQueue.instances.clear();
    transparentQueue.instances.clear();
    opaqueInstancingQueue.clear();
    transparentInstancingQueue.clear();
    sceneFlags = SceneFlags::NONE;
    subpassOrPassLayoutID = 0xFFFFFFFF;
}

bool NativeRenderQueue::empty() const noexcept {
    return opaqueQueue.instances.empty() &&
           transparentQueue.instances.empty() &&
           opaqueInstancingQueue.empty() &&
           transparentInstancingQueue.empty();
}

uint32_t SceneCulling::getOrCreateSceneCullingQuery(const SceneData& sceneData) {
    const auto* const scene = sceneData.scene;
    // get or add scene to queries
    auto& queries = sceneQueries[scene];

    // check cast shadow
    const bool bCastShadow = any(sceneData.flags & SceneFlags::SHADOW_CASTER);

    // get or create query source
    // make query key
    const auto key = CullingKey{
        sceneData.camera,
        sceneData.light.light,
        bCastShadow,
        sceneData.light.level,
    };

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

void SceneCulling::collectCullingQueries(
    const RenderGraph& rg, const LayoutGraphData& lg) {
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
        const auto lightType = sceneData.light.light
                                   ? sceneData.light.light->getType()
                                   : scene::LightType::UNKNOWN;

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

void octreeCulling(
    const scene::Octree& octree,
    const scene::Model* skyboxModelToSkip,
    const scene::RenderScene& scene,
    const scene::Camera& camera,
    const geometry::Frustum& cameraOrLightFrustum,
    bool bCastShadow,
    ccstd::vector<const scene::Model*>& models) {
    const auto visibility = camera.getVisibility();
    // add instances without world bounds
    for (const auto& pModel : scene.getModels()) {
        CC_EXPECTS(pModel);
        const auto& model = *pModel;
        if (!model.isEnabled()) {
            continue;
        }
        // has world bounds, should be in octree
        if (model.getWorldBounds()) {
            continue;
        }
        // is skybox, skip
        if (&model == skyboxModelToSkip) {
            continue;
        }
        // check cast shadow
        if (bCastShadow && !model.isCastShadow()) {
            continue;
        }
        // filter model by view visibility
        if (isNodeVisible(model.getNode(), visibility) || isModelVisible(model, visibility)) {
            models.emplace_back(&model);
        }
    }
    // add instances with world bounds
    octree.queryVisibility(&camera, cameraOrLightFrustum, bCastShadow, models);

    // TODO(zhouzhenglong): move lod culling into octree query
    auto iter = std::remove_if(
        models.begin(), models.end(),
        [&](const scene::Model* model) {
            return scene.isCulledByLod(&camera, model);
        });
    models.erase(iter, models.end());
}

void bruteForceCulling(
    const scene::Model* skyboxModelToSkip,
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
            // frustum culling
            if (!isFrustumVisible(model, cameraOrLightFrustum)) {
                continue;
            }
            // is skybox, skip
            if (&model == skyboxModelToSkip) {
                continue;
            }
            // lod culling
            if (scene.isCulledByLod(&camera, &model)) {
                continue;
            }
            models.emplace_back(&model);
        }
    }
}

void sceneCulling(
    const scene::Model* skyboxModelToSkip,
    const scene::RenderScene& scene,
    const scene::Camera& camera,
    const geometry::Frustum& cameraOrLightFrustum,
    bool bCastShadow,
    ccstd::vector<const scene::Model*>& models) {
    const auto* const octree = scene.getOctree();
    if (octree && octree->isEnabled()) {
        octreeCulling(
            *octree, skyboxModelToSkip,
            scene, camera, cameraOrLightFrustum, bCastShadow, models);
    } else {
        bruteForceCulling(
            skyboxModelToSkip,
            scene, camera, cameraOrLightFrustum, bCastShadow, models);
    }
}

} // namespace

void SceneCulling::batchCulling(const pipeline::PipelineSceneData& pplSceneData) {
    const auto* const skybox = pplSceneData.getSkybox();
    const auto* const skyboxModelToSkip = skybox ? skybox->getModel() : nullptr;

    for (const auto& [scene, queries] : sceneQueries) {
        CC_ENSURES(scene);
        for (const auto& [key, sourceID] : queries.culledResultIndex) {
            CC_EXPECTS(key.camera);
            CC_EXPECTS(key.camera->getScene() == scene);
            const auto& camera = *key.camera;
            const auto* light = key.light;
            const auto level = key.lightLevel;
            const auto bCastShadow = key.castShadow;

            CC_EXPECTS(sourceID < culledResults.size());
            auto& models = culledResults[sourceID];

            if (light) {
                switch (light->getType()) {
                    case scene::LightType::SPOT:
                        sceneCulling(
                            skyboxModelToSkip,
                            *scene, camera,
                            dynamic_cast<const scene::SpotLight*>(light)->getFrustum(),
                            bCastShadow,
                            models);
                        break;
                    case scene::LightType::DIRECTIONAL: {
                        const auto& csmLayers = *pplSceneData.getCSMLayers();
                        const auto* mainLight = dynamic_cast<const scene::DirectionalLight*>(light);
                        const auto& csmLevel = mainLight->getCSMLevel();
                        const geometry::Frustum* frustum = nullptr;
                        if (mainLight->isShadowFixedArea() || csmLevel == scene::CSMLevel::LEVEL_1) {
                            frustum = &csmLayers.getSpecialLayer()->getValidFrustum();
                        } else {
                            frustum = &csmLayers.getLayers()[level]->getValidFrustum();
                        }
                        sceneCulling(
                            skyboxModelToSkip,
                            *scene, camera,
                            *frustum,
                            bCastShadow,
                            models);
                    } break;
                    default:
                        // noop
                        break;
                }
            } else {
                sceneCulling(
                    skyboxModelToSkip,
                    *scene, camera,
                    camera.getFrustum(),
                    bCastShadow,
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
    const bool bDrawShadowCaster,
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
            const bool bRenderPhaseAllowed = phaseLayoutID == pass.getPhaseID();
            if (!bRenderPhaseAllowed) {
                continue;
            }

            // check scene flags
            const bool bBlend = isBlend(pass);
            const bool bOpaqueOrMask = !bBlend;
            if (!bDrawShadowCaster) {
                if (!bDrawBlend && bBlend) {
                    // skip transparent object
                    continue;
                }
                if (!bDrawOpaqueOrMask && bOpaqueOrMask) {
                    // skip opaque object
                    continue;
                }
            }

            // add object to queue
            if (pass.getBatchingScheme() == scene::BatchingSchemes::INSTANCING) {
                if (bBlend) {
                    queue.transparentInstancingQueue.add(pass, *subModel, passIdx);
                } else {
                    queue.opaqueInstancingQueue.add(pass, *subModel, passIdx);
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

void SceneCulling::fillRenderQueues(
    const RenderGraph& rg, const pipeline::PipelineSceneData& pplSceneData) {
    const auto* const skybox = pplSceneData.getSkybox();
    for (auto&& [sceneID, desc] : sceneQueryIndex) {
        CC_EXPECTS(holds<SceneTag>(sceneID, rg));
        const auto sourceID = desc.culledSource;
        const auto targetID = desc.renderQueueTarget;
        const auto& sceneData = get(SceneTag{}, sceneID, rg);

        // check scene flags
        const bool bDrawBlend = any(sceneData.flags & SceneFlags::TRANSPARENT_OBJECT);
        const bool bDrawOpaqueOrMask = any(sceneData.flags & (SceneFlags::OPAQUE_OBJECT | SceneFlags::CUTOUT_OBJECT));
        const bool bDrawShadowCaster = any(sceneData.flags & SceneFlags::SHADOW_CASTER);

        if (!bDrawShadowCaster && !bDrawBlend && !bDrawOpaqueOrMask) {
            // nothing to draw
            continue;
        }

        // render queue info
        const auto renderQueueID = parent(sceneID, rg);
        CC_EXPECTS(holds<QueueTag>(renderQueueID, rg));
        const auto& renderQueue = get(QueueTag{}, renderQueueID, rg);
        const auto phaseLayoutID = renderQueue.phaseID;
        CC_EXPECTS(phaseLayoutID != LayoutGraphData::null_vertex());

        // culling source
        CC_EXPECTS(sourceID < culledResults.size());
        const auto& sourceModels = culledResults[sourceID];

        // native queue target
        CC_EXPECTS(targetID < renderQueues.size());
        auto& nativeQueue = renderQueues[targetID];
        CC_EXPECTS(nativeQueue.empty());

        // skybox
        const auto* camera = sceneData.camera;
        CC_EXPECTS(camera);
        if (!any(sceneData.flags & SceneFlags::SHADOW_CASTER) &&
            skybox && skybox->isEnabled() &&
            (static_cast<int32_t>(camera->getClearFlag()) & scene::Camera::SKYBOX_FLAG)) {
            CC_EXPECTS(skybox->getModel());
            const auto& model = *skybox->getModel();
            const auto* node = model.getNode();
            float depth = 0;
            if (node) {
                Vec3 tempVec3{};
                tempVec3 = node->getWorldPosition() - camera->getPosition();
                depth = tempVec3.dot(camera->getForward());
            }
            nativeQueue.opaqueQueue.add(model, depth, 0, 0);
        }

        // fill native queue
        for (const auto* const model : sourceModels) {
            addRenderObject(
                phaseLayoutID, bDrawOpaqueOrMask, bDrawBlend, bDrawShadowCaster,
                *sceneData.camera, *model, nativeQueue);
        }

        // post-processing
        nativeQueue.sort();
    }
}

void SceneCulling::buildRenderQueues(
    const RenderGraph& rg, const LayoutGraphData& lg,
    const pipeline::PipelineSceneData& pplSceneData) {
    collectCullingQueries(rg, lg);
    batchCulling(pplSceneData);
    fillRenderQueues(rg, pplSceneData);
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
