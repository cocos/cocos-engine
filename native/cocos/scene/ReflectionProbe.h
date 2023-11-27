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

#pragma once

#include "base/Macros.h"
#include "base/Ptr.h"
#include "base/RefCounted.h"
#include "core/Root.h"
#include "core/assets/RenderTexture.h"
#include "core/assets/TextureCube.h"
#include "renderer/pipeline/Define.h"
#include "scene/Camera.h"
namespace cc {
namespace scene {
class ReflectionProbe final {
public:
    explicit ReflectionProbe(int32_t id);
    ~ReflectionProbe() = default;
    void initialize(Node* probeNode, Node* cameraNode);
    enum class ProbeType {
        CUBE = 0,
        PLANAR = 1,
    };
    /**
     * @en Set probe type,cube or planar.
     * @zh 设置探针类型，cube或者planar
     */
    inline void setProbeType(ProbeType type) {
        _probeType = type;
    }
    inline ProbeType getProbeType() const { return _probeType; }
    inline int32_t getProbeId() const { return _probeId; }
    void setResolution(int32_t resolution);
    inline int32_t getResolution() const { return _resolution; }
    /**
     * @en Clearing flags of the camera, specifies which part of the framebuffer will be actually cleared every frame.
     * @zh 相机的缓冲清除标志位，指定帧缓冲的哪部分要每帧清除。
     */
    inline void setClearFlag(gfx::ClearFlagBit value) {
        _clearFlag = value;
        _camera->setClearFlag(_clearFlag);
    }
    inline gfx::ClearFlagBit getClearFlag() const { return _clearFlag; }

    /**
     * @en Clearing color of the camera.
     * @zh 相机的颜色缓冲默认值。
     */
    inline void setBackgroundColor(gfx::Color& val) {
        _backgroundColor = val;
        _camera->setClearColor(val);
    }
    inline const gfx::Color& getBackgroundColor() const { return _backgroundColor; }

    /**
    * @en Visibility mask, declaring a set of node layers that will be visible to this camera.
    * @zh 可见性掩码，声明在当前相机中可见的节点层级集合。
    */
    inline void setVisibility(int32_t val) { _visibility = val; }
    inline int32_t getVisibility() const { return _visibility; }

    /**
    * @en Gets or sets the size of the bouding box, in local space.
    * @zh 获取或设置包围盒的大小。
    */
    inline void setBoudingSize(Vec3& value) {
        _size = value;
        const Vec3 pos = _node->getWorldPosition();
        geometry::AABB::set(_boundingBox, pos.x, pos.y, pos.z, _size.x, _size.y, _size.z);
    }
    inline const Vec3& getBoudingSize() const { return _size; }
    /**
     * @en The node of the probe.
     * @zh probe绑定的节点
     */
    inline Node* getNode() { return _node; }
    inline const Camera* getCamera() const { return _camera; }
    inline bool needRender() const { return _needRender; }
    inline void setNeedRender(bool b) { _needRender = b; }
    inline const geometry::AABB* getBoundingBox() const { return _boundingBox; }

    inline void setCameraNode(Node* val) { _cameraNode = val; }
    inline Node* getCameraNode() const { return _cameraNode; }

    inline void setPreviewSphere(Node* val) { _previewSphere = val; }
    inline const Node* getPreviewSphere() const { return _previewSphere; }

    inline void setPreviewPlane(Node* val) { _previewPlane = val; }
    inline const Node* getPreviewPlane() const { return _previewPlane; }

    inline void setCubeMap(cc::TextureCube* cubeMap) { _cubemap = cubeMap; }
    inline const cc::TextureCube* getCubeMap() const { return _cubemap; }

    inline RenderTexture* getRealtimePlanarTexture() const { return _realtimePlanarTexture; }
    void updateBoundingBox();
    void syncCameraParams(const Camera* camera);
    void transformReflectionCamera(const Camera* sourceCamera);
    void renderPlanarReflection(const Camera* camera);
    void switchProbeType(int32_t type, const Camera* sourceCamera);
    static Vec3 reflect(const Vec3& point, const Vec3& normal, float offset);

    void updatePlanarTexture(const scene::RenderScene* scene);

    void destroy();
    void enable();
    void disable();

    inline bool validate() const { return _cubemap != nullptr; }

    void initBakedTextures();
    void captureCubemap();

    inline const ccstd::vector<IntrusivePtr<cc::RenderTexture>>& getBakedCubeTextures() const { return _bakedCubeTextures; }
    void resetCameraParams();
    void updateCameraDir(int32_t faceIdx);
    Vec2 renderArea() const;
    void packBackgroundColor();
    bool isRGBE() const;

private:
    ccstd::vector<IntrusivePtr<cc::RenderTexture>> _bakedCubeTextures;
    IntrusivePtr<cc::RenderTexture> _realtimePlanarTexture{nullptr};

    int32_t _resolution = 256;
    gfx::ClearFlagBit _clearFlag = gfx::ClearFlagBit::NONE;
    gfx::Color _backgroundColor{1.0, 1.0, 1.0, 1.0};
    int32_t _visibility = 0;
    ProbeType _probeType = ProbeType::CUBE;
    IntrusivePtr<TextureCube> _cubemap{nullptr};
    Vec3 _size;
    /**
     * @en Objects inside bouding box.
     * @zh 包围盒范围内的物体
     */
    ccstd::vector<Model*> _renderObjects;

    /**
     * @en Render cubemap's camera
     * @zh 渲染cubemap的相机
     */
    IntrusivePtr<scene::Camera> _camera{nullptr};

    /**
     * @en Unique id of probe.
     * @zh probe的唯一id
     */
    int32_t _probeId = 0;

    bool _needRender = false;

    IntrusivePtr<Node> _node;

    IntrusivePtr<Node> _cameraNode;
    IntrusivePtr<Node> _previewSphere;
    IntrusivePtr<Node> _previewPlane;

    /**
     * @en The AABB bounding box and probe only render the objects inside the bounding box.
     * @zh AABB包围盒，probe只渲染包围盒内的物体
     */
    IntrusivePtr<geometry::AABB> _boundingBox{nullptr};

    /**
     * @en The position of the camera in world space.
     * @zh 世界空间相机的位置
     */
    Vec3 _cameraWorldPos;

    /**
     * @en The rotation of the camera in world space.
     * @zh 世界空间相机的旋转
     */
    Quaternion _cameraWorldRotation;

    /**
     * @en The forward direction vertor of the camera in world space.
     * @zh 世界空间相机朝前的方向向量
     */
    Vec3 _forward;
    /**
     * @en The up direction vertor of the camera in world space.
     * @zh 世界空间相机朝上的方向向量
     */
    Vec3 _up;

    CC_DISALLOW_COPY_MOVE_ASSIGN(ReflectionProbe);
};

} // namespace scene
} // namespace cc
