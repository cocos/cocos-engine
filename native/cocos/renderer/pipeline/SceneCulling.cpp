/****************************************************************************
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#include "base/std/container/array.h"

#include "Define.h"
#include "PipelineSceneData.h"
#include "RenderPipeline.h"
#include "SceneCulling.h"
#include "base/std/container/map.h"
#include "core/geometry/AABB.h"
#include "core/geometry/Frustum.h"
#include "core/geometry/Intersect.h"
#include "core/geometry/Sphere.h"
#include "core/platform/Debug.h"
#include "core/scene-graph/Node.h"
#include "math/Quaternion.h"
#include "profiler/Profiler.h"
#include "scene/Camera.h"
#include "scene/DirectionalLight.h"
#include "scene/LODGroup.h"
#include "scene/Light.h"
#include "scene/Octree.h"
#include "scene/RangedDirectionalLight.h"
#include "scene/RenderScene.h"
#include "scene/Shadow.h"
#include "scene/Skybox.h"
#include "scene/SpotLight.h"
#include "shadow/CSMLayers.h"

namespace cc {
namespace pipeline {

RenderObject genRenderObject(const scene::Model *model, const scene::Camera *camera) {
    float depth = 0;
    if (model->getNode()) {
        const auto *node = model->getTransform();
        cc::Vec3 position;
        const auto *bounds = model->getWorldBounds();
        Vec3::subtract(bounds ? bounds->center : node->getWorldPosition(), camera->getPosition(), &position);
        depth = position.dot(camera->getForward());
    }

    return {depth, model};
}

void validPunctualLightsCulling(const RenderPipeline *pipeline, const scene::Camera *camera) {
    const auto *const scene = camera->getScene();
    PipelineSceneData *sceneData = pipeline->getPipelineSceneData();
    sceneData->clearValidPunctualLights();

    geometry::Sphere sphere;
    for (const auto &light : scene->getSpotLights()) {
        if (light->isBaked()) {
            continue;
        }

        sphere.setCenter(light->getPosition());
        sphere.setRadius(light->getRange());

        if (sphere.sphereFrustum(camera->getFrustum())) {
            sceneData->addValidPunctualLight(static_cast<scene::Light *>(light));
        }
    }

    for (const auto &light : scene->getSphereLights()) {
        if (light->isBaked()) {
            continue;
        }

        sphere.setCenter(light->getPosition());
        sphere.setRadius(light->getRange());
        if (sphere.sphereFrustum(camera->getFrustum())) {
            sceneData->addValidPunctualLight(static_cast<scene::Light *>(light));
        }
    }

    for (const auto &light : scene->getPointLights()) {
        if (light->isBaked()) {
            continue;
        }

        sphere.setCenter(light->getPosition());
        sphere.setRadius(light->getRange());
        if (sphere.sphereFrustum(camera->getFrustum())) {
            sceneData->addValidPunctualLight(static_cast<scene::Light *>(light));
        }
    }

    for (const auto &light : scene->getRangedDirLights()) {
        if (light->isBaked()) {
            continue;
        }

        geometry::AABB rangedDirLightBoundingBox(0.0F, 0.0F, 0.0F, 0.5F, 0.5F, 0.5F);
        light->getNode()->updateWorldTransform();
        rangedDirLightBoundingBox.transform(light->getNode()->getWorldMatrix(), &rangedDirLightBoundingBox);
        if (rangedDirLightBoundingBox.aabbFrustum(camera->getFrustum())) {
            sceneData->addValidPunctualLight(static_cast<scene::Light *>(light));
        }
    }
}

// Todo If you want to optimize the cutting efficiency, you can get it from the octree
void shadowCulling(const RenderPipeline *pipeline, const scene::Camera *camera, ShadowTransformInfo *layer) {
    const auto *sceneData = pipeline->getPipelineSceneData();
    auto *csmLayers = sceneData->getCSMLayers();
    const auto *const scene = camera->getScene();
    const auto *mainLight = scene->getMainLight();
    const uint32_t visibility = camera->getVisibility();

    layer->clearShadowObjects();

    if (csmLayers->getLayerObjects().empty()) return;

    for (auto it = csmLayers->getLayerObjects().begin(); it != csmLayers->getLayerObjects().end();) {
        const auto *model = it->model;
        if (!model || !model->isEnabled() || !model->getNode()) {
            it = csmLayers->getLayerObjects().erase(it);
            continue;
        }
        const auto *node = model->getNode();
        if (((visibility & node->getLayer()) != node->getLayer()) && !(visibility & static_cast<uint32_t>(model->getVisFlags()))) {
            it = csmLayers->getLayerObjects().erase(it);
            continue;
        }
        if (!model->getWorldBounds() || !model->isCastShadow()) {
            it = csmLayers->getLayerObjects().erase(it);
            continue;
        }

        // frustum culling
        const bool accurate = model->getWorldBounds()->aabbFrustum(layer->getValidFrustum());
        if (!accurate) {
            ++it;
            continue;
        }
        layer->addShadowObject(genRenderObject(model, camera));
        if (layer->getLevel() < static_cast<uint32_t>(mainLight->getCSMLevel())) {
            if (mainLight->getCSMOptimizationMode() == scene::CSMOptimizationMode::REMOVE_DUPLICATES &&
                aabbFrustumCompletelyInside(*model->getWorldBounds(), layer->getValidFrustum())) {
                it = csmLayers->getLayerObjects().erase(it);
            } else {
                ++it;
            }
        } else {
            ++it;
        }
    }
}

void sceneCulling(const RenderPipeline *pipeline, scene::Camera *camera) {
    CC_PROFILE(SceneCulling);
    PipelineSceneData *const sceneData = pipeline->getPipelineSceneData();
    const scene::Shadows *shadowInfo = sceneData->getShadows();
    CSMLayers *csmLayers = sceneData->getCSMLayers();
    const scene::Skybox *skyBox = sceneData->getSkybox();
    const scene::RenderScene *const scene = camera->getScene();
    scene::DirectionalLight *mainLight = scene->getMainLight();

    if (shadowInfo != nullptr && shadowInfo->isEnabled() && shadowInfo->getType() == scene::ShadowType::SHADOW_MAP) {
        // update dirLightFrustum
        if (mainLight && mainLight->getNode()) {
            csmLayers->update(sceneData, camera);
        }
    }

    sceneData->clearRenderObjects();
    csmLayers->clearCastShadowObjects();
    csmLayers->clearLayerObjects();

    auto clearFlagValue = static_cast<uint32_t>(camera->getClearFlag());
    if (clearFlagValue & skyboxFlag) {
        if (skyBox != nullptr && skyBox->isEnabled() && skyBox->getModel()) {
            sceneData->addRenderObject(genRenderObject(skyBox->getModel(), camera));
        } else if (clearFlagValue == skyboxFlag) {
            debug::warnID(15100, camera->getName());
        }
    }

    const scene::Octree *octree = scene->getOctree();
    if (octree && octree->isEnabled()) {
        for (const auto &model : scene->getModels()) {
            // filter model by view visibility
            if (model->isEnabled()) {
                if (scene->isCulledByLod(camera, model)) {
                    continue;
                }

                if (model->isCastShadow()) {
                    csmLayers->addCastShadowObject(genRenderObject(model, camera));
                    csmLayers->addLayerObject(genRenderObject(model, camera));
                }

                const auto visibility = camera->getVisibility();
                const auto *const node = model->getNode();

                if ((model->getNode() && ((visibility & node->getLayer()) == node->getLayer())) ||
                    (visibility & static_cast<uint32_t>(model->getVisFlags()))) {
                    const auto *modelWorldBounds = model->getWorldBounds();

                    if (!modelWorldBounds && (skyBox == nullptr || skyBox->getModel() != model)) {
                        sceneData->addRenderObject(genRenderObject(model, camera));
                    }
                }
            }
        }

        ccstd::vector<const scene::Model *> models;
        models.reserve(scene->getModels().size() / 4);
        octree->queryVisibility(camera, camera->getFrustum(), false, models);
        for (const auto &model : models) {
            if (scene->isCulledByLod(camera, model)) {
                continue;
            }
            sceneData->addRenderObject(genRenderObject(model, camera));
        }
    } else {
        for (const auto &model : scene->getModels()) {
            // filter model by view visibility
            if (model->isEnabled()) {
                if (scene->isCulledByLod(camera, model)) {
                    continue;
                }
                const auto visibility = camera->getVisibility();
                const auto *const node = model->getNode();

                // cast shadow render Object
                if (model->isCastShadow()) {
                    csmLayers->addCastShadowObject(genRenderObject(model, camera));
                    csmLayers->addLayerObject(genRenderObject(model, camera));
                }

                if ((model->getNode() && ((visibility & node->getLayer()) == node->getLayer())) ||
                    (visibility & static_cast<uint32_t>(model->getVisFlags()))) {
                    const auto *modelWorldBounds = model->getWorldBounds();
                    if (!modelWorldBounds) {
                        sceneData->addRenderObject(genRenderObject(model, camera));
                        continue;
                    }

                    // frustum culling
                    if (modelWorldBounds->aabbFrustum(camera->getFrustum())) {
                        sceneData->addRenderObject(genRenderObject(model, camera));
                    }
                }
            }
        }
    }

    csmLayers = nullptr;
}

} // namespace pipeline
} // namespace cc
