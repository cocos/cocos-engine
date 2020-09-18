#include "SceneCulling.h"
#include "../Define.h"
#include "../RenderView.h"
#include "../helper/SharedMemory.h"
#include "ForwardPipeline.h"
#include "platform/Application.h"

namespace cc {
namespace pipeline {

RenderObject genRenderObject(ModelView *model, const Camera *camera) {
    float depth = 0;
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
    const auto mainLight = GET_LIGHT(scene->mainLightID);
    const auto skybox = pipeline->getSkybox();
    RenderObjectList renderObjects;
    RenderObjectList shadowObjects;

    if (mainLight) {
        //TODO coulsonwang
        //        if (planarShadows.enabled) {
        //            planarShadows.updateDirLight(mainLight);
        //        }
    }

    if (skybox->enabled && (camera->getClearFlag() & SKYBOX_FLAG)) {
        renderObjects.emplace_back(genRenderObject(GET_MODEL(skybox->model), camera));
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
            const auto node = GET_NODE(model->nodeID);
            if (vis) {
                if ((model->nodeID && (visibility == node->getLayer())) ||
                    visibility == model->visFlags) {
                    renderObjects.emplace_back(genRenderObject(model, camera));
                }
            } else {

                if ((model->nodeID && ((visibility & node->getLayer()) == node->getLayer())) ||
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
    pipeline->setRenderObjcts(renderObjects);
    pipeline->setShadowObjects(shadowObjects);
}

} // namespace pipeline
} // namespace cc
