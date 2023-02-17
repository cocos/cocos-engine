/****************************************************************************
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

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

/**
 * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
 * The following section is auto-generated.
 * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
 */
// clang-format off
#pragma once
#include "cocos/core/assets/EffectAsset.h"
#include "cocos/renderer/core/PassUtils.h"
#include "cocos/renderer/gfx-base/GFXDef-common.h"
#include "cocos/renderer/pipeline/PipelineSceneData.h"
#include "cocos/renderer/pipeline/custom/RenderCommonTypes.h"
#include "cocos/renderer/pipeline/custom/RenderInterfaceFwd.h"
#include "cocos/scene/Camera.h"

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
    PipelineRuntime(PipelineRuntime&& rhs) = delete;
    PipelineRuntime(PipelineRuntime const& rhs) = delete;
    PipelineRuntime& operator=(PipelineRuntime&& rhs) = delete;
    PipelineRuntime& operator=(PipelineRuntime const& rhs) = delete;
    virtual ~PipelineRuntime() noexcept = default;

    virtual bool activate(gfx::Swapchain *swapchain) = 0;
    virtual bool destroy() noexcept = 0;
    virtual void render(const ccstd::vector<scene::Camera*> &cameras) = 0;
    virtual gfx::Device *getDevice() const = 0;
    virtual const MacroRecord &getMacros() const = 0;
    virtual pipeline::GlobalDSManager *getGlobalDSManager() const = 0;
    virtual gfx::DescriptorSetLayout *getDescriptorSetLayout() const = 0;
    virtual gfx::DescriptorSet *getDescriptorSet() const = 0;
    virtual const ccstd::vector<gfx::CommandBuffer*> &getCommandBuffers() const = 0;
    virtual pipeline::PipelineSceneData *getPipelineSceneData() const = 0;
    virtual const ccstd::string &getConstantMacros() const = 0;
    virtual scene::Model *getProfiler() const = 0;
    virtual void setProfiler(scene::Model *profiler) = 0;
    virtual pipeline::GeometryRenderer *getGeometryRenderer() const = 0;
    virtual float getShadingScale() const = 0;
    virtual void setShadingScale(float scale) = 0;
    virtual const ccstd::string &getMacroString(const ccstd::string &name) const = 0;
    virtual int32_t getMacroInt(const ccstd::string &name) const = 0;
    virtual bool getMacroBool(const ccstd::string &name) const = 0;
    virtual void setMacroString(const ccstd::string &name, const ccstd::string &value) = 0;
    virtual void setMacroInt(const ccstd::string &name, int32_t value) = 0;
    virtual void setMacroBool(const ccstd::string &name, bool value) = 0;
    virtual void onGlobalPipelineStateChanged() = 0;
    virtual void setValue(const ccstd::string &name, int32_t value) = 0;
    virtual void setValue(const ccstd::string &name, bool value) = 0;
    virtual bool isOcclusionQueryEnabled() const = 0;
    virtual void resetRenderQueue(bool reset) = 0;
    virtual bool isRenderQueueReset() const = 0;
};

class RenderNode {
public:
    RenderNode() noexcept = default;
    RenderNode(RenderNode&& rhs) = delete;
    RenderNode(RenderNode const& rhs) = delete;
    RenderNode& operator=(RenderNode&& rhs) = delete;
    RenderNode& operator=(RenderNode const& rhs) = delete;
    virtual ~RenderNode() noexcept = default;

    virtual ccstd::string getName() const = 0;
    virtual void setName(const ccstd::string &name) = 0;
};

class Setter : public RenderNode {
public:
    Setter() noexcept = default;

    virtual void setMat4(const ccstd::string &name, const Mat4 &mat) = 0;
    virtual void setQuaternion(const ccstd::string &name, const Quaternion &quat) = 0;
    virtual void setColor(const ccstd::string &name, const gfx::Color &color) = 0;
    virtual void setVec4(const ccstd::string &name, const Vec4 &vec) = 0;
    virtual void setVec2(const ccstd::string &name, const Vec2 &vec) = 0;
    virtual void setFloat(const ccstd::string &name, float v) = 0;
    virtual void setBuffer(const ccstd::string &name, gfx::Buffer *buffer) = 0;
    virtual void setTexture(const ccstd::string &name, gfx::Texture *texture) = 0;
    virtual void setReadWriteBuffer(const ccstd::string &name, gfx::Buffer *buffer) = 0;
    virtual void setReadWriteTexture(const ccstd::string &name, gfx::Texture *texture) = 0;
    virtual void setSampler(const ccstd::string &name, gfx::Sampler *sampler) = 0;
};

class RasterQueueBuilder : public Setter {
public:
    RasterQueueBuilder() noexcept = default;

