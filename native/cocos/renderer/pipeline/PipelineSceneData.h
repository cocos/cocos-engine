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

#include "Define.h"
#include "core/assets/Material.h"
#include "core/geometry/Sphere.h"

namespace cc {

namespace gfx {
class Framebuffer;
}
namespace scene {
class Pass;
class Ambient;
class Shadows;
class Skybox;
class Fog;
class Octree;
class Light;
} // namespace scene
namespace pipeline {

class RenderPipeline;

class CC_DLL PipelineSceneData : public Object {
public:
    PipelineSceneData();
    ~PipelineSceneData() override;
    virtual void activate(gfx::Device *device, RenderPipeline *pipeline);
    void         destroy();

    virtual void onGlobalPipelineStateChanged() {}

    inline void                                                                setShadowFramebuffer(const scene::Light *light, gfx::Framebuffer *framebuffer) { _shadowFrameBufferMap.emplace(light, framebuffer); }
    inline const std::unordered_map<const scene::Light *, gfx::Framebuffer *> &getShadowFramebufferMap() const { return _shadowFrameBufferMap; }
    inline const RenderObjectList &                                            getRenderObjects() const { return _renderObjects; }
    inline const RenderObjectList &                                            getDirShadowObjects() const { return _dirShadowObjects; }
    inline void                                                                setRenderObjects(RenderObjectList &&ro) { _renderObjects = std::forward<RenderObjectList>(ro); }
    inline void                                                                setDirShadowObjects(RenderObjectList &&ro) { _dirShadowObjects = std::forward<RenderObjectList>(ro); }
    inline const RenderObjectList &                                            isCastShadowObjects() const { return _castShadowObjects; }
    inline void                                                                setCastShadowObjects(RenderObjectList &&ro) { _castShadowObjects = std::forward<RenderObjectList>(ro); }
    inline const vector<const scene::Light *> &                                getValidPunctualLights() const { return _validPunctualLights; }
    inline void                                                                setValidPunctualLights(vector<const scene::Light *> &&validPunctualLights) { _validPunctualLights = std::forward<vector<const scene::Light *>>(validPunctualLights); }
    inline bool                                                                isHDR() const { return _isHDR; }
    inline void                                                                setHDR(bool val) { _isHDR = val; }
    inline scene::Shadows *                                                    getShadows() const { return _shadow; }
    inline scene::Ambient *                                                    getAmbient() const { return _ambient; }
    inline scene::Skybox *                                                     getSkybox() const { return _skybox; }
    inline scene::Fog *                                                        getFog() const { return _fog; }
    inline scene::Octree *                                                     getOctree() const { return _octree; }
    inline gfx::InputAssembler *                                               getOcclusionQueryInputAssembler() const { return _occlusionQueryInputAssembler; }
    inline scene::Pass *                                                       getOcclusionQueryPass() const { return _occlusionQueryPass; }
    inline gfx::Shader *                                                       getOcclusionQueryShader() const { return _occlusionQueryShader; }
    inline const std::vector<IntrusivePtr<Material>> &                         getGeometryRendererMaterials() const { return _geometryRendererMaterials; }
    inline const std::vector<scene::Pass *> &                                  getGeometryRendererPasses() const { return _geometryRendererPasses; }
    inline const std::vector<gfx::Shader *> &                                  getGeometryRendererShaders() const { return _geometryRendererShaders; }
    inline void                                                                addRenderObject(RenderObject &&obj) { _renderObjects.emplace_back(obj); }
    inline void                                                                clearRenderObjects() { _renderObjects.clear(); }
    inline void                                                                addValidPunctualLight(scene::Light *light) { _validPunctualLights.emplace_back(light); }
    inline void                                                                clearValidPunctualLights() { _validPunctualLights.clear(); }
    inline float                                                               getShadingScale() const { return _shadingScale; }
    inline void                                                                setShadingScale(float val) { _shadingScale = val; }

    scene::Pass *getOcclusionQueryPass();

protected:
    void                 initOcclusionQuery();
    void                 initGeometryRendererMaterials();
    gfx::InputAssembler *createOcclusionQueryIA();

    static constexpr uint32_t GEOMETRY_RENDERER_TECHNIQUE_COUNT{6};

    RenderObjectList             _renderObjects;
    RenderObjectList             _dirShadowObjects;
    RenderObjectList             _castShadowObjects;
    vector<const scene::Light *> _validPunctualLights;
    gfx::Buffer *                _occlusionQueryVertexBuffer{nullptr};
    gfx::Buffer *                _occlusionQueryIndicesBuffer{nullptr};
    gfx::InputAssembler *        _occlusionQueryInputAssembler{nullptr};

    IntrusivePtr<Material> _occlusionQueryMaterial{nullptr};
    gfx::Shader *          _occlusionQueryShader{nullptr}; // weak reference
    scene::Pass *          _occlusionQueryPass{nullptr};   // weak reference

    std::vector<IntrusivePtr<Material>> _geometryRendererMaterials;
    std::vector<scene::Pass *>          _geometryRendererPasses;  // weak reference
    std::vector<gfx::Shader *>          _geometryRendererShaders; // weak reference

    RenderPipeline *_pipeline{nullptr};
    gfx::Device *   _device{nullptr};

    scene::Fog *    _fog{nullptr};
    scene::Ambient *_ambient{nullptr};
    scene::Skybox * _skybox{nullptr};
    scene::Shadows *_shadow{nullptr};
    scene::Octree * _octree{nullptr};
    bool            _isHDR{true};
    float           _shadingScale{1.0F};

    std::unordered_map<const scene::Light *, gfx::Framebuffer *> _shadowFrameBufferMap;
};

} // namespace pipeline
} // namespace cc
