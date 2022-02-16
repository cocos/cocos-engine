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
class Size;
class Rect;

} // namespace cc

namespace cc {

namespace render {

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

class RasterQueue {
public:
    RasterQueue() noexcept = default;
    RasterQueue(RasterQueue&& rhs)      = delete;
    RasterQueue(RasterQueue const& rhs) = delete;
    RasterQueue& operator=(RasterQueue&& rhs) = delete;
    RasterQueue& operator=(RasterQueue const& rhs) = delete;

    virtual ~RasterQueue() noexcept = 0;

    virtual void addSceneOfCamera(scene::Camera* camera, const std::string& name) = 0;
    virtual void addSceneOfCamera(scene::Camera* camera) = 0;
    virtual void addScene(const std::string& name) = 0;
    virtual void addFullscreenQuad(const std::string& shader, const std::string& layoutName, const std::string& name) = 0;
    virtual void addFullscreenQuad(const std::string& shader, const std::string& layoutName) = 0;
    virtual void addFullscreenQuad(const std::string& shader) = 0;
};

inline RasterQueue::~RasterQueue() noexcept = default;

class RasterPass {
public:
    RasterPass() noexcept = default;
    RasterPass(RasterPass&& rhs)      = delete;
    RasterPass(RasterPass const& rhs) = delete;
    RasterPass& operator=(RasterPass&& rhs) = delete;
    RasterPass& operator=(RasterPass const& rhs) = delete;

    virtual ~RasterPass() noexcept = 0;

    virtual void addRasterView(const std::string& name, const RasterView& view) = 0;
    virtual void addComputeView(const std::string& name, const ComputeView& view) = 0;
    virtual RasterQueue* addQueue(QueueHint hint, const std::string& layoutName, const std::string& name) = 0;
    virtual RasterQueue* addQueue(QueueHint hint, const std::string& layoutName) = 0;
    virtual RasterQueue* addQueue(QueueHint hint) = 0;
    virtual void addFullscreenQuad(const std::string& shader, const std::string& layoutName, const std::string& name) = 0;
    virtual void addFullscreenQuad(const std::string& shader, const std::string& layoutName) = 0;
    virtual void addFullscreenQuad(const std::string& shader) = 0;
};

inline RasterPass::~RasterPass() noexcept = default;

class ComputeQueue {
public:
    ComputeQueue() noexcept = default;
    ComputeQueue(ComputeQueue&& rhs)      = delete;
    ComputeQueue(ComputeQueue const& rhs) = delete;
    ComputeQueue& operator=(ComputeQueue&& rhs) = delete;
    ComputeQueue& operator=(ComputeQueue const& rhs) = delete;

    virtual ~ComputeQueue() noexcept = 0;

    virtual void addDispatch(const std::string& shader, uint32_t threadGroupCountX, uint32_t threadGroupCountY, uint32_t threadGroupCountZ, const std::string& layoutName, const std::string& name) = 0;
    virtual void addDispatch(const std::string& shader, uint32_t threadGroupCountX, uint32_t threadGroupCountY, uint32_t threadGroupCountZ, const std::string& layoutName) = 0;
    virtual void addDispatch(const std::string& shader, uint32_t threadGroupCountX, uint32_t threadGroupCountY, uint32_t threadGroupCountZ) = 0;
};

inline ComputeQueue::~ComputeQueue() noexcept = default;

class ComputePass {
public:
    ComputePass() noexcept = default;
    ComputePass(ComputePass&& rhs)      = delete;
    ComputePass(ComputePass const& rhs) = delete;
    ComputePass& operator=(ComputePass&& rhs) = delete;
    ComputePass& operator=(ComputePass const& rhs) = delete;

    virtual ~ComputePass() noexcept = 0;

    virtual void addComputeView(const std::string& name, const ComputeView& view) = 0;

    virtual ComputeQueue* addQueue(const std::string& layoutName, const std::string& name) = 0;
    virtual ComputeQueue* addQueue(const std::string& layoutName) = 0;
    virtual ComputeQueue* addQueue() = 0;

    virtual void addDispatch(const std::string& shader, uint32_t threadGroupCountX, uint32_t threadGroupCountY, uint32_t threadGroupCountZ, const std::string& layoutName, const std::string& name) = 0;
    virtual void addDispatch(const std::string& shader, uint32_t threadGroupCountX, uint32_t threadGroupCountY, uint32_t threadGroupCountZ, const std::string& layoutName) = 0;
    virtual void addDispatch(const std::string& shader, uint32_t threadGroupCountX, uint32_t threadGroupCountY, uint32_t threadGroupCountZ) = 0;
};

inline ComputePass::~ComputePass() noexcept = default;

class MovePass {
public:
    MovePass() noexcept = default;
    MovePass(MovePass&& rhs)      = delete;
    MovePass(MovePass const& rhs) = delete;
    MovePass& operator=(MovePass&& rhs) = delete;
    MovePass& operator=(MovePass const& rhs) = delete;

    virtual ~MovePass() noexcept = 0;

    virtual void addPair(const MovePair& pair) = 0;
};

inline MovePass::~MovePass() noexcept = default;

class CopyPass {
public:
    CopyPass() noexcept = default;
    CopyPass(CopyPass&& rhs)      = delete;
    CopyPass(CopyPass const& rhs) = delete;
    CopyPass& operator=(CopyPass&& rhs) = delete;
    CopyPass& operator=(CopyPass const& rhs) = delete;

    virtual ~CopyPass() noexcept = 0;

    virtual void addPair(const CopyPair& pair) = 0;
};

inline CopyPass::~CopyPass() noexcept = default;

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
    virtual void beginFrame() = 0;
    virtual void endFrame() = 0;
    virtual RasterPass* addRasterPass(uint32_t width, uint32_t height, const std::string& layoutName, const std::string& name) = 0;
    virtual RasterPass* addRasterPass(uint32_t width, uint32_t height, const std::string& layoutName) = 0;
    virtual ComputePass* addComputePass(const std::string& layoutName, const std::string& name) = 0;
    virtual ComputePass* addComputePass(const std::string& layoutName) = 0;
    virtual MovePass* addMovePass(const std::string& name) = 0;
    virtual CopyPass* addCopyPass(const std::string& name) = 0;
};

inline Pipeline::~Pipeline() noexcept = default;

} // namespace render

} // namespace cc