    virtual void addSceneOfCamera(scene::Camera *camera, LightInfo light, SceneFlags sceneFlags) = 0;
    virtual void addScene(const ccstd::string &name, SceneFlags sceneFlags) = 0;
    virtual void addFullscreenQuad(Material *material, uint32_t passID, SceneFlags sceneFlags) = 0;
    virtual void addCameraQuad(scene::Camera *camera, Material *material, uint32_t passID, SceneFlags sceneFlags) = 0;
    virtual void clearRenderTarget(const ccstd::string &name, const gfx::Color &color) = 0;
    virtual void setViewport(const gfx::Viewport &viewport) = 0;
    void addSceneOfCamera(scene::Camera *camera, LightInfo light) {
        addSceneOfCamera(camera, std::move(light), SceneFlags::NONE);
    }
    void addScene(const ccstd::string &name) {
        addScene(name, SceneFlags::NONE);
    }
    void addFullscreenQuad(Material *material, uint32_t passID) {
        addFullscreenQuad(material, passID, SceneFlags::NONE);
    }
    void addCameraQuad(scene::Camera *camera, Material *material, uint32_t passID) {
        addCameraQuad(camera, material, passID, SceneFlags::NONE);
    }
    void clearRenderTarget(const ccstd::string &name) {
        clearRenderTarget(name, {});
    }
};

class RasterPassBuilder : public Setter {
public:
    RasterPassBuilder() noexcept = default;

    virtual void addRasterView(const ccstd::string &name, const RasterView &view) = 0;
    virtual void addComputeView(const ccstd::string &name, const ComputeView &view) = 0;
    virtual RasterQueueBuilder *addQueue(QueueHint hint) = 0;
    virtual void setViewport(const gfx::Viewport &viewport) = 0;
    virtual void setVersion(const ccstd::string &name, uint64_t version) = 0;
    virtual bool getShowStatistics() const = 0;
    virtual void setShowStatistics(bool enable) = 0;
    RasterQueueBuilder *addQueue() {
        return addQueue(QueueHint::NONE);
    }
};

class ComputeQueueBuilder : public Setter {
public:
    ComputeQueueBuilder() noexcept = default;

    virtual void addDispatch(const ccstd::string &shader, uint32_t threadGroupCountX, uint32_t threadGroupCountY, uint32_t threadGroupCountZ) = 0;
};

class ComputePassBuilder : public Setter {
public:
    ComputePassBuilder() noexcept = default;

    virtual void addComputeView(const ccstd::string &name, const ComputeView &view) = 0;
    virtual ComputeQueueBuilder *addQueue() = 0;
};

class MovePassBuilder : public RenderNode {
public:
    MovePassBuilder() noexcept = default;

    virtual void addPair(const MovePair &pair) = 0;
};

class CopyPassBuilder : public RenderNode {
public:
    CopyPassBuilder() noexcept = default;

    virtual void addPair(const CopyPair &pair) = 0;
};

class SceneVisitor {
public:
    SceneVisitor() noexcept = default;
    SceneVisitor(SceneVisitor&& rhs) = delete;
    SceneVisitor(SceneVisitor const& rhs) = delete;
    SceneVisitor& operator=(SceneVisitor&& rhs) = delete;
    SceneVisitor& operator=(SceneVisitor const& rhs) = delete;
    virtual ~SceneVisitor() noexcept = default;

    virtual const pipeline::PipelineSceneData *getPipelineSceneData() const = 0;
    virtual void setViewport(const gfx::Viewport &vp) = 0;
    virtual void setScissor(const gfx::Rect &rect) = 0;
    virtual void bindPipelineState(gfx::PipelineState *pso) = 0;
    virtual void bindDescriptorSet(uint32_t set, gfx::DescriptorSet *descriptorSet, uint32_t dynamicOffsetCount, const uint32_t *dynamicOffsets) = 0;
    virtual void bindInputAssembler(gfx::InputAssembler *ia) = 0;
    virtual void updateBuffer(gfx::Buffer *buff, const void *data, uint32_t size) = 0;
    virtual void draw(const gfx::DrawInfo &info) = 0;
};

class SceneTask {
public:
    SceneTask() noexcept = default;
    SceneTask(SceneTask&& rhs) = delete;
    SceneTask(SceneTask const& rhs) = delete;
    SceneTask& operator=(SceneTask&& rhs) = delete;
    SceneTask& operator=(SceneTask const& rhs) = delete;
    virtual ~SceneTask() noexcept = default;

    virtual TaskType getTaskType() const noexcept = 0;
    virtual void start() = 0;
    virtual void join() = 0;
    virtual void submit() = 0;
};

