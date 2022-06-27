/****************************************************************************
 Copyright (c) 2020-2022 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

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
#include "core/geometry/AABB.h"
#include "core/geometry/Frustum.h"
#include "core/geometry/Intersect.h"
#include "core/geometry/Sphere.h"
#include "core/scene-graph/Node.h"
#include "math/Quaternion.h"
#include "profiler/Profiler.h"
#include "scene/Camera.h"
#include "scene/DirectionalLight.h"
#include "scene/Light.h"
#include "scene/Octree.h"
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
        cc::Vec3::subtract(node->getWorldPosition(), camera->getPosition(), &position);
        depth = position.dot(camera->getForward());
    }

    return {depth, model};
}

void getShadowWorldMatrix(const geometry::Sphere *sphere, const cc::Quaternion &rotation, const cc::Vec3 &dir, cc::Mat4 *shadowWorldMat, cc::Vec3 *out) {
    cc::Vec3 translation(dir);
    translation.negate();
    const auto distance = sphere->getRadius() * COEFFICIENT_OF_EXPANSION;
    translation.scale(distance);
    translation.add(sphere->getCenter());
    out->set(translation);

    Mat4::fromRT(rotation, translation, shadowWorldMat);
}

void updateSphereLight(scene::Shadows *shadowInfo, const scene::Light *light, ccstd::array<float, UBOShadow::COUNT> *shadowUBO) {
    const auto *node = light->getNode();
    if (!node->getChangedFlags() && !shadowInfo->isShadowMapDirty()) {
        return;
    }

    shadowInfo->setShadowMapDirty(false);
    const auto &position = node->getWorldPosition();
    const auto &normal = shadowInfo->getNormal();
    const auto distance = shadowInfo->getDistance() + 0.001F; // avoid z-fighting
    const auto ndL = normal.dot(position);
    const auto lx = position.x;
    const auto ly = position.y;
    const auto lz = position.z;
    const auto nx = normal.x;
    const auto ny = normal.y;
    const auto nz = normal.z;
    auto &matLight = shadowInfo->getMatLight();
    matLight.m[0] = ndL - distance - lx * nx;
    matLight.m[1] = -ly * nx;
    matLight.m[2] = -lz * nx;
    matLight.m[3] = -nx;
    matLight.m[4] = -lx * ny;
    matLight.m[5] = ndL - distance - ly * ny;
    matLight.m[6] = -lz * ny;
    matLight.m[7] = -ny;
    matLight.m[8] = -lx * nz;
    matLight.m[9] = -ly * nz;
    matLight.m[10] = ndL - distance - lz * nz;
    matLight.m[11] = -nz;
    matLight.m[12] = lx * distance;
    matLight.m[13] = ly * distance;
    matLight.m[14] = lz * distance;
    matLight.m[15] = ndL;

    memcpy(shadowUBO->data() + UBOShadow::MAT_LIGHT_PLANE_PROJ_OFFSET, matLight.m, sizeof(matLight));
}

void updateDirLight(scene::Shadows *shadowInfo, const scene::Light *light, ccstd::array<float, UBOShadow::COUNT> *shadowUBO) {
    const auto *node = light->getNode();
    const auto &rotation = node->getWorldRotation();
    const Quaternion qt(rotation.x, rotation.y, rotation.z, rotation.w);
    cc::Vec3 forward(0.0F, 0.0F, -1.0F);
    forward.transformQuat(qt);
    const auto &normal = shadowInfo->getNormal();
    const auto distance = shadowInfo->getDistance() + 0.001F; // avoid z-fighting
    const auto ndL = normal.dot(forward);
    const auto scale = 1.0F / ndL;
    const auto lx = forward.x * scale;
    const auto ly = forward.y * scale;
    const auto lz = forward.z * scale;
    const auto nx = normal.x;
    const auto ny = normal.y;
    const auto nz = normal.z;
    auto &matLight = shadowInfo->getMatLight();
    matLight.m[0] = 1 - nx * lx;
    matLight.m[1] = -nx * ly;
    matLight.m[2] = -nx * lz;
    matLight.m[3] = 0;
    matLight.m[4] = -ny * lx;
    matLight.m[5] = 1 - ny * ly;
    matLight.m[6] = -ny * lz;
    matLight.m[7] = 0;
    matLight.m[8] = -nz * lx;
    matLight.m[9] = -nz * ly;
    matLight.m[10] = 1 - nz * lz;
    matLight.m[11] = 0;
    matLight.m[12] = lx * distance;
    matLight.m[13] = ly * distance;
    matLight.m[14] = lz * distance;
    matLight.m[15] = 1;

    memcpy(shadowUBO->data() + UBOShadow::MAT_LIGHT_PLANE_PROJ_OFFSET, matLight.m, sizeof(matLight));
    memcpy(shadowUBO->data() + UBOShadow::SHADOW_COLOR_OFFSET, shadowInfo->getShadowColor4f().data(), sizeof(float) * 4);
}

void updatePlanarNormalAndDistance(const scene::Shadows* shadowInfo, ccstd::array<float, UBOShadow::COUNT>* shadowUBO) {
    const Vec3 normal = shadowInfo->getNormal().getNormalized();
    const float planarNDInfo[4] = {normal.x, normal.y, normal.z, shadowInfo->getDistance()};
    memcpy(shadowUBO->data() + UBOShadow::PLANAR_NORMAL_DISTANCE_INFO_OFFSET, &planarNDInfo, sizeof(planarNDInfo));
}

void validPunctualLightsCulling(const RenderPipeline* pipeline, const scene::Camera* camera) {
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
}

void updateDirFrustum(const geometry::Sphere *cameraBoundingSphere, const Quaternion &rotation, float range, geometry::Frustum *dirLightFrustum) {
    const float radius = cameraBoundingSphere->getRadius();
    const cc::Vec3 &position = cameraBoundingSphere->getCenter();
    Mat4 matWorldTrans;
    Mat4::fromRT(rotation, position, &matWorldTrans);
    matWorldTrans.m[8] *= -1.0F;
    matWorldTrans.m[9] *= -1.0F;
    matWorldTrans.m[10] *= -1.0F;

    dirLightFrustum->createOrtho(radius, radius, -range, radius, matWorldTrans);
}

 // Todo If you want to optimize the cutting efficiency, you can get it from the octree
void shadowCulling(const RenderPipeline* pipeline, const scene::Camera* camera, ShadowTransformInfo* layer) {
    const auto *sceneData = pipeline->getPipelineSceneData();
    auto *csmLayers = sceneData->getCSMLayers();
    const auto *const scene = camera->getScene();
    const auto *mainLight = scene->getMainLight();

    layer->clearShadowObjects();
    for (size_t i = 0; i < csmLayers->getLayerObjects().size(); ++i) {
        const auto *model = csmLayers->getLayerObjects()[i].model;
        // filter model by view visibility
        if (model->isEnabled()) {
            const uint32_t visibility = camera->getVisibility();
            const auto *node = model->getNode();
            if ((model->getNode() && ((visibility & node->getLayer()) == node->getLayer())) ||
                (visibility & static_cast<uint32_t>(model->getVisFlags()))) {
                // frustum culling
                const bool accurate = model->getWorldBounds()->aabbFrustum(layer->getValidFrustum());
                if (accurate) {
                    layer->addShadowObject(genRenderObject(model, camera));
                    if (layer->getLevel() < static_cast<uint32_t>(mainLight->getCSMLevel())) {
                        if (static_cast<uint32_t>(mainLight->getCSMOptimizationMode()) == 2 &&
                            aabbFrustumCompletelyInside(*model->getWorldBounds(), layer->getValidFrustum())) {
                            csmLayers->getLayerObjects().erase(csmLayers->getLayerObjects().begin() + static_cast<uint32_t>(i));
                            i--;
                        }
                    }
                }
            }
        }
    }
}

void sceneCulling(const RenderPipeline* pipeline, scene::Camera* camera) {
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

    if (skyBox != nullptr && skyBox->isEnabled() && skyBox->getModel() && (static_cast<uint32_t>(camera->getClearFlag()) & skyboxFlag)) {
        sceneData->addRenderObject(genRenderObject(skyBox->getModel(), camera));
    }

    const scene::Octree *octree = scene->getOctree();
    if (octree && octree->isEnabled()) {
        for (const auto &model : scene->getModels()) {
            // filter model by view visibility
            if (model->isEnabled()) {
                if (model->isCastShadow()) {
                    csmLayers->addCastShadowObject(genRenderObject(model, camera));
                    csmLayers->addLayerObject(genRenderObject(model, camera));
                }

                const auto visibility = camera->getVisibility();
                const auto *const node = model->getNode();

                if ((model->getNode() && ((visibility & node->getLayer()) == node->getLayer())) ||
                    (visibility & static_cast<uint32_t>(model->getVisFlags()))) {
                    const auto *modelWorldBounds = model->getWorldBounds();

                    if (!modelWorldBounds && skyBox->getModel() != model) {
                        sceneData->addRenderObject(genRenderObject(model, camera));
                    }
                }
            }
        }

        ccstd::vector<scene::Model *> models;
        models.reserve(scene->getModels().size() / 4);
        octree->queryVisibility(camera, camera->getFrustum(), false, models);
        for (const auto *model : models) {
            sceneData->addRenderObject(genRenderObject(model, camera));
        }
    } else {
        for (const auto &model : scene->getModels()) {
            // filter model by view visibility
            if (model->isEnabled()) {
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
