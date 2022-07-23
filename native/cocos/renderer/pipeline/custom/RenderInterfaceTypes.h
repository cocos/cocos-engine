/****************************************************************************
 Copyright (c) 2021-2022 Xiamen Yaji Software Co., Ltd.

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

/**
 * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
 * The following section is auto-generated.
 * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
 */
// clang-format off
#pragma once
#include "cocos/renderer/gfx-base/GFXDef-common.h"
#include "cocos/renderer/pipeline/custom/LayoutGraphTypes.h"
#include "cocos/renderer/pipeline/custom/RenderGraphTypes.h"
#include "cocos/renderer/pipeline/custom/RenderInterfaceFwd.h"

namespace cc {

class Mat4;
class Mat4;
class Quaternion;
class Vec4;
class Vec3;
class Vec2;

namespace pipeline {

class GlobalDSManager;
class PipelineSceneData;
class GeometryRenderer;

} // namespace pipeline

namespace scene {

class Model;
class RenderScene;
class RenderWindow;

} // namespace scene

} // namespace cc

namespace cc {

namespace render {

class PipelineRuntime {
public:
    PipelineRuntime() noexcept = default;
    PipelineRuntime(PipelineRuntime&& rhs)      = delete;
    PipelineRuntime(PipelineRuntime const& rhs) = delete;
    PipelineRuntime& operator=(PipelineRuntime&& rhs) = delete;
    PipelineRuntime& operator=(PipelineRuntime const& rhs) = delete;

    virtual ~PipelineRuntime() noexcept = default;

    virtual bool activate(gfx::Swapchain * swapchain) = 0;
    virtual bool destroy() noexcept = 0;
    virtual void render(const ccstd::vector<scene::Camera*>& cameras) = 0;

    virtual gfx::Device* getDevice() const = 0;
    virtual const MacroRecord &getMacros() const = 0;
    virtual pipeline::GlobalDSManager *getGlobalDSManager() const = 0;
    virtual gfx::DescriptorSetLayout *getDescriptorSetLayout() const = 0;
    virtual gfx::DescriptorSet *getDescriptorSet() const = 0;
    virtual ccstd::vector<gfx::CommandBuffer*> getCommandBuffers() const = 0;
    virtual pipeline::PipelineSceneData *getPipelineSceneData() const = 0;
    virtual const ccstd::string &getConstantMacros() const = 0;
    virtual scene::Model *getProfiler() const = 0;
    virtual void setProfiler(scene::Model *profiler) = 0;
    virtual pipeline::GeometryRenderer  *getGeometryRenderer() const = 0;

    virtual float getShadingScale() const = 0;
    virtual void setShadingScale(float scale) = 0;

    virtual const ccstd::string& getMacroString(const ccstd::string& name) const = 0;
    virtual int32_t getMacroInt(const ccstd::string& name) const = 0;
    virtual bool getMacroBool(const ccstd::string& name) const = 0;

    virtual void setMacroString(const ccstd::string& name, const ccstd::string& value) = 0;
    virtual void setMacroInt(const ccstd::string& name, int32_t value) = 0;
    virtual void setMacroBool(const ccstd::string& name, bool value) = 0;

    virtual void onGlobalPipelineStateChanged() = 0;

    virtual void setValue(const ccstd::string& name, int32_t value) = 0;
    virtual void setValue(const ccstd::string& name, bool value) = 0;

    virtual bool isOcclusionQueryEnabled() const = 0;
};

class Setter {
public:
    Setter() noexcept = default;
    Setter(Setter&& rhs)      = delete;
    Setter(Setter const& rhs) = delete;
    Setter& operator=(Setter&& rhs) = delete;
    Setter& operator=(Setter const& rhs) = delete;

    virtual ~Setter() noexcept = default;

    virtual void setMat4(const ccstd::string& name, const cc::Mat4& mat) = 0;
    virtual void setQuaternion(const ccstd::string& name, const cc::Quaternion& quat) = 0;
    virtual void setColor(const ccstd::string& name, const gfx::Color& color) = 0;
    virtual void setVec4(const ccstd::string& name, const cc::Vec4& vec) = 0;
    virtual void setVec2(const ccstd::string& name, const cc::Vec2& vec) = 0;
    virtual void setFloat(const ccstd::string& name, float v) = 0;

    virtual void setBuffer(const ccstd::string& name, gfx::Buffer* buffer) = 0;
    virtual void setTexture(const ccstd::string& name, gfx::Texture* texture) = 0;
    virtual void setReadWriteBuffer(const ccstd::string& name, gfx::Buffer* buffer) = 0;
    virtual void setReadWriteTexture(const ccstd::string& name, gfx::Texture* texture) = 0;
    virtual void setSampler(const ccstd::string& name, gfx::Sampler* sampler) = 0;
};

class RasterQueueBuilder : public Setter {
public:
    RasterQueueBuilder() noexcept = default;

