/****************************************************************************
 Copyright (c) 2019-2021 Xiamen Yaji Software Co., Ltd.

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

#include <utility>

#include "gfx-base/GFXDef.h"
#include "gfx-gles-common/GLESCommandPool.h"

#include "GLES3Std.h"
#include "GLES3Wrangler.h"

namespace cc {
namespace gfx {

class GLES3GPUConstantRegistry {
public:
    uint currentBoundThreadID{0U};
    uint glMinorVersion{0U};
    uint defaultFramebuffer{0U};

    MSRTSupportLevel mMSRT{MSRTSupportLevel::NONE};
    FBFSupportLevel  mFBF{FBFSupportLevel::NONE};
    PLSSupportLevel  mPLS{PLSSupportLevel::NONE};
    uint             mPLSsize{0U};
};

class GLES3GPUBuffer final : public Object {
public:
    BufferUsage  usage    = BufferUsage::NONE;
    MemoryUsage  memUsage = MemoryUsage::NONE;
    uint         size     = 0;
    uint         stride   = 0;
    uint         count    = 0;
    GLenum       glTarget = 0;
    GLuint       glBuffer = 0;
    GLuint       glOffset = 0;
    uint8_t *    buffer   = nullptr;
    DrawInfoList indirects;
};
using GLES3GPUBufferList = vector<GLES3GPUBuffer *>;

class GLES3GPUTexture final : public Object {
public:
    TextureType  type           = TextureType::TEX2D;
    Format       format         = Format::UNKNOWN;
    TextureUsage usage          = TextureUsageBit::NONE;
    uint         width          = 0;
    uint         height         = 0;
    uint         depth          = 1;
    uint         size           = 0;
    uint         arrayLayer     = 1;
    uint         mipLevel       = 1;
    SampleCount  samples        = SampleCount::X1;
    TextureFlags flags          = TextureFlagBit::NONE;
    bool         isPowerOf2     = false;
    bool         memoryless     = false;
    GLenum       glTarget       = 0;
    GLenum       glInternalFmt  = 0;
    GLenum       glFormat       = 0;
    GLenum       glType         = 0;
    GLenum       glUsage        = 0;
    GLint        glSamples      = 0;
    GLuint       glTexture      = 0;
    GLuint       glRenderbuffer = 0;
    GLenum       glWrapS        = 0;
    GLenum       glWrapT        = 0;
    GLenum       glMinFilter    = 0;
    GLenum       glMagFilter    = 0;
};

using GLES3GPUTextureList = vector<GLES3GPUTexture *>;

class GLES3GPUSampler final : public Object {
public:
    Filter  minFilter   = Filter::NONE;
    Filter  magFilter   = Filter::NONE;
    Filter  mipFilter   = Filter::NONE;
    Address addressU    = Address::CLAMP;
    Address addressV    = Address::CLAMP;
    Address addressW    = Address::CLAMP;
    GLuint  glSampler   = 0;
    GLenum  glMinFilter = 0;
    GLenum  glMagFilter = 0;
    GLenum  glWrapS     = 0;
    GLenum  glWrapT     = 0;
    GLenum  glWrapR     = 0;
};

struct GLES3GPUInput final {
    uint   binding = 0;
    String name;
    Type   type   = Type::UNKNOWN;
    uint   stride = 0;
    uint   count  = 0;
    uint   size   = 0;
    GLenum glType = 0;
    GLint  glLoc  = -1;
};
using GLES3GPUInputList = vector<GLES3GPUInput>;

struct GLES3GPUUniform final {
    uint   binding = INVALID_BINDING;
    String name;
    Type   type   = Type::UNKNOWN;
    uint   stride = 0;
    uint   count  = 0;
    uint   size   = 0;
    uint   offset = 0;
    GLenum glType = 0;
    GLint  glLoc  = -1;
};
using GLES3GPUUniformList = vector<GLES3GPUUniform>;

struct GLES3GPUUniformBuffer final {
    uint   set     = INVALID_BINDING;
    uint   binding = INVALID_BINDING;
    String name;
    uint   size      = 0;
    uint   glBinding = 0xffffffff;
    bool   isStorage = false;
};
using GLES3GPUUniformBufferList = vector<GLES3GPUUniformBuffer>;

struct GLES3GPUUniformSamplerTexture final {
    uint   set     = 0;
    uint   binding = 0;
    String name;
    Type   type  = Type::UNKNOWN;
    uint   count = 0U;

    vector<GLint> units;
    GLenum        glType = 0;
    GLint         glLoc  = -1;
};
using GLES3GPUUniformSamplerTextureList = vector<GLES3GPUUniformSamplerTexture>;

struct GLES3GPUUniformStorageImage final {
    uint   set     = 0;
    uint   binding = 0;
    String name;
    Type   type  = Type::UNKNOWN;
    uint   count = 0U;

    vector<int> units;
    GLenum      glMemoryAccess = GL_READ_WRITE;
    GLint       glLoc          = -1;
};
using GLES3GPUUniformStorageImageList = vector<GLES3GPUUniformStorageImage>;

struct GLES3GPUShaderStage final {
    GLES3GPUShaderStage(ShaderStageFlagBit t, String s, GLuint shader = 0)
    : type(t),
      source(std::move(std::move(s))),
      glShader(shader) {}
    ShaderStageFlagBit type;
    String             source;
    GLuint             glShader = 0;
};
using GLES3GPUShaderStageList = vector<GLES3GPUShaderStage>;

class GLES3GPUShader final : public Object {
public:
    String                     name;
    UniformBlockList           blocks;
    UniformStorageBufferList   buffers;
    UniformSamplerTextureList  samplerTextures;
    UniformSamplerList         samplers;
    UniformTextureList         textures;
    UniformStorageImageList    images;
    UniformInputAttachmentList subpassInputs;

    GLES3GPUShaderStageList           gpuStages;
    GLuint                            glProgram = 0;
    GLES3GPUInputList                 glInputs;
    GLES3GPUUniformBufferList         glBuffers;
    GLES3GPUUniformSamplerTextureList glSamplerTextures;
    GLES3GPUUniformStorageImageList   glImages;
};

struct GLES3GPUAttribute final {
    String name;
    GLuint glBuffer       = 0;
    GLenum glType         = 0;
    uint   size           = 0;
    uint   count          = 0;
    uint   stride         = 1;
    uint   componentCount = 1;
    bool   isNormalized   = false;
    bool   isInstanced    = false;
    uint   offset         = 0;
};
using GLES3GPUAttributeList = vector<GLES3GPUAttribute>;

class GLES3GPUInputAssembler final : public Object {
public:
    AttributeList                 attributes;
    GLES3GPUBufferList            gpuVertexBuffers;
    GLES3GPUBuffer *              gpuIndexBuffer    = nullptr;
    GLES3GPUBuffer *              gpuIndirectBuffer = nullptr;
    GLES3GPUAttributeList         glAttribs;
    GLenum                        glIndexType = 0;
    unordered_map<size_t, GLuint> glVAOs;
};

class GLES3GPURenderPass final : public Object {
public:
    ColorAttachmentList    colorAttachments;
    DepthStencilAttachment depthStencilAttachment;
    SubpassInfoList        subpasses;
};

class GLES3GPUFramebuffer final : public Object {
public:
    GLES3GPURenderPass *gpuRenderPass = nullptr;
    GLES3GPUTextureList gpuColorTextures;
    GLES3GPUTexture *   gpuDepthStencilTexture = nullptr;
    bool                usesPLS                = false;
    bool                usesFBF                = false;

    struct GLFramebuffer {
        GLuint glFramebuffer = 0U;

        // for blit-based manual resolving
        GLbitfield resolveMask          = 0U;
        GLuint     glResolveFramebuffer = 0U;
    };

    // one per subpass, if not using FBF or PLS
    vector<GLFramebuffer> instances;

    vector<uint>  uberColorAttachmentIndices;
    GLFramebuffer uberInstance;
};

class GLES3GPUDescriptorSetLayout final : public Object {
public:
    DescriptorSetLayoutBindingList bindings;
    vector<uint>                   dynamicBindings;

    vector<uint> bindingIndices;
    vector<uint> descriptorIndices;
    uint         descriptorCount = 0U;
};
using GLES3GPUDescriptorSetLayoutList = vector<GLES3GPUDescriptorSetLayout *>;

class GLES3GPUPipelineLayout final : public Object {
public:
    GLES3GPUDescriptorSetLayoutList setLayouts;

    // helper storages
    vector<vector<int>> dynamicOffsetIndices;
    vector<uint>        dynamicOffsetOffsets;
    vector<uint>        dynamicOffsets;
    uint                dynamicOffsetCount;
};

class GLES3GPUPipelineState final : public Object {
public:
    GLenum                  glPrimitive = GL_TRIANGLES;
    GLES3GPUShader *        gpuShader   = nullptr;
    RasterizerState         rs;
    DepthStencilState       dss;
    BlendState              bs;
    DynamicStateList        dynamicStates;
    GLES3GPUPipelineLayout *gpuLayout         = nullptr;
    GLES3GPURenderPass *    gpuRenderPass     = nullptr;
    GLES3GPUPipelineLayout *gpuPipelineLayout = nullptr;
};

struct GLES3GPUDescriptor final {
    DescriptorType   type       = DescriptorType::UNKNOWN;
    GLES3GPUBuffer * gpuBuffer  = nullptr;
    GLES3GPUTexture *gpuTexture = nullptr;
    GLES3GPUSampler *gpuSampler = nullptr;
};
using GLES3GPUDescriptorList = vector<GLES3GPUDescriptor>;

class GLES3GPUDescriptorSet final : public Object {
public:
    GLES3GPUDescriptorList gpuDescriptors;
    const vector<uint> *   descriptorIndices = nullptr;
};

class GLES3GPUGlobalBarrier final : public Object {
public:
    GLbitfield glBarriers         = 0U;
    GLbitfield glBarriersByRegion = 0U;
};

struct GLES3GPUDispatchInfo final : public Object {
    uint groupCountX = 0;
    uint groupCountY = 0;
    uint groupCountZ = 0;

    GLES3GPUBuffer *indirectBuffer = nullptr;
    uint            indirectOffset = 0;
};

struct GLES3ObjectCache final {
    uint                    subpassIdx        = 0U;
    GLES3GPURenderPass *    gpuRenderPass     = nullptr;
    GLES3GPUFramebuffer *   gpuFramebuffer    = nullptr;
    GLES3GPUPipelineState * gpuPipelineState  = nullptr;
    GLES3GPUInputAssembler *gpuInputAssembler = nullptr;
    GLenum                  glPrimitive       = 0;
    Rect                    renderArea;
    ColorList               clearColors;
    float                   clearDepth   = 1.F;
    uint                    clearStencil = 0U;
};

class GLES3GPUStateCache final : public Object {
public:
    GLuint                      glArrayBuffer        = 0;
    GLuint                      glElementArrayBuffer = 0;
    GLuint                      glUniformBuffer      = 0;
    vector<GLuint>              glBindUBOs;
    vector<GLuint>              glBindUBOOffsets;
    GLuint                      glShaderStorageBuffer = 0;
    vector<GLuint>              glBindSSBOs;
    vector<GLuint>              glBindSSBOOffsets;
    GLuint                      glDispatchIndirectBuffer = 0;
    GLuint                      glVAO                    = 0;
    uint                        texUint                  = 0;
    vector<GLuint>              glTextures;
    vector<GLuint>              glImages;
    vector<GLuint>              glSamplers;
    GLuint                      glProgram = 0;
    vector<bool>                glEnabledAttribLocs;
    vector<bool>                glCurrentAttribLocs;
    GLuint                      glReadFramebuffer = 0;
    GLuint                      glDrawFramebuffer = 0;
    GLuint                      glRenderbuffer    = 0;
    Viewport                    viewport;
    Rect                        scissor;
    RasterizerState             rs;
    DepthStencilState           dss;
    BlendState                  bs;
    bool                        isCullFaceEnabled    = true;
    bool                        isStencilTestEnabled = false;
    bool                        isPLSEnabled         = false;
    unordered_map<String, uint> texUnitCacheMap;
    GLES3ObjectCache            gfxStateCache;

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
    }

    void reset() {
        glArrayBuffer        = 0;
        glElementArrayBuffer = 0;
        glUniformBuffer      = 0;
        glBindUBOs.assign(glBindUBOs.size(), 0U);
        glBindUBOOffsets.assign(glBindUBOOffsets.size(), 0U);
        glShaderStorageBuffer = 0;
        glBindSSBOs.assign(glBindSSBOs.size(), 0U);
        glBindSSBOOffsets.assign(glBindSSBOOffsets.size(), 0U);
        glDispatchIndirectBuffer = 0;
        glVAO                    = 0;
        texUint                  = 0;
        glTextures.assign(glTextures.size(), 0U);
        glImages.assign(glImages.size(), 0U);
        glSamplers.assign(glSamplers.size(), 0U);
        glProgram = 0;
        glEnabledAttribLocs.assign(glEnabledAttribLocs.size(), false);
        glCurrentAttribLocs.assign(glCurrentAttribLocs.size(), false);
        glReadFramebuffer    = 0;
        glDrawFramebuffer    = 0;
        glRenderbuffer       = 0;
        isCullFaceEnabled    = true;
        isStencilTestEnabled = false;
        isPLSEnabled         = false;

        viewport = Viewport();
        scissor  = Rect();
        rs       = RasterizerState();
        dss      = DepthStencilState();
        bs       = BlendState();

        gfxStateCache.gpuRenderPass     = nullptr;
        gfxStateCache.gpuFramebuffer    = nullptr;
        gfxStateCache.gpuPipelineState  = nullptr;
        gfxStateCache.gpuInputAssembler = nullptr;
        gfxStateCache.glPrimitive       = 0U;
        gfxStateCache.subpassIdx        = 0U;
    }
};

class GLES3GPUFramebufferCacheMap final : public Object {
public:
    explicit GLES3GPUFramebufferCacheMap(GLES3GPUStateCache *cache) : _cache(cache) {}

    ~GLES3GPUFramebufferCacheMap() override = default;

    GLuint getFramebufferFromTexture(const GLES3GPUTexture *gpuTexture, const TextureSubresLayers &subres) {
        bool   isTexture  = gpuTexture->glTexture;
        GLuint glResource = isTexture ? gpuTexture->glTexture : gpuTexture->glRenderbuffer;
        auto & cacheMap   = isTexture ? _textureMap : _renderbufferMap;
        uint   mipLevel   = isTexture ? subres.mipLevel : 0;

        if (cacheMap[glResource].empty()) cacheMap[glResource].resize(gpuTexture->mipLevel, 0U);

        if (!cacheMap[glResource][mipLevel]) {
            GLuint glFramebuffer = 0U;
            GL_CHECK(glGenFramebuffers(1, &glFramebuffer));
            if (_cache->glDrawFramebuffer != glFramebuffer) {
                GL_CHECK(glBindFramebuffer(GL_DRAW_FRAMEBUFFER, glFramebuffer));
                _cache->glDrawFramebuffer = glFramebuffer;
            }

            const FormatInfo &info       = GFX_FORMAT_INFOS[static_cast<uint>(gpuTexture->format)];
            GLenum            attachment = GL_COLOR_ATTACHMENT0;
            if (info.hasStencil) {
                attachment = GL_DEPTH_STENCIL_ATTACHMENT;
            } else if (info.hasDepth) {
                attachment = GL_DEPTH_ATTACHMENT;
            }
            if (isTexture) {
                GL_CHECK(glFramebufferTexture2D(GL_DRAW_FRAMEBUFFER, attachment, gpuTexture->glTarget, glResource, mipLevel));
            } else {
                GL_CHECK(glFramebufferRenderbuffer(GL_DRAW_FRAMEBUFFER, attachment, gpuTexture->glTarget, glResource));
            }

            GLenum status;
            GL_CHECK(status = glCheckFramebufferStatus(GL_DRAW_FRAMEBUFFER));
            CCASSERT(status == GL_FRAMEBUFFER_COMPLETE, "frambuffer incomplete");

            cacheMap[glResource][mipLevel] = glFramebuffer;
        }

        return cacheMap[glResource][mipLevel];
    }

    void onTextureDestroy(const GLES3GPUTexture *gpuTexture) {
        bool   isTexture  = gpuTexture->glTexture;
        GLuint glResource = isTexture ? gpuTexture->glTexture : gpuTexture->glRenderbuffer;
        auto & cacheMap   = isTexture ? _textureMap : _renderbufferMap;

        if (cacheMap.count(glResource)) {
            for (GLuint glFramebuffer : cacheMap[glResource]) {
                if (!glFramebuffer) continue;

                if (_cache->glDrawFramebuffer == glFramebuffer || _cache->glReadFramebuffer == glFramebuffer) {
                    GL_CHECK(glBindFramebuffer(GL_FRAMEBUFFER, 0));
                    _cache->glDrawFramebuffer = _cache->glReadFramebuffer = 0;
                }
                GL_CHECK(glDeleteFramebuffers(1, &glFramebuffer));
            }
            cacheMap.erase(glResource);
        }
    }

private:
    GLES3GPUStateCache *_cache = nullptr;

    using CacheMap = unordered_map<GLuint, vector<GLuint>>;
    CacheMap _renderbufferMap; // renderbuffer -> mip level -> framebuffer
    CacheMap _textureMap;      // texture -> mip level -> framebuffer
};

constexpr size_t                CHUNK_SIZE = 16 * 1024 * 1024; // 16M per block by default
class GLES3GPUStagingBufferPool final : public Object {
public:
    ~GLES3GPUStagingBufferPool() override {
        for (Buffer &buffer : _pool) {
            CC_FREE(buffer.mappedData);
        }
        _pool.clear();
    }

    uint8_t *alloc(size_t size) {
        size_t  bufferCount = _pool.size();
        Buffer *buffer      = nullptr;
        for (size_t idx = 0U; idx < bufferCount; idx++) {
            Buffer *cur = &_pool[idx];
            if (CHUNK_SIZE - cur->curOffset >= size) {
                buffer = cur;
                break;
            }
        }
        if (!buffer) {
            _pool.resize(bufferCount + 1);
            buffer             = &_pool.back();
            buffer->mappedData = static_cast<uint8_t *>(CC_MALLOC(CHUNK_SIZE));
        }
        uint8_t *data = buffer->mappedData + buffer->curOffset;
        buffer->curOffset += size;
        return data;
    }

    void reset() {
        for (Buffer &buffer : _pool) {
            buffer.curOffset = 0U;
        }
    }

private:
    struct Buffer {
        uint8_t *mappedData = nullptr;
        size_t   curOffset  = 0U;
    };
    vector<Buffer> _pool;
};

} // namespace gfx
} // namespace cc
