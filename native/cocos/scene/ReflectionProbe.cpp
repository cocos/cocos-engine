/****************************************************************************
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

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

#include "scene/ReflectionProbe.h"
#include "Define.h"
#include "core/scene-graph/Scene.h"
#include "math/Quaternion.h"
#include "scene/ReflectionProbeManager.h"
#include "core/scene-graph/SceneGlobals.h"
#include "scene/Skybox.h"
namespace cc {
namespace scene {
// right left up down front back
const std::array<Vec3, 6> CAMERA_DIR{
    Vec3(0, -90, 0),
    Vec3(0, 90, 0),
    Vec3(90, 0, 0),
    Vec3(-90, 0, 0),
    Vec3(0, 0, 0),
    Vec3(0, 180, 0)};
ReflectionProbe::ReflectionProbe(int32_t id) {
    _probeId = id;
}

void ReflectionProbe::setResolution(int32_t resolution) {
    if (_resolution != resolution) {
        for (const auto& rt : _bakedCubeTextures) {
            rt->resize(resolution, resolution);
        }
        _resolution = resolution;
    }
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
    _camera->setClearFlag(camera->getClearFlag());
    _camera->setClearColor(camera->getClearColor());
    _camera->setPriority(camera->getPriority() - 1);
    _camera->changeTargetWindow(_realtimePlanarTexture->getWindow());
    _camera->resize(camera->getWidth(), camera->getHeight());
}

void ReflectionProbe::renderPlanarReflection(const Camera* sourceCamera) {
    if (!sourceCamera) return;
    syncCameraParams(sourceCamera);
    transformReflectionCamera(sourceCamera);
    packBackgroundColor();
    _needRender = true;
}

void ReflectionProbe::switchProbeType(int32_t type, const Camera* sourceCamera) {
    if (type == static_cast<uint32_t>(ProbeType::CUBE)) {
        _needRender = false;
    } else if (sourceCamera != nullptr) {
        renderPlanarReflection(sourceCamera);
    }
}

void ReflectionProbe::transformReflectionCamera(const Camera* sourceCamera) {
    float offset = Vec3::dot(_node->getWorldPosition(), _node->getUp());
    _cameraWorldPos = reflect(sourceCamera->getNode()->getWorldPosition(), _node->getUp(), offset);
    _cameraNode->setWorldPosition(_cameraWorldPos);

    _forward = Vec3::FORWARD;
    _forward.transformQuat(sourceCamera->getNode()->getWorldRotation());
    _forward = reflect(_forward, _node->getUp(), 0);
    _forward.normalize();
    _forward *= -1;

    _up = Vec3::UNIT_Y;
    _up.transformQuat(sourceCamera->getNode()->getWorldRotation());
    _up = reflect(_up, _node->getUp(), 0);
    _up.normalize();

    Quaternion::fromViewUp(_forward, _up, &_cameraWorldRotation);
    _cameraNode->setWorldRotation(_cameraWorldRotation);
    _camera->update(true);

    // Transform the plane from world space to reflection camera space use the inverse transpose matrix
    Vec4 viewSpaceProbe{ _node->getUp().x, _node->getUp().y, _node->getUp().z, -Vec3::dot(_node->getUp(), _node->getWorldPosition())};
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
        if (model->isEnabled() && model->getReflectionProbeType() == scene::UseReflectionProbeType::PLANAR_REFLECTION) {
            const auto visibility = _camera->getVisibility();
            const auto* const node = model->getNode();
            if ((model->getNode() && ((visibility & node->getLayer()) == node->getLayer())) ||
                (visibility & static_cast<uint32_t>(model->getVisFlags()))) {
                const auto* modelWorldBounds = model->getWorldBounds();
                if (!modelWorldBounds) {
                    continue;
                }
                const auto* probeBoundingBox = getBoundingBox();
                if (modelWorldBounds->aabbAabb(*probeBoundingBox)) {
                    model->updateReflectionProbePlanarMap(_realtimePlanarTexture->getGFXTexture());
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
    for (const auto& rt : _bakedCubeTextures) {
        rt->destroy();
    }
    _bakedCubeTextures.clear();
}

void ReflectionProbe::enable() {
    scene::ReflectionProbeManager::getInstance()->registerProbe(this);
}
void ReflectionProbe::disable() {
    scene::ReflectionProbeManager::getInstance()->unRegisterProbe(this);
}

void ReflectionProbe::initBakedTextures() {
    if (_bakedCubeTextures.empty()) {
        for (uint32_t i = 0; i < 6; i++) {
            auto* rt = ccnew RenderTexture();
            IRenderTextureCreateInfo info;
            info.name = "capture";
            info.height = _resolution;
            info.width = _resolution;
            rt->initialize(info);
            _bakedCubeTextures.emplace_back(rt);
        }
    }
}
void ReflectionProbe::resetCameraParams() {
    _camera->setProjectionType(CameraProjection::PERSPECTIVE);
    _camera->setOrthoHeight(10.F);
    _camera->setNearClip(1.F);
    _camera->setFarClip(1000.F);
    _camera->setFov(static_cast<float>(mathutils::toRadian(90.F)));
    _camera->setPriority(0);
    if (!_bakedCubeTextures.empty()) {
        _camera->changeTargetWindow(_bakedCubeTextures[0]->getWindow());
    }
    _camera->resize(_resolution, _resolution);
    _camera->setVisibility(_visibility);

    _camera->setClearColor(_backgroundColor);
    _camera->setClearDepth(1.F);
    _camera->setClearStencil(0.F);
    _camera->setClearFlag(_clearFlag);

    _camera->setAperture(CameraAperture::F16_0);
    _camera->setShutter(CameraShutter::D125);
    _camera->setIso(CameraISO::ISO100);

    _cameraNode->setWorldPosition(_node->getWorldPosition());
    _cameraNode->setWorldRotation(_node->getWorldRotation());
    _camera->update(true);
}
void ReflectionProbe::captureCubemap() {
    initBakedTextures();
    resetCameraParams();
    packBackgroundColor();
    _needRender = true;
}

void ReflectionProbe::updateCameraDir(int32_t faceIdx) {
    _cameraNode->setRotationFromEuler(CAMERA_DIR[faceIdx]);
    _camera->update(true);
}

Vec2 ReflectionProbe::renderArea() const {
    if (_probeType == ProbeType::PLANAR) {
        return Vec2(_realtimePlanarTexture->getWidth(), _realtimePlanarTexture->getHeight());
    }
    return Vec2(_resolution, _resolution);
}

void ReflectionProbe::packBackgroundColor() {
    Vec3 rgb{_camera->getClearColor().x, _camera->getClearColor().y, _camera->getClearColor().z};
    float maxComp = std::max(std::max(rgb.x, rgb.y), rgb.z);
    float e = 128.F;
    if (maxComp > 0.0001) {
        e = std::log(maxComp) / std::log(1.1F);
        e = std::ceil(e);
        e = std::clamp(e + 128.F, 0.F, 255.F);
    }
    float sc = 1.F / std::pow(1.1F, e - 128.F);
    Vec3 encode{std::clamp(rgb * sc, Vec3(0.F, 0.F, 0.F), Vec3(1.F, 1.F, 1.F))};
    encode *= 255.F;
    Vec3 fVec3{std::floor(encode.x), std::floor(encode.y), std::floor(encode.z)};
    Vec3 sub(encode - fVec3);
    Vec3 stepVec3 = sub < Vec3(0.5F, 0.5F, 0.5F) ? Vec3(0.5F, 0.5F, 0.5F) : sub;
    Vec3 encodeRounded(fVec3 + stepVec3);
    _camera->setClearColor(gfx::Color{encodeRounded.x / 255.F, encodeRounded.y / 255.F, encodeRounded.z / 255.F, e / 255.F});
}

bool ReflectionProbe::isRGBE() const {
    if (_cubemap) {
        return _cubemap->isRGBE;
    }
    // no baking will reflect the skybox
    if (_node && _node->getScene() && _node->getScene()->getSceneGlobals()->getSkyboxInfo()->getEnvmap()) {
        return _node->getScene()->getSceneGlobals()->getSkyboxInfo()->getEnvmap()->isRGBE;
    }
    return true;
}

} // namespace scene
} // namespace cc
