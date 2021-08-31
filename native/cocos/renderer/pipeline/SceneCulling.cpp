/****************************************************************************
 Copyright (c) 2020-2021 Xiamen Yaji Software Co., Ltd.

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
#include "gfx-base/GFXBuffer.h"
#include "gfx-base/GFXDescriptorSet.h"
#include "math/Quaternion.h"
#include "platform/Application.h"
#include "scene/AABB.h"
#include "scene/Light.h"
#include "scene/RenderScene.h"
#include "scene/Sphere.h"
#include "scene/SpotLight.h"

namespace cc {
namespace pipeline {
bool        castBoundsInitialized = false;
scene::AABB castWorldBounds;

RenderObject genRenderObject(const scene::Model *model, const scene::Camera *camera) {
    float depth = 0;
    if (model->getNode()) {
        auto *const node = model->getTransform();
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
    auto *const node = light->getNode();
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
    auto *const node     = light->getNode();
    const auto &rotation = node->getWorldRotation();
    Quaternion  qt(rotation.x, rotation.y, rotation.z, rotation.w);
    Vec3        forward(0, 0, -1.0F);
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
    float color[4] = {shadows->color.x, shadows->color.y, shadows->color.z, shadows->color.w};
    memcpy(shadowUBO->data() + UBOShadow::SHADOW_COLOR_OFFSET, &color, sizeof(float) * 4);
}

void lightCollecting(scene::Camera *camera, std::vector<const scene::Light *> *validLights) {
    validLights->clear();
    auto *              sphere    = CC_NEW(scene::Sphere);
    const auto *        scene     = camera->scene;
    const scene::Light *mainLight = scene->getMainLight();
    validLights->emplace_back(mainLight);

    for (auto *spotLight : scene->getSpotLights()) {
        sphere->setCenter(spotLight->getPosition());
        sphere->setRadius(spotLight->getRange());
        if (sphere->interset(camera->frustum)) {
            validLights->emplace_back(static_cast<scene::Light *>(spotLight));
        }
    }

    CC_SAFE_DELETE(sphere);
}

void sceneCulling(RenderPipeline *pipeline, scene::Camera *camera) {
    auto *const       sceneData  = pipeline->getPipelineSceneData();
    auto *const       sharedData = sceneData->getSharedData();
    auto *const       shadows    = sharedData->shadow;
    auto *const       skyBox     = sharedData->skybox;
    const auto *const scene      = camera->scene;

    castBoundsInitialized = false;
    RenderObjectList shadowObjects;
    bool             isShadowMap = false;
    if (shadows->enabled && shadows->shadowType == scene::ShadowType::SHADOWMAP) {
        isShadowMap = true;
    }

    RenderObjectList renderObjects;

    if (skyBox->enabled && skyBox->model && (camera->clearFlag & skyboxFlag)) {
        renderObjects.emplace_back(genRenderObject(skyBox->model, camera));
    }

    const auto visibility = camera->visibility;

    for (auto *model : scene->getModels()) {
        // filter model by view visibility
        if (model->getEnabled()) {
            const auto *const node = model->getNode();
            if ((model->getNode() && ((visibility & node->getLayer()) == node->getLayer())) ||
                (visibility & model->getVisFlags())) {
                // shadow render Object
                const auto *modelWorldBounds = model->getWorldBounds();
                if (isShadowMap && model->getCastShadow() && modelWorldBounds) {
                    if (!castBoundsInitialized) {
                        castWorldBounds.set(modelWorldBounds->getCenter(), modelWorldBounds->getHalfExtents());
                        castBoundsInitialized = true;
                    }
                    castWorldBounds.merge(*modelWorldBounds);
                    shadowObjects.emplace_back(genRenderObject(model, camera));
                }
                // frustum culling
                if (modelWorldBounds && !modelWorldBounds->aabbFrustum(camera->frustum)) {
                    continue;
                }

                renderObjects.emplace_back(genRenderObject(model, camera));
            }
        }
    }

    if (isShadowMap) {
        sceneData->getSphere()->define(castWorldBounds);
        sceneData->setShadowObjects(std::move(shadowObjects));
    }

    sceneData->setRenderObjects(std::move(renderObjects));
}

} // namespace pipeline
} // namespace cc
