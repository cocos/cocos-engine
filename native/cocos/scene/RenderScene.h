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

#include <vector>
#include "scene/BakedSkinningModel.h"
#include "scene/DirectionalLight.h"
#include "scene/DrawBatch2D.h"
#include "scene/Model.h"
#include "scene/SkinningModel.h"
#include "scene/SphereLight.h"
#include "scene/SpotLight.h"

namespace cc {
namespace scene {

class RenderScene final {
public:
    RenderScene()                    = default;
    RenderScene(const RenderScene &) = delete;
    RenderScene(RenderScene &&)      = delete;
    ~RenderScene()                   = default;
    RenderScene &operator=(const RenderScene &) = delete;
    RenderScene &operator=(RenderScene &&) = delete;

    void update(uint32_t stamp);

    void addSphereLight(SphereLight *);
    void removeSphereLight(SphereLight *);
    void removeSphereLights();

    void addSpotLight(SpotLight *);
    void removeSpotLight(SpotLight *);
    void removeSpotLights();

    void addModel(Model *);
    void addSkinningModel(SkinningModel *);
    void addBakedSkinningModel(BakedSkinningModel *);
    void removeModel(Model *);
    void removeModels();

    void updateBatches(std::vector<DrawBatch2D *> &&);
    void addBatch(DrawBatch2D *);
    void removeBatch(DrawBatch2D *);
    void removeBatch(uint32_t index);
    void removeBatches();

    inline void setMainLight(DirectionalLight *light) { _directionalLight = light; }

    inline const std::vector<DrawBatch2D *> &getDrawBatch2Ds() const { return _drawBatch2Ds; }
    inline DirectionalLight *                getMainLight() const { return _directionalLight; }
    inline const std::vector<Model *> &      getModels() const { return _models; }
    inline const std::vector<SphereLight *> &getSphereLights() const { return _sphereLights; }
    inline const std::vector<SpotLight *> &  getSpotLights() const { return _spotLights; }

private:
    DirectionalLight *         _directionalLight{nullptr};
    std::vector<Model *>       _models;
    std::vector<SphereLight *> _sphereLights;
    std::vector<SpotLight *>   _spotLights;
    std::vector<DrawBatch2D *> _drawBatch2Ds;
};

} // namespace scene
} // namespace cc
