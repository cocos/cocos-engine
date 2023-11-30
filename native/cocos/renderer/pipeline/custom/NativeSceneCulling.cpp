#include "cocos/renderer/pipeline/Define.h"
#include "cocos/renderer/pipeline/custom/LayoutGraphUtils.h"
#include "cocos/renderer/pipeline/custom/NativeBuiltinUtils.h"
#include "cocos/renderer/pipeline/custom/NativePipelineTypes.h"
#include "cocos/renderer/pipeline/custom/NativeRenderGraphUtils.h"
#include "cocos/renderer/pipeline/custom/details/GslUtils.h"
#include "cocos/renderer/pipeline/custom/details/Range.h"
#include "cocos/scene/Octree.h"
#include "cocos/scene/ReflectionProbe.h"
#include "cocos/scene/RenderScene.h"
#include "cocos/scene/Skybox.h"
#include "cocos/scene/SpotLight.h"

#include <boost/align/align_up.hpp>

namespace cc {

namespace render {

const static uint32_t REFLECTION_PROBE_DEFAULT_MASK = ~static_cast<uint32_t>(pipeline::LayerList::UI_2D) & ~static_cast<uint32_t>(pipeline::LayerList::PROFILER) & ~static_cast<uint32_t>(pipeline::LayerList::UI_3D) & ~static_cast<uint32_t>(pipeline::LayerList::GIZMOS) & ~static_cast<uint32_t>(pipeline::LayerList::SCENE_GIZMO) & ~static_cast<uint32_t>(pipeline::LayerList::EDITOR);

void NativeRenderQueue::clear() noexcept {
    probeQueue.clear();
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

FrustumCullingID SceneCulling::getOrCreateFrustumCulling(const SceneData& sceneData) {
    const auto* const scene = sceneData.scene;
    // get or add scene to queries
    auto& queries = frustumCullings[scene];

    // check cast shadow
    const bool bCastShadow = any(sceneData.flags & SceneFlags::SHADOW_CASTER);

    // get or create query source
    // make query key
    const auto key = FrustumCullingKey{
        sceneData.camera,
        sceneData.light.probe,
        sceneData.light.light,
        sceneData.light.level,
        bCastShadow,
    };

    // find query source
    auto iter = queries.resultIndex.find(key);
    if (iter == queries.resultIndex.end()) {
        // create query source
        // make query source id
        const FrustumCullingID frustomCulledResultID{numFrustumCulling++};
        if (numFrustumCulling > frustumCullingResults.size()) {
            // space is not enough, create query source
            CC_EXPECTS(numFrustumCulling == frustumCullingResults.size() + 1);
            frustumCullingResults.emplace_back();
        }
        // add query source to query index
        bool added = false;
        std::tie(iter, added) = queries.resultIndex.emplace(key, frustomCulledResultID);
        CC_ENSURES(added);
    }
    return iter->second;
}

LightBoundsCullingID SceneCulling::getOrCreateLightBoundsCulling(
    const SceneData& sceneData, FrustumCullingID frustumCullingID) {
    if (!any(sceneData.cullingFlags & CullingFlags::LIGHT_BOUNDS)) {
        return {};
    }
    if (sceneData.shadingLight->getType() == scene::LightType::DIRECTIONAL) {
        return {};
    }
    if (!enableLightCulling) {
        return {};
    }

    CC_EXPECTS(sceneData.shadingLight);
    const auto* const scene = sceneData.scene;
    CC_EXPECTS(scene);

    auto& queries = lightBoundsCullings[scene];

    // get or create query source
    // make query key
    const auto key = LightBoundsCullingKey{
        frustumCullingID,
        sceneData.camera,
        sceneData.light.probe,
        sceneData.shadingLight,
    };

    // find query source
    auto iter = queries.resultIndex.find(key);
    if (iter == queries.resultIndex.end()) {
        // create query source
        // make query source id
        const LightBoundsCullingID lightBoundsCullingID{numLightBoundsCulling++};
        if (numLightBoundsCulling > lightBoundsCullingResults.size()) {
            // space is not enough, create query source
            CC_EXPECTS(numLightBoundsCulling == lightBoundsCullingResults.size() + 1);
            lightBoundsCullingResults.emplace_back();
        }
        // add query source to query index
        bool added = false;
        std::tie(iter, added) = queries.resultIndex.emplace(key, lightBoundsCullingID);
        CC_ENSURES(added);
    }
    return iter->second;
}

NativeRenderQueueID SceneCulling::createRenderQueue(
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
    return NativeRenderQueueID{targetID};
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
        const auto frustomCulledResultID = getOrCreateFrustumCulling(sceneData);
        const auto lightBoundsCullingID = getOrCreateLightBoundsCulling(sceneData, frustomCulledResultID);
        const auto layoutID = getSubpassOrPassID(vertID, rg, lg);
        const auto targetID = createRenderQueue(sceneData.flags, layoutID);
        const auto lightType = sceneData.light.light
                                   ? sceneData.light.light->getType()
                                   : scene::LightType::UNKNOWN;

        // add render queue to query source
        renderQueueIndex.emplace(
            vertID,
            NativeRenderQueueDesc{
                frustomCulledResultID,
                lightBoundsCullingID,
                targetID,
                lightType,
            });
    }
}

namespace {

const pipeline::PipelineSceneData* kPipelineSceneData = nullptr;

const LayoutGraphData* kLayoutGraph = nullptr;

bool isNodeVisible(const Node* node, uint32_t visibility) {
    return node && ((visibility & node->getLayer()) == node->getLayer());
}

uint32_t isModelVisible(const scene::Model& model, uint32_t visibility) {
    return visibility & static_cast<uint32_t>(model.getVisFlags());
}

bool isReflectProbeMask(const scene::Model& model) {
    return ((model.getNode()->getLayer() & REFLECTION_PROBE_DEFAULT_MASK) == model.getNode()->getLayer()) || (REFLECTION_PROBE_DEFAULT_MASK & static_cast<uint32_t>(model.getVisFlags()));
}

bool isIntersectAABB(const geometry::AABB& lAABB, const geometry::AABB& rAABB) {
    return !lAABB.aabbAabb(rAABB);
}

bool isFrustumVisible(const scene::Model& model, const geometry::Frustum& frustum, bool castShadow) {
    const auto* const modelWorldBounds = model.getWorldBounds();
    if (!modelWorldBounds) {
        return false;
    }
    geometry::AABB transWorldBounds{};
    transWorldBounds.set(modelWorldBounds->getCenter(), modelWorldBounds->getHalfExtents());
    const scene::Shadows& shadows = *kPipelineSceneData->getShadows();
    if (shadows.getType() == scene::ShadowType::PLANAR && castShadow) {
        modelWorldBounds->transform(shadows.getMatLight(), &transWorldBounds);
    }
    return !transWorldBounds.aabbFrustum(frustum);
}

void octreeCulling(
    const scene::Octree& octree,
    const scene::Model* skyboxModel,
    const scene::RenderScene& scene,
    const scene::Camera& camera,
    const geometry::Frustum& cameraOrLightFrustum,
    bool bCastShadow,
    ccstd::vector<const scene::Model*>& models) {
    const auto visibility = camera.getVisibility();
    const auto camSkyboxFlag = (static_cast<int32_t>(camera.getClearFlag()) & scene::Camera::SKYBOX_FLAG);
    if (!bCastShadow && skyboxModel && camSkyboxFlag) {
        models.emplace_back(skyboxModel);
    }
    // add instances without world bounds
    for (const auto& pModel : scene.getModels()) {
        CC_EXPECTS(pModel);
        const auto& model = *pModel;
        if (!model.isEnabled() || !model.getNode() || model.getWorldBounds() || (bCastShadow && !model.isCastShadow())) {
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
    const scene::Model* skyboxModel,
    const scene::RenderScene& scene,
    const scene::Camera& camera,
    const geometry::Frustum& cameraOrLightFrustum,
    bool bCastShadow,
    const scene::ReflectionProbe* probe,
    ccstd::vector<const scene::Model*>& models) {
    const auto visibility = camera.getVisibility();
    const auto camSkyboxFlag = (static_cast<int32_t>(camera.getClearFlag()) & scene::Camera::SKYBOX_FLAG);
    if (!bCastShadow && skyboxModel && camSkyboxFlag) {
        models.emplace_back(skyboxModel);
    }
    for (const auto& pModel : scene.getModels()) {
        CC_EXPECTS(pModel);
        const auto& model = *pModel;
        if (!model.isEnabled() || !model.getNode() || (bCastShadow && !model.isCastShadow())) {
            continue;
        }
        // lod culling
        if (scene.isCulledByLod(&camera, &model)) {
            continue;
        }
        if (!probe || (probe && probe->getProbeType() == cc::scene::ReflectionProbe::ProbeType::CUBE)) {
            // filter model by view visibility
            if (isNodeVisible(model.getNode(), visibility) || isModelVisible(model, visibility)) {
                const auto* const wBounds = model.getWorldBounds();
                // frustum culling
                if (wBounds && ((!probe && isFrustumVisible(model, cameraOrLightFrustum, bCastShadow)) ||
                                (probe && isIntersectAABB(*wBounds, *probe->getBoundingBox())))) {
                    continue;
                }

                models.emplace_back(&model);
            }
        } else if (isReflectProbeMask(model)) {
            models.emplace_back(&model);
        }
    }
}

void sceneCulling(
    const scene::Model* skyboxModel,
    const scene::RenderScene& scene,
    const scene::Camera& camera,
    const geometry::Frustum& cameraOrLightFrustum,
    bool bCastShadow,
    const scene::ReflectionProbe* probe,
    ccstd::vector<const scene::Model*>& models) {
    const auto* const octree = scene.getOctree();
    if (octree && octree->isEnabled() && !probe) {
        octreeCulling(
            *octree, skyboxModel,
            scene, camera, cameraOrLightFrustum, bCastShadow, models);
    } else {
        bruteForceCulling(
            skyboxModel,
            scene, camera, cameraOrLightFrustum, bCastShadow, probe, models);
    }
}

} // namespace

void SceneCulling::batchFrustumCulling(const NativePipeline& ppl) {
    const auto& pplSceneData = *ppl.getPipelineSceneData();
    const auto* const skybox = pplSceneData.getSkybox();
    const auto* const skyboxModel = skybox && skybox->isEnabled() ? skybox->getModel() : nullptr;

    for (const auto& [scene, queries] : frustumCullings) {
        CC_ENSURES(scene);
        for (const auto& [key, frustomCulledResultID] : queries.resultIndex) {
            CC_EXPECTS(key.camera);
            CC_EXPECTS(key.camera->getScene() == scene);
            const auto* light = key.light;
            const auto level = key.lightLevel;
            const auto bCastShadow = key.castShadow;
            const auto* probe = key.probe;
            const auto& camera = probe ? *probe->getCamera() : *key.camera;
            CC_EXPECTS(frustomCulledResultID.value < frustumCullingResults.size());
            auto& models = frustumCullingResults[frustomCulledResultID.value];

            if (probe) {
                sceneCulling(
                    skyboxModel,
                    *scene, camera,
                    camera.getFrustum(),
                    bCastShadow,
                    probe,
                    models);
                continue;
            }

            if (light) {
                switch (light->getType()) {
                    case scene::LightType::SPOT:
                        sceneCulling(
                            skyboxModel,
                            *scene, camera,
                            dynamic_cast<const scene::SpotLight*>(light)->getFrustum(),
                            bCastShadow,
                            nullptr,
                            models);
                        break;
                    case scene::LightType::DIRECTIONAL: {
                        const auto* mainLight = dynamic_cast<const scene::DirectionalLight*>(light);
                        const auto& frustum = getBuiltinShadowFrustum(ppl, camera, mainLight, level);
                        sceneCulling(
                            skyboxModel,
                            *scene, camera,
                            frustum,
                            bCastShadow,
                            nullptr,
                            models);
                    } break;
                    default:
                        // noop
                        break;
                }
            } else {
                sceneCulling(
                    skyboxModel,
                    *scene, camera,
                    camera.getFrustum(),
                    bCastShadow,
                    nullptr,
                    models);
            }
        }
    }
}

namespace {

void executeSphereLightCulling(
    const scene::SphereLight& light,
    const ccstd::vector<const scene::Model*>& frustumCullingResult,
    ccstd::vector<const scene::Model*>& lightBoundsCullingResult) {
    const auto& lightAABB = light.getAABB();
    for (const auto* const model : frustumCullingResult) {
        CC_EXPECTS(model);
        const auto* const modelBounds = model->getWorldBounds();
        if (!modelBounds || modelBounds->aabbAabb(lightAABB)) {
            lightBoundsCullingResult.emplace_back(model);
        }
    }
}

void executeSpotLightCulling(
    const scene::SpotLight& light,
    const ccstd::vector<const scene::Model*>& frustumCullingResult,
    ccstd::vector<const scene::Model*>& lightBoundsCullingResult) {
    const auto& lightAABB = light.getAABB();
    const auto& lightFrustum = light.getFrustum();
    for (const auto* const model : frustumCullingResult) {
        CC_EXPECTS(model);
        const auto* const modelBounds = model->getWorldBounds();
        if (!modelBounds || (modelBounds->aabbAabb(lightAABB) && modelBounds->aabbFrustum(lightFrustum))) {
            lightBoundsCullingResult.emplace_back(model);
        }
    }
}

void executePointLightCulling(
    const scene::PointLight& light,
    const ccstd::vector<const scene::Model*>& frustumCullingResult,
    ccstd::vector<const scene::Model*>& lightBoundsCullingResult) {
    const auto& lightAABB = light.getAABB();
    for (const auto* const model : frustumCullingResult) {
        CC_EXPECTS(model);
        const auto* const modelBounds = model->getWorldBounds();
        if (!modelBounds || modelBounds->aabbAabb(lightAABB)) {
            lightBoundsCullingResult.emplace_back(model);
        }
    }
}

void executeRangedDirectionalLightCulling(
    const scene::RangedDirectionalLight& light,
    const ccstd::vector<const scene::Model*>& frustumCullingResult,
    ccstd::vector<const scene::Model*>& lightBoundsCullingResult) {
    const geometry::AABB rangedDirLightBoundingBox(0.0F, 0.0F, 0.0F, 0.5F, 0.5F, 0.5F);
    // when execute render graph, we should never update world matrix
    // light->getNode()->updateWorldTransform();
    geometry::AABB lightAABB{};
    rangedDirLightBoundingBox.transform(light.getNode()->getWorldMatrix(), &lightAABB);
    for (const auto* const model : frustumCullingResult) {
        CC_EXPECTS(model);
        const auto* const modelBounds = model->getWorldBounds();
        if (!modelBounds || modelBounds->aabbAabb(lightAABB)) {
            lightBoundsCullingResult.emplace_back(model);
        }
    }
}

} // namespace

void SceneCulling::batchLightBoundsCulling() {
    for (const auto& [scene, queries] : lightBoundsCullings) {
        CC_ENSURES(scene);
        for (const auto& [key, cullingID] : queries.resultIndex) {
            CC_EXPECTS(key.camera);
            CC_EXPECTS(key.camera->getScene() == scene);
            const auto& frustumCullingResult = frustumCullingResults.at(key.frustumCullingID.value);
            auto& lightBoundsCullingResult = lightBoundsCullingResults.at(cullingID.value);
            CC_EXPECTS(lightBoundsCullingResult.instances.empty());
            switch (key.cullingLight->getType()) {
                case scene::LightType::SPHERE: {
                    const auto* light = dynamic_cast<const scene::SphereLight*>(key.cullingLight);
                    CC_ENSURES(light);
                    executeSphereLightCulling(*light, frustumCullingResult, lightBoundsCullingResult.instances);
                } break;
                case scene::LightType::SPOT: {
                    const auto* light = dynamic_cast<const scene::SpotLight*>(key.cullingLight);
                    CC_ENSURES(light);
                    executeSpotLightCulling(*light, frustumCullingResult, lightBoundsCullingResult.instances);
                } break;
                case scene::LightType::POINT: {
                    const auto* light = dynamic_cast<const scene::PointLight*>(key.cullingLight);
                    CC_ENSURES(light);
                    executePointLightCulling(*light, frustumCullingResult, lightBoundsCullingResult.instances);
                } break;
                case scene::LightType::RANGED_DIRECTIONAL: {
                    const auto* light = dynamic_cast<const scene::RangedDirectionalLight*>(key.cullingLight);
                    CC_ENSURES(light);
                    executeRangedDirectionalLightCulling(*light, frustumCullingResult, lightBoundsCullingResult.instances);
                } break;
                case scene::LightType::DIRECTIONAL:
                case scene::LightType::UNKNOWN:
                default:
                    // noop
                    break;
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
        const auto* bounds = model.getWorldBounds();
        Vec3::subtract(bounds ? bounds->center : node->getWorldPosition(), camera.getPosition(), &position);
        depth = position.dot(camera.getForward());
    }
    return depth;
}

void addRenderObject(
    LayoutGraphData::vertex_descriptor phaseLayoutID,
    const bool bDrawOpaqueOrMask,
    const bool bDrawBlend,
    const bool bDrawProbe,
    const scene::Camera& camera,
    const scene::Model& model,
    NativeRenderQueue& queue) {
    if (bDrawProbe) {
        queue.probeQueue.applyMacro(*kLayoutGraph, model, phaseLayoutID);
    }
    const auto& subModels = model.getSubModels();
    const auto subModelCount = subModels.size();
    for (uint32_t subModelIdx = 0; subModelIdx < subModelCount; ++subModelIdx) {
        const auto& subModel = subModels[subModelIdx];
        const auto& passes = *(subModel->getPasses());
        const auto passCount = passes.size();
        auto probeIt = std::find(queue.probeQueue.probeMap.begin(), queue.probeQueue.probeMap.end(), subModel.get());
        if (probeIt != queue.probeQueue.probeMap.end()) {
            phaseLayoutID = ProbeHelperQueue::getDefaultId(*kLayoutGraph);
        }
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
    for (auto&& [sceneID, desc] : renderQueueIndex) {
        CC_EXPECTS(holds<SceneTag>(sceneID, rg));
        const auto frustomCulledResultID = desc.frustumCulledResultID;
        const auto lightBoundsCullingID = desc.lightBoundsCulledResultID;
        const auto targetID = desc.renderQueueTarget;
        const auto& sceneData = get(SceneTag{}, sceneID, rg);

        // check scene flags
        const bool bDrawBlend = any(sceneData.flags & SceneFlags::TRANSPARENT_OBJECT);
        const bool bDrawOpaqueOrMask = any(sceneData.flags & (SceneFlags::OPAQUE_OBJECT | SceneFlags::CUTOUT_OBJECT));
        const bool bDrawShadowCaster = any(sceneData.flags & SceneFlags::SHADOW_CASTER);
        const bool bDrawProbe = any(sceneData.flags & SceneFlags::REFLECTION_PROBE);
        if (!bDrawShadowCaster && !bDrawBlend && !bDrawOpaqueOrMask && !bDrawProbe) {
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
        CC_EXPECTS(frustomCulledResultID.value < frustumCullingResults.size());
        const auto& sourceModels = [&]() -> const auto& {
            // is culled by light bounds
            if (lightBoundsCullingID.value != 0xFFFFFFFF) {
                CC_EXPECTS(lightBoundsCullingID.value < lightBoundsCullingResults.size());
                return lightBoundsCullingResults.at(lightBoundsCullingID.value).instances;
            }
            // not culled by light bounds
            return frustumCullingResults.at(frustomCulledResultID.value);
        }
        ();

        // native queue target
        CC_EXPECTS(targetID.value < renderQueues.size());
        auto& nativeQueue = renderQueues[targetID.value];
        CC_EXPECTS(nativeQueue.empty());

        // skybox
        const auto* camera = sceneData.camera;
        CC_EXPECTS(camera);

        // fill native queue
        for (const auto* const model : sourceModels) {
            addRenderObject(
                phaseLayoutID, bDrawOpaqueOrMask, bDrawBlend,
                bDrawProbe, *sceneData.camera, *model, nativeQueue);
        }

        // post-processing
        nativeQueue.sort();
    }
}

void SceneCulling::buildRenderQueues(
    const RenderGraph& rg, const LayoutGraphData& lg,
    const NativePipeline& ppl) {
    kPipelineSceneData = ppl.pipelineSceneData;
    kLayoutGraph = &lg;
    collectCullingQueries(rg, lg);
    batchFrustumCulling(ppl);
    batchLightBoundsCulling(); // cull frustum-culling's results by light bounds
    fillRenderQueues(rg, *ppl.pipelineSceneData);
}

void SceneCulling::clear() noexcept {
    // frustum culling
    frustumCullings.clear();
    for (auto& c : frustumCullingResults) {
        c.clear();
    }
    // light bounds culling
    lightBoundsCullings.clear();
    for (auto& c : lightBoundsCullingResults) {
        c.instances.clear();
        c.lightByteOffset = 0xFFFFFFFF;
    }
    // native render queues
    for (auto& q : renderQueues) {
        q.clear();
    }

    // clear render graph scene vertex query index
    renderQueueIndex.clear();
    // do not clear this->renderQueues, it is reused to avoid memory allocation

    // reset all counters
    numFrustumCulling = 0;
    numLightBoundsCulling = 0;
    numRenderQueues = 0;
}

void LightResource::init(const NativeProgramLibrary& programLib, gfx::Device* deviceIn, uint32_t maxNumLightsIn) {
    CC_EXPECTS(!device);
    device = deviceIn;
    programLibrary = &programLib;

    const auto& instanceLayout = programLibrary->localLayoutData;
    const auto attrID = at(programLib.layoutGraph.attributeIndex, std::string_view{"CCForwardLight"});
    const auto& uniformBlock = instanceLayout.uniformBlocks.at(attrID);

    elementSize = boost::alignment::align_up(
        getUniformBlockSize(uniformBlock.members),
        device->getCapabilities().uboOffsetAlignment);
    maxNumLights = maxNumLightsIn;
    binding = programLib.localLayoutData.bindingMap.at(attrID);

    const auto bufferSize = elementSize * maxNumLights;

    lightBuffer = device->createBuffer(gfx::BufferInfo{
        gfx::BufferUsageBit::UNIFORM | gfx::BufferUsageBit::TRANSFER_DST,
        gfx::MemoryUsageBit::HOST | gfx::MemoryUsageBit::DEVICE,
        bufferSize,
        elementSize,
    });
    firstLightBufferView = device->createBuffer({lightBuffer, 0, elementSize});

    cpuBuffer.resize(bufferSize);
    lights.reserve(maxNumLights);
    lightIndex.reserve(maxNumLights);

    CC_ENSURES(elementSize);
    CC_ENSURES(maxNumLights);

    resized = true;
}

uint32_t LightResource::addLight(
    const scene::Light* light,
    bool bHDR,
    float exposure,
    const scene::Shadows* shadowInfo) {
    // already added
    auto iter = lightIndex.find(light);
    if (iter != lightIndex.end()) {
        return iter->second;
    }

    // resize buffer
    if (lights.size() == maxNumLights) {
        resized = true;
        maxNumLights *= 2;
        const auto bufferSize = elementSize * maxNumLights;
        lightBuffer->resize(bufferSize);
        firstLightBufferView = device->createBuffer({lightBuffer, 0, elementSize});
        cpuBuffer.resize(bufferSize);
        lights.reserve(maxNumLights);
        lightIndex.reserve(maxNumLights);
    }
    CC_ENSURES(lights.size() < maxNumLights);

    // add light
    const auto lightID = static_cast<uint32_t>(lights.size());
    lights.emplace_back(light);
    auto res = lightIndex.emplace(light, lightID);
    CC_ENSURES(res.second);

    // update buffer
    const auto offset = elementSize * lightID;
    setLightUBO(light, bHDR, exposure, shadowInfo, cpuBuffer.data() + offset, elementSize);

    return lightID * elementSize;
}

void LightResource::buildLights(
    SceneCulling& sceneCulling,
    bool bHDR,
    const scene::Shadows* shadowInfo) {
    // build light buffer
    for (const auto& [scene, lightBoundsCullings] : sceneCulling.lightBoundsCullings) {
        for (const auto& [key, lightBoundsCullingID] : lightBoundsCullings.resultIndex) {
            float exposure = 1.0F;
            if (key.camera) {
                exposure = key.camera->getExposure();
            } else if (key.probe && key.probe->getCamera()) {
                exposure = key.probe->getCamera()->getExposure();
            } else {
                CC_EXPECTS(false);
            }
            const auto lightByteOffset = addLight(
                key.cullingLight,
                bHDR,
                exposure,
                shadowInfo);

            // save light byte offset for each light bounds culling
            auto& result = sceneCulling.lightBoundsCullingResults.at(lightBoundsCullingID.value);
            result.lightByteOffset = lightByteOffset;
        }
    }

    // assign light byte offset to each queue
    for (const auto& [sceneID, desc] : sceneCulling.renderQueueIndex) {
        if (desc.lightBoundsCulledResultID.value == 0xFFFFFFFF) {
            continue;
        }
        const auto lightByteOffset = sceneCulling.lightBoundsCullingResults.at(
                                                                               desc.lightBoundsCulledResultID.value)
                                         .lightByteOffset;

        sceneCulling.renderQueues.at(desc.renderQueueTarget.value).lightByteOffset = lightByteOffset;
    }
}

void LightResource::clear() {
    std::fill(cpuBuffer.begin(), cpuBuffer.end(), 0);
    lights.clear();
    lightIndex.clear();
}

void LightResource::buildLightBuffer(gfx::CommandBuffer* cmdBuffer) const {
    if (lights.empty()) {
        return;
    }
    cmdBuffer->updateBuffer(
        lightBuffer,
        cpuBuffer.data(),
        static_cast<uint32_t>(lights.size()) * elementSize);
}

void LightResource::tryUpdateRenderSceneLocalDescriptorSet(const SceneCulling& sceneCulling) {
    if (sceneCulling.lightBoundsCullingResults.empty()) {
        return;
    }

    for (const auto& [scene, culling] : sceneCulling.frustumCullings) {
        for (const auto& model : scene->getModels()) {
            CC_EXPECTS(model);
            for (const auto& submodel : model->getSubModels()) {
                auto* set = submodel->getDescriptorSet();
                const auto& prev = set->getBuffer(binding);
                if (resized || prev != firstLightBufferView) {
                    set->bindBuffer(binding, firstLightBufferView);
                    set->update();
                }
            }
        }
    }
    resized = false;
}

} // namespace render

} // namespace cc
