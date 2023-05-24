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
#include "RenderFlow.h"
#include "base/std/container/string.h"
#include "base/std/container/unordered_map.h"
#include "core/assets/Asset.h"
#include "frame-graph/FrameGraph.h"
#include "frame-graph/Handle.h"
#include "renderer/core/PassUtils.h"
#include "scene/Model.h"

namespace cc {
namespace gfx {
class CommandBuffer;
class DescriptorSet;
class DescriptorSetLayout;
} // namespace gfx
namespace scene {
class Camera;
class SubModel;
} // namespace scene
namespace render {
class PipelineRuntime;
} // namespace render
namespace pipeline {

class PipelineUBO;
class PipelineSceneData;
class GlobalDSManager;
class RenderStage;
class GeometryRenderer;
struct CC_DLL RenderPipelineInfo {
    uint32_t tag = 0;
    RenderFlowList flows;
};

class CC_DLL RenderPipeline : public Asset {
public:
    using Super = Asset;
    static RenderPipeline *getInstance();
    static framegraph::StringHandle fgStrHandleOutDepthTexture;
    static framegraph::StringHandle fgStrHandleOutColorTexture;
    static framegraph::StringHandle fgStrHandlePostprocessPass;
    static framegraph::StringHandle fgStrHandleBloomOutTexture;
    static gfx::Rect getRenderArea(scene::Camera *camera);

    RenderPipeline();
    ~RenderPipeline() override;

    virtual bool activate(gfx::Swapchain *swapchain);
    bool destroy() override;
    virtual bool initialize(const RenderPipelineInfo &info);
    virtual void render(const ccstd::vector<scene::Camera *> &cameras);
    virtual void onGlobalPipelineStateChanged();

    inline const RenderFlowList &getFlows() const { return _flows; }
    inline void setFlows(const RenderFlowList &flows) { _flows = flows; }
    inline uint32_t getTag() const { return _tag; }
    inline void setTag(uint32_t tag) { _tag = tag; }
    inline const ccstd::unordered_map<ccstd::string, InternalBindingInst> &getGlobalBindings() const { return _globalBindings; }
    inline const MacroRecord &getMacros() const { return _macros; }
    inline void setValue(const ccstd::string &name, int32_t value) { _macros[name] = value; }
    inline void setValue(const ccstd::string &name, bool value) { _macros[name] = value; }
    inline void setValue(const ccstd::string &name, const ccstd::string &value) { _macros[name] = value; }
    inline GlobalDSManager *getGlobalDSManager() const { return _globalDSManager; }
    inline gfx::DescriptorSet *getDescriptorSet() const { return _descriptorSet; }
    gfx::DescriptorSetLayout *getDescriptorSetLayout() const;
    inline PipelineSceneData *getPipelineSceneData() const { return _pipelineSceneData; }
    inline const gfx::CommandBufferList &getCommandBuffers() const { return _commandBuffers; }
    inline const gfx::QueryPoolList &getQueryPools() const { return _queryPools; }
    inline PipelineUBO *getPipelineUBO() const { return _pipelineUBO; }
    inline const ccstd::string &getConstantMacros() const { return _constantMacros; }
    inline gfx::Device *getDevice() const { return _device; }
    RenderStage *getRenderstageByName(const ccstd::string &name) const;
    bool isOccluded(const scene::Camera *camera, const scene::SubModel *subModel);
    bool isOcclusionQueryEnabled() const {
#if CC_USE_OCCLUSION_QUERY
        return _occlusionQueryEnabled && _device->getCapabilities().supportQuery;
#else
        return false;
#endif
    }
    void setOcclusionQueryEnabled(bool enable) { _occlusionQueryEnabled = enable; }
    bool isEnvmapEnabled() const;

