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

#include "Define.h"
#include "base/RefCounted.h"
#include "core/assets/Material.h"
#include "renderer/gfx-base/GFXFramebuffer.h"
#include "renderer/pipeline/shadow/CSMLayers.h"

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
class Skin;
class PostSettings;
} // namespace scene
namespace gi {
class LightProbes;
}

namespace pipeline {

class CC_DLL PipelineSceneData : public RefCounted {
public:
    PipelineSceneData();
    ~PipelineSceneData() override;
    virtual void activate(gfx::Device *device);
    void destroy();

    virtual void updatePipelineSceneData() {}

    inline void setShadowFramebuffer(const scene::Light *light, gfx::Framebuffer *framebuffer) { _shadowFrameBufferMap[light] = framebuffer; }
    inline const ccstd::unordered_map<const scene::Light *, IntrusivePtr<gfx::Framebuffer>> &getShadowFramebufferMap() const { return _shadowFrameBufferMap; }
    inline const RenderObjectList &getRenderObjects() const { return _renderObjects; }
    inline void setRenderObjects(RenderObjectList &&ro) { _renderObjects = std::forward<RenderObjectList>(ro); }
    inline const ccstd::vector<const scene::Light *> &getValidPunctualLights() const { return _validPunctualLights; }
    inline void setValidPunctualLights(ccstd::vector<const scene::Light *> lights) { _validPunctualLights = std::move(lights); }
    inline bool isHDR() const { return _isHDR; }
    inline void setHDR(bool val) { _isHDR = val; }
    inline scene::Shadows *getShadows() const { return _shadow; }
    inline CSMLayers *getCSMLayers() const { return _csmLayers; }
    inline scene::Ambient *getAmbient() const { return _ambient; }
    inline scene::Skybox *getSkybox() const { return _skybox; }
    inline scene::Fog *getFog() const { return _fog; }
    inline scene::Octree *getOctree() const { return _octree; }
    inline gi::LightProbes *getLightProbes() const { return _lightProbes; }
    inline scene::Skin *getSkin() const { return _skin; }
    inline scene::PostSettings *getPostSettings() const { return _postSettings; }
    inline gfx::InputAssembler *getOcclusionQueryInputAssembler() const { return _occlusionQueryInputAssembler; }
    inline scene::Pass *getOcclusionQueryPass() const { return _occlusionQueryPass; }
    inline gfx::Shader *getOcclusionQueryShader() const { return _occlusionQueryShader; }
    inline const ccstd::vector<IntrusivePtr<Material>> &getGeometryRendererMaterials() const { return _geometryRendererMaterials; }
    inline const ccstd::vector<scene::Pass *> &getGeometryRendererPasses() const { return _geometryRendererPasses; }
    inline const ccstd::vector<gfx::Shader *> &getGeometryRendererShaders() const { return _geometryRendererShaders; }
    inline scene::Pass *getDebugRendererPass() const { return _debugRendererPass; }
    inline gfx::Shader *getDebugRendererShader() const { return _debugRendererShader; }
    inline void addRenderObject(RenderObject &&obj) { _renderObjects.emplace_back(obj); }
    inline void clearRenderObjects() { _renderObjects.clear(); }
    inline void addValidPunctualLight(scene::Light *light) { _validPunctualLights.emplace_back(light); }
    inline void clearValidPunctualLights() { _validPunctualLights.clear(); }
    inline float getShadingScale() const { return _shadingScale; }
    inline void setShadingScale(float val) { _shadingScale = val; }
    inline bool getCSMSupported() const { return _csmSupported; }
    inline void setCSMSupported(bool val) { _csmSupported = val; }
    inline scene::Model *getStandardSkinModel() const { return _standardSkinModel.get(); }
    void setStandardSkinModel(scene::Model *val);
    inline scene::Model *getSkinMaterialModel() const { return _skinMaterialModel.get(); }
    void setSkinMaterialModel(scene::Model *val);

protected:
    void initOcclusionQuery();
    void initGeometryRenderer();
    void initDebugRenderer();
    gfx::InputAssembler *createOcclusionQueryIA();

    static constexpr uint32_t GEOMETRY_RENDERER_TECHNIQUE_COUNT{6};

    IntrusivePtr<gfx::Buffer> _occlusionQueryVertexBuffer;
    IntrusivePtr<gfx::Buffer> _occlusionQueryIndicesBuffer;
    IntrusivePtr<gfx::InputAssembler> _occlusionQueryInputAssembler;
    IntrusivePtr<Material> _occlusionQueryMaterial{nullptr};
    IntrusivePtr<Material> _debugRendererMaterial{nullptr};
    IntrusivePtr<scene::Model> _standardSkinModel;
    IntrusivePtr<scene::Model> _skinMaterialModel;

    gfx::Shader *_occlusionQueryShader{nullptr}; // weak reference
    scene::Pass *_occlusionQueryPass{nullptr};   // weak reference
    gfx::Shader *_debugRendererShader{nullptr};  // weak reference
    scene::Pass *_debugRendererPass{nullptr};    // weak reference
    gfx::Device *_device{nullptr};               // weak reference
    // manage memory manually
    scene::Fog *_fog{nullptr};
    // manage memory manually
    scene::Ambient *_ambient{nullptr};
    // manage memory manually
    scene::Skybox *_skybox{nullptr};
    // manage memory manually
    scene::Shadows *_shadow{nullptr};
    // manage memory manually
    scene::Octree *_octree{nullptr};
    // manage memory manually
    gi::LightProbes *_lightProbes{nullptr};
    // manage memory manually
    scene::Skin *_skin{nullptr};
    // manage memory manually
    CSMLayers *_csmLayers{nullptr};
    // manage memory manually
    scene::PostSettings *_postSettings{nullptr};

    bool _isHDR{true};
    bool _csmSupported{true};

    float _shadingScale{1.0F};

    RenderObjectList _renderObjects;

    ccstd::vector<IntrusivePtr<Material>> _geometryRendererMaterials;
    // `scene::Light *`: weak reference
    ccstd::vector<const scene::Light *> _validPunctualLights;
    ccstd::vector<scene::Pass *> _geometryRendererPasses;  // weak reference
    ccstd::vector<gfx::Shader *> _geometryRendererShaders; // weak reference

    ccstd::unordered_map<const scene::Light *, IntrusivePtr<gfx::Framebuffer>> _shadowFrameBufferMap;
};

} // namespace pipeline
} // namespace cc
