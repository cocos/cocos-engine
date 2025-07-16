/****************************************************************************
 Copyright (c) 2019-2023 Xiamen Yaji Software Co., Ltd.
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

#include <algorithm>
#include <unordered_map>

#include "base/Macros.h"
#include "base/std/container/unordered_map.h"
#include "gfx-base/GFXDef-common.h"
#include "gfx-base/GFXDef.h"
#include "gfx-base/GFXDeviceObject.h"
#include "gfx-gles-common/GLESCommandPool.h"

#include "GLES3Std.h"
#include "GLES3Wrangler.h"
namespace cc {
namespace gfx {

struct GLES3GPUConstantRegistry {
    size_t currentBoundThreadID{0U};
    uint32_t glMinorVersion{0U};

    MSRTSupportLevel mMSRT{MSRTSupportLevel::NONE};
    FBFSupportLevel mFBF{FBFSupportLevel::NONE};
    bool debugMarker = false;
};

class GLES3GPUStateCache;
struct GLES3GPUSwapchain;
class GLES3GPUContext final {
public:
    bool initialize(GLES3GPUStateCache *stateCache, GLES3GPUConstantRegistry *constantRegistry);
    void destroy();

    EGLint eglMajorVersion{0};
    EGLint eglMinorVersion{0};
    EGLDisplay eglDisplay{EGL_NO_DISPLAY};
    EGLConfig eglConfig{nullptr};
    ccstd::vector<EGLint> eglAttributes;

    EGLSurface eglDefaultSurface{EGL_NO_SURFACE};
    EGLContext eglDefaultContext{EGL_NO_CONTEXT};

    // pass nullptr to keep the current surface
    void makeCurrent(const GLES3GPUSwapchain *drawSwapchain = nullptr, const GLES3GPUSwapchain *readSwapchain = nullptr);
    void bindContext(bool bound); // for context switching between threads

    void present(const GLES3GPUSwapchain *swapchain);

    inline bool checkExtension(const ccstd::string &extension) const {
        return std::find(_extensions.begin(), _extensions.end(), extension) != _extensions.end();
    }

private:
    bool makeCurrent(EGLSurface drawSurface, EGLSurface readSurface, EGLContext context, bool updateCache = true);
    EGLContext getSharedContext();
    void resetStates() const;

    // state caches
    EGLSurface _eglCurrentDrawSurface{EGL_NO_SURFACE};
    EGLSurface _eglCurrentReadSurface{EGL_NO_SURFACE};
    EGLContext _eglCurrentContext{EGL_NO_CONTEXT};
    EGLint _eglCurrentInterval{0};

    GLES3GPUStateCache *_stateCache{nullptr};
    GLES3GPUConstantRegistry *_constantRegistry{nullptr};

    ccstd::unordered_map<size_t, EGLContext> _sharedContexts;

    ccstd::vector<ccstd::string> _extensions;
};

class GLES3GPUQueryPool final {
public:
    QueryType type{QueryType::OCCLUSION};
    uint32_t maxQueryObjects{0};
    bool forceWait{true};
    ccstd::vector<GLuint> glQueryIds;

    inline GLuint mapGLQueryId(uint32_t queryId) {
        if (queryId < maxQueryObjects) {
            return glQueryIds[queryId];
        }

        return UINT_MAX;
    }
};

struct GLES3GPUBuffer {
    BufferUsage usage = BufferUsage::NONE;
    MemoryUsage memUsage = MemoryUsage::NONE;
    uint32_t size = 0;
    uint32_t stride = 0;
    uint32_t count = 0;
    GLenum glTarget = 0;
    GLuint glBuffer = 0;
    GLuint glOffset = 0;
    uint8_t *buffer = nullptr;
    DrawInfoList indirects;
};
using GLES3GPUBufferList = ccstd::vector<GLES3GPUBuffer *>;

struct GLES3GPUTexture {
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
    GLenum glWrapS{0};
    GLenum glWrapT{0};
    GLenum glMinFilter{0};
    GLenum glMagFilter{0};
    GLES3GPUSwapchain *swapchain{nullptr};
};

struct GLES3GPUTextureView {
    GLES3GPUTexture *gpuTexture{nullptr};
    TextureType type = TextureType::TEX2D;
    Format format = Format::UNKNOWN;
    uint32_t baseLevel = 0U;
    uint32_t levelCount = 1U;
    uint32_t baseLayer = 0U;
    uint32_t layerCount = 1U;
    uint32_t basePlane = 0U;
    uint32_t planeCount = 0U;
    GLenum glTarget{0};
};

using GLES3GPUTextureViewList = ccstd::vector<GLES3GPUTextureView *>;

struct GLES3GPUSwapchain {
#if CC_SWAPPY_ENABLED
    bool swappyEnabled{false};
#endif
    EGLSurface eglSurface{EGL_NO_SURFACE};
    EGLint eglSwapInterval{0};
    GLuint glFramebuffer{0};
    GLES3GPUTexture *gpuColorTexture{nullptr};
    bool isXR{false};
};

class GLES3GPUSampler final {
public:
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

    ~GLES3GPUSampler() {
        ccstd::vector<GLuint> glSampelrs;
        for (const auto &pair : _cache) {
            glSampelrs.push_back(pair.second);
        }
        GL_CHECK(glDeleteSamplers(static_cast<GLsizei>(glSampelrs.size()), glSampelrs.data()));
    }

    GLuint getGLSampler(uint16_t minLod, uint16_t maxLod);

private:
    ccstd::unordered_map<uint32_t, GLuint> _cache;
};

struct GLES3GPUInput {
    uint32_t binding = 0;
    ccstd::string name;
    Type type = Type::UNKNOWN;
    uint32_t stride = 0;
    uint32_t count = 0;
    uint32_t size = 0;
    GLenum glType = 0;
    GLint glLoc = -1;
};
using GLES3GPUInputList = ccstd::vector<GLES3GPUInput>;

struct GLES3GPUUniform {
    uint32_t binding = INVALID_BINDING;
    ccstd::string name;
    Type type = Type::UNKNOWN;
    uint32_t stride = 0;
    uint32_t count = 0;
    uint32_t size = 0;
    uint32_t offset = 0;
    GLenum glType = 0;
    GLint glLoc = -1;
};
using GLES3GPUUniformList = ccstd::vector<GLES3GPUUniform>;

struct GLES3GPUUniformBuffer {
    uint32_t set = INVALID_BINDING;
    uint32_t binding = INVALID_BINDING;
    ccstd::string name;
    uint32_t size = 0;
    uint32_t glBinding = 0xffffffff;
    bool isStorage = false;
};
using GLES3GPUUniformBufferList = ccstd::vector<GLES3GPUUniformBuffer>;

struct GLES3GPUUniformSamplerTexture {
    uint32_t set = 0;
    uint32_t binding = 0;
    ccstd::string name;
    Type type = Type::UNKNOWN;
    uint32_t count = 0U;

    ccstd::vector<GLint> units;
    GLenum glType = 0;
    GLint glLoc = -1;
};
using GLES3GPUUniformSamplerTextureList = ccstd::vector<GLES3GPUUniformSamplerTexture>;

struct GLES3GPUUniformStorageImage {
    uint32_t set = 0;
    uint32_t binding = 0;
    ccstd::string name;
    Type type = Type::UNKNOWN;
    uint32_t count = 0U;

    ccstd::vector<int> units;
    GLenum glMemoryAccess = GL_READ_WRITE;
    GLint glLoc = -1;
};
using GLES3GPUUniformStorageImageList = ccstd::vector<GLES3GPUUniformStorageImage>;

struct GLES3GPUShaderStage {
    GLES3GPUShaderStage(ShaderStageFlagBit t, ccstd::string s, GLuint shader = 0)
    : type(t),
      source(std::move(std::move(s))),
      glShader(shader) {}
    ShaderStageFlagBit type;
    ccstd::string source;
    GLuint glShader = 0;
};
using GLES3GPUShaderStageList = ccstd::vector<GLES3GPUShaderStage>;

struct GLES3GPUShader {
    ccstd::string name;
    UniformBlockList blocks;
    UniformStorageBufferList buffers;
    UniformSamplerTextureList samplerTextures;
    UniformSamplerList samplers;
    UniformTextureList textures;
    UniformStorageImageList images;
    UniformInputAttachmentList subpassInputs;

    GLES3GPUShaderStageList gpuStages;
    GLuint glProgram = 0;
    ccstd::hash_t hash = INVALID_SHADER_HASH;
    GLES3GPUInputList glInputs;
    GLES3GPUUniformBufferList glBuffers;
    GLES3GPUUniformSamplerTextureList glSamplerTextures;
    GLES3GPUUniformStorageImageList glImages;
};

struct GLES3GPUAttribute {
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
using GLES3GPUAttributeList = ccstd::vector<GLES3GPUAttribute>;

struct GLES3GPUInputAssembler {
    AttributeList attributes;
    GLES3GPUBufferList gpuVertexBuffers;
    GLES3GPUBuffer *gpuIndexBuffer = nullptr;
    GLES3GPUBuffer *gpuIndirectBuffer = nullptr;
    GLES3GPUAttributeList glAttribs;
    GLenum glIndexType = 0;
    ccstd::unordered_map<size_t, GLuint> glVAOs;
};

struct GLES3GPUGeneralBarrier {
    AccessFlags prevAccesses = AccessFlagBit::NONE;
    AccessFlags nextAccesses = AccessFlagBit::NONE;

    GLbitfield glBarriers = 0U;
    GLbitfield glBarriersByRegion = 0U;
};

using DrawBuffer = ccstd::vector<GLenum>;
struct GLES3GPURenderPass {
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

class GLES3GPUFramebufferCacheMap;
struct GLES3GPUFramebufferObject {
    void initialize(GLES3GPUSwapchain *swc = nullptr);

    void bindColor(const GLES3GPUTextureView *texture, uint32_t colorIndex, const ColorAttachment &attachment);
    void bindColorMultiSample(const GLES3GPUTextureView *texture, uint32_t colorIndex, GLint samples, const ColorAttachment &attachment);
    void bindDepthStencil(const GLES3GPUTextureView *texture, const DepthStencilAttachment &attachment);
    void bindDepthStencilMultiSample(const GLES3GPUTextureView *texture, GLint samples, const DepthStencilAttachment &attachment);

    bool isActive() const;
    void finalize(GLES3GPUStateCache *cache);
    void processLoad(GLenum target);
    void processStore(GLenum target);
    void destroy(GLES3GPUStateCache *cache, GLES3GPUFramebufferCacheMap *framebufferCacheMap);
    GLuint getHandle() const { return swapchain != nullptr ? swapchain->glFramebuffer : handle; }

    using Reference = std::pair<const GLES3GPUTextureView*, GLint>;

    GLES3GPUSwapchain *swapchain{nullptr};

    ccstd::vector<Reference> colors;
    Reference depthStencil{nullptr, 1};
    GLenum dsAttachment{GL_NONE};

    ccstd::vector<GLenum> loadInvalidates;
    ccstd::vector<GLenum> storeInvalidates;
private:
    GLuint handle{0};
};

class GLES3GPUFramebuffer final {
public:
    GLES3GPURenderPass *gpuRenderPass{nullptr};
    GLES3GPUTextureViewList gpuColorViews;
    GLES3GPUTextureView *gpuDepthStencilView{nullptr};
    GLES3GPUTextureView *gpuDepthStencilResolveView{nullptr};

    uint32_t width{UINT_MAX};
    uint32_t height{UINT_MAX};
    GLbitfield dsResolveMask = 0;
    std::vector<std::pair<uint32_t, uint32_t>> colorBlitPairs;
    GLES3GPUFramebufferObject framebuffer;
    GLES3GPUFramebufferObject resolveFramebuffer;
};

struct GLES3GPUDescriptorSetLayout {
    DescriptorSetLayoutBindingList bindings;
    ccstd::vector<uint32_t> dynamicBindings;

    ccstd::vector<uint32_t> bindingIndices;
    ccstd::vector<uint32_t> descriptorIndices;
    uint32_t descriptorCount = 0U;
    ccstd::hash_t hash = 0U;
};
using GLES3GPUDescriptorSetLayoutList = ccstd::vector<GLES3GPUDescriptorSetLayout *>;

struct GLES3GPUPipelineLayout {
    GLES3GPUDescriptorSetLayoutList setLayouts;

    // helper storages
    ccstd::vector<ccstd::vector<int>> dynamicOffsetIndices;
    ccstd::vector<uint32_t> dynamicOffsetOffsets;
    ccstd::vector<uint32_t> dynamicOffsets;
    uint32_t dynamicOffsetCount = 0U;
    ccstd::hash_t hash = 0U;
};

struct GLES3GPUPipelineState {
    GLenum glPrimitive = GL_TRIANGLES;
    GLES3GPUShader *gpuShader = nullptr;
    RasterizerState rs;
    DepthStencilState dss;
    BlendState bs;
    DynamicStateList dynamicStates;
    GLES3GPUPipelineLayout *gpuLayout = nullptr;
    GLES3GPURenderPass *gpuRenderPass = nullptr;
    GLES3GPUPipelineLayout *gpuPipelineLayout = nullptr;
};

struct GLES3GPUDescriptor {
    DescriptorType type = DescriptorType::UNKNOWN;
    GLES3GPUBuffer *gpuBuffer = nullptr;
    GLES3GPUTextureView *gpuTextureView = nullptr;
    GLES3GPUSampler *gpuSampler = nullptr;
};
using GLES3GPUDescriptorList = ccstd::vector<GLES3GPUDescriptor>;

struct GLES3GPUDescriptorSet {
    GLES3GPUDescriptorList gpuDescriptors;
    const ccstd::vector<uint32_t> *descriptorIndices = nullptr;
};

struct GLES3GPUDispatchInfo {
    uint32_t groupCountX = 0;
    uint32_t groupCountY = 0;
    uint32_t groupCountZ = 0;

    GLES3GPUBuffer *indirectBuffer = nullptr;
    uint32_t indirectOffset = 0;
};

struct GLES3ObjectCache {
    uint32_t subpassIdx = 0U;
    GLES3GPURenderPass *gpuRenderPass = nullptr;
    GLES3GPUFramebuffer *gpuFramebuffer = nullptr;
    GLES3GPUPipelineState *gpuPipelineState = nullptr;
    GLES3GPUInputAssembler *gpuInputAssembler = nullptr;
    GLenum glPrimitive = 0;
    Rect renderArea;
    ColorList clearColors;
    float clearDepth = 1.F;
    uint32_t clearStencil = 0U;
};

class GLES3GPUStateCache final {
public:
    GLuint glArrayBuffer = 0;
    GLuint glElementArrayBuffer = 0;
    GLuint glUniformBuffer = 0;
    ccstd::vector<GLuint> glBindUBOs;
    ccstd::vector<GLuint> glBindUBOOffsets;
    GLuint glShaderStorageBuffer = 0;
    ccstd::vector<GLuint> glBindSSBOs;
    ccstd::vector<GLuint> glBindSSBOOffsets;
    GLuint glDispatchIndirectBuffer = 0;
    GLuint glVAO = 0;
    uint32_t texUint = 0;
    ccstd::vector<GLuint> glTextures;
    ccstd::vector<GLuint> glImages;
    ccstd::vector<GLuint> glSamplers;
    GLuint glProgram = 0;
    ccstd::vector<bool> glEnabledAttribLocs;
    ccstd::vector<bool> glCurrentAttribLocs;
    GLuint glReadFramebuffer = 0;
    GLuint glDrawFramebuffer = 0;
    GLuint glRenderbuffer = 0;
    Viewport viewport;
    Rect scissor;
    RasterizerState rs;
    DepthStencilState dss;
    BlendState bs;
    bool isCullFaceEnabled = true;
    bool isStencilTestEnabled = false;
    ccstd::unordered_map<ccstd::string, uint32_t> texUnitCacheMap;
    GLES3ObjectCache gfxStateCache;

    void initialize(size_t texUnits, size_t imageUnits, size_t uboBindings, size_t ssboBindings, size_t vertexAttributes) {
        glBindUBOs.resize(uboBindings, 0U);
        glBindUBOOffsets.resize(uboBindings, 0U);
        glBindSSBOs.resize(ssboBindings, 0U);
        glBindSSBOOffsets.resize(ssboBindings, 0U);
        glTextures.resize(texUnits, 0U);
        glSamplers.resize(texUnits, 0U);
        glImages.resize(imageUnits, 0U);
        glEnabledAttribLocs.resize(vertexAttributes, false);
        glCurrentAttribLocs.resize(vertexAttributes, false);
        _initialized = true;
    }

    void reset() {
        if (!_initialized) return;

        glArrayBuffer = 0;
        glElementArrayBuffer = 0;
        glUniformBuffer = 0;
        glBindUBOs.assign(glBindUBOs.size(), 0U);
        glBindUBOOffsets.assign(glBindUBOOffsets.size(), 0U);
        glShaderStorageBuffer = 0;
        glBindSSBOs.assign(glBindSSBOs.size(), 0U);
        glBindSSBOOffsets.assign(glBindSSBOOffsets.size(), 0U);
        glDispatchIndirectBuffer = 0;
        glVAO = 0;
        texUint = 0;
        glTextures.assign(glTextures.size(), 0U);
        glImages.assign(glImages.size(), 0U);
        glSamplers.assign(glSamplers.size(), 0U);
        glProgram = 0;
        glEnabledAttribLocs.assign(glEnabledAttribLocs.size(), false);
        glCurrentAttribLocs.assign(glCurrentAttribLocs.size(), false);
        glReadFramebuffer = 0;
        glDrawFramebuffer = 0;
        glRenderbuffer = 0;
        isCullFaceEnabled = true;
        isStencilTestEnabled = false;

        viewport = Viewport();
        scissor = Rect();
        rs = RasterizerState();
        dss = DepthStencilState();
        bs = BlendState();

        gfxStateCache.gpuRenderPass = nullptr;
        gfxStateCache.gpuFramebuffer = nullptr;
        gfxStateCache.gpuPipelineState = nullptr;
        gfxStateCache.gpuInputAssembler = nullptr;
        gfxStateCache.glPrimitive = 0U;
        gfxStateCache.subpassIdx = 0U;
    }

private:
    bool _initialized{false};
};

class GLES3GPUFramebufferCacheMap final {
public:
    explicit GLES3GPUFramebufferCacheMap(GLES3GPUStateCache *cache) : _cache(cache) {}

    void registerExternal(GLuint glFramebuffer, const GLES3GPUTexture *gpuTexture, uint32_t mipLevel) {
        bool isTexture = gpuTexture->glTexture;
        GLuint glResource = isTexture ? gpuTexture->glTexture : gpuTexture->glRenderbuffer;
        auto &cacheMap = isTexture ? _textureMap : _renderbufferMap;

        if (cacheMap[glResource].empty()) cacheMap[glResource].resize(gpuTexture->mipLevel);
        if (!cacheMap[glResource][mipLevel].glFramebuffer) {
            cacheMap[glResource][mipLevel] = {glFramebuffer, true};
        }
    }

    void unregisterExternal(GLuint glFramebuffer) {
        for (auto &levels : _textureMap) {
            for (auto &fbo : levels.second) {
                if (fbo.glFramebuffer == glFramebuffer) {
                    fbo.glFramebuffer = 0;
                    return;
                }
            }
        }
        for (auto &levels : _renderbufferMap) {
            for (auto &fbo : levels.second) {
                if (fbo.glFramebuffer == glFramebuffer) {
                    fbo.glFramebuffer = 0;
                    return;
                }
            }
        }
    }

    GLuint getFramebufferFromTexture(const GLES3GPUTextureView *gpuTextureView, const TextureSubresLayers &subres) {
        const auto *gpuTexture = gpuTextureView->gpuTexture;
        bool isTexture = gpuTexture->glTexture;
        GLuint glResource = isTexture ? gpuTexture->glTexture : gpuTexture->glRenderbuffer;
        auto &cacheMap = isTexture ? _textureMap : _renderbufferMap;
        uint32_t mipLevel = isTexture ? subres.mipLevel : 0;

        if (gpuTexture->swapchain) return gpuTexture->swapchain->glFramebuffer;
        CC_ASSERT(gpuTexture->glTexture || gpuTexture->glRenderbuffer);

        if (cacheMap[glResource].empty()) cacheMap[glResource].resize(gpuTexture->mipLevel);

        if (!cacheMap[glResource][mipLevel].glFramebuffer) {
            GLuint glFramebuffer = 0U;
            GL_CHECK(glGenFramebuffers(1, &glFramebuffer));
            if (_cache->glDrawFramebuffer != glFramebuffer) {
                GL_CHECK(glBindFramebuffer(GL_DRAW_FRAMEBUFFER, glFramebuffer));
                _cache->glDrawFramebuffer = glFramebuffer;
            }

            const FormatInfo &info = GFX_FORMAT_INFOS[static_cast<uint32_t>(gpuTexture->format)];
            GLenum attachment = GL_COLOR_ATTACHMENT0;
            if (info.hasStencil) {
                attachment = GL_DEPTH_STENCIL_ATTACHMENT;
            } else if (info.hasDepth) {
                attachment = GL_DEPTH_ATTACHMENT;
            }
            if (isTexture) {
                GL_CHECK(glFramebufferTexture2D(GL_DRAW_FRAMEBUFFER, attachment, gpuTextureView->glTarget, glResource, mipLevel));
            } else {
                GL_CHECK(glFramebufferRenderbuffer(GL_DRAW_FRAMEBUFFER, attachment, GL_RENDERBUFFER, glResource));
            }

            GLenum status;
            GL_CHECK(status = glCheckFramebufferStatus(GL_DRAW_FRAMEBUFFER));
            CC_ASSERT_EQ(status, GL_FRAMEBUFFER_COMPLETE);

            cacheMap[glResource][mipLevel].glFramebuffer = glFramebuffer;
        }

        return cacheMap[glResource][mipLevel].glFramebuffer;
    }

    void onTextureDestroy(const GLES3GPUTexture *gpuTexture) {
        bool isTexture = gpuTexture->glTexture;
        GLuint glResource = isTexture ? gpuTexture->glTexture : gpuTexture->glRenderbuffer;
        auto &cacheMap = isTexture ? _textureMap : _renderbufferMap;

        if (cacheMap.count(glResource)) {
            for (auto &record : cacheMap[glResource]) {
                if (!record.glFramebuffer || record.isExternal) continue;

                if (_cache->glDrawFramebuffer == record.glFramebuffer || _cache->glReadFramebuffer == record.glFramebuffer) {
                    GL_CHECK(glBindFramebuffer(GL_FRAMEBUFFER, 0));
                    _cache->glDrawFramebuffer = _cache->glReadFramebuffer = 0;
                }
                GL_CHECK(glDeleteFramebuffers(1, &record.glFramebuffer));
            }
            cacheMap.erase(glResource);
        }
    }

private:
    GLES3GPUStateCache *_cache = nullptr;

    struct FramebufferRecord {
        GLuint glFramebuffer{0};
        bool isExternal{false};
    };
    using CacheMap = ccstd::unordered_map<GLuint, ccstd::vector<FramebufferRecord>>;
    CacheMap _renderbufferMap; // renderbuffer -> mip level -> framebuffer
    CacheMap _textureMap;      // texture -> mip level -> framebuffer
};

class GLES3GPUFramebufferHub final {
public:
    void connect(GLES3GPUTexture *texture, GLES3GPUFramebuffer *framebuffer) {
        _framebuffers[texture].push_back(framebuffer);
    }

    void disengage(GLES3GPUTexture *texture) {
        _framebuffers.erase(texture);
    }

    void disengage(GLES3GPUTexture *texture, GLES3GPUFramebuffer *framebuffer) {
        auto &pool = _framebuffers[texture];
        pool.erase(std::remove(pool.begin(), pool.end(), framebuffer), pool.end());
    }

    void update(GLES3GPUTexture *texture);

private:
    ccstd::unordered_map<GLES3GPUTexture *, ccstd::vector<GLES3GPUFramebuffer *>> _framebuffers;
};

struct GLES3GPUProgramBinary : public GFXDeviceObject<DefaultDeleter> {
    ccstd::string name;
    ccstd::hash_t hash = 0;
    GLenum format;
    std::vector<char> data;
};

} // namespace gfx
} // namespace cc
