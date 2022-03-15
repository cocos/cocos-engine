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
#include "cocos/core/assets/EffectAsset.h"
#include "cocos/renderer/gfx-base/GFXDef-common.h"
#include "cocos/renderer/pipeline/custom/RenderGraphTypes.h"
#include "cocos/renderer/pipeline/custom/RenderInterfaceFwd.h"

namespace cc {

class Mat4;
class Mat4;
class Quaternion;
class Color;
class Vec4;
class Vec3;
class Vec2;

class EffectAsset;

namespace pipeline {

class GlobalDSManager;
class PipelineSceneData;

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

    virtual ~PipelineRuntime() noexcept = 0;

    virtual bool activate(gfx::Swapchain * swapchain) = 0;
    virtual bool destroy() noexcept = 0;
    virtual void render(const std::vector<scene::Camera*>& cameras) = 0;

    virtual const MacroRecord           &getMacros() const = 0;
    virtual pipeline::GlobalDSManager   *getGlobalDSManager() const = 0;
    virtual gfx::DescriptorSetLayout    *getDescriptorSetLayout() const = 0;
    virtual pipeline::PipelineSceneData *getPipelineSceneData() const = 0;
    virtual const std::string           &getConstantMacros() const = 0;
    virtual scene::Model                *getProfiler() const = 0;
    virtual void                         setProfiler(scene::Model *profiler) = 0;

    virtual float getShadingScale() const = 0;
    virtual void  setShadingScale(float scale) = 0;

    virtual void onGlobalPipelineStateChanged() = 0;
};

inline PipelineRuntime::~PipelineRuntime() noexcept = default;

class DescriptorHierarchy {
public:
    DescriptorHierarchy() noexcept = default;
    DescriptorHierarchy(DescriptorHierarchy&& rhs)      = delete;
    DescriptorHierarchy(DescriptorHierarchy const& rhs) = delete;
    DescriptorHierarchy& operator=(DescriptorHierarchy&& rhs) = delete;
    DescriptorHierarchy& operator=(DescriptorHierarchy const& rhs) = delete;

    virtual ~DescriptorHierarchy() noexcept = 0;

    virtual void addEffect(EffectAsset* asset) = 0;
};

inline DescriptorHierarchy::~DescriptorHierarchy() noexcept = default;

class Setter {
public:
    Setter() noexcept = default;
    Setter(Setter&& rhs)      = delete;
    Setter(Setter const& rhs) = delete;
    Setter& operator=(Setter&& rhs) = delete;
    Setter& operator=(Setter const& rhs) = delete;

    virtual ~Setter() noexcept = 0;

    virtual void setMat4(const std::string& name, const cc::Mat4& mat) = 0;
    virtual void setQuaternion(const std::string& name, const cc::Quaternion& quat) = 0;
    virtual void setColor(const std::string& name, const cc::Color& color) = 0;
    virtual void setVec4(const std::string& name, const cc::Vec4& vec) = 0;
    virtual void setVec2(const std::string& name, const cc::Vec2& vec) = 0;
    virtual void setFloat(const std::string& name, float v) = 0;

    virtual void setBuffer(const std::string& name, gfx::Buffer* buffer) = 0;
    virtual void setTexture(const std::string& name, gfx::Texture* texture) = 0;
    virtual void setReadWriteBuffer(const std::string& name, gfx::Buffer* buffer) = 0;
    virtual void setReadWriteTexture(const std::string& name, gfx::Texture* texture) = 0;
    virtual void setSampler(const std::string& name, gfx::Sampler* sampler) = 0;
};

inline Setter::~Setter() noexcept = default;

class RasterQueueBuilder : public Setter {
public:
    RasterQueueBuilder() noexcept = default;

    ~RasterQueueBuilder() noexcept override = 0;

    virtual void addSceneOfCamera(scene::Camera* camera, const std::string& name) = 0;
    virtual void addSceneOfCamera(scene::Camera* camera) = 0;
    virtual void addScene(const std::string& name) = 0;
    virtual void addFullscreenQuad(const std::string& shader, const std::string& name) = 0;
    virtual void addFullscreenQuad(const std::string& shader) = 0;
};

inline RasterQueueBuilder::~RasterQueueBuilder() noexcept = default;

class RasterPassBuilder : public Setter {
public:
    RasterPassBuilder() noexcept = default;

