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
#include "helper/SharedMemory.h"
#include "math/Quaternion.h"
#include "platform/Application.h"

namespace cc {
namespace pipeline {
bool castBoundsInitialized = false;
AABB castWorldBounds;

RenderObject genRenderObject(const ModelView *model, const Camera *camera) {
    float depth = 0;
    if (model->nodeID) {
        const auto *const node = model->getTransform();
        cc::Vec3          position;
        cc::Vec3::subtract(node->worldPosition, camera->position, &position);
        depth = position.dot(camera->forward);
    }

    return {depth, model};
}

void getShadowWorldMatrix(const Sphere *sphere, const cc::Vec4 &rotation, const cc::Vec3 &dir, cc::Mat4 &shadowWorldMat, cc::Vec3 &out) {
    Vec3 translation(dir);
    translation.negate();
    const auto distance = sphere->radius * COEFFICIENT_OF_EXPANSION;
    translation.scale(distance);
    translation.add(sphere->center);
    out.set(translation);

    Mat4::fromRT(rotation, translation, &shadowWorldMat);
}

void updateSphereLight(Shadows *shadows, const Light *light, std::array<float, UBOShadow::COUNT> &shadowUBO) {
    const auto *const node = light->getNode();
    if (!node->getHasChangedFlags() && !shadows->dirty) {
        return;
    }

    shadows->dirty       = false;
    const auto  position = node->worldPosition;
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

    memcpy(shadowUBO.data() + UBOShadow::MAT_LIGHT_PLANE_PROJ_OFFSET, matLight.m, sizeof(matLight));
}

void updateDirLight(Shadows *shadows, const Light *light, std::array<float, UBOShadow::COUNT> &shadowUBO) {
    const auto *const node     = light->getNode();
    const auto        rotation = node->worldRotation;
    Quaternion        qt(rotation.x, rotation.y, rotation.z, rotation.w);
    Vec3              forward(0, 0, -1.0F);
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

    memcpy(shadowUBO.data() + UBOShadow::MAT_LIGHT_PLANE_PROJ_OFFSET, matLight.m, sizeof(matLight));
    float color[4] = {shadows->color.x, shadows->color.y, shadows->color.z, shadows->color.w};
    memcpy(shadowUBO.data() + UBOShadow::SHADOW_COLOR_OFFSET, &color, sizeof(float) * 4);
}

void lightCollecting(Camera *camera, std::vector<const Light *> &validLights) {
    validLights.clear();
    auto *            sphere    = CC_NEW(Sphere);
    const auto *const scene     = camera->getScene();
    const Light *     mainLight = nullptr;
    if (scene->mainLightID) mainLight = scene->getMainLight();
    validLights.emplace_back(mainLight);

    const auto *const spotLightArrayID = scene->getSpotLightArrayID();
    const auto        count            = spotLightArrayID ? spotLightArrayID[0] : 0;
    for (uint32_t i = 1; i <= count; ++i) {
        const auto *spotLight = cc::pipeline::Scene::getSpotLight(spotLightArrayID[i]);
        sphere->center.set(spotLight->position);
        sphere->radius = spotLight->range;
        if (sphere->interset(*camera->getFrustum())) {
            validLights.emplace_back(spotLight);
        }
    }

    CC_SAFE_DELETE(sphere);
}


void sceneCulling(RenderPipeline *pipeline, Camera *camera) {
    auto *const       sceneData  = pipeline->getPipelineSceneData();
    auto *const       sharedData = sceneData->getSharedData();
    auto *const       shadows    = sharedData->getShadows();
    auto *const       skyBox     = sharedData->getSkybox();
    const auto *const scene      = camera->getScene();

    castBoundsInitialized = false;
    RenderObjectList shadowObjects;
    bool isShadowMap = false;
    if(shadows->enabled && shadows->getShadowType() == ShadowType::SHADOWMAP) {
        isShadowMap = true;
    }

    const Light *mainLight = nullptr;
    if (scene->mainLightID) mainLight = scene->getMainLight();
    RenderObjectList renderObjects;

    if (skyBox->enabled && skyBox->modelID && (camera->clearFlag & skyboxFlag)) {
        renderObjects.emplace_back(genRenderObject(skyBox->getModel(), camera));
    }

    const auto *const models     = scene->getModels();
    const auto        modelCount = models[0];
    for (size_t i = 1; i <= modelCount; i++) {
        const auto *const model = cc::pipeline::Scene::getModelView(models[i]);

        // filter model by view visibility
        if (model->enabled) {
            const auto        visibility = camera->visibility;
            const auto *const node       = model->getNode();
            if ((model->nodeID && ((visibility & node->layer) == node->layer)) ||
                (visibility & model->visFlags)) {
                // shadow render Object
                if (isShadowMap && model->castShadow && model->getWorldBounds()) {
                    if (!castBoundsInitialized) {
                        castWorldBounds = *model->getWorldBounds();
                        castBoundsInitialized = true;
                    }
                    castWorldBounds.merge(*model->getWorldBounds());
                    shadowObjects.emplace_back(genRenderObject(model, camera));
                }
                // frustum culling
                if ((model->worldBoundsID) && !aabbFrustum(model->getWorldBounds(), camera->getFrustum())) {
                    continue;
                }

                renderObjects.emplace_back(genRenderObject(model, camera));
            }
        }
    }

    if(isShadowMap) {
        sceneData->getSphere()->define(castWorldBounds);
        sceneData->setShadowObjects(std::move(shadowObjects));
    }

    sceneData->setRenderObjects(std::move(renderObjects));
}

} // namespace pipeline
} // namespace cc
