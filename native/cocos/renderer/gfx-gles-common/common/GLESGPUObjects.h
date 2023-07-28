#pragma once

#include <memory>
#include "base/Ptr.h"
#include "gfx-base/GFXDeviceObject.h"
#include "gfx-gles-common/egl/Surface.h"
#include "gfx-gles-common/common/GLESBase.h"

namespace cc::gfx {

struct GLESGPUBuffer : public GFXDeviceObject<DefaultDeleter> {
    GLESGPUBuffer() = default;
    ~GLESGPUBuffer() override;

    BufferUsage usage = BufferUsage::NONE;
    MemoryUsage memUsage = MemoryUsage::NONE;
    uint32_t size = 0;
    GLuint glBuffer = 0;
    GLenum glUsage = 0;
    uint32_t lastUpdateFrame = (~0U);
    std::unique_ptr<uint8_t[]> buffer;
};

struct GLESGPUBufferView : public GFXDeviceObject<DefaultDeleter> {
    IntrusivePtr<GLESGPUBuffer> gpuBuffer;
    GLuint offset = 0;
    GLuint range = 0;
    uint32_t stride = 0;
};

using GLESGPUBufferViewList = ccstd::vector<ConstPtr<GLESGPUBufferView>>;

struct GLESGPUSwapchain;
struct GLESGPUTexture : public GFXDeviceObject<DefaultDeleter> {
    GLESGPUTexture() = default;
    ~GLESGPUTexture() override;

    TextureType type{TextureType::TEX2D};
    Format format{Format::UNKNOWN};
    TextureUsage usage{TextureUsageBit::NONE};
    uint32_t width{0};
    uint32_t height{0};
    uint32_t depth{1};
    uint32_t size{0};
    uint32_t arrayLayer{1};
    uint32_t mipLevel{1};
    TextureFlags flags{TextureFlagBit::NONE};

    bool immutable{true};
    bool isPowerOf2{false};
    bool useRenderBuffer{false};
    bool memoryAllocated{true}; // false if swapchain image or implicit ms render buffer.

    GLenum glInternalFmt{0};
    GLenum glFormat{0};
    GLenum glType{0};
    GLenum glUsage{0};
    GLint glSamples{0};
    GLuint glTexture{0};
    GLuint glRenderbuffer{0};
    GLenum glTarget = GL_NONE;

    // for gles2
    GLenum glWrapS{0};
    GLenum glWrapT{0};
    GLenum glMinFilter{0};
    GLenum glMagFilter{0};

    GLESGPUSwapchain *swapchain{nullptr};
};

struct GLESGPUTextureView : public GFXDeviceObject<DefaultDeleter> {
    IntrusivePtr<GLESGPUTexture> texture;
    TextureType type = TextureType::TEX2D;
    Format format = Format::UNKNOWN;
    uint32_t baseLevel = 0U;
    uint32_t levelCount = 1U;
    uint32_t baseLayer = 0U;
    uint32_t layerCount = 1U;
};
using GLESGPUTextureViewList = ccstd::vector<ConstPtr<GLESGPUTextureView>>;

struct GLESGPUSwapchain : public GFXDeviceObject<DefaultDeleter> {
#if CC_SWAPPY_ENABLED
    bool swappyEnabled{false};
#endif
    IntrusivePtr<egl::Surface> surface;
    EGLint eglSwapInterval{0};
    IntrusivePtr<GLESGPUTexture> gpuColorTexture;
};

struct GLESGPUSampler : public GFXDeviceObject<DefaultDeleter> {
    GLESGPUSampler() = default;
    ~GLESGPUSampler() override;

    Filter minFilter = Filter::NONE;
    Filter magFilter = Filter::NONE;
    Filter mipFilter = Filter::NONE;
    Address addressU = Address::CLAMP;
    Address addressV = Address::CLAMP;
    Address addressW = Address::CLAMP;

