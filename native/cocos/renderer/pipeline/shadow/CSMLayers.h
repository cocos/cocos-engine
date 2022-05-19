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

#pragma once

#include "../base/TypeDef.h"
#include "../math/Mat4.h"
#include "../../../core/geometry/Frustum.h"
#include "pipeline/Define.h"
#include "scene/Camera.h"
#include "scene/DirectionalLight.h"
#include "scene/Shadow.h"

namespace cc {
namespace pipeline {
class PipelineSceneData;

class ShadowTransformInfo {
public:
    ShadowTransformInfo();
    ~ShadowTransformInfo();

    inline RenderObjectList &getShadowObjects() { return _shadowObjects; }
    inline void setShadowObjects(RenderObjectList &&ro) { _shadowObjects = std::forward<RenderObjectList>(ro); }
    inline void addShadowObject(RenderObject obj) { _shadowObjects.emplace_back(obj); }
    inline void clearShadowObjects() { _shadowObjects.clear(); }

    inline float getShadowCameraFar() const { return _shadowCameraFar; }
    inline void setShadowCameraFar(float shadowCameraFar) { _shadowCameraFar = shadowCameraFar; }

    inline Mat4 getMatShadowView() const { return _matShadowView; }
    inline void setMatShadowView(const Mat4 &matShadowView) { _matShadowView = matShadowView; }

    inline Mat4 getMatShadowProj() const { return _matShadowProj; }
    inline void setMatShadowProj(const Mat4 &matShadowProj) { _matShadowProj = matShadowProj; }

    inline Mat4 getMatShadowViewProj() const { return _matShadowViewProj; }
    inline void setMatShadowViewProj(const Mat4 &matShadowViewProj) { _matShadowViewProj = matShadowViewProj; }

    inline geometry::Frustum getValidFrustum() const { return _validFrustum; }
    inline void setValidFrustum(const geometry::Frustum &validFrustum) { _validFrustum = validFrustum; }

    inline geometry::Frustum getSplitFrustum() const { return _splitFrustum; }
    inline void setSplitFrustum(const geometry::Frustum &splitFrustum) { _splitFrustum = splitFrustum; }

    inline geometry::Frustum getLightViewFrustum() const { return _lightViewFrustum; }
    inline void setLightViewFrustum(const geometry::Frustum &lightViewFrustum) { _lightViewFrustum = lightViewFrustum; }

    inline geometry::AABB getCastLightViewBoundingBox() const { return _castLightViewBoundingBox; }
    inline void setCastLightViewBoundingBox(const geometry::AABB &castLightViewBoundingBox) { _castLightViewBoundingBox = castLightViewBoundingBox; }

    void createMatrix(geometry::Frustum splitFrustum, const scene::DirectionalLight *dirLight, float shadowMapWidth, bool isOnlyCulling);

private:
    RenderObjectList _shadowObjects;

    float _shadowCameraFar{0.0F};

    Mat4 _matShadowView;
    Mat4 _matShadowProj;
    Mat4 _matShadowViewProj;
    geometry::Frustum _validFrustum;

    // debug renderer value
    geometry::Frustum _splitFrustum;
    geometry::Frustum _lightViewFrustum;
    geometry::AABB _castLightViewBoundingBox;
};

class CSMLayerInfo : public ShadowTransformInfo {
public:
    explicit CSMLayerInfo(uint level);
    ~CSMLayerInfo() = default;

    inline uint getLevel() const { return _level; }

    inline float getSplitCameraNear() const { return _splitCameraNear; }
    inline void setSplitCameraNear(float splitCameraNear) { _splitCameraNear = splitCameraNear; }

    inline float getSplitCameraFar() const { return _splitCameraFar; }
    inline void setSplitCameraFar(float splitCameraFar) { _splitCameraFar = splitCameraFar; }

    inline Mat4 getMatShadowAtlas() const { return _matShadowAtlas; }
    inline void setMatShadowAtlas(const Mat4 &matShadowAtlas) { _matShadowAtlas = matShadowAtlas; }

    inline Mat4 getMatShadowViewProjAtlas() const { return _matShadowViewProjAtlas; }
    inline void setMatShadowViewProjAtlas(const Mat4 &matShadowViewProjAtlas) { _matShadowViewProjAtlas = matShadowViewProjAtlas; }

private:
    void calculateAtlas(uint level);

    // Level is a vector, Indicates the location.
    uint _level;
    float _splitCameraNear;
    float _splitCameraFar;

    Mat4 _matShadowAtlas;
    Mat4 _matShadowViewProjAtlas;
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

    inline const ccstd::vector<CSMLayerInfo *> &getLayers() const { return _layers; }

    inline ShadowTransformInfo *getSpecialLayer() const { return _specialLayer; }

private:
    static Mat4 getCameraWorldMatrix(const scene::Camera *camera);

    void splitFrustumLevels(scene::DirectionalLight *dirLight);
    void updateFixedArea(const scene::DirectionalLight *dirLight) const;
    void calculateCSM(const scene::Camera *camera, const scene::DirectionalLight *dirLight, const scene::Shadows *shadowInfo);

    RenderObjectList _castShadowObjects;

    // LevelCount is a scalar, Indicates the number.
    uint _levelCount;
    // The ShadowTransformInfo object for 'fixed area shadow' || 'maximum clipping info' || 'CSM layers = 1'.
    ShadowTransformInfo *_specialLayer{nullptr};
    ccstd::vector<CSMLayerInfo *> _layers;
    float _shadowDistance;
};
} // namespace pipeline
} // namespace cc
