/****************************************************************************
 Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.

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
#include "core/scene-graph/Scene.h"
#include "Define.h"

namespace cc {
namespace scene {
    const ccstd::vector<Model*> &ReflectionProbe::getRenderObjects() const {
        return _renderObjects;
    }
    void ReflectionProbe::addRenderObject(Model *model) {
        _renderObjects.push_back(model);
    }

    void ReflectionProbe::initialize(Node* node) {
        _node = node;
        _cameraNode = new Node("ReflectionProbeCamera");
        Scene* c = _node->getScene();
        c->addChild(_cameraNode);

        const Vec3 pos = node->getWorldPosition();
        _boundingBox = geometry::AABB::create(pos.x, pos.y, pos.z, _size.x, _size.y, _size.z);

        if (!_camera) {
            _camera = Root::getInstance()->createCamera();
            scene::ICameraInfo info;
            info.name = _cameraNode->getName();
            info.node = _cameraNode;
            info.projection = CameraProjection::PERSPECTIVE;
            info.window = Root::getInstance()->getTempWindow();
            info.priority = 0;
            info.cameraType= CameraType::REFLECTION_PROBE;
            info.trackingType= TrackingType::NO_TRACKING;
            _camera->initialize(info);
        }
        _camera->setViewportInOrientedSpace(Rect(0, 0, 1, 1));
        _camera->setFovAxis(CameraFOVAxis::VERTICAL);
        _camera->setFov(static_cast<float>(mathutils::toRadian(90)));
        _camera->setOrthoHeight(10.0f);

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
    }

    void ReflectionProbe::syncCameraParams(camera: Camera) {
        this.camera.projectionType = camera.projectionType;
        this.camera.orthoHeight = camera.orthoHeight;
        this.camera.nearClip = camera.nearClip;
        this.camera.farClip = camera.farClip;
        this.camera.fov = camera.fov;
        this.camera.visibility = camera.visibility;
        this.camera.clearFlag = camera.clearFlag;
        this.camera.clearColor = camera.clearColor;
        this.camera.priority = camera.priority - 1;
    }

    void ReflectionProbe::switchProbeType(int32_t type, Camera* sourceCamera) {
        if (_probeType == ProbeType::PLANAR) {
            if (!sourceCamera) return;
            this._syncCameraParams(sourceCamera);
            this._transformReflectionCamera(sourceCamera);
            this._attachCameraToScene();
            this._needRender = true;
        }
    }
    void ReflectionProbe::renderPlanarReflection(Camera* camera) {}
    void ReflectionProbe::setTargetTexture(RenderTexture* rt) {}
    void ReflectionProbe::updateBoundingBox() {}
    void ReflectionProbe::syncCameraParams(){}
    void ReflectionProbe::transformReflectionCamera(){}

} // namespace scene
} // namespace cc