    GLenum glMinFilter = 0;
    GLenum glMagFilter = 0;
    GLenum glWrapS = 0;
    GLenum glWrapT = 0;
    GLenum glWrapR = 0;

    float minLod = 0.F;
    float maxLod = 16.F;

    GLuint glSampler = 0;
};

using DrawBuffer = ccstd::vector<GLenum>;
struct GLESGPURenderPass : public GFXDeviceObject<DefaultDeleter> {
    ColorAttachmentList colorAttachments;
    DepthStencilAttachment depthStencilAttachment;
    DepthStencilAttachment depthStencilResolveAttachment;
    SubpassInfoList subpasses;
    SubpassDependencyList dependencies;

    ccstd::vector<uint32_t> colors;
    ccstd::vector<uint32_t> resolves;
    uint32_t depthStencil = INVALID_BINDING;
    uint32_t depthStencilResolve = INVALID_BINDING;
    ccstd::vector<uint32_t> indices; // offsets to GL_COLOR_ATTACHMENT_0
    ccstd::vector<DrawBuffer> drawBuffers;
};

struct GLESGPUAttribute {
    ccstd::string name;
    GLuint glBuffer = 0;
    GLenum glType = 0;
    uint32_t size = 0;
    uint32_t count = 0;
    uint32_t stride = 1;
    uint32_t componentCount = 1;
    bool isNormalized = false;
    bool isInstanced = false;
    uint32_t offset = 0;
};
using GLESGPUAttributeList = ccstd::vector<GLESGPUAttribute>;

struct GLESGPUInputAssembler : public GFXDeviceObject<DefaultDeleter> {
    GLESGPUInputAssembler() = default;
    ~GLESGPUInputAssembler() override = default;

    // vao can not be shared cross context.
    using VAOList = ccstd::array<GLuint, MAX_CONTEXT_NUM>;
    using VAOMap = ccstd::unordered_map<uint32_t, VAOList>;
    VAOMap vaoMap;

    AttributeList attributes;
    GLESGPUAttributeList glAttribs;

    GLESGPUBufferViewList gpuVertexBuffers;
    IntrusivePtr<GLESGPUBufferView> gpuIndexBuffer;
    IntrusivePtr<GLESGPUBufferView> gpuIndirectBuffer; // deprecated future.
    GLenum glIndexType = 0;
};

struct GLESGPUSwapchain;
struct GLESGPUFramebufferObject {
    using Reference = std::pair<ConstPtr<GLESGPUTextureView>, GLint>;

    GLuint handle[MAX_CONTEXT_NUM]{0}; // fbo can not be shared cross context.
    GLESGPUSwapchain *swapchain{nullptr}; // weak reference

    ccstd::vector<Reference> colors;
    Reference depthStencil{nullptr, 1};
    GLenum dsAttachment{GL_NONE};

    ccstd::vector<GLenum> loadInvalidates;
    ccstd::vector<GLenum> storeInvalidates;
};

struct GLESGPUFramebuffer : public GFXDeviceObject<DefaultDeleter> {
    GLESGPUFramebuffer() = default;
    ~GLESGPUFramebuffer() override = default;

    ConstPtr<GLESGPURenderPass> gpuRenderPass;
    GLESGPUTextureViewList gpuColorViews;
    ConstPtr<GLESGPUTextureView> gpuDepthStencilView;
    ConstPtr<GLESGPUTextureView> gpuDepthStencilResolveView;