    ~RasterPassBuilder() noexcept override = 0;

    virtual void                addRasterView(const std::string& name, const RasterView& view) = 0;
    virtual void                addComputeView(const std::string& name, const ComputeView& view) = 0;
    virtual RasterQueueBuilder *addQueue(QueueHint hint, const std::string& layoutName, const std::string& name) = 0;
    virtual RasterQueueBuilder *addQueue(QueueHint hint, const std::string& layoutName) = 0;
    virtual RasterQueueBuilder *addQueue(QueueHint hint) = 0;
    virtual void                addFullscreenQuad(const std::string& shader, const std::string& layoutName, const std::string& name) = 0;
    virtual void                addFullscreenQuad(const std::string& shader, const std::string& layoutName) = 0;
    virtual void                addFullscreenQuad(const std::string& shader) = 0;
};

inline RasterPassBuilder::~RasterPassBuilder() noexcept = default;

class ComputeQueueBuilder : public Setter {
public:
    ComputeQueueBuilder() noexcept = default;

    ~ComputeQueueBuilder() noexcept override = 0;

    virtual void addDispatch(const std::string& shader, uint32_t threadGroupCountX, uint32_t threadGroupCountY, uint32_t threadGroupCountZ, const std::string& layoutName, const std::string& name) = 0;
    virtual void addDispatch(const std::string& shader, uint32_t threadGroupCountX, uint32_t threadGroupCountY, uint32_t threadGroupCountZ, const std::string& layoutName) = 0;
    virtual void addDispatch(const std::string& shader, uint32_t threadGroupCountX, uint32_t threadGroupCountY, uint32_t threadGroupCountZ) = 0;
};

inline ComputeQueueBuilder::~ComputeQueueBuilder() noexcept = default;

class ComputePassBuilder : public Setter {
public:
    ComputePassBuilder() noexcept = default;

    ~ComputePassBuilder() noexcept override = 0;

    virtual void addComputeView(const std::string& name, const ComputeView& view) = 0;

    virtual ComputeQueueBuilder *addQueue(const std::string& layoutName, const std::string& name) = 0;
    virtual ComputeQueueBuilder *addQueue(const std::string& layoutName) = 0;
    virtual ComputeQueueBuilder *addQueue() = 0;

    virtual void addDispatch(const std::string& shader, uint32_t threadGroupCountX, uint32_t threadGroupCountY, uint32_t threadGroupCountZ, const std::string& layoutName, const std::string& name) = 0;
    virtual void addDispatch(const std::string& shader, uint32_t threadGroupCountX, uint32_t threadGroupCountY, uint32_t threadGroupCountZ, const std::string& layoutName) = 0;
    virtual void addDispatch(const std::string& shader, uint32_t threadGroupCountX, uint32_t threadGroupCountY, uint32_t threadGroupCountZ) = 0;
};

inline ComputePassBuilder::~ComputePassBuilder() noexcept = default;

class MovePassBuilder {
public:
    MovePassBuilder() noexcept = default;
    MovePassBuilder(MovePassBuilder&& rhs)      = delete;
    MovePassBuilder(MovePassBuilder const& rhs) = delete;
    MovePassBuilder& operator=(MovePassBuilder&& rhs) = delete;
    MovePassBuilder& operator=(MovePassBuilder const& rhs) = delete;

    virtual ~MovePassBuilder() noexcept = 0;

    virtual void addPair(const MovePair& pair) = 0;
};

inline MovePassBuilder::~MovePassBuilder() noexcept = default;

class CopyPassBuilder {
public:
    CopyPassBuilder() noexcept = default;
    CopyPassBuilder(CopyPassBuilder&& rhs)      = delete;
    CopyPassBuilder(CopyPassBuilder const& rhs) = delete;
    CopyPassBuilder& operator=(CopyPassBuilder&& rhs) = delete;
    CopyPassBuilder& operator=(CopyPassBuilder const& rhs) = delete;

    virtual ~CopyPassBuilder() noexcept = 0;

