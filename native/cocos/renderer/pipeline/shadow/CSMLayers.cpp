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

#include "CSMLayers.h"
#include "../gfx-base/GFXDevice.h"
#include "math/Quaternion.h"
#include "pipeline/PipelineSceneData.h"
#include "pipeline/RenderPipeline.h"
#include "scene/RenderScene.h"

namespace cc {
namespace pipeline {

ShadowTransformInfo::ShadowTransformInfo(uint level) {
    _level = level;
    _validFrustum.setType(geometry::ShapeEnum::SHAPE_FRUSTUM_ACCURATE);
    _splitFrustum.setType(geometry::ShapeEnum::SHAPE_FRUSTUM_ACCURATE);
    _lightViewFrustum.setType(geometry::ShapeEnum::SHAPE_FRUSTUM_ACCURATE);
}

ShadowTransformInfo::~ShadowTransformInfo() {
    _shadowObjects.clear();
}

void ShadowTransformInfo::createMatrix(const geometry::Frustum &splitFrustum, const scene::DirectionalLight *dirLight, float shadowMapWidth, bool isOnlyCulling) {
    const float invisibleOcclusionRange = dirLight->getShadowInvisibleOcclusionRange();
    const gfx::Device *device = gfx::Device::getInstance();
    _lightViewFrustum = *geometry::Frustum::clone(splitFrustum);
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
    float orthoSizeWidth;
    float orthoSizeHeight;
    if (static_cast<uint>(dirLight->getShadowCSMPerformanceOptimizationMode()) == 3U) {
        orthoSizeWidth = _castLightViewBoundingBox.halfExtents.x;
        orthoSizeHeight = _castLightViewBoundingBox.halfExtents.y;
    } else {
        orthoSizeWidth = orthoSizeHeight = _lightViewFrustum.vertices[0].distance(_lightViewFrustum.vertices[6]);
    }

    if (static_cast<uint>(dirLight->getShadowCSMLevel()) > 1U && static_cast<uint>(dirLight->getShadowCSMPerformanceOptimizationMode()) == 2U) {
        if (_level >= static_cast<uint>(dirLight->getShadowCSMLevel() - 1.0F)) {
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

CSMLayerInfo::CSMLayerInfo(uint level) : ShadowTransformInfo(level) {
    _splitCameraNear = 0.0F;
    _splitCameraFar = 0.0F;
    _matShadowAtlas.setZero();
    _matShadowViewProjAtlas.setZero();
    calculateAtlas(level);
}

void CSMLayerInfo::calculateAtlas(uint level) {
    const gfx::Device *device = gfx::Device::getInstance();
    const float clipSpaceSignY = device->getCapabilities().clipSpaceSignY;
    const float x = floorf(static_cast<float>(level % 2U)) - 0.5F;
    const float y = clipSpaceSignY * (0.5F - floorf(static_cast<float>(level) / 2U));
    const Vec3 bias(x, y, 0.0F);
    const Vec3 scale(0.5F, 0.5F, 1.0F);
    Mat4::fromRTS(Quaternion::identity(), bias, scale, &_matShadowAtlas);
}

CSMLayers::CSMLayers() {
    _levelCount = 0U;
    _specialLayer = new ShadowTransformInfo(1U);
    _shadowDistance = 0.0F;
}

CSMLayers::~CSMLayers() {
    if (_specialLayer) {
        delete _specialLayer;
        _specialLayer = nullptr;
    }

    for (const auto *shadowCSMLayer : _layers) {
        if (shadowCSMLayer) {
            delete shadowCSMLayer;
            shadowCSMLayer = nullptr;
        }
    }

    _layers.clear();
}

void CSMLayers::update(const PipelineSceneData *sceneData, const scene::Camera *camera) {
    CC_ASSERT(sceneData);
    CC_ASSERT(camera);

    const scene::Shadows *shadowInfo = sceneData->getShadows();
    const scene::RenderScene *const scene = camera->getScene();
    scene::DirectionalLight *dirLight = scene->getMainLight();

    CC_ASSERT(dirLight);

    const uint levelCount = static_cast<uint>(dirLight->getShadowCSMLevel());
    const float shadowDistance = dirLight->getShadowDistance();

    if (!shadowInfo->isEnabled() || !dirLight->isShadowEnabled()) {
        return;
    }

    if (dirLight->isShadowFixedArea()) {
        updateFixedArea(dirLight);
    } else {
        bool isRecalculate = false;
        for (uint i = 0; i < levelCount; ++i) {
            if (_layers.size() <= i) {
                _layers.emplace_back(new CSMLayerInfo(i));
                isRecalculate = true;
            }
        }

        if (dirLight->isShadowCSMValueDirty() || _levelCount != levelCount ||
            isRecalculate || std::abs(_shadowDistance - shadowDistance) > 1.0F) {
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

    _specialLayer->getValidFrustum().createOrtho(x * 2.0F, y * 2.0F, nearClamp, farClamp, matShadowTrans);
}

void CSMLayers::splitFrustumLevels(scene::DirectionalLight *dirLight) {
    constexpr float nd = 0.1F;
    const float fd = dirLight->getShadowDistance();
    const float ratio = fd / nd;
    const uint level = static_cast<uint>(dirLight->getShadowCSMLevel());
    const float lambda = dirLight->getShadowCSMLambda();
    _layers.at(0)->setSplitCameraNear(nd);
    for (uint i = 1; i < level; ++i) {
        // i ÷ numbers of level
        const float si = static_cast<float>(i) / static_cast<float>(level);
        const float preNear = lambda * (nd * powf(ratio, si)) + (1.0F - lambda) * (nd + (fd - nd) * si);
        // Slightly increase the overlap to avoid fracture
        const float nextFar = preNear * 1.005F;
        _layers[i]->setSplitCameraNear(preNear);
        _layers[i - 1]->setSplitCameraFar(nextFar);
    }
    // numbers of level - 1
    _layers.at(level - 1)->setSplitCameraFar(fd);

    dirLight->setShadowCSMValueDirty(false);
}

void CSMLayers::calculateCSM(const scene::Camera *camera, const scene::DirectionalLight *dirLight, const scene::Shadows *shadowInfo) {
    const int level = static_cast<int>(dirLight->getShadowCSMLevel());
    const float shadowMapWidth = level > 1 ? shadowInfo->getSize().x * 0.5F : shadowInfo->getSize().x;

    if (shadowMapWidth < 0.0F) {
        return;
    }

    const Mat4 mat4Trans = getCameraWorldMatrix(camera);
    for (int i = level; i >=0; --i){
        auto *layer = _layers[i];
        const float nearClamp = layer->getSplitCameraNear();
        const float farClamp = layer->getSplitCameraFar();
        geometry::Frustum splitFrustum;
        splitFrustum.setType(geometry::ShapeEnum::SHAPE_FRUSTUM_ACCURATE);
        splitFrustum.split(nearClamp, farClamp, camera->getAspect(), camera->getFov(), mat4Trans);
        layer->setSplitFrustum(splitFrustum);
        layer->createMatrix(layer->getSplitFrustum(), dirLight, shadowMapWidth, false);
        Mat4 matShadowViewProjAtlas;
        Mat4::multiply(layer->getMatShadowAtlas(), layer->getMatShadowViewProj(), &matShadowViewProjAtlas);
        layer->setMatShadowViewProjAtlas(matShadowViewProjAtlas);
    }

    if (level == 1) {
        _specialLayer->setShadowCameraFar(_layers[0]->getShadowCameraFar());
        _specialLayer->setMatShadowView(_layers[0]->getMatShadowView().clone());
        _specialLayer->setMatShadowProj(_layers[0]->getMatShadowProj().clone());
        _specialLayer->setMatShadowViewProj(_layers[0]->getMatShadowViewProj().clone());
        _specialLayer->setValidFrustum(*geometry::Frustum::clone(_layers[0]->getValidFrustum()));
    } else {
        _specialLayer->getSplitFrustum().split(0.1F, dirLight->getShadowDistance(), camera->getAspect(), camera->getFov(), mat4Trans);
        _specialLayer->createMatrix(_specialLayer->getSplitFrustum(), dirLight, shadowMapWidth, true);
    }
}

Mat4 CSMLayers::getCameraWorldMatrix(const scene::Camera *camera) {
    const Node *cameraNode = camera->getNode();
    const Vec3 &position = cameraNode->getWorldPosition();
    const Quaternion &rotation = cameraNode->getWorldRotation();

    Mat4 out;
    Mat4::fromRT(rotation, position, &out);
    out.m[8] *= -1.0F;
    out.m[9] *= -1.0F;
    out.m[10] *= -1.0F;
    return out;
}

} // namespace pipeline
} // namespace cc
