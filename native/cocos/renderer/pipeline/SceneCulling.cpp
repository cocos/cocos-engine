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

#include <array>
#include <vector>

#include "Define.h"
#include "RenderPipeline.h"
#include "SceneCulling.h"
#include "gfx-base/GFXDevice.h"
#include "math/Quaternion.h"
#include "scene/AABB.h"
#include "scene/Frustum.h"
#include "scene/Light.h"
#include "scene/Octree.h"
#include "scene/RenderScene.h"
#include "scene/Sphere.h"
#include "scene/SpotLight.h"
#include "shadow/CSMLayers.h"

namespace cc {
namespace pipeline {

RenderObject genRenderObject(const scene::Model *model, const scene::Camera *camera) {
    float depth = 0;
    if (model->getNode()) {
        const auto *node = model->getTransform();
        cc::Vec3    position;
        cc::Vec3::subtract(node->getWorldPosition(), camera->position, &position);
        depth = position.dot(camera->forward);
    }

    return {depth, model};
}

void getShadowWorldMatrix(const scene::Sphere *sphere, const cc::Quaternion &rotation, const cc::Vec3 &dir, cc::Mat4 *shadowWorldMat, cc::Vec3 *out) {
    Vec3 translation(dir);
    translation.negate();
    const auto distance = sphere->getRadius() * COEFFICIENT_OF_EXPANSION;
    translation.scale(distance);
    translation.add(sphere->getCenter());
    out->set(translation);

    Mat4::fromRT(rotation, translation, shadowWorldMat);
}

void updateSphereLight(scene::Shadow *shadows, const scene::Light *light, std::array<float, UBOShadow::COUNT> *shadowUBO) {
    const auto *node = light->getNode();
    if (!node->getFlagsChanged() && !shadows->dirty) {
        return;
    }

    shadows->dirty       = false;
    const auto &position = node->getWorldPosition();
    const auto &normal   = shadows->normal;
    const auto  distance = shadows->distance + 0.001F; // avoid z-fighting
    const auto  ndL      = normal.dot(position);
    const auto  lx       = position.x;
    const auto  ly       = position.y;
    const auto  lz       = position.z;
    const auto  nx       = normal.x;
    const auto  ny       = normal.y;
    const auto  nz       = normal.z;
    auto &      matLight = shadows->matLight;
    matLight.m[0]        = ndL - distance - lx * nx;
    matLight.m[1]        = -ly * nx;
    matLight.m[2]        = -lz * nx;
    matLight.m[3]        = -nx;
    matLight.m[4]        = -lx * ny;
    matLight.m[5]        = ndL - distance - ly * ny;
    matLight.m[6]        = -lz * ny;
    matLight.m[7]        = -ny;
    matLight.m[8]        = -lx * nz;
    matLight.m[9]        = -ly * nz;
    matLight.m[10]       = ndL - distance - lz * nz;
    matLight.m[11]       = -nz;
    matLight.m[12]       = lx * distance;
    matLight.m[13]       = ly * distance;
    matLight.m[14]       = lz * distance;
    matLight.m[15]       = ndL;

    memcpy(shadowUBO->data() + UBOShadow::MAT_LIGHT_PLANE_PROJ_OFFSET, matLight.m, sizeof(matLight));
}

void updateDirLight(scene::Shadow *shadows, const scene::Light *light, std::array<float, UBOShadow::COUNT> *shadowUBO) {
    const auto *     node     = light->getNode();
    const auto &     rotation = node->getWorldRotation();
    const Quaternion qt(rotation.x, rotation.y, rotation.z, rotation.w);
    Vec3             forward(0, 0, -1.0F);
    forward.transformQuat(qt);
    const auto &normal   = shadows->normal;
    const auto  distance = shadows->distance + 0.001F; // avoid z-fighting
    const auto  ndL      = normal.dot(forward);
    const auto  scale    = 1.0F / ndL;
    const auto  lx       = forward.x * scale;
    const auto  ly       = forward.y * scale;
    const auto  lz       = forward.z * scale;
    const auto  nx       = normal.x;
    const auto  ny       = normal.y;
    const auto  nz       = normal.z;
    auto &      matLight = shadows->matLight;
    matLight.m[0]        = 1 - nx * lx;
    matLight.m[1]        = -nx * ly;
    matLight.m[2]        = -nx * lz;
    matLight.m[3]        = 0;
    matLight.m[4]        = -ny * lx;
    matLight.m[5]        = 1 - ny * ly;
    matLight.m[6]        = -ny * lz;
    matLight.m[7]        = 0;
    matLight.m[8]        = -nz * lx;
    matLight.m[9]        = -nz * ly;
    matLight.m[10]       = 1 - nz * lz;
    matLight.m[11]       = 0;
    matLight.m[12]       = lx * distance;
    matLight.m[13]       = ly * distance;
    matLight.m[14]       = lz * distance;
    matLight.m[15]       = 1;

    memcpy(shadowUBO->data() + UBOShadow::MAT_LIGHT_PLANE_PROJ_OFFSET, matLight.m, sizeof(matLight));
    const float color[4] = {shadows->color.x, shadows->color.y, shadows->color.z, shadows->color.w};
    memcpy(shadowUBO->data() + UBOShadow::SHADOW_COLOR_OFFSET, &color, sizeof(color));
}

void updatePlanarNormalAndDistance(scene::Shadow *shadows, std::array<float, UBOShadow::COUNT> *shadowUBO) {
    const Vec3  normal          = shadows->normal.getNormalized();
    const float planarNDInfo[4] = {normal.x, normal.y, normal.z, shadows->distance};
    memcpy(shadowUBO->data() + UBOShadow::PLANAR_NORMAL_DISTANCE_INFO_OFFSET, &planarNDInfo, sizeof(planarNDInfo));
}

void validPunctualLightsCulling(RenderPipeline *pipeline, scene::Camera *camera) {
    const auto *const  scene     = camera->scene;
    PipelineSceneData *sceneData = pipeline->getPipelineSceneData();
    sceneData->clearValidPunctualLights();

    scene::Sphere sphere;
    for (auto *light : scene->getSpotLights()) {
        if (light->getBaked()) {
            continue;
        }

        sphere.setCenter(light->getPosition());
        sphere.setRadius(light->getRange());
        if (sphere.sphereFrustum(camera->frustum)) {
            sceneData->addValidPunctualLight(static_cast<scene::Light *>(light));
        }
    }

    for (auto *light : scene->getSphereLights()) {
        if (light->getBaked()) {
            continue;
        }

        sphere.setCenter(light->getPosition());
        sphere.setRadius(light->getRange());
        if (sphere.sphereFrustum(camera->frustum)) {
            sceneData->addValidPunctualLight(static_cast<scene::Light *>(light));
        }
    }
}

void updateDirFrustum(const scene::Sphere *cameraBoundingSphere, const Quaternion &rotation, float range, scene::Frustum *dirLightFrustum) {
    const float radius   = cameraBoundingSphere->getRadius();
    const Vec3 &position = cameraBoundingSphere->getCenter();
    Mat4        matWorldTrans;
    Mat4::fromRT(rotation, position, &matWorldTrans);
    matWorldTrans.m[8] *= -1.0F;
    matWorldTrans.m[9] *= -1.0F;
    matWorldTrans.m[10] *= -1.0F;

    dirLightFrustum->createOrtho(radius, radius, -range, radius, matWorldTrans);
}

// Todo 如果要接 ocTree,需要去掉 sceneCulling 中 CastShadowObjects 的收集,让 layer.validFrustum 直接从场景八叉树中获取
void shadowCulling(RenderPipeline* pipeline, const scene::Camera* camera, ShadowTransformInfo* layer) {
    const PipelineSceneData *sceneData = pipeline->getPipelineSceneData();
    const CSMLayers *        csmLayers = sceneData->getCSMLayers();

    layer->clearShadowObjects();
    for (const RenderObject &renderObject : csmLayers->getCastShadowObjects()) {
        const scene::Model *model = renderObject.model;
        // filter model by view visibility
        if (model->getEnabled()) {
            const uint32_t           visibility = camera->visibility;
            const scene::Node *const node       = model->getNode();
            if ((node && ((visibility & node->getLayer()) == node->getLayer())) ||
                (visibility & model->getVisFlags())) {
                // frustum culling
                if (model->getWorldBounds()->aabbFrustum(layer->getValidFrustum())) {
                    layer->addShadowObject(renderObject);
                }
            }
        }
    }
}

void sceneCulling(RenderPipeline *pipeline, scene::Camera *camera) {
    PipelineSceneData *const              sceneData  = pipeline->getPipelineSceneData();
    const scene::PipelineSharedSceneData *sharedData = sceneData->getSharedData();
    const scene::Shadow *                 shadowInfo = sharedData->shadow;
    CSMLayers *                           csmLayers  = sceneData->getCSMLayers();
    const scene::Skybox *                 skyBox     = sharedData->skybox;
    const scene::RenderScene *const       scene      = camera->scene;
    scene::DirectionalLight *             mainLight  = scene->getMainLight();

    if (shadowInfo->enabled && shadowInfo->shadowType == scene::ShadowType::SHADOWMAP) {
        // update dirLightFrustum
        if (mainLight && mainLight->getNode()) {
            csmLayers->update(pipeline, camera);
        }
    }

    sceneData->clearRenderObjects();
    csmLayers->clearCastShadowObjects();

    if (skyBox->enabled && skyBox->model && (camera->clearFlag & skyboxFlag)) {
        sceneData->addRenderObject(genRenderObject(skyBox->model, camera));
    }

    const scene::Octree *octree = scene->getOctree();
    if (octree) {
        for (const auto *model : scene->getModels()) {
            // filter model by view visibility
            if (model->getEnabled()) {
                if (model->getCastShadow()) {
                    csmLayers->addCastShadowObject(genRenderObject(model, camera));
                }

                const uint32_t     visibility = camera->visibility;
                const scene::Node *node       = model->getNode();

                if ((model->getNode() && ((visibility & node->getLayer()) == node->getLayer())) ||
                    (visibility & model->getVisFlags())) {
                    const auto *modelWorldBounds = model->getWorldBounds();
                    if (!modelWorldBounds && skyBox->model != model) {
                        sceneData->addRenderObject(genRenderObject(model, camera));
                    }
                }
            }
        }

        std::vector<scene::Model *> models;
        models.reserve(scene->getModels().size() / 4);
        octree->queryVisibility(camera, camera->frustum, false, models);
        for (const auto *model : models) {
            sceneData->addRenderObject(genRenderObject(model, camera));
        }
    } else {
        for (const auto *model : scene->getModels()) {
            // filter model by view visibility
            if (model->getEnabled()) {
                const uint32_t           visibility = camera->visibility;
                const scene::Node *const node       = model->getNode();

                // cast shadow render Object
                if (model->getCastShadow()) {
                    csmLayers->addCastShadowObject(genRenderObject(model, camera));
                }

                if ((model->getNode() && ((visibility & node->getLayer()) == node->getLayer())) ||
                    (visibility & model->getVisFlags())) {
                    const scene::AABB *modelWorldBounds = model->getWorldBounds();
                    if (!modelWorldBounds) {
                        sceneData->addRenderObject(genRenderObject(model, camera));
                        continue;
                    }

                    // frustum culling
                    if (modelWorldBounds->aabbFrustum(camera->frustum)) {
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
