/**
 * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
 * The following section is auto-generated.
 * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
 */
// clang-format off
#pragma once
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

namespace pipeline {

class PipelineSceneData;

} // namespace pipeline

} // namespace cc

namespace cc {

namespace render {

class ShaderGroupBuilder {
public:
    ShaderGroupBuilder() noexcept = default;
    ShaderGroupBuilder(ShaderGroupBuilder&& rhs)      = delete;
    ShaderGroupBuilder(ShaderGroupBuilder const& rhs) = delete;
    ShaderGroupBuilder& operator=(ShaderGroupBuilder&& rhs) = delete;
    ShaderGroupBuilder& operator=(ShaderGroupBuilder const& rhs) = delete;

    virtual ~ShaderGroupBuilder() noexcept = 0;

    virtual void addShader() = 0;
};

inline ShaderGroupBuilder::~ShaderGroupBuilder() noexcept = default;

class DescriptorGroupBuilder {
public:
    DescriptorGroupBuilder() noexcept = default;
    DescriptorGroupBuilder(DescriptorGroupBuilder&& rhs)      = delete;
    DescriptorGroupBuilder(DescriptorGroupBuilder const& rhs) = delete;
    DescriptorGroupBuilder& operator=(DescriptorGroupBuilder&& rhs) = delete;
    DescriptorGroupBuilder& operator=(DescriptorGroupBuilder const& rhs) = delete;

    virtual ~DescriptorGroupBuilder() noexcept = 0;

    virtual DescriptorGroupBuilder* addDescriptorGroup(UpdateFrequency update) = 0;
    virtual ShaderGroupBuilder* addShaderGroup(UpdateFrequency update) = 0;
};

inline DescriptorGroupBuilder::~DescriptorGroupBuilder() noexcept = default;

class DescriptorLayout {
public:
    DescriptorLayout() noexcept = default;
    DescriptorLayout(DescriptorLayout&& rhs)      = delete;
    DescriptorLayout(DescriptorLayout const& rhs) = delete;
    DescriptorLayout& operator=(DescriptorLayout&& rhs) = delete;
    DescriptorLayout& operator=(DescriptorLayout const& rhs) = delete;

    virtual ~DescriptorLayout() noexcept = 0;

    virtual DescriptorGroupBuilder* addDescriptorGroup(UpdateFrequency update) = 0;
};

inline DescriptorLayout::~DescriptorLayout() noexcept = default;

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

class RasterQueueBuilder {
public:
    RasterQueueBuilder() noexcept = default;
    RasterQueueBuilder(RasterQueueBuilder&& rhs)      = delete;
    RasterQueueBuilder(RasterQueueBuilder const& rhs) = delete;
    RasterQueueBuilder& operator=(RasterQueueBuilder&& rhs) = delete;
    RasterQueueBuilder& operator=(RasterQueueBuilder const& rhs) = delete;

    virtual ~RasterQueueBuilder() noexcept = 0;

    virtual void addSceneOfCamera(scene::Camera* camera, const std::string& name) = 0;
    virtual void addSceneOfCamera(scene::Camera* camera) = 0;
    virtual void addScene(const std::string& name) = 0;
    virtual void addFullscreenQuad(const std::string& shader, const std::string& name) = 0;
    virtual void addFullscreenQuad(const std::string& shader) = 0;
};

inline RasterQueueBuilder::~RasterQueueBuilder() noexcept = default;

class RasterPassBuilder {
public:
    RasterPassBuilder() noexcept = default;
    RasterPassBuilder(RasterPassBuilder&& rhs)      = delete;
    RasterPassBuilder(RasterPassBuilder const& rhs) = delete;
    RasterPassBuilder& operator=(RasterPassBuilder&& rhs) = delete;
    RasterPassBuilder& operator=(RasterPassBuilder const& rhs) = delete;

    virtual ~RasterPassBuilder() noexcept = 0;

