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

RenderObject genRenderObject(const ModelView *model, const Camera *camera) {
    float depth = 0;
    if (model->nodeID) {
        const auto node = model->getNode();
        cc::Vec3 position;
        cc::Vec3::subtract(node->worldPosition, camera->position, &position);
        depth = position.dot(camera->forward);
    }

    return {depth, model};
}

void getShadowWorldMatrix(const Shadows *shadows, const cc::Vec4 &rotation, const cc::Vec3 &dir, cc::Mat4 &shadowWorldMat) {
    Vec3 translation(dir);
    translation.negate();
    const auto sphere = shadows->getSphere();
    const auto distance = std::sqrt(2) * sphere->radius;
    translation.scale(distance);
    translation.add(sphere->center);

    
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

    descriptorSet->getBuffer(UBOShadow::BLOCK.layout.binding)->update(matLight.m, UBOShadow::MAT_LIGHT_PLANE_PROJ_OFFSET, sizeof(matLight));
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

    descriptorSet->getBuffer(UBOShadow::BLOCK.layout.binding)->update(matLight.m, UBOShadow::MAT_LIGHT_PLANE_PROJ_OFFSET, sizeof(matLight));
}

void sceneCulling(ForwardPipeline *pipeline, RenderView *view) {
    const auto camera = view->getCamera();
    auto shadows = pipeline->getShadows();
    const auto skybox = pipeline->getSkybox();
    const auto scene = camera->getScene();
    auto sphere = shadows->getSphere();
    sphere->setCenter(cc::Vec3::ZERO);
    sphere->setRadius(0.01f);

    const Light *mainLight = nullptr;
    if (scene->mainLightID) mainLight = scene->getMainLight();
    RenderObjectList renderObjects;
    RenderObjectList shadowObjects;

    if (shadows->enabled && shadows->dirty) {
        float color[3] = {shadows->color.x, shadows->color.y, shadows->color.z};
        pipeline->getDescriptorSet()->getBuffer(UBOShadow::BLOCK.layout.binding)->update(color, UBOShadow::SHADOW_COLOR_OFFSET, sizeof(color));
    }

    if (mainLight && shadows->getShadowType() == ShadowType::PLANAR) {
        updateDirLight(shadows, mainLight, pipeline->getDescriptorSet());
    }

    if (skybox->enabled && skybox->modelID && (camera->clearFlag & SKYBOX_FLAG)) {
        renderObjects.emplace_back(genRenderObject(skybox->getModel(), camera));
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

                    // shadow render Object
                    if (model->castShadow) {
                        sphere->mergeAABB(model->getWroldBounds());
                        shadowObjects.emplace_back(genRenderObject(model, camera));
                    }

                    //                     frustum culling
                    if ((model->worldBoundsID) && !aabb_frustum(model->getWroldBounds(), camera->getFrustum())) {
                        continue;
                    }

                    renderObjects.emplace_back(genRenderObject(model, camera));
                }
            }
        }
    }

    pipeline->setRenderObjcts(renderObjects);
    pipeline->setShadowObjects(shadowObjects);
}

} // namespace pipeline
} // namespace cc