class SceneTransversal {
public:
    SceneTransversal() noexcept = default;
    SceneTransversal(SceneTransversal&& rhs) = delete;
    SceneTransversal(SceneTransversal const& rhs) = delete;
    SceneTransversal& operator=(SceneTransversal&& rhs) = delete;
    SceneTransversal& operator=(SceneTransversal const& rhs) = delete;
    virtual ~SceneTransversal() noexcept = default;

    virtual SceneTask *transverse(SceneVisitor *visitor) const = 0;
};

class Pipeline : public PipelineRuntime {
public:
    Pipeline() noexcept = default;

    virtual void beginSetup() = 0;
    virtual void endSetup() = 0;
    virtual bool containsResource(const ccstd::string &name) const = 0;
    virtual uint32_t addRenderTexture(const ccstd::string &name, gfx::Format format, uint32_t width, uint32_t height, scene::RenderWindow *renderWindow) = 0;
    virtual uint32_t addRenderTarget(const ccstd::string &name, gfx::Format format, uint32_t width, uint32_t height, ResourceResidency residency) = 0;
    virtual uint32_t addDepthStencil(const ccstd::string &name, gfx::Format format, uint32_t width, uint32_t height, ResourceResidency residency) = 0;
    virtual void updateRenderWindow(const ccstd::string &name, scene::RenderWindow *renderWindow) = 0;
    virtual void updateRenderTarget(const ccstd::string &name, uint32_t width, uint32_t height, gfx::Format format) = 0;
    virtual void updateDepthStencil(const ccstd::string &name, uint32_t width, uint32_t height, gfx::Format format) = 0;
    virtual void beginFrame() = 0;
    virtual void endFrame() = 0;
    virtual RasterPassBuilder *addRasterPass(uint32_t width, uint32_t height, const ccstd::string &layoutName) = 0;
    virtual ComputePassBuilder *addComputePass(const ccstd::string &layoutName) = 0;
    virtual MovePassBuilder *addMovePass() = 0;
    virtual CopyPassBuilder *addCopyPass() = 0;
    virtual void presentAll() = 0;
    virtual SceneTransversal *createSceneTransversal(const scene::Camera *camera, const scene::RenderScene *scene) = 0;
    virtual gfx::DescriptorSetLayout *getDescriptorSetLayout(const ccstd::string &shaderName, UpdateFrequency freq) = 0;
    uint32_t addRenderTarget(const ccstd::string &name, gfx::Format format, uint32_t width, uint32_t height) {
        return addRenderTarget(name, format, width, height, ResourceResidency::MANAGED);
    }
    uint32_t addDepthStencil(const ccstd::string &name, gfx::Format format, uint32_t width, uint32_t height) {
        return addDepthStencil(name, format, width, height, ResourceResidency::MANAGED);
    }
    void updateRenderTarget(const ccstd::string &name, uint32_t width, uint32_t height) {
        updateRenderTarget(name, width, height, gfx::Format::UNKNOWN);
    }
    void updateDepthStencil(const ccstd::string &name, uint32_t width, uint32_t height) {
        updateDepthStencil(name, width, height, gfx::Format::UNKNOWN);
    }
    RasterPassBuilder *addRasterPass(uint32_t width, uint32_t height) {
        return addRasterPass(width, height, "default");
    }
};

class PipelineBuilder {
public:
    PipelineBuilder() noexcept = default;
    PipelineBuilder(PipelineBuilder&& rhs) = delete;
    PipelineBuilder(PipelineBuilder const& rhs) = delete;
    PipelineBuilder& operator=(PipelineBuilder&& rhs) = delete;
    PipelineBuilder& operator=(PipelineBuilder const& rhs) = delete;
    virtual ~PipelineBuilder() noexcept = default;

    virtual void setup(const ccstd::vector<scene::Camera*> &cameras, Pipeline *pipeline) = 0;
};

class RenderingModule {
public:
    RenderingModule() noexcept = default;
    RenderingModule(RenderingModule&& rhs) = delete;
    RenderingModule(RenderingModule const& rhs) = delete;
    RenderingModule& operator=(RenderingModule&& rhs) = delete;
    RenderingModule& operator=(RenderingModule const& rhs) = delete;
    virtual ~RenderingModule() noexcept = default;

    virtual uint32_t getPassID(const ccstd::string &name) const = 0;
    virtual uint32_t getPhaseID(uint32_t passID, const ccstd::string &name) const = 0;
};

class Factory {
public:
    static RenderingModule* init(gfx::Device* deviceIn, const ccstd::vector<unsigned char>& bufferIn);
    static void destroy(RenderingModule* renderingModule) noexcept;
    static Pipeline *createPipeline();
};

} // namespace render

} // namespace cc

// clang-format on
