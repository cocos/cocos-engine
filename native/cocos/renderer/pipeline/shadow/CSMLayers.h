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

#pragma once

#include "base/TypeDef.h"
#include "core/geometry/Frustum.h"
#include "math/Mat4.h"
#include "pipeline/Define.h"
#include "scene/Camera.h"
#include "scene/DirectionalLight.h"
#include "scene/Shadow.h"

namespace cc {
namespace pipeline {
class PipelineSceneData;

class ShadowTransformInfo {
public:
    explicit ShadowTransformInfo(uint32_t level);
    ~ShadowTransformInfo() = default;

    inline uint32_t getLevel() const { return _level; }

    inline RenderObjectList &getShadowObjects() { return _shadowObjects; }
    inline void setShadowObjects(RenderObjectList &&ro) { _shadowObjects = std::forward<RenderObjectList>(ro); }
    inline void addShadowObject(RenderObject &&obj) { _shadowObjects.emplace_back(obj); }
    inline void clearShadowObjects() { _shadowObjects.clear(); }

    inline float getShadowCameraFar() const { return _shadowCameraFar; }
    inline void setShadowCameraFar(float shadowCameraFar) { _shadowCameraFar = shadowCameraFar; }

    inline const Mat4 &getMatShadowView() const { return _matShadowView; }
    inline void setMatShadowView(const Mat4 &matShadowView) { _matShadowView = matShadowView; }

    inline const Mat4 &getMatShadowProj() const { return _matShadowProj; }
    inline void setMatShadowProj(const Mat4 &matShadowProj) { _matShadowProj = matShadowProj; }

    inline const Mat4 &getMatShadowViewProj() const { return _matShadowViewProj; }
    inline void setMatShadowViewProj(const Mat4 &matShadowViewProj) { _matShadowViewProj = matShadowViewProj; }

    inline const geometry::Frustum &getValidFrustum() const { return _validFrustum; }

    inline const geometry::Frustum &getSplitFrustum() const { return _splitFrustum; }

    inline const geometry::Frustum &getLightViewFrustum() const { return _lightViewFrustum; }

    inline const geometry::AABB &getCastLightViewBoundingBox() const { return _castLightViewBoundingBox; }

    void createMatrix(const geometry::Frustum &splitFrustum, const scene::DirectionalLight *dirLight, float shadowMapWidth, bool isOnlyCulling);

    void copyToValidFrustum(const geometry::Frustum &validFrustum);

    void calculateValidFrustumOrtho(float width, float height, float nearClamp, float farClamp, const Mat4 &transform);

    void calculateSplitFrustum(float start, float end, float aspect, float fov, const Mat4 &transform);

private:
    // global set
    static float _maxLayerPosz;
    static float _maxLayerFarPlane;

    // Level is a vector, Indicates the location.range: [0 ~ 3]
    uint32_t _level{1U};

    float _shadowCameraFar{0.0F};

    Mat4 _matShadowView;
    Mat4 _matShadowProj;
    Mat4 _matShadowViewProj;
    geometry::Frustum _validFrustum;

    // debug renderer value
    geometry::Frustum _splitFrustum;
    geometry::Frustum _lightViewFrustum;
    geometry::AABB _castLightViewBoundingBox;

    RenderObjectList _shadowObjects;
};

class CSMLayerInfo : public ShadowTransformInfo {
public:
    explicit CSMLayerInfo(uint32_t level);
    ~CSMLayerInfo() = default;

    inline float getSplitCameraNear() const { return _splitCameraNear; }
    inline void setSplitCameraNear(float splitCameraNear) { _splitCameraNear = splitCameraNear; }

    inline float getSplitCameraFar() const { return _splitCameraFar; }
    inline void setSplitCameraFar(float splitCameraFar) { _splitCameraFar = splitCameraFar; }

    inline const Vec4 &getCSMAtlas() const { return _csmAtlas; }

private:
    void calculateAtlas(uint32_t level);

    float _splitCameraNear{0.0F};
    float _splitCameraFar{0.0F};

    Vec4 _csmAtlas;
};

class CSMLayers {
public:
    CSMLayers();
    ~CSMLayers();

    void update(const PipelineSceneData *sceneData, const scene::Camera *camera);

    inline const RenderObjectList &getCastShadowObjects() const { return _castShadowObjects; }
    inline void setCastShadowObjects(RenderObjectList &&ro) { _castShadowObjects = std::forward<RenderObjectList>(ro); }
    inline void addCastShadowObject(RenderObject &&obj) { _castShadowObjects.emplace_back(obj); }
    inline void clearCastShadowObjects() { _castShadowObjects.clear(); }

    inline RenderObjectList &getLayerObjects() { return _layerObjects; }
    inline void setLayerObjects(RenderObjectList &&ro) { _layerObjects = std::forward<RenderObjectList>(ro); }
    inline void addLayerObject(RenderObject &&obj) { _layerObjects.emplace_back(obj); }
    inline void clearLayerObjects() { _layerObjects.clear(); }

    inline const ccstd::array<CSMLayerInfo *, 4> &getLayers() const { return _layers; }

    inline ShadowTransformInfo *getSpecialLayer() const { return _specialLayer; }

private:
    static Mat4 getCameraWorldMatrix(const scene::Camera *camera);

    void splitFrustumLevels(scene::DirectionalLight *dirLight);
    void updateFixedArea(const scene::DirectionalLight *dirLight) const;
    void calculateCSM(const scene::Camera *camera, const scene::DirectionalLight *dirLight, const scene::Shadows *shadowInfo);

    // LevelCount is a scalar, Indicates the number.
    uint32_t _levelCount{0U};

    // The ShadowTransformInfo object for 'fixed area shadow' || 'maximum clipping info' || 'CSM layers = 1'.
    ShadowTransformInfo *_specialLayer{nullptr};

    float _shadowDistance{0.0F};

    ccstd::array<CSMLayerInfo *, 4> _layers{};

    RenderObjectList _castShadowObjects;
    RenderObjectList _layerObjects;
};
} // namespace pipeline
} // namespace cc
