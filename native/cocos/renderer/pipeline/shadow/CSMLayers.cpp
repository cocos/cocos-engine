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

#include "CSMLayers.h"
#include "core/Root.h"
#include "gfx-base/GFXDevice.h"
#include "pipeline/PipelineSceneData.h"
#include "pipeline/RenderPipeline.h"
#include "pipeline/custom/RenderInterfaceTypes.h"
#include "scene/RenderScene.h"
#include "scene/Shadow.h"

namespace cc {
namespace pipeline {

float ShadowTransformInfo::_maxLayerPosz{0.0F};
float ShadowTransformInfo::_maxLayerFarPlane{0.0F};

ShadowTransformInfo::ShadowTransformInfo(uint32_t level) : _level(level) {
    _validFrustum.setType(geometry::ShapeEnum::SHAPE_FRUSTUM_ACCURATE);
    _splitFrustum.setType(geometry::ShapeEnum::SHAPE_FRUSTUM_ACCURATE);
    _lightViewFrustum.setType(geometry::ShapeEnum::SHAPE_FRUSTUM_ACCURATE);
}

void ShadowTransformInfo::createMatrix(const geometry::Frustum &splitFrustum, const scene::DirectionalLight *dirLight, float shadowMapWidth, bool isOnlyCulling) {
    const float invisibleOcclusionRange = dirLight->getShadowInvisibleOcclusionRange();
    const gfx::Device *device = gfx::Device::getInstance();
    const Root *root = Root::getInstance();
    geometry::Frustum::copy(&_lightViewFrustum, splitFrustum);
    const float projectionSinY = device->getCapabilities().clipSpaceSignY;
    const float clipSpaceMinZ = device->getCapabilities().clipSpaceMinZ;

    // view matrix with range back
    Mat4 matShadowTrans;
    Mat4::fromRT(dirLight->getNode()->getRotation(), Vec3::ZERO, &matShadowTrans);
    Mat4 matShadowView = matShadowTrans.getInversed();
    const Mat4 shadowViewArbitaryPos = matShadowView.clone();
    _lightViewFrustum.transform(matShadowView);

    // bounding box in light space
    geometry::AABB::fromPoints(Vec3(100000.0F, 100000.0F, 100000.0F),
                               Vec3(-100000.0F, -100000.0F, -100000.0F),
                               &_castLightViewBoundingBox);
    _castLightViewBoundingBox.merge(_lightViewFrustum);
    float orthoSizeWidth = 0.0F;
    float orthoSizeHeight = 0.0F;
    if (dirLight->getCSMOptimizationMode() == scene::CSMOptimizationMode::DISABLE_ROTATION_FIX) {
        orthoSizeWidth = _castLightViewBoundingBox.halfExtents.x;
        orthoSizeHeight = _castLightViewBoundingBox.halfExtents.y;
    } else {
        orthoSizeWidth = orthoSizeHeight = _lightViewFrustum.vertices[0].distance(_lightViewFrustum.vertices[6]);
    }

    const auto csmLevel = root->getPipeline()->getPipelineSceneData()->getCSMSupported() ? dirLight->getCSMLevel() : scene::CSMLevel::LEVEL_1;
    if (csmLevel != scene::CSMLevel::LEVEL_1 && dirLight->getCSMOptimizationMode() ==
                                                    scene::CSMOptimizationMode::REMOVE_DUPLICATES) {
        if (_level >= static_cast<uint32_t>(csmLevel) - 1U) {
            _maxLayerFarPlane = _castLightViewBoundingBox.halfExtents.z;
            _maxLayerPosz = _castLightViewBoundingBox.center.z;
        } else {
            const float alignFarPlaneDist = fabsf(_castLightViewBoundingBox.center.z - _maxLayerPosz) + _maxLayerFarPlane;
            _castLightViewBoundingBox.halfExtents.z = fmaxf(_castLightViewBoundingBox.center.z, alignFarPlaneDist);
        }
    }

    const float r = _castLightViewBoundingBox.getHalfExtents().z;
    _shadowCameraFar = r * 2.0F + invisibleOcclusionRange;
    const Vec3 &center = _castLightViewBoundingBox.getCenter();
    Vec3 shadowPos(center.x, center.y, center.z + r + invisibleOcclusionRange);
    shadowPos.transformMat4(shadowPos, matShadowTrans);

    Mat4::fromRT(dirLight->getNode()->getRotation(), shadowPos, &matShadowTrans);
    matShadowView = matShadowTrans.getInversed();

    if (!isOnlyCulling) {
        // snap to whole texels
        const float halfOrthoSizeWidth = orthoSizeWidth * 0.5F;
        const float halfOrthoSizeHeight = orthoSizeHeight * 0.5F;
        Mat4 matShadowProj;
        Mat4::createOrthographicOffCenter(-halfOrthoSizeWidth, halfOrthoSizeWidth, -halfOrthoSizeHeight, halfOrthoSizeHeight,
                                          0.1F, _shadowCameraFar, clipSpaceMinZ, projectionSinY, 0U, &matShadowProj);

        Mat4 matShadowViewProjArbitaryPos;
        Mat4::multiply(matShadowProj, shadowViewArbitaryPos, &matShadowViewProjArbitaryPos);
        Vec3 projPos;
        projPos.transformMat4(shadowPos, matShadowViewProjArbitaryPos);
        const float invActualSize = 2.0F / shadowMapWidth;
        const Vec2 texelSize(invActualSize, invActualSize);
        const float modX = fmodf(projPos.x, texelSize.x);
        const float modY = fmodf(projPos.y, texelSize.y);
        const Vec3 projSnap(projPos.x - modX, projPos.y - modY, projPos.z);
        const Mat4 matShadowViewProjArbitaryPosInv = matShadowViewProjArbitaryPos.getInversed();
        Vec3 snap;
        snap.transformMat4(projSnap, matShadowViewProjArbitaryPosInv);

        Mat4::fromRT(dirLight->getNode()->getRotation(), snap, &matShadowTrans);
        matShadowView = matShadowTrans.getInversed();

        // fill data
        Mat4 matShadowViewProj;
        Mat4::multiply(matShadowProj, matShadowView, &matShadowViewProj);
        _matShadowView = matShadowView.clone();
        _matShadowProj = matShadowProj.clone();
        _matShadowViewProj = matShadowViewProj.clone();
    }
    _validFrustum.createOrtho(orthoSizeWidth, orthoSizeHeight, 0.1F, _shadowCameraFar, matShadowTrans);
}

void ShadowTransformInfo::copyToValidFrustum(const geometry::Frustum &validFrustum) {
    geometry::Frustum::copy(&_validFrustum, validFrustum);
}

void ShadowTransformInfo::calculateValidFrustumOrtho(float width, float height, float nearClamp, float farClamp, const Mat4 &transform) {
    _validFrustum.createOrtho(width, height, nearClamp, farClamp, transform);
}

void ShadowTransformInfo::calculateSplitFrustum(float start, float end, float aspect, float fov, const Mat4 &transform) {
    _splitFrustum.split(start, end, aspect, fov, transform);
}

CSMLayerInfo::CSMLayerInfo(uint32_t level) : ShadowTransformInfo(level) {
    calculateAtlas(level);
}

void CSMLayerInfo::calculateAtlas(uint32_t level) {
    const gfx::Device *device = gfx::Device::getInstance();
    const float clipSpaceSignY = device->getCapabilities().clipSpaceSignY;
    const float x = floorf(static_cast<float>(level % 2U)) - 0.5F;
    const float y = clipSpaceSignY * (0.5F - floorf(static_cast<float>(level) / 2U));
    _csmAtlas.set(0.5F, 0.5F, x, y);
}

CSMLayers::CSMLayers() {
    _specialLayer = ccnew ShadowTransformInfo(1U);

    for (uint32_t i = 0; i < static_cast<uint32_t>(scene::CSMLevel::LEVEL_4); ++i) {
        _layers[i] = ccnew CSMLayerInfo(i);
    }
}

CSMLayers::~CSMLayers() {
    CC_SAFE_DELETE(_specialLayer);

    for (const auto *shadowCSMLayer : _layers) {
        CC_SAFE_DELETE(shadowCSMLayer);
    }
}

void CSMLayers::update(const PipelineSceneData *sceneData, const scene::Camera *camera) {
    CC_ASSERT(sceneData);
    CC_ASSERT(camera);

    const scene::Shadows *shadowInfo = sceneData->getShadows();
    const scene::RenderScene *const scene = camera->getScene();
    const Root *root = Root::getInstance();
    scene::DirectionalLight *dirLight = scene->getMainLight();

    CC_ASSERT(dirLight);

    const auto levelCount = root->getPipeline()->getPipelineSceneData()->getCSMSupported() ? static_cast<uint32_t>(dirLight->getCSMLevel()) : 1U;
    CC_ASSERT(levelCount <= static_cast<uint32_t>(scene::CSMLevel::LEVEL_4));
    const float shadowDistance = dirLight->getShadowDistance();

    if (!shadowInfo->isEnabled() || !dirLight->isShadowEnabled()) {
        return;
    }

    if (dirLight->isShadowFixedArea()) {
        updateFixedArea(dirLight);
    } else {
        if (dirLight->isCSMNeedUpdate() || _levelCount != levelCount ||
            std::abs(_shadowDistance - shadowDistance) > 1.0F) {
            splitFrustumLevels(dirLight);
            _levelCount = levelCount;
            _shadowDistance = shadowDistance;
        }

        calculateCSM(camera, dirLight, shadowInfo);
    }
}

void CSMLayers::updateFixedArea(const scene::DirectionalLight *dirLight) const {
    const gfx::Device *device = gfx::Device::getInstance();
    const float x = dirLight->getShadowOrthoSize();
    const float y = dirLight->getShadowOrthoSize();
    const float nearClamp = dirLight->getShadowNear();
    const float farClamp = dirLight->getShadowFar();
    const float projectionSinY = device->getCapabilities().clipSpaceSignY;
    const float clipSpaceMinZ = device->getCapabilities().clipSpaceMinZ;

    Mat4 matShadowTrans;
    Mat4::fromRT(dirLight->getNode()->getWorldRotation(),
                 dirLight->getNode()->getWorldPosition(), &matShadowTrans);
    const Mat4 matShadowView = matShadowTrans.getInversed();
    Mat4 matShadowProj;
    Mat4::createOrthographicOffCenter(-x, x, -y, y, -nearClamp,
                                      farClamp, clipSpaceMinZ, projectionSinY, 0U, &matShadowProj);
    Mat4 matShadowViewProj;
    Mat4::multiply(matShadowProj, matShadowView, &matShadowViewProj);
    _specialLayer->setMatShadowView(matShadowView);
    _specialLayer->setMatShadowProj(matShadowProj);
    _specialLayer->setMatShadowViewProj(matShadowViewProj);

    _specialLayer->calculateValidFrustumOrtho(x * 2.0F, y * 2.0F, nearClamp, farClamp, matShadowTrans);
}

void CSMLayers::splitFrustumLevels(scene::DirectionalLight *dirLight) {
    const Root *root = Root::getInstance();
    constexpr float nd = 0.1F;
    const float fd = dirLight->getShadowDistance();
    const float ratio = fd / nd;
    const auto level = root->getPipeline()->getPipelineSceneData()->getCSMSupported() ? static_cast<uint32_t>(dirLight->getCSMLevel()) : 1U;
    const float lambda = dirLight->getCSMLayerLambda();
    _layers.at(0)->setSplitCameraNear(nd);
    for (uint32_t i = 1; i < level; ++i) {
        // i ÷ numbers of level
        const float si = static_cast<float>(i) / static_cast<float>(level);
        const float preNear = lambda * (nd * powf(ratio, si)) + (1.0F - lambda) * (nd + (fd - nd) * si);
        // Slightly increase the overlap to avoid fracture
        const float nextFar = preNear * 1.005F;
        _layers[i]->setSplitCameraNear(preNear);
        _layers[i - 1]->setSplitCameraFar(nextFar);
    }
    // numbers of level - 1
    _layers[level - 1]->setSplitCameraFar(fd);

    dirLight->setCSMNeedUpdate(false);
}

void CSMLayers::calculateCSM(const scene::Camera *camera, const scene::DirectionalLight *dirLight, const scene::Shadows *shadowInfo) {
    const Root *root = Root::getInstance();
    const auto level = root->getPipeline()->getPipelineSceneData()->getCSMSupported() ? dirLight->getCSMLevel() : scene::CSMLevel::LEVEL_1;
    const float shadowMapWidth = level != scene::CSMLevel::LEVEL_1 ? shadowInfo->getSize().x * 0.5F : shadowInfo->getSize().x;

    if (shadowMapWidth < 0.999F) {
        return;
    }

    const Mat4 mat4Trans = getCameraWorldMatrix(camera);
    for (int i = static_cast<int>(level) - 1; i >= 0; --i) {
        auto *layer = _layers[i];
        const float nearClamp = layer->getSplitCameraNear();
        const float farClamp = layer->getSplitCameraFar();
        layer->calculateSplitFrustum(nearClamp, farClamp, camera->getAspect(), camera->getFov(), mat4Trans);
        layer->createMatrix(layer->getSplitFrustum(), dirLight, shadowMapWidth, false);
    }

    if (level == scene::CSMLevel::LEVEL_1) {
        _specialLayer->setShadowCameraFar(_layers[0]->getShadowCameraFar());
        _specialLayer->setMatShadowView(_layers[0]->getMatShadowView().clone());
        _specialLayer->setMatShadowProj(_layers[0]->getMatShadowProj().clone());
        _specialLayer->setMatShadowViewProj(_layers[0]->getMatShadowViewProj().clone());
        _specialLayer->copyToValidFrustum(_layers[0]->getValidFrustum());
    } else {
        _specialLayer->calculateSplitFrustum(0.1F, dirLight->getShadowDistance(), camera->getAspect(), camera->getFov(), mat4Trans);
        _specialLayer->createMatrix(_specialLayer->getSplitFrustum(), dirLight, shadowMapWidth, true);
    }
}

Mat4 CSMLayers::getCameraWorldMatrix(const scene::Camera *camera) {
    const Node *cameraNode = camera->getNode();
    const Vec3 &position = cameraNode->getWorldPosition();
    const Quaternion &rotation = cameraNode->getWorldRotation();

    Mat4 out;
    Mat4::fromRT(rotation, position, &out);
    return out;
}

} // namespace pipeline
} // namespace cc
