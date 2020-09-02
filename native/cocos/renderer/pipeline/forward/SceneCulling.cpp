#include "SceneCulling.h"
#include "../Define.h"
#include "../RenderView.h"
#include "../helper/SharedMemory.h"
#include "ForwardPipeline.h"
#include "platform/Application.h"

namespace cc {
namespace pipeline {

RenderObject genRenderObject(ModelView *model, const Camera *camera) {
    uint depth = 0;
    if (model->nodeID != 0) {
        const auto node = GET_NODE(model->nodeID);
        cc::Vec3 position;
        cc::Vec3::subtract(node->getWorldPosition(), camera->getPosition(), &position);
        depth = position.dot(camera->getForward());
    }

    return {depth, model};
}

void sceneCulling(ForwardPipeline *pipeline, RenderView *view) {
    const auto camera = view->getCamera();
    const auto scene = GET_SCENE(camera->getSceneID());
    RenderObjectList renderObjects;
    RenderObjectList shadowObjects;

    const auto mainLight = GET_MAIN_LIGHT(scene->mainLightID);
    const auto planarShadows = GET_PLANAR_SHADOW(scene->planarShadowID);
    if (mainLight) {
        //TODO coulsonwang
        //        if (planarShadows.enabled) {
        //            planarShadows.updateDirLight(mainLight);
        //        }
    }

    if (GET_SKYBOX(scene->skyboxID)->enabled && (camera->getClearFlag() & SKYBOX_FLAG)) {
        renderObjects.emplace_back(genRenderObject(GET_SKYBOX(scene->skyboxID), camera));
    }

    const auto stamp = Application::getInstance()->getTotalFrames();
    uint32_t *models = GET_MODEL_ARRAY(scene->modelsID);
    uint32_t modelCount = models[0];
    for (size_t i = 1; i <= modelCount; i++) {
        const auto model = GET_MODEL(models[i]);

        // filter model by view visibility
        if (model->enabled) {
            const auto visibility = view->getVisibility();
            const auto vis = visibility & static_cast<uint>(LayerList::UI_2D);
            if (vis) {
                if ((model->nodeID && (visibility == GET_NODE(model->nodeID)->getLayer())) ||
                    visibility == model->visFlags) {
                    renderObjects.emplace_back(genRenderObject(model, camera));
                }
            } else {
                if ((model->nodeID && ((visibility & GET_NODE(model->nodeID)->getLayer()) == GET_NODE(model->nodeID)->getLayer())) ||
                    (visibility & model->visFlags)) {

                    // shadow render Object
                    if (model->castShadow) {
                        shadowObjects.emplace_back(genRenderObject(model, camera));
                    }

                    // frustum culling
                    if (model->worldBoundsID && !aabb_frustum(GET_AABB(model->worldBoundsID), GET_FRUSTUM(camera->getFrustumID()))) {
                        continue;
                    }

                    renderObjects.emplace_back(genRenderObject(model, camera));
                }
            }
        }
    }

    //TODO coulsonwang
    //        if (planarShadows->enabled) {
    //            planarShadows.updateShadowList(camera.frustum, stamp, (camera.visibility & Layers.BitMask.DEFAULT) !== 0);
    //        }
}

} // namespace pipeline
} // namespace cc
