/****************************************************************************
 Copyright (c) 2020-2021 Xiamen Yaji Software Co., Ltd.

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
#include <unordered_map>
#include "Define.h"
#include "GlobalDescriptorSetManager.h"
#include "PipelineSceneData.h"
#include "PipelineUBO.h"
#include "base/CoreStd.h"
#include "core/assets/Asset.h"
#include "frame-graph/FrameGraph.h"
#include "frame-graph/Handle.h"
#include "renderer/core/PassUtils.h"
#include "scene/Camera.h"
#include "scene/Model.h"

namespace cc {
namespace gfx {
class CommandBuffer;
class DescriptorSet;
class DescriptorSetLayout;
} // namespace gfx
namespace scene {
class SubModel;
} // namespace scene
namespace pipeline {

class GlobalDSManager;
class RenderStage;
class GeometryRenderer;

struct CC_DLL RenderPipelineInfo {
    uint           tag = 0;
    RenderFlowList flows;
};

class CC_DLL RenderPipeline : public Asset {
public:
    using Super = Asset;
    static RenderPipeline *         getInstance();
    static framegraph::StringHandle fgStrHandleOutDepthTexture;
    static framegraph::StringHandle fgStrHandleOutColorTexture;
    static framegraph::StringHandle fgStrHandlePostprocessPass;
    static framegraph::StringHandle fgStrHandleBloomOutTexture;
    static gfx::Rect                getRenderArea(scene::Camera *camera);

    RenderPipeline();
    ~RenderPipeline() override;

    virtual bool activate(gfx::Swapchain *swapchain);
    bool         destroy() override;
    virtual bool initialize(const RenderPipelineInfo &info);
    virtual void render(const vector<scene::Camera *> &cameras);

    inline const RenderFlowList &                  getFlows() const { return _flows; }
    inline uint                                    getTag() const { return _tag; }
    inline const map<String, InternalBindingInst> &getGlobalBindings() const { return _globalBindings; }
    inline const MacroRecord &                     getMacros() const { return _macros; }
    inline void                                    setValue(const String &name, int32_t value) { _macros[name] = value; }
    inline void                                    setValue(const String &name, bool value) { _macros[name] = value; }
    inline void                                    setValue(const String &name, const std::string &value) { _macros[name] = value; }
    inline GlobalDSManager *                       getGlobalDSManager() const { return _globalDSManager; }
    inline gfx::DescriptorSet *                    getDescriptorSet() const { return _descriptorSet; }
    inline gfx::DescriptorSetLayout *              getDescriptorSetLayout() const { return _globalDSManager->getDescriptorSetLayout(); }
    inline PipelineSceneData *                     getPipelineSceneData() const { return _pipelineSceneData; }
    inline const gfx::CommandBufferList &          getCommandBuffers() const { return _commandBuffers; }
    inline const gfx::QueryPoolList &              getQueryPools() const { return _queryPools; }
    inline PipelineUBO *                           getPipelineUBO() const { return _pipelineUBO; }
    inline const String &                          getConstantMacros() const { return _constantMacros; }
    inline gfx::Device *                           getDevice() const { return _device; }
    RenderStage *                                  getRenderstageByName(const String &name) const;
    bool                                           isOccluded(const scene::Camera *camera, const scene::SubModel *subModel);
    bool                                           isOcclusionQueryEnabled() const { return _occlusionQueryEnabled && _device->getCapabilities().supportQuery; }
    void                                           setOcclusionQueryEnabled(bool enable) { _occlusionQueryEnabled = enable; }
    bool                                           isEnvmapEnabled() const;

    gfx::Viewport           getViewport(scene::Camera *camera);
    gfx::Rect               getScissor(scene::Camera *camera);
    void                    genQuadVertexData(const Vec4 &viewport, float *data);
    uint                    getWidth() const { return _width; }
    uint                    getHeight() const { return _height; }
    framegraph::FrameGraph &getFrameGraph() { return _fg; }
    gfx::Color              getClearcolor(scene::Camera *camera) const;
    gfx::InputAssembler *   getIAByRenderArea(const gfx::Rect &renderArea);
    void                    updateQuadVertexData(const Vec4 &viewport, gfx::Buffer *buffer);
    void                    ensureEnoughSize(const vector<scene::Camera *> &cameras);
    bool                    createQuadInputAssembler(gfx::Buffer *quadIB, gfx::Buffer **quadVB, gfx::InputAssembler **quadIA);

    inline scene::Model *getProfiler() const { return _profiler; }
    inline void          setProfiler(scene::Model *value) { _profiler = value; }

    inline GeometryRenderer *getGeometryRenderer() const { return _geometryRenderer; }
    inline void              setGeometryRenderer(GeometryRenderer *geometryRenderer) { _geometryRenderer = geometryRenderer; }

    inline bool isClusterEnabled() const { return _clusterEnabled; }
    inline void setClusterEnabled(bool enable) { _clusterEnabled = enable; }

    inline bool isBloomEnabled() const { return _bloomEnabled; }
    inline void setBloomEnabled(bool enable) { _bloomEnabled = enable; }

protected:
    static RenderPipeline *instance;

    void generateConstantMacros();
    void destroyQuadInputAssembler();

    static void framegraphGC();

    gfx::CommandBufferList           _commandBuffers;
    gfx::QueryPoolList               _queryPools;
    RenderFlowList                   _flows;
    map<String, InternalBindingInst> _globalBindings;
    MacroRecord                      _macros;
    uint                             _tag = 0;
    String                           _constantMacros;

    gfx::Device *                   _device{nullptr};
    GlobalDSManager *               _globalDSManager{nullptr};
    gfx::DescriptorSet *            _descriptorSet{nullptr};
    PipelineUBO *                   _pipelineUBO{nullptr};
    scene::Model *                  _profiler{nullptr};
    IntrusivePtr<PipelineSceneData> _pipelineSceneData;
    IntrusivePtr<GeometryRenderer>  _geometryRenderer;
    // has not initBuiltinRes,
    // create temporary default Texture to binding sampler2d
    uint                                                          _width{0};
    uint                                                          _height{0};
    gfx::Buffer *                                                 _quadIB{nullptr};
    std::vector<gfx::Buffer *>                                    _quadVB;
    std::unordered_map<Vec4, gfx::InputAssembler *, Hasher<Vec4>> _quadIA;

    framegraph::FrameGraph                            _fg;
    unordered_map<gfx::ClearFlags, gfx::RenderPass *> _renderPasses;

    // use cluster culling or not
    bool _clusterEnabled{false};
    bool _bloomEnabled{false};
    bool _occlusionQueryEnabled{false};
};

} // namespace pipeline
} // namespace cc