    virtual void addSceneOfCamera(scene::Camera* camera, LightInfo light, SceneFlags sceneFlags, const ccstd::string& name) = 0;
    virtual void addSceneOfCamera(scene::Camera* camera, LightInfo light, SceneFlags sceneFlags) = 0;
    virtual void addScene(const ccstd::string& name, SceneFlags sceneFlags) = 0;
    virtual void addFullscreenQuad(cc::Material *material, SceneFlags sceneFlags, const ccstd::string& name) = 0;
    virtual void addFullscreenQuad(cc::Material *material, SceneFlags sceneFlags) = 0;
    virtual void addCameraQuad(scene::Camera* camera, cc::Material *material, SceneFlags sceneFlags, const ccstd::string& name) = 0;
    virtual void addCameraQuad(scene::Camera* camera, cc::Material *material, SceneFlags sceneFlags) = 0;
    virtual void clearRenderTarget(const ccstd::string &name, const gfx::Color &color) = 0;
    virtual void setViewport(const gfx::Viewport &viewport) = 0;
};

class RasterPassBuilder : public Setter {
public:
    RasterPassBuilder() noexcept = default;

    virtual void addRasterView(const ccstd::string& name, const RasterView& view) = 0;
    virtual void addComputeView(const ccstd::string& name, const ComputeView& view) = 0;
    virtual RasterQueueBuilder *addQueue(QueueHint hint, const ccstd::string& name) = 0;
    virtual RasterQueueBuilder *addQueue(QueueHint hint) = 0;
    virtual void addFullscreenQuad(cc::Material *material, SceneFlags sceneFlags, const ccstd::string& name) = 0;
    virtual void addFullscreenQuad(cc::Material *material, SceneFlags sceneFlags) = 0;
    virtual void addCameraQuad(scene::Camera* camera, cc::Material *material, SceneFlags sceneFlags, const ccstd::string& name) = 0;
    virtual void addCameraQuad(scene::Camera* camera, cc::Material *material, SceneFlags sceneFlags) = 0;
    virtual void setViewport(const gfx::Viewport &viewport) = 0;
};

class ComputeQueueBuilder : public Setter {
public:
    ComputeQueueBuilder() noexcept = default;

    virtual void addDispatch(const ccstd::string& shader, uint32_t threadGroupCountX, uint32_t threadGroupCountY, uint32_t threadGroupCountZ, const ccstd::string& name) = 0;
    virtual void addDispatch(const ccstd::string& shader, uint32_t threadGroupCountX, uint32_t threadGroupCountY, uint32_t threadGroupCountZ) = 0;
};

class ComputePassBuilder : public Setter {
public:
    ComputePassBuilder() noexcept = default;

    virtual void addComputeView(const ccstd::string& name, const ComputeView& view) = 0;

    virtual ComputeQueueBuilder *addQueue(const ccstd::string& name) = 0;
    virtual ComputeQueueBuilder *addQueue() = 0;

    virtual void addDispatch(const ccstd::string& shader, uint32_t threadGroupCountX, uint32_t threadGroupCountY, uint32_t threadGroupCountZ, const ccstd::string& name) = 0;
    virtual void addDispatch(const ccstd::string& shader, uint32_t threadGroupCountX, uint32_t threadGroupCountY, uint32_t threadGroupCountZ) = 0;
};

class MovePassBuilder {
public:
    MovePassBuilder() noexcept = default;
    MovePassBuilder(MovePassBuilder&& rhs)      = delete;
    MovePassBuilder(MovePassBuilder const& rhs) = delete;
    MovePassBuilder& operator=(MovePassBuilder&& rhs) = delete;
    MovePassBuilder& operator=(MovePassBuilder const& rhs) = delete;

    virtual ~MovePassBuilder() noexcept = default;

    virtual void addPair(const MovePair& pair) = 0;
};

class CopyPassBuilder {
public:
    CopyPassBuilder() noexcept = default;
    CopyPassBuilder(CopyPassBuilder&& rhs)      = delete;
    CopyPassBuilder(CopyPassBuilder const& rhs) = delete;
    CopyPassBuilder& operator=(CopyPassBuilder&& rhs) = delete;
    CopyPassBuilder& operator=(CopyPassBuilder const& rhs) = delete;

    virtual ~CopyPassBuilder() noexcept = default;

    virtual void addPair(const CopyPair& pair) = 0;
};

class SceneVisitor {
public:
    SceneVisitor() noexcept = default;
    SceneVisitor(SceneVisitor&& rhs)      = delete;
    SceneVisitor(SceneVisitor const& rhs) = delete;
    SceneVisitor& operator=(SceneVisitor&& rhs) = delete;
    SceneVisitor& operator=(SceneVisitor const& rhs) = delete;

    virtual ~SceneVisitor() noexcept = default;

    virtual const pipeline::PipelineSceneData* getPipelineSceneData() const = 0;

    virtual void setViewport(const gfx::Viewport &vp) = 0;
    virtual void setScissor(const gfx::Rect &rect) = 0;
    virtual void bindPipelineState(gfx::PipelineState* pso) = 0;
    virtual void bindDescriptorSet(uint32_t set, gfx::DescriptorSet *descriptorSet, uint32_t dynamicOffsetCount, const uint32_t *dynamicOffsets) = 0;
    virtual void bindInputAssembler(gfx::InputAssembler *ia) = 0;
    virtual void updateBuffer(gfx::Buffer *buff, const void *data, uint32_t size) = 0;
    virtual void draw(const gfx::DrawInfo &info) = 0;
};

class SceneTask {
public:
    SceneTask() noexcept = default;
    SceneTask(SceneTask&& rhs)      = delete;
    SceneTask(SceneTask const& rhs) = delete;
    SceneTask& operator=(SceneTask&& rhs) = delete;
    SceneTask& operator=(SceneTask const& rhs) = delete;