    gfx::Viewport getViewport(scene::Camera *camera);
    gfx::Rect getScissor(scene::Camera *camera);
    void genQuadVertexData(const Vec4 &viewport, float data[16]);
    uint32_t getWidth() const { return _width; }
    uint32_t getHeight() const { return _height; }
    framegraph::FrameGraph &getFrameGraph() { return _fg; }
    gfx::Color getClearcolor(scene::Camera *camera) const;
    gfx::InputAssembler *getIAByRenderArea(const gfx::Rect &renderArea);
    void updateQuadVertexData(const Vec4 &viewport, gfx::Buffer *buffer);
    void ensureEnoughSize(const ccstd::vector<scene::Camera *> &cameras);
    bool createQuadInputAssembler(gfx::Buffer *quadIB, gfx::Buffer **quadVB, gfx::InputAssembler **quadIA);

    float getShadingScale() const;
    void setShadingScale(float scale);

    inline scene::Model *getProfiler() const { return _profiler; }
    inline void setProfiler(scene::Model *value) { _profiler = value; }

    inline bool isClusterEnabled() const { return _clusterEnabled; }
    inline void setClusterEnabled(bool enable) { _clusterEnabled = enable; }

    inline bool isBloomEnabled() const { return _bloomEnabled; }
    inline void setBloomEnabled(bool enable) { _bloomEnabled = enable; }

    inline GeometryRenderer *getGeometryRenderer() const {
#if CC_USE_GEOMETRY_RENDERER
        return _geometryRenderer;
#else
        return nullptr;
#endif
    }

    inline void resetRenderQueue(bool reset) { _resetRenderQueue = reset; }
    inline bool isRenderQueueReset() const { return _resetRenderQueue; }

    render::PipelineRuntime *getPipelineRuntime() const { return _pipelineRuntime; }
    void setPipelineRuntime(render::PipelineRuntime *pipelineRuntime) {
        _pipelineRuntime = pipelineRuntime;
    }

protected:
    static RenderPipeline *instance;

    void generateConstantMacros();
    void destroyQuadInputAssembler();

#if CC_USE_GEOMETRY_RENDERER
    void updateGeometryRenderer(const ccstd::vector<scene::Camera *> &cameras);
#endif

    static void framegraphGC();

    gfx::CommandBufferList _commandBuffers;
    gfx::QueryPoolList _queryPools;
    RenderFlowList _flows;
    ccstd::unordered_map<ccstd::string, InternalBindingInst> _globalBindings;
    MacroRecord _macros;
    uint32_t _tag{0};
    ccstd::string _constantMacros;

    // weak reference
    gfx::Device *_device{nullptr};
    // manage memory manually
    GlobalDSManager *_globalDSManager{nullptr};
    // weak reference, get from _globalDSManager
    gfx::DescriptorSet *_descriptorSet{nullptr};
    // manage memory manually
    PipelineUBO *_pipelineUBO{nullptr};
    IntrusivePtr<scene::Model> _profiler;
    IntrusivePtr<PipelineSceneData> _pipelineSceneData;

#if CC_USE_GEOMETRY_RENDERER
    IntrusivePtr<GeometryRenderer> _geometryRenderer;
#endif

    // has not initBuiltinRes,
    // create temporary default Texture to binding sampler2d
    uint32_t _width{0};
    uint32_t _height{0};
    gfx::Buffer *_quadIB{nullptr};
    // manage memory manually
    ccstd::vector<gfx::Buffer *> _quadVB;
    // manage memory manually
    ccstd::unordered_map<Vec4, gfx::InputAssembler *, Hasher<Vec4>> _quadIA;

    framegraph::FrameGraph _fg;
    ccstd::unordered_map<gfx::ClearFlags, gfx::RenderPass *> _renderPasses;

    // use cluster culling or not
    bool _clusterEnabled{false};
    bool _bloomEnabled{false};
    bool _occlusionQueryEnabled{false};

    bool _resetRenderQueue{true};

    render::PipelineRuntime *_pipelineRuntime{nullptr};
};

} // namespace pipeline
} // namespace cc
