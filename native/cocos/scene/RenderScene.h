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

#pragma once

#include <string>
#include <vector>
#include "base/Macros.h"
#include "base/Ptr.h"
#include "base/TypeDef.h"
#include "scene/Camera.h"

namespace cc {

class Node;
class SkinningModel;
class BakedSkinningModel;

namespace scene {

class Octree;
struct DrawBatch2D;
class DirectionalLight;
class SphereLight;
class SpotLight;

struct IRaycastResult {
    Node *node{nullptr};
    float distance{0.F};
};

struct IRenderSceneInfo {
    std::string name;
};

class RenderScene : public RefCounted {
public:
    RenderScene() = default;
    ~RenderScene() override;

    bool initialize(const IRenderSceneInfo &info);
    void update(uint32_t stamp);
    void destroy();

    void activate();

    void addCamera(Camera *camera);
    void removeCamera(Camera *camera);
    void removeCameras();

    void unsetMainLight(DirectionalLight *dl);
    void addDirectionalLight(DirectionalLight *dl);
    void removeDirectionalLight(DirectionalLight *dl);

    void addSphereLight(SphereLight *);
    void removeSphereLight(SphereLight *);
    void removeSphereLights();

    void addSpotLight(SpotLight *);
    void removeSpotLight(SpotLight *);
    void removeSpotLights();

    void addModel(Model *);
    void removeModel(index_t idx);
    void removeModel(Model *model);
    void removeModels();

    void addBatch(DrawBatch2D *);
    void removeBatch(DrawBatch2D *);
    void removeBatches();

    void onGlobalPipelineStateChanged();

    inline DirectionalLight *getMainLight() const { return _mainLight.get(); }
    void                     setMainLight(DirectionalLight *dl);

    inline uint64_t                                      generateModelId() { return _modelId++; }
    inline const std::string &                           getName() const { return _name; }
    inline const std::vector<IntrusivePtr<Camera>> &     getCameras() const { return _cameras; }
    inline const std::vector<IntrusivePtr<SphereLight>> &getSphereLights() const { return _sphereLights; }
    inline const std::vector<IntrusivePtr<SpotLight>> &  getSpotLights() const { return _spotLights; }
    inline const std::vector<IntrusivePtr<Model>> &      getModels() const { return _models; }
    inline Octree *                                      getOctree() const { return _octree; }
    void                                                 updateOctree(Model *model);
    // FIXME: remove getDrawBatch2Ds
    inline const std::vector<DrawBatch2D *> &getBatches() const { return _batches; }
    inline const std::vector<DrawBatch2D *> &getDrawBatch2Ds() const { return _batches; }

private:
    std::string                                 _name;
    uint64_t                                    _modelId{0};
    IntrusivePtr<DirectionalLight>              _mainLight;
    std::vector<IntrusivePtr<Model>>            _models;
    std::vector<IntrusivePtr<Camera>>           _cameras;
    std::vector<IntrusivePtr<DirectionalLight>> _directionalLights;
    std::vector<IntrusivePtr<SphereLight>>      _sphereLights;
    std::vector<IntrusivePtr<SpotLight>>        _spotLights;
    std::vector<DrawBatch2D *>                  _batches;
    Octree *                                    _octree{nullptr};

    CC_DISALLOW_COPY_MOVE_ASSIGN(RenderScene);
};

} // namespace scene
} // namespace cc