    virtual ~SceneTask() noexcept = default;

    virtual TaskType getTaskType() const noexcept = 0;
    virtual void     start() = 0;
    virtual void     join() = 0;
    virtual void     submit() = 0;
};

class SceneTransversal {
public:
    SceneTransversal() noexcept = default;
    SceneTransversal(SceneTransversal&& rhs)      = delete;
    SceneTransversal(SceneTransversal const& rhs) = delete;
    SceneTransversal& operator=(SceneTransversal&& rhs) = delete;
    SceneTransversal& operator=(SceneTransversal const& rhs) = delete;

    virtual ~SceneTransversal() noexcept = default;

    virtual SceneTask* transverse(SceneVisitor *visitor) const = 0;
};

class LayoutGraphBuilder {
public:
    LayoutGraphBuilder() noexcept = default;
    LayoutGraphBuilder(LayoutGraphBuilder&& rhs)      = delete;
    LayoutGraphBuilder(LayoutGraphBuilder const& rhs) = delete;
    LayoutGraphBuilder& operator=(LayoutGraphBuilder&& rhs) = delete;
    LayoutGraphBuilder& operator=(LayoutGraphBuilder const& rhs) = delete;

    virtual ~LayoutGraphBuilder() noexcept = default;

    virtual void clear() = 0;
    virtual uint32_t addRenderStage(const ccstd::string& name) = 0;
    virtual uint32_t addRenderPhase(const ccstd::string& name, uint32_t parentID) = 0;
    virtual void addShader(const ccstd::string& name, uint32_t parentPhaseID) = 0;
    virtual void addDescriptorBlock(uint32_t nodeID, const DescriptorBlockIndex& index, const DescriptorBlockFlattened& block) = 0;
    virtual void addUniformBlock(uint32_t nodeID, const DescriptorBlockIndex& index, const ccstd::string& name, const gfx::UniformBlock& uniformBlock) = 0;
    virtual void reserveDescriptorBlock(uint32_t nodeID, const DescriptorBlockIndex& index, const DescriptorBlockFlattened& block) = 0;
    virtual int compile() = 0;

    virtual ccstd::string print() const = 0;
};

class Pipeline : public PipelineRuntime {
public:
    Pipeline() noexcept = default;

    virtual bool containsResource(const ccstd::string& name) const = 0;
    virtual uint32_t addRenderTexture(const ccstd::string& name, gfx::Format format, uint32_t width, uint32_t height, scene::RenderWindow* renderWindow) = 0;
    virtual uint32_t addRenderTarget(const ccstd::string& name, gfx::Format format, uint32_t width, uint32_t height, ResourceResidency residency) = 0;
    virtual uint32_t addDepthStencil(const ccstd::string& name, gfx::Format format, uint32_t width, uint32_t height, ResourceResidency residency) = 0;

    virtual void beginFrame() = 0;
    virtual void endFrame() = 0;
    virtual RasterPassBuilder *addRasterPass(uint32_t width, uint32_t height, const ccstd::string& layoutName, const ccstd::string& name) = 0;
    virtual RasterPassBuilder *addRasterPass(uint32_t width, uint32_t height, const ccstd::string& layoutName) = 0;
    virtual ComputePassBuilder *addComputePass(const ccstd::string& layoutName, const ccstd::string& name) = 0;
    virtual ComputePassBuilder *addComputePass(const ccstd::string& layoutName) = 0;
    virtual MovePassBuilder *addMovePass(const ccstd::string& name) = 0;
    virtual CopyPassBuilder *addCopyPass(const ccstd::string& name) = 0;
    virtual void presentAll() = 0;

    virtual SceneTransversal *createSceneTransversal(const scene::Camera *camera, const scene::RenderScene *scene) = 0;
    virtual LayoutGraphBuilder *getLayoutGraphBuilder() = 0;
    virtual gfx::DescriptorSetLayout *getDescriptorSetLayout(const ccstd::string& shaderName, UpdateFrequency freq) = 0;
};

class PipelineBuilder {
public:
    PipelineBuilder() noexcept = default;
    PipelineBuilder(PipelineBuilder&& rhs)      = delete;
    PipelineBuilder(PipelineBuilder const& rhs) = delete;
    PipelineBuilder& operator=(PipelineBuilder&& rhs) = delete;
    PipelineBuilder& operator=(PipelineBuilder const& rhs) = delete;

    virtual ~PipelineBuilder() noexcept = default;

    virtual void setup(const ccstd::vector<scene::Camera*>& cameras, Pipeline* pipeline) = 0;
};

class Factory {
public:
    static Pipeline            *createPipeline();
};

} // namespace render

} // namespace cc

// clang-format on
