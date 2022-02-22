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

class PipelineSceneData;

} // namespace pipeline

} // namespace cc

namespace cc {

namespace render {

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