    virtual void addRasterView(const std::string& name, const RasterView& view) = 0;
    virtual void addComputeView(const std::string& name, const ComputeView& view) = 0;
    virtual RasterQueueBuilder* addQueue(QueueHint hint, const std::string& layoutName, const std::string& name) = 0;
    virtual RasterQueueBuilder* addQueue(QueueHint hint, const std::string& layoutName) = 0;
    virtual RasterQueueBuilder* addQueue(QueueHint hint) = 0;
    virtual void addFullscreenQuad(const std::string& shader, const std::string& layoutName, const std::string& name) = 0;
    virtual void addFullscreenQuad(const std::string& shader, const std::string& layoutName) = 0;
    virtual void addFullscreenQuad(const std::string& shader) = 0;
};

inline RasterPassBuilder::~RasterPassBuilder() noexcept = default;

class ComputeQueueBuilder {
public:
    ComputeQueueBuilder() noexcept = default;
    ComputeQueueBuilder(ComputeQueueBuilder&& rhs)      = delete;
    ComputeQueueBuilder(ComputeQueueBuilder const& rhs) = delete;
    ComputeQueueBuilder& operator=(ComputeQueueBuilder&& rhs) = delete;
    ComputeQueueBuilder& operator=(ComputeQueueBuilder const& rhs) = delete;

    virtual ~ComputeQueueBuilder() noexcept = 0;

    virtual void addDispatch(const std::string& shader, uint32_t threadGroupCountX, uint32_t threadGroupCountY, uint32_t threadGroupCountZ, const std::string& layoutName, const std::string& name) = 0;
    virtual void addDispatch(const std::string& shader, uint32_t threadGroupCountX, uint32_t threadGroupCountY, uint32_t threadGroupCountZ, const std::string& layoutName) = 0;
    virtual void addDispatch(const std::string& shader, uint32_t threadGroupCountX, uint32_t threadGroupCountY, uint32_t threadGroupCountZ) = 0;
};

inline ComputeQueueBuilder::~ComputeQueueBuilder() noexcept = default;

class ComputePassBuilder {
public:
    ComputePassBuilder() noexcept = default;
    ComputePassBuilder(ComputePassBuilder&& rhs)      = delete;
    ComputePassBuilder(ComputePassBuilder const& rhs) = delete;
    ComputePassBuilder& operator=(ComputePassBuilder&& rhs) = delete;
    ComputePassBuilder& operator=(ComputePassBuilder const& rhs) = delete;

    virtual ~ComputePassBuilder() noexcept = 0;

    virtual void addComputeView(const std::string& name, const ComputeView& view) = 0;

    virtual ComputeQueueBuilder* addQueue(const std::string& layoutName, const std::string& name) = 0;
    virtual ComputeQueueBuilder* addQueue(const std::string& layoutName) = 0;
    virtual ComputeQueueBuilder* addQueue() = 0;

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

class Pipeline {
public:
    Pipeline() noexcept = default;
    Pipeline(Pipeline&& rhs)      = delete;
    Pipeline(Pipeline const& rhs) = delete;
    Pipeline& operator=(Pipeline&& rhs) = delete;
    Pipeline& operator=(Pipeline const& rhs) = delete;

    virtual ~Pipeline() noexcept = 0;

    virtual uint32_t addRenderTexture(const std::string& name, gfx::Format format, uint32_t width, uint32_t height) = 0;
    virtual uint32_t addRenderTarget(const std::string& name, gfx::Format format, uint32_t width, uint32_t height) = 0;
    virtual uint32_t addDepthStencil(const std::string& name, gfx::Format format, uint32_t width, uint32_t height) = 0;
    virtual void beginFrame(pipeline::PipelineSceneData* pplScene) = 0;
    virtual void endFrame() = 0;
    virtual RasterPassBuilder* addRasterPass(uint32_t width, uint32_t height, const std::string& layoutName, const std::string& name) = 0;
    virtual RasterPassBuilder* addRasterPass(uint32_t width, uint32_t height, const std::string& layoutName) = 0;
    virtual ComputePassBuilder* addComputePass(const std::string& layoutName, const std::string& name) = 0;
    virtual ComputePassBuilder* addComputePass(const std::string& layoutName) = 0;
    virtual MovePassBuilder* addMovePass(const std::string& name) = 0;
    virtual CopyPassBuilder* addCopyPass(const std::string& name) = 0;
};

inline Pipeline::~Pipeline() noexcept = default;

} // namespace render

} // namespace cc

// clang-format on
