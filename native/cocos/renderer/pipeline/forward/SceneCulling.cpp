#include <vector>
#include <array>

#include "SceneCulling.h"
#include "../Define.h"
#include "../RenderView.h"
#include "../helper/SharedMemory.h"
#include "ForwardPipeline.h"
#include "gfx/GFXBuffer.h"
#include "gfx/GFXDescriptorSet.h"
#include "math/Quaternion.h"
#include "platform/Application.h"

namespace cc {
namespace pipeline {
bool castBoundsInitialized = false;
AABB castWorldBounds;

RenderObject genRenderObject(const ModelView *model, const Camera *camera) {
    float depth = 0;
    if (model->nodeID) {
        const auto node = model->getTransform();
        cc::Vec3 position;
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

void updateSphereLight(Shadows *shadows, const Light *light, gfx::DescriptorSet *descriptorSet) {
    const auto node = light->getNode();
    if (!node->flagsChanged && !shadows->dirty) {
        return;
    }

    shadows->dirty = false;
    const auto position = node->worldPosition;
    const auto &normal = shadows->normal;
    const auto distance = shadows->distance + 0.001f; // avoid z-fighting
    const auto NdL = normal.dot(position);
    const auto lx = position.x;
    const auto ly = position.y;
    const auto lz = position.z;
    const auto nx = normal.x;
    const auto ny = normal.y;
    const auto nz = normal.z;
    auto &matLight = shadows->matLight;
    matLight.m[0] = NdL - distance - lx * nx;
    matLight.m[1] = -ly * nx;
    matLight.m[2] = -lz * nx;
    matLight.m[3] = -nx;
    matLight.m[4] = -lx * ny;
    matLight.m[5] = NdL - distance - ly * ny;
    matLight.m[6] = -lz * ny;
    matLight.m[7] = -ny;
    matLight.m[8] = -lx * nz;
    matLight.m[9] = -ly * nz;
    matLight.m[10] = NdL - distance - lz * nz;
    matLight.m[11] = -nz;
    matLight.m[12] = lx * distance;
    matLight.m[13] = ly * distance;
    matLight.m[14] = lz * distance;
    matLight.m[15] = NdL;

    descriptorSet->getBuffer(UBOShadow::BINDING)->update(matLight.m, UBOShadow::MAT_LIGHT_PLANE_PROJ_OFFSET, sizeof(matLight));
}

void updateDirLight(Shadows *shadows, const Light *light, gfx::DescriptorSet *descriptorSet) {
    const auto node = light->getNode();
    if (!node->flagsChanged && !shadows->dirty) {
        return;
    }

    shadows->dirty = false;
    const auto rotation = node->worldRotation;
    Quaternion _qt(rotation.x, rotation.y, rotation.z, rotation.w);
    Vec3 forward(0, 0, -1.0f);
    forward.transformQuat(_qt);
    const auto &normal = shadows->normal;
    const auto distance = shadows->distance + 0.001f; // avoid z-fighting
    const auto NdL = normal.dot(forward);
    const auto scale = 1.0f / NdL;
    const auto lx = forward.x * scale;
    const auto ly = forward.y * scale;
    const auto lz = forward.z * scale;
    const auto nx = normal.x;
    const auto ny = normal.y;
    const auto nz = normal.z;
    auto &matLight = shadows->matLight;
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

    descriptorSet->getBuffer(UBOShadow::BINDING)->update(matLight.m, UBOShadow::MAT_LIGHT_PLANE_PROJ_OFFSET, sizeof(matLight));
}

void updateDirLight(Shadows *shadows, const Light *light, std::array<float, UBOShadow::COUNT>& shadowUBO) {
    const auto node = light->getNode();
    const auto rotation = node->worldRotation;
    Quaternion _qt(rotation.x, rotation.y, rotation.z, rotation.w);
    Vec3 forward(0, 0, -1.0f);
    forward.transformQuat(_qt);
    const auto &normal = shadows->normal;
    const auto distance = shadows->distance + 0.001f; // avoid z-fighting
    const auto NdL = normal.dot(forward);
    const auto scale = 1.0f / NdL;
    const auto lx = forward.x * scale;
    const auto ly = forward.y * scale;
    const auto lz = forward.z * scale;
    const auto nx = normal.x;
    const auto ny = normal.y;
    const auto nz = normal.z;
    auto &matLight = shadows->matLight;
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

    memcpy(shadowUBO.data() + UBOShadow::MAT_LIGHT_PLANE_PROJ_OFFSET, matLight.m, sizeof(matLight));
}

 void lightCollecting(RenderView *view, std::vector<const Light *>& validLights) {
    validLights.clear();
    auto *sphere = CC_NEW(Sphere);
    const auto scene = view->getCamera()->getScene();
    const Light *mainLight = nullptr;
    if (scene->mainLightID) mainLight = scene->getMainLight();
    validLights.emplace_back(mainLight);

    const auto spotLightArrayID = scene->getSpotLightArrayID();
    const auto count = spotLightArrayID ? spotLightArrayID[0] : 0;
    for (uint32_t i = 1; i <= count; ++i) {
        const auto *spotLight = scene->getSpotLight(spotLightArrayID[i]);
        sphere->center.set(spotLight->position);
        sphere->radius = spotLight->range;
        if (sphere->interset(*view->getCamera()->getFrustum())) {
            validLights.emplace_back(spotLight);
        }
    }

    CC_SAFE_DELETE(sphere);
}

void shadowCollecting(ForwardPipeline *pipeline, RenderView *view) {
    const auto camera = view->getCamera();
    const auto scene = camera->getScene();

    castBoundsInitialized = false;

    RenderObjectList shadowObjects;

    const auto models = scene->getModels();
    const auto modelCount = models[0];
    for (size_t i = 1; i <= modelCount; i++) {
        const auto model = scene->getModelView(models[i]);

        // filter model by view visibility
        if (model->enabled) {
            const auto visibility = view->getVisibility();
            const auto node = model->getNode();
            if ((model->nodeID && ((visibility & node->layer) == node->layer)) ||
                (visibility & model->visFlags)) {
                // shadow render Object
                if (model->castShadow && model->getWorldBounds()) {
                    if (!castBoundsInitialized) {
                        castWorldBounds = *model->getWorldBounds();
                        castBoundsInitialized = true;
                    }
                    castWorldBounds.merge(*model->getWorldBounds());
                    shadowObjects.emplace_back(genRenderObject(model, camera));
                }
            }
        }
    }

    pipeline->getSphere()->define(castWorldBounds);

    pipeline->setShadowObjects(shadowObjects);
}

void sceneCulling(ForwardPipeline *pipeline, RenderView *view) {
    const auto camera = view->getCamera();
    const auto shadows = pipeline->getShadows();
    const auto skyBox = pipeline->getSkybox();
    const auto scene = camera->getScene();

    const Light *mainLight = nullptr;
    if (scene->mainLightID) mainLight = scene->getMainLight();
    RenderObjectList renderObjects;

    if (skyBox->enabled && skyBox->modelID && (camera->clearFlag & SKYBOX_FLAG)) {
        renderObjects.emplace_back(genRenderObject(skyBox->getModel(), camera));
    }

    const auto models = scene->getModels();
    const auto modelCount = models[0];
    for (size_t i = 1; i <= modelCount; i++) {
        const auto model = scene->getModelView(models[i]);

        // filter model by view visibility
        if (model->enabled) {
            const auto visibility = view->getVisibility();
            const auto vis = visibility & static_cast<uint>(LayerList::UI_2D);
            const auto node = model->getNode();
            if (vis) {
                if ((model->nodeID && (visibility == node->layer)) ||
                    visibility == model->visFlags) {
                    renderObjects.emplace_back(genRenderObject(model, camera));
                }
            } else {
                if ((model->nodeID && ((visibility & node->layer) == node->layer)) ||
                    (visibility & model->visFlags)) {

                    // frustum culling
                    if ((model->worldBoundsID) && !aabb_frustum(model->getWorldBounds(), camera->getFrustum())) {
                        continue;
                    }

                    renderObjects.emplace_back(genRenderObject(model, camera));
                }
            }
        }
    }

    pipeline->setRenderObjects(renderObjects);
}

} // namespace pipeline
} // namespace cc