    uint32_t width{UINT_MAX};
    uint32_t height{UINT_MAX};
    bool needResolve = false;
    GLbitfield dsResolveMask = 0;
    std::vector<std::pair<uint32_t, uint32_t>> colorBlitPairs;
    GLESGPUFramebufferObject framebuffer;
    GLESGPUFramebufferObject resolveFramebuffer;
};

struct GLESGPUBinding {
    DescriptorType type = DescriptorType::UNKNOWN;
    uint32_t binding    = 0;  // current binding
    uint32_t count      = 0;  // current descriptor count
};

struct GLESGPUDescriptorSetLayout : public GFXDeviceObject<DefaultDeleter> {
    ccstd::vector<GLESGPUBinding> bindings;
    uint32_t descriptorCount = 0U; // quick look at descriptor count;
    ccstd::hash_t hash = 0U;
};

struct GLESGPUPipelineLayout : public GFXDeviceObject<DefaultDeleter> {
    ccstd::vector<IntrusivePtr<GLESGPUDescriptorSetLayout>> setLayouts;
    uint32_t descriptorCount = 0;
    ccstd::hash_t hash = 0U;
};

struct GLESGPUDescriptor {
    DescriptorType type = DescriptorType::UNKNOWN;
    IntrusivePtr<GLESGPUBufferView> gpuBufferView;
    IntrusivePtr<GLESGPUTextureView> gpuTextureView;
    IntrusivePtr<GLESGPUSampler> gpuSampler;
};
using GLESGPUDescriptorList = ccstd::vector<GLESGPUDescriptor>;
struct GLESGPUDescriptorSet : public GFXDeviceObject<DefaultDeleter> {
    GLESGPUDescriptorList gpuDescriptors;
    ConstPtr<GLESGPUDescriptorSetLayout> layout;
};

struct GLESGPUInput {
    ccstd::string name;
    GLsizei glLength = 0;
    GLint glSize = 0;
    GLenum glType = 0;
    GLint glLoc = -1;
};

struct GLESGPUShader : public GFXDeviceObject<DefaultDeleter> {
    GLESGPUShader() = default;
    ~GLESGPUShader() override;

    struct Stage {
        ccstd::string source;
        ShaderStageFlagBit type;
        GLuint glShader;
    };
    ccstd::string name;
    ccstd::vector<Stage> stages;
    GLuint glProgram = 0;
    ccstd::hash_t hash = INVALID_SHADER_HASH;

    UniformBlockList blocks;
    UniformStorageBufferList buffers;
    UniformSamplerTextureList samplerTextures;
    UniformStorageImageList images;
};

struct GLESGPUPipelineState : public GFXDeviceObject<DefaultDeleter> {
    GLESGPUPipelineState() = default;
    ~GLESGPUPipelineState() override;

    struct DescriptorIndex {
        union {
            uint32_t binding;
            uint32_t unit;
        };
    };

    RasterizerState rs;
    DepthStencilState dss;
    BlendState bs;
    DynamicStateList dynamicStates;
    uint32_t subpassIndex = 0;

    PrimitiveMode primitive = PrimitiveMode::TRIANGLE_LIST;
    GLenum glPrimitive = GL_TRIANGLES;
    IntrusivePtr<GLESGPUShader>         gpuShader;
    IntrusivePtr<GLESGPURenderPass>     gpuRenderPass;
    IntrusivePtr<GLESGPUPipelineLayout> gpuPipelineLayout;

    uint32_t inputHash = 0;
    // bind states
    std::vector<GLESGPUInput> attributes;
    std::vector<DescriptorIndex> descriptorIndices; // binding or location
    std::vector<uint32_t> descriptorOffsets;        // set offset to descriptors [set, offset]
};

struct GLESGPUGeneralBarrier {
    AccessFlags prevAccesses = AccessFlagBit::NONE;
    AccessFlags nextAccesses = AccessFlagBit::NONE;

    GLbitfield glBarriers = 0U;
    GLbitfield glBarriersByRegion = 0U;
};

struct GLESGPUProgramBinary : public GFXDeviceObject<DefaultDeleter> {
    ccstd::string name;
    ccstd::hash_t hash = 0;
    GLenum format;
    std::vector<char> data;
};

struct GLESGPUFence : public GFXDeviceObject<DefaultDeleter> {
    GLsync sync = nullptr;
};

} // namespace cc::gfx
