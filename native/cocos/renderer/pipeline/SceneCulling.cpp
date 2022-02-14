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
#include "PipelineSceneData.h"
#include "RenderPipeline.h"
#include "SceneCulling.h"
#include "core/geometry/AABB.h"
#include "core/geometry/Frustum.h"
#include "core/geometry/Sphere.h"
#include "core/scene-graph/Node.h"
#include "gfx-base/GFXDevice.h"
#include "math/Quaternion.h"
#include "scene/Camera.h"
#include "scene/DirectionalLight.h"
#include "scene/Light.h"
#include "scene/Octree.h"
#include "scene/RenderScene.h"
#include "scene/Shadow.h"
#include "scene/Skybox.h"
#include "scene/SpotLight.h"

namespace cc {
namespace pipeline {

RenderObject genRenderObject(const scene::Model *model, const scene::Camera *camera) {
    float depth = 0;
    if (model->getNode()) {
        auto *   node = model->getTransform();
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

void updateSphereLight(scene::Shadows *shadows, const scene::Light *light, std::array<float, UBOShadow::COUNT> *shadowUBO) {
    const auto *node = light->getNode();
    if (!node->getChangedFlags() && !shadows->isShadowMapDirty()) {
        return;
    }

    shadows->setShadowMapDirty(false);
    const auto &position = node->getWorldPosition();
    const auto &normal   = shadows->getNormal();
    const auto  distance = shadows->getDistance() + 0.001F; // avoid z-fighting
    const auto  ndL      = normal.dot(position);
    const auto  lx       = position.x;
    const auto  ly       = position.y;
    const auto  lz       = position.z;
    const auto  nx       = normal.x;
    const auto  ny       = normal.y;
    const auto  nz       = normal.z;
    auto &      matLight = shadows->getMatLight();
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

void updateDirLight(scene::Shadows *shadows, const scene::Light *light, std::array<float, UBOShadow::COUNT> *shadowUBO) {
    const auto *     node     = light->getNode();
    const auto &     rotation = node->getWorldRotation();
    const Quaternion qt(rotation.x, rotation.y, rotation.z, rotation.w);
    cc::Vec3         forward(0.0F, 0.0F, -1.0F);
    forward.transformQuat(qt);
    const auto &normal   = shadows->getNormal();
    const auto  distance = shadows->getDistance() + 0.001F; // avoid z-fighting
    const auto  ndL      = normal.dot(forward);
    const auto  scale    = 1.0F / ndL;
    const auto  lx       = forward.x * scale;
    const auto  ly       = forward.y * scale;
    const auto  lz       = forward.z * scale;
    const auto  nx       = normal.x;
    const auto  ny       = normal.y;
    const auto  nz       = normal.z;
    auto &      matLight = shadows->getMatLight();
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
    memcpy(shadowUBO->data() + UBOShadow::SHADOW_COLOR_OFFSET, shadows->getShadowColor4f().data(), sizeof(float) * 4);
}

void updatePlanarNormalAndDistance(scene::Shadows *shadows, std::array<float, UBOShadow::COUNT> *shadowUBO) {
    const Vec3  normal          = shadows->getNormal().getNormalized();
    const float planarNDInfo[4] = {normal.x, normal.y, normal.z, shadows->getDistance()};
    memcpy(shadowUBO->data() + UBOShadow::PLANAR_NORMAL_DISTANCE_INFO_OFFSET, &planarNDInfo, sizeof(planarNDInfo));
}

void validPunctualLightsCulling(RenderPipeline *pipeline, scene::Camera *camera) {
    const auto *const  scene     = camera->getScene();
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

Mat4 getCameraWorldMatrix(const scene::Camera *camera) {
    Mat4 out;
    if (!camera || !camera->getNode()) {
        return out;
    }

    const Node *      cameraNode = camera->getNode();
    const cc::Vec3 &  position   = cameraNode->getWorldPosition();
    const Quaternion &rotation   = cameraNode->getWorldRotation();

    Mat4::fromRT(rotation, position, &out);
    out.m[8] *= -1.0F;
    out.m[9] *= -1.0F;
    out.m[10] *= -1.0F;

    return out;
}

void updateDirFrustum(const geometry::Sphere *cameraBoundingSphere, const Quaternion &rotation, float range, geometry::Frustum *dirLightFrustum) {
    const float     radius   = cameraBoundingSphere->getRadius();
    const cc::Vec3 &position = cameraBoundingSphere->getCenter();
    Mat4            matWorldTrans;
    Mat4::fromRT(rotation, position, &matWorldTrans);
    matWorldTrans.m[8] *= -1.0F;
    matWorldTrans.m[9] *= -1.0F;
    matWorldTrans.m[10] *= -1.0F;

    dirLightFrustum->createOrtho(radius, radius, -range, radius, matWorldTrans);
}

void quantizeDirLightShadowCamera(RenderPipeline *pipeline, const scene::Camera *camera, geometry::Frustum *out) {
    const gfx::Device *             device                  = gfx::Device::getInstance();
    PipelineSceneData *const        sceneData               = pipeline->getPipelineSceneData();
    const scene::Shadows *          shadowInfo              = sceneData->getShadows();
    const scene::RenderScene *const scene                   = camera->getScene();
    const scene::DirectionalLight * mainLight               = scene->getMainLight();
    const float                     invisibleOcclusionRange = mainLight->getShadowInvisibleOcclusionRange();
    const float                     shadowMapWidth          = shadowInfo->getSize().x;
    const auto *                    node                    = mainLight->getNode();
    const Quaternion &              rotation                = node->getWorldRotation();
    const bool                      fixedArea               = mainLight->getShadowFixedArea();

    if (fixedArea) {
        const float x         = mainLight->getShadowOrthoSize();
        const float y         = mainLight->getShadowOrthoSize();
        const float nearClamp = mainLight->getShadowNear();
        const float farClamp  = mainLight->getShadowFar();

        Mat4 matShadowTrans;
        Mat4::fromRT(rotation, node->getWorldPosition(), &matShadowTrans);
        Mat4        matShadowView    = matShadowTrans.getInversed();
        Mat4        matShadowViewInv = matShadowTrans.clone();
        const float projectionSinY   = device->getCapabilities().clipSpaceSignY;
        const float clipSpaceMinZ    = device->getCapabilities().clipSpaceMinZ;
        Mat4        matShadowProj;
        Mat4::createOrthographicOffCenter(-x, x, -y, y, -nearClamp,
                                          farClamp, clipSpaceMinZ, projectionSinY, 0, &matShadowProj);
        Mat4 matShadowViewProj = matShadowProj * matShadowView;
        sceneData->setMatShadowView(matShadowView);
        sceneData->setMatShadowProj(matShadowProj);
        sceneData->setMatShadowViewProj(matShadowViewProj);

        out->createOrtho(x * 2.0F, y * 2.0F, nearClamp, farClamp, matShadowViewInv);
    } else {
        // Raw data.
        const Mat4        matWorldTrans = getCameraWorldMatrix(camera);
        geometry::Frustum validFrustum;
        validFrustum.setType(geometry::ShapeEnum::SHAPE_FRUSTUM_ACCURATE);
        validFrustum.split(0.1F, mainLight->getShadowDistance(), camera->getAspect(), camera->getFov(), matWorldTrans);
        geometry::Frustum lightViewFrustum = validFrustum.clone();

        // view matrix with range back.
        Mat4 matShadowTrans;
        Mat4::fromRT(rotation, Vec3::ZERO, &matShadowTrans);
        Mat4 matShadowView    = matShadowTrans.getInversed();
        Mat4 matShadowViewInv = matShadowTrans.clone();

        const Mat4 shadowViewArbitraryPos = matShadowView.clone();
        lightViewFrustum.transform(matShadowView);
        // bounding box in light space.
        geometry::AABB castLightViewBounds;
        geometry::AABB::fromPoints(Vec3(10000000.0F, 10000000.0F, 10000000.0F), Vec3(-10000000.0F, -10000000.0F, -10000000.0F), &castLightViewBounds);
        castLightViewBounds.merge(lightViewFrustum);

        const float r = castLightViewBounds.getHalfExtents().z * 2.0F;
        Vec3        shadowPos(castLightViewBounds.getCenter().x, castLightViewBounds.getCenter().y,
                       castLightViewBounds.getCenter().z + castLightViewBounds.getHalfExtents().z + invisibleOcclusionRange);
        shadowPos.transformMat4(shadowPos, matShadowViewInv);

        Mat4::fromRT(rotation, shadowPos, &matShadowTrans);
        matShadowView    = matShadowTrans.getInversed();
        matShadowViewInv = matShadowTrans.clone();

        // calculate projection matrix params.
        // min value may lead to some shadow leaks.
        const float orthoSizeMin = validFrustum.vertices[0].distance(validFrustum.vertices[6]);
        // max value is accurate but poor usage for shadowMap
        geometry::Sphere cameraBoundingSphere;
        cameraBoundingSphere.setCenter(Vec3(0.0F, 0.0F, 0.0F));
        cameraBoundingSphere.setRadius(-1.0F);
        cameraBoundingSphere.merge(validFrustum);
        const float orthoSizeMax = cameraBoundingSphere.getRadius() * 2.0F;
        // use lerp(min, accurate_max) to save shadowMap usage
        const float orthoSize = orthoSizeMin * 0.8F + orthoSizeMax * 0.2F;
        sceneData->setShadowCameraFar(r + invisibleOcclusionRange);

        // snap to whole texels
        const float halfOrthoSize = orthoSize * 0.5F;
        Mat4        matShadowProj;
        const float projectionSinY = device->getCapabilities().clipSpaceSignY;
        const float clipSpaceMinZ  = device->getCapabilities().clipSpaceMinZ;
        Mat4::createOrthographicOffCenter(-halfOrthoSize, halfOrthoSize, -halfOrthoSize, halfOrthoSize, 0.1F, sceneData->getShadowCameraFar(),
                                          clipSpaceMinZ, projectionSinY, 0, &matShadowProj);

        if (shadowMapWidth > 0.0F) {
            const Mat4 matShadowViewProjArbitraryPos = matShadowProj * shadowViewArbitraryPos;
            Vec3       projPos;
            projPos.transformMat4(shadowPos, matShadowViewProjArbitraryPos);
            const float invActualSize = 2.0F / shadowMapWidth;
            const Vec2  texelSize(invActualSize, invActualSize);
            const float modX = fmodf(projPos.x, texelSize.x);
            const float modY = fmodf(projPos.y, texelSize.y);
            const Vec3  projSnap(projPos.x - modX, projPos.y - modY, projPos.z);

            const Mat4 matShadowViewProjArbitaryPosInv = matShadowViewProjArbitraryPos.getInversed();
            Vec3       snap;
            snap.transformMat4(projSnap, matShadowViewProjArbitaryPosInv);
            Mat4::fromRT(rotation, snap, &matShadowTrans);
            matShadowView    = matShadowTrans.getInversed();
            matShadowViewInv = matShadowTrans.clone();
            out->createOrtho(orthoSize, orthoSize, 0.1F, sceneData->getShadowCameraFar(), matShadowViewInv);
        } else {
            for (uint i = 0; i < 8; i++) {
                out->vertices[i].setZero();
            }
            out->updatePlanes();
        }

        const Mat4 matShadowViewProj = matShadowProj * matShadowView;
        sceneData->setMatShadowView(matShadowView);
        sceneData->setMatShadowProj(matShadowProj);
        sceneData->setMatShadowViewProj(matShadowViewProj);
    }
}
void sceneCulling(RenderPipeline *pipeline, scene::Camera *camera) {
    PipelineSceneData *const        sceneData = pipeline->getPipelineSceneData();
    const scene::Shadows *          shadows   = sceneData->getShadows();
    const scene::Skybox *           skyBox    = sceneData->getSkybox();
    const scene::RenderScene *const scene     = camera->getScene();
    const scene::DirectionalLight * mainLight = scene->getMainLight();
    geometry::Frustum               dirLightFrustum;

    RenderObjectList dirShadowObjects;
    bool             isShadowMap = false;
    if (shadows != nullptr && shadows->isEnabled() && shadows->getType() == scene::ShadowType::SHADOW_MAP) {
        isShadowMap = true;

        // update dirLightFrustum
        if (mainLight && mainLight->getNode()) {
            quantizeDirLightShadowCamera(pipeline, camera, &dirLightFrustum);
        } else {
            for (Vec3 &vertex : dirLightFrustum.vertices) {
                vertex.setZero();
            }
            dirLightFrustum.updatePlanes();
        }
    }

    sceneData->clearRenderObjects();

    RenderObjectList castShadowObject;

    if (skyBox != nullptr && skyBox->isEnabled() && skyBox->getModel() && (static_cast<uint32_t>(camera->getClearFlag()) & skyboxFlag)) {
        sceneData->addRenderObject(genRenderObject(skyBox->getModel(), camera));
    }

    const scene::Octree *octree = scene->getOctree();
    if (octree && octree->isEnabled()) {
        for (const auto &model : scene->getModels()) {
            // filter model by view visibility
            if (model->isEnabled()) {
                if (model->isCastShadow()) {
                    castShadowObject.emplace_back(genRenderObject(model, camera));
                }

                const auto        visibility = camera->getVisibility();
                const auto *const node       = model->getNode();

                if ((model->getNode() && ((visibility & node->getLayer()) == node->getLayer())) ||
                    (visibility & static_cast<uint32_t>(model->getVisFlags()))) {
                    const auto *modelWorldBounds = model->getWorldBounds();

                    if (!modelWorldBounds && skyBox->getModel() != model) {
                        sceneData->addRenderObject(genRenderObject(model, camera));
                    }
                }
            }
        }

        if (isShadowMap) {
            std::vector<scene::Model *> casters;
            casters.reserve(scene->getModels().size() / 4);
            octree->queryVisibility(camera, dirLightFrustum, true, casters);

            for (const auto *model : casters) {
                dirShadowObjects.emplace_back(genRenderObject(model, camera));
            }
        }

        std::vector<scene::Model *> models;
        models.reserve(scene->getModels().size() / 4);
        octree->queryVisibility(camera, camera->getFrustum(), false, models);
        for (const auto *model : models) {
            sceneData->addRenderObject(genRenderObject(model, camera));
        }
    } else {
        geometry::AABB ab;
        for (const auto &model : scene->getModels()) {
            // filter model by view visibility
            if (model->isEnabled()) {
                const auto        visibility = camera->getVisibility();
                const auto *const node       = model->getNode();

                // cast shadow render Object
                if (model->isCastShadow()) {
                    castShadowObject.emplace_back(genRenderObject(model, camera));
                }

                if ((model->getNode() && ((visibility & node->getLayer()) == node->getLayer())) ||
                    (visibility & static_cast<uint32_t>(model->getVisFlags()))) {
                    const auto *modelWorldBounds = model->getWorldBounds();
                    if (!modelWorldBounds) {
                        sceneData->addRenderObject(genRenderObject(model, camera));
                        continue;
                    }

                    // dir shadow render Object
                    if (isShadowMap && model->isCastShadow()) {
                        if (modelWorldBounds->aabbFrustum(dirLightFrustum)) {
                            dirShadowObjects.emplace_back(genRenderObject(model, camera));
                        }
                    }

                    // frustum culling
                    if (modelWorldBounds->aabbFrustum(camera->getFrustum())) {
                        sceneData->addRenderObject(genRenderObject(model, camera));
                    }
                }
            }
        }
    }

    if (isShadowMap) {
        sceneData->setDirShadowObjects(std::move(dirShadowObjects));
        sceneData->setCastShadowObjects(std::move(castShadowObject));
    }
}

} // namespace pipeline
} // namespace cc
