/****************************************************************************
 Copyright (c) 2022 Xiamen Yaji Software Co., Ltd.

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

#include "scene/ReflectionProbe.h"
#include "Define.h"
#include "core/scene-graph/Scene.h"
#include "math/Quaternion.h"
#include "scene/ReflectionProbeManager.h"
namespace cc {
namespace scene {
ReflectionProbe::ReflectionProbe(int32_t id) {
    _probeId = id;
    scene::ReflectionProbeManager::getInstance()->registerProbe(this);
}

void ReflectionProbe::initialize(Node* probeNode, Node* cameraNode) {
    _node = probeNode;
    _cameraNode = cameraNode;
    const Vec3 pos = probeNode->getWorldPosition();
    _boundingBox = geometry::AABB::create(pos.x, pos.y, pos.z, _size.x, _size.y, _size.z);

    if (!_camera) {
        _camera = Root::getInstance()->createCamera();
        scene::ICameraInfo info;
        info.name = cameraNode->getName();
        info.node = cameraNode;
        info.projection = CameraProjection::PERSPECTIVE;
        info.window = Root::getInstance()->getTempWindow();
        info.priority = 0;
        info.cameraType = CameraType::DEFAULT;
        info.trackingType = TrackingType::NO_TRACKING;
        _camera->initialize(info);
    }
    _camera->setViewportInOrientedSpace(Rect(0, 0, 1, 1));
    _camera->setFovAxis(CameraFOVAxis::VERTICAL);
    _camera->setFov(static_cast<float>(mathutils::toRadian(90.0)));
    _camera->setOrthoHeight(10.0);

    _camera->setNearClip(1.0);
    _camera->setFarClip(1000.0);
    _camera->setClearColor(_backgroundColor);
    _camera->setClearDepth(1.0);
    _camera->setClearStencil(0.0);
    _camera->setClearFlag(_clearFlag);
    _camera->setVisibility(_visibility);
    _camera->setAperture(CameraAperture::F16_0);
    _camera->setShutter(CameraShutter::D125);
    _camera->setIso(CameraISO::ISO100);

    RenderWindow* win = Root::getInstance()->getMainWindow();
    _realtimePlanarTexture = ccnew RenderTexture();
    IRenderTextureCreateInfo info;
    info.name = "realtimePlanarTexture";
    info.height = win->getHeight();
    info.width = win->getWidth();
    _realtimePlanarTexture->initialize(info);
}

void ReflectionProbe::syncCameraParams(const Camera* camera) {
    _camera->setProjectionType(camera->getProjectionType());
    _camera->setOrthoHeight(camera->getOrthoHeight());
    _camera->setNearClip(camera->getNearClip());
    _camera->setFarClip(camera->getFarClip());
    _camera->setFov(camera->getFov());
    _camera->setVisibility(camera->getVisibility());
    _camera->setClearFlag(camera->getClearFlag());
    _camera->setClearColor(camera->getClearColor());
    _camera->setPriority(camera->getPriority() - 1);
}

void ReflectionProbe::renderPlanarReflection(const Camera* sourceCamera) {
    if (!sourceCamera) return;
    syncCameraParams(sourceCamera);
    transformReflectionCamera(sourceCamera);
    _needRender = true;
}

void switchProbeType(int32_t type, const Camera* sourceCamera) {
    if (type == ProbeType.CUBE) {
        this._needRender = false;
    } else if (sourceCamera != nullptr) {
        renderPlanarReflection(sourceCamera);
    }
}

void ReflectionProbe::transformReflectionCamera(const Camera* sourceCamera) {
    float offset = Vec3::dot(_node->getWorldPosition(), Vec3::UNIT_Y);
    _cameraWorldPos = reflect(sourceCamera->getNode()->getWorldPosition(), Vec3::UNIT_Y, offset);
    _cameraNode->setWorldPosition(_cameraWorldPos);

    _forward = Vec3::FORWARD;
    _forward.transformQuat(sourceCamera->getNode()->getWorldRotation());
    _forward = reflect(_forward, Vec3::UNIT_Y, 0);
    _forward.normalize();
    _forward *= -1;

    _up = Vec3::UNIT_Y;
    _up.transformQuat(sourceCamera->getNode()->getWorldRotation());
    _up = reflect(_up, Vec3::UNIT_Y, 0);
    _up.normalize();

    Quaternion::fromViewUp(_forward, _up, &_cameraWorldRotation);
    _cameraNode->setWorldRotation(_cameraWorldRotation);
    _camera->update(true);

    // Transform the plane from world space to reflection camera space use the inverse transpose matrix
    Vec4 viewSpaceProbe{ Vec3::UNIT_Y.x, Vec3::UNIT_Y.y, Vec3::UNIT_Y.z, -Vec3::dot(Vec3::UNIT_Y, _node->getWorldPosition()) };
    Mat4 matView = _camera->getMatView();
    matView.inverse();
    matView.transpose();
    matView.transformVector(&viewSpaceProbe);
    _camera->calculateObliqueMat(viewSpaceProbe);
}

Vec3 ReflectionProbe::reflect(const Vec3& point, const Vec3& normal, float offset) {
    Vec3 n = normal;
    n.normalize();
    float dist = Vec3::dot(n, point) - offset;
    n = n * 2.0 * dist;
    Vec3 mirrorPos = point;
    mirrorPos.subtract(n);
    return mirrorPos;
}

void ReflectionProbe::updateBoundingBox() {
    if (_node) {
        auto pos = _node->getWorldPosition();
        _boundingBox = geometry::AABB::set(_boundingBox, pos.x, pos.y, pos.z, _size.x, _size.y, _size.z);
    }
}

void ReflectionProbe::updatePlanarTexture(const scene::RenderScene* scene) {
    if (!scene) return;
    for (const auto& model : scene->getModels()) {
        // filter model by view visibility
        auto useProbeType = static_cast<uint32_t>(scene::ReflectionProbe::UseProbeType::PLANAR_REFLECTION);
        if (model->isEnabled() && model->getReflectionProbeType() == useProbeType) {
            const auto visibility = _camera->getVisibility();
            const auto* const node = model->getNode();
            if ((model->getNode() && ((visibility & node->getLayer()) == node->getLayer())) ||
                (visibility & static_cast<uint32_t>(model->getVisFlags()))) {
                const auto* modelWorldBounds = model->getWorldBounds();
                if (!modelWorldBounds) {
                    continue;
                }
                const auto *probeBoundingBox = getBoundingBox();
                if (modelWorldBounds->aabbAabb(*probeBoundingBox)) {
                    model->updateReflctionProbePlanarMap(_realtimePlanarTexture->getGFXTexture());
                }
            }
        }
    }
}

void ReflectionProbe::destroy() {
    _needRender = false;
    if (_camera) {
        _camera->destroy();
        _camera = nullptr;
    }
    if (_realtimePlanarTexture) {
        _realtimePlanarTexture->destroy();
        _realtimePlanarTexture = nullptr;
    }
    scene::ReflectionProbeManager::getInstance()->unRegisterProbe(this);
}

} // namespace scene
} // namespace cc