    virtual void addPair(const CopyPair& pair) = 0;
};

inline CopyPassBuilder::~CopyPassBuilder() noexcept = default;

class SceneVisitor {
public:
    SceneVisitor() noexcept = default;
    SceneVisitor(SceneVisitor&& rhs)      = delete;
    SceneVisitor(SceneVisitor const& rhs) = delete;
    SceneVisitor& operator=(SceneVisitor&& rhs) = delete;
    SceneVisitor& operator=(SceneVisitor const& rhs) = delete;

    virtual ~SceneVisitor() noexcept = 0;

    virtual void setViewport(const gfx::Viewport &vp) = 0;
    virtual void setScissor(const gfx::Rect &rect) = 0;
    virtual void bindPipelineState(gfx::PipelineState* pso) = 0;
    virtual void bindDescriptorSet(uint32_t set, gfx::DescriptorSet *descriptorSet, uint32_t dynamicOffsetCount, const uint32_t *dynamicOffsets) = 0;
    virtual void bindInputAssembler(gfx::InputAssembler *ia) = 0;
    virtual void updateBuffer(gfx::Buffer *buff, const void *data, uint32_t size) = 0;
    virtual void draw(const gfx::DrawInfo &info) = 0;
};

inline SceneVisitor::~SceneVisitor() noexcept = default;

class SceneTask {
public:
    SceneTask() noexcept = default;
    SceneTask(SceneTask&& rhs)      = delete;
    SceneTask(SceneTask const& rhs) = delete;
    SceneTask& operator=(SceneTask&& rhs) = delete;
    SceneTask& operator=(SceneTask const& rhs) = delete;

    virtual ~SceneTask() noexcept = 0;

    virtual TaskType getTaskType() const noexcept = 0;
    virtual void     start() = 0;
    virtual void     join() = 0;
    virtual void     submit() = 0;
};

inline SceneTask::~SceneTask() noexcept = default;

class SceneTransversal {
public:
    SceneTransversal() noexcept = default;
    SceneTransversal(SceneTransversal&& rhs)      = delete;
    SceneTransversal(SceneTransversal const& rhs) = delete;
    SceneTransversal& operator=(SceneTransversal&& rhs) = delete;
    SceneTransversal& operator=(SceneTransversal const& rhs) = delete;

    virtual ~SceneTransversal() noexcept = 0;

    virtual SceneTask* transverse(SceneVisitor *visitor) const = 0;
};

inline SceneTransversal::~SceneTransversal() noexcept = default;

class Pipeline : public PipelineRuntime {
public:
    Pipeline() noexcept = default;

    ~Pipeline() noexcept override = 0;

    virtual uint32_t            addRenderTexture(const std::string& name, gfx::Format format, uint32_t width, uint32_t height, scene::RenderWindow* renderWindow) = 0;
    virtual uint32_t            addRenderTarget(const std::string& name, gfx::Format format, uint32_t width, uint32_t height, ResourceResidency residency) = 0;
    virtual uint32_t            addDepthStencil(const std::string& name, gfx::Format format, uint32_t width, uint32_t height, ResourceResidency residency) = 0;
    virtual void                beginFrame() = 0;
    virtual void                endFrame() = 0;
    virtual RasterPassBuilder  *addRasterPass(uint32_t width, uint32_t height, const std::string& layoutName, const std::string& name) = 0;
    virtual RasterPassBuilder  *addRasterPass(uint32_t width, uint32_t height, const std::string& layoutName) = 0;
    virtual ComputePassBuilder *addComputePass(const std::string& layoutName, const std::string& name) = 0;
    virtual ComputePassBuilder *addComputePass(const std::string& layoutName) = 0;
    virtual MovePassBuilder    *addMovePass(const std::string& name) = 0;
    virtual CopyPassBuilder    *addCopyPass(const std::string& name) = 0;
    virtual void                addPresentPass(const std::string& name, const std::string& swapchainName) = 0;

    virtual SceneTransversal *createSceneTransversal(const scene::Camera *camera, const scene::RenderScene *scene) = 0;
};

inline Pipeline::~Pipeline() noexcept = default;

class Factory {
public:
    static Pipeline            *createPipeline();
    static DescriptorHierarchy *createDescriptorHierarchy();
};

} // namespace render

} // namespace cc

// clang-format on
