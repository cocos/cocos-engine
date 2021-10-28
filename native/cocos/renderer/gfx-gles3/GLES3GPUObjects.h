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

#include "base/Macros.h"
#include "gfx-base/GFXDef-common.h"
#include "gfx-base/GFXDef.h"
#include "gfx-gles-common/GLESCommandPool.h"

#include "GLES3Std.h"
#include "GLES3Wrangler.h"

namespace cc {
namespace gfx {

class GLES3GPUConstantRegistry final : public Object {
public:
    size_t   currentBoundThreadID{0U};
    uint32_t glMinorVersion{0U};

    MSRTSupportLevel mMSRT{MSRTSupportLevel::NONE};
    FBFSupportLevel  mFBF{FBFSupportLevel::NONE};
};

class GLES3GPUStateCache;
class GLES3GPUSwapchain;
class GLES3GPUContext final : public Object {
public:
    bool initialize(GLES3GPUStateCache *stateCache, GLES3GPUConstantRegistry *constantRegistry);
    void destroy();

    EGLint         eglMajorVersion{0};
    EGLint         eglMinorVersion{0};
    EGLDisplay     eglDisplay{EGL_NO_DISPLAY};
    EGLConfig      eglConfig{nullptr};
    vector<EGLint> eglAttributes;

    EGLSurface eglDefaultSurface{EGL_NO_SURFACE};
    EGLContext eglDefaultContext{EGL_NO_CONTEXT};

    // pass nullptr to keep the current surface
    void makeCurrent(const GLES3GPUSwapchain *drawSwapchain = nullptr, const GLES3GPUSwapchain *readSwapchain = nullptr);
    void bindContext(bool bound); // for context switching between threads

    void present(const GLES3GPUSwapchain *swapchain);

    inline bool checkExtension(const String &extension) const {
        return std::find(_extensions.begin(), _extensions.end(), extension) != _extensions.end();
    }

private:
    bool       makeCurrent(EGLSurface drawSurface, EGLSurface readSurface, EGLContext context, bool updateCache = true);
    EGLContext getSharedContext();
    void       resetStates() const;

    // state caches
    EGLSurface _eglCurrentDrawSurface{EGL_NO_SURFACE};
    EGLSurface _eglCurrentReadSurface{EGL_NO_SURFACE};
    EGLContext _eglCurrentContext{EGL_NO_CONTEXT};
    EGLint     _eglCurrentInterval{0};

    GLES3GPUStateCache *      _stateCache{nullptr};
    GLES3GPUConstantRegistry *_constantRegistry{nullptr};

    map<size_t, EGLContext> _sharedContexts;

    StringArray _extensions;
};

class GLES3GPUQueryPool final : public Object {
public:
    QueryType           type{QueryType::OCCLUSION};
    uint32_t            maxQueryObjects{0};
    std::vector<GLuint> glQueryIds;

    inline GLuint mapGLQueryId(uint32_t queryId) {
        if (queryId < maxQueryObjects) {
            return glQueryIds[queryId];
        }

        return ~0U;
    }
};

class GLES3GPUBuffer final : public Object {
public:
    BufferUsage  usage    = BufferUsage::NONE;
    MemoryUsage  memUsage = MemoryUsage::NONE;
    uint32_t     size     = 0;
    uint32_t     stride   = 0;
    uint32_t     count    = 0;
    GLenum       glTarget = 0;
    GLuint       glBuffer = 0;
    GLuint       glOffset = 0;
    uint8_t *    buffer   = nullptr;
    DrawInfoList indirects;
};
using GLES3GPUBufferList = vector<GLES3GPUBuffer *>;

class GLES3GPUTexture final : public Object {
public:
    TextureType        type{TextureType::TEX2D};
    Format             format{Format::UNKNOWN};
    TextureUsage       usage{TextureUsageBit::NONE};
    uint32_t           width{0};
    uint32_t           height{0};
    uint32_t           depth{1};
    uint32_t           size{0};
    uint32_t           arrayLayer{1};
    uint32_t           mipLevel{1};
    SampleCount        samples{SampleCount::ONE};
    TextureFlags       flags{TextureFlagBit::NONE};
    bool               isPowerOf2{false};
    bool               memoryless{false};
    GLenum             glTarget{0};
    GLenum             glInternalFmt{0};
    GLenum             glFormat{0};
    GLenum             glType{0};
    GLenum             glUsage{0};
    GLint              glSamples{0};
    GLuint             glTexture{0};
    GLuint             glRenderbuffer{0};
    GLenum             glWrapS{0};
    GLenum             glWrapT{0};
    GLenum             glMinFilter{0};
    GLenum             glMagFilter{0};
    GLES3GPUSwapchain *swapchain{nullptr};
};

using GLES3GPUTextureList = vector<GLES3GPUTexture *>;

class GLES3GPUSwapchain final : public Object {
public:
    EGLSurface       eglSurface{EGL_NO_SURFACE};
    EGLint           eglSwapInterval{0};
    GLuint           glFramebuffer{0};
    GLES3GPUTexture *gpuColorTexture{nullptr};
};

class GLES3GPUSampler final : public Object {
public:
    Filter  minFilter   = Filter::NONE;
    Filter  magFilter   = Filter::NONE;
    Filter  mipFilter   = Filter::NONE;
    Address addressU    = Address::CLAMP;
    Address addressV    = Address::CLAMP;
    Address addressW    = Address::CLAMP;
    GLenum  glMinFilter = 0;
    GLenum  glMagFilter = 0;
    GLenum  glWrapS     = 0;
    GLenum  glWrapT     = 0;
    GLenum  glWrapR     = 0;
};

class GLES3GPUInput final : public Object {
public:
    uint32_t binding = 0;
    String   name;
    Type     type   = Type::UNKNOWN;
    uint32_t stride = 0;
    uint32_t count  = 0;
    uint32_t size   = 0;
    GLenum   glType = 0;
    GLint    glLoc  = -1;
};
using GLES3GPUInputList = vector<GLES3GPUInput>;

class GLES3GPUUniform final : public Object {
public:
    uint32_t binding = INVALID_BINDING;
    String   name;
    Type     type   = Type::UNKNOWN;
    uint32_t stride = 0;
    uint32_t count  = 0;
    uint32_t size   = 0;
    uint32_t offset = 0;
    GLenum   glType = 0;
    GLint    glLoc  = -1;
};
using GLES3GPUUniformList = vector<GLES3GPUUniform>;

class GLES3GPUUniformBuffer final : public Object {
public:
    uint32_t set     = INVALID_BINDING;
    uint32_t binding = INVALID_BINDING;
    String   name;
    uint32_t size      = 0;
    uint32_t glBinding = 0xffffffff;
    bool     isStorage = false;
};
using GLES3GPUUniformBufferList = vector<GLES3GPUUniformBuffer>;

class GLES3GPUUniformSamplerTexture final : public Object {
public:
    uint32_t set     = 0;
    uint32_t binding = 0;
    String   name;
    Type     type  = Type::UNKNOWN;
    uint32_t count = 0U;

    vector<GLint> units;
    GLenum        glType = 0;
    GLint         glLoc  = -1;
};
using GLES3GPUUniformSamplerTextureList = vector<GLES3GPUUniformSamplerTexture>;

class GLES3GPUUniformStorageImage final : public Object {
public:
    uint32_t set     = 0;
    uint32_t binding = 0;
    String   name;
    Type     type  = Type::UNKNOWN;
    uint32_t count = 0U;

    vector<int> units;
    GLenum      glMemoryAccess = GL_READ_WRITE;
    GLint       glLoc          = -1;
};
using GLES3GPUUniformStorageImageList = vector<GLES3GPUUniformStorageImage>;

class GLES3GPUShaderStage final : public Object {
public:
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

class GLES3GPUAttribute final : public Object {
public:
    String   name;
    GLuint   glBuffer       = 0;
    GLenum   glType         = 0;
    uint32_t size           = 0;
    uint32_t count          = 0;
    uint32_t stride         = 1;
    uint32_t componentCount = 1;
    bool     isNormalized   = false;
    bool     isInstanced    = false;
    uint32_t offset         = 0;
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

class GLES3GPUGlobalBarrier final : public Object {
public:
    GLbitfield glBarriers         = 0U;
    GLbitfield glBarriersByRegion = 0U;
};

class GLES3GPURenderPass final : public Object {
public:
    struct AttachmentStatistics {
        uint32_t loadSubpass{SUBPASS_EXTERNAL};
        uint32_t storeSubpass{SUBPASS_EXTERNAL};
    };

    ColorAttachmentList    colorAttachments;
    DepthStencilAttachment depthStencilAttachment;
    SubpassInfoList        subpasses;

    vector<AttachmentStatistics> statistics; // per attachment

    vector<GLES3GPUGlobalBarrier> barriers; // per subpass
};

class GLES3GPUFramebufferCacheMap;
class GLES3GPUFramebuffer final : public Object {
public:
    GLES3GPURenderPass *gpuRenderPass{nullptr};
    GLES3GPUTextureList gpuColorTextures;
    GLES3GPUTexture *   gpuDepthStencilTexture{nullptr};
    bool                usesFBF{false};

    struct GLFramebufferInfo {
        GLuint   glFramebuffer{0U};
        uint32_t width{UINT_MAX};
        uint32_t height{UINT_MAX};
    };
    struct GLFramebuffer {
        inline void initialize(GLES3GPUSwapchain *sc) { swapchain = sc; }
        inline void initialize(const GLFramebufferInfo &info) {
            _glFramebuffer = info.glFramebuffer;
            _width         = info.width;
            _height        = info.height;
        }
        inline GLuint   getFramebuffer() const { return swapchain ? swapchain->glFramebuffer : _glFramebuffer; }
        inline uint32_t getWidth() const { return swapchain ? swapchain->gpuColorTexture->width : _width; }
        inline uint32_t getHeight() const { return swapchain ? swapchain->gpuColorTexture->height : _height; }

        void destroy(GLES3GPUStateCache *cache, GLES3GPUFramebufferCacheMap *framebufferCacheMap);

        GLES3GPUSwapchain *swapchain{nullptr};

    private:
        GLuint   _glFramebuffer{0U};
        uint32_t _width{0U};
        uint32_t _height{0U};
    };

    struct Framebuffer {
        GLFramebuffer framebuffer;

        // for blit-based manual resolving
        GLbitfield    resolveMask{0U};
        GLFramebuffer resolveFramebuffer;
    };

    // one per subpass, if not using FBF
    vector<Framebuffer> instances;

    vector<uint32_t> uberColorAttachmentIndices;
    uint32_t         uberDepthStencil{INVALID_BINDING};
    Framebuffer      uberInstance;

    // the assumed shader output, may differ from actual subpass output
    // see Feature::INPUT_ATTACHMENT_BENEFIT for more details on this
    uint32_t uberOnChipOutput{INVALID_BINDING};
    uint32_t uberFinalOutput{INVALID_BINDING};
};

class GLES3GPUDescriptorSetLayout final : public Object {
public:
    DescriptorSetLayoutBindingList bindings;
    vector<uint32_t>               dynamicBindings;

    vector<uint32_t> bindingIndices;
    vector<uint32_t> descriptorIndices;
    uint32_t         descriptorCount = 0U;
};
using GLES3GPUDescriptorSetLayoutList = vector<GLES3GPUDescriptorSetLayout *>;

class GLES3GPUPipelineLayout final : public Object {
public:
    GLES3GPUDescriptorSetLayoutList setLayouts;

    // helper storages
    vector<vector<int>> dynamicOffsetIndices;
    vector<uint32_t>    dynamicOffsetOffsets;
    vector<uint32_t>    dynamicOffsets;
    uint32_t            dynamicOffsetCount;
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

class GLES3GPUDescriptor final : public Object {
public:
    DescriptorType   type       = DescriptorType::UNKNOWN;
    GLES3GPUBuffer * gpuBuffer  = nullptr;
    GLES3GPUTexture *gpuTexture = nullptr;
    GLES3GPUSampler *gpuSampler = nullptr;
};
using GLES3GPUDescriptorList = vector<GLES3GPUDescriptor>;

class GLES3GPUDescriptorSet final : public Object {
public:
    GLES3GPUDescriptorList  gpuDescriptors;
    const vector<uint32_t> *descriptorIndices = nullptr;
};

class GLES3GPUDispatchInfo final : public Object {
public:
    uint32_t groupCountX = 0;
    uint32_t groupCountY = 0;
    uint32_t groupCountZ = 0;

    GLES3GPUBuffer *indirectBuffer = nullptr;
    uint32_t        indirectOffset = 0;
};

class GLES3ObjectCache final : public Object {
public:
    uint32_t                subpassIdx        = 0U;
    GLES3GPURenderPass *    gpuRenderPass     = nullptr;
    GLES3GPUFramebuffer *   gpuFramebuffer    = nullptr;
    GLES3GPUPipelineState * gpuPipelineState  = nullptr;
    GLES3GPUInputAssembler *gpuInputAssembler = nullptr;
    GLenum                  glPrimitive       = 0;
    Rect                    renderArea;
    ColorList               clearColors;
    float                   clearDepth   = 1.F;
    uint32_t                clearStencil = 0U;
};

class GLES3GPUStateCache final : public Object {
public:
    GLuint                          glArrayBuffer        = 0;
    GLuint                          glElementArrayBuffer = 0;
    GLuint                          glUniformBuffer      = 0;
    vector<GLuint>                  glBindUBOs;
    vector<GLuint>                  glBindUBOOffsets;
    GLuint                          glShaderStorageBuffer = 0;
    vector<GLuint>                  glBindSSBOs;
    vector<GLuint>                  glBindSSBOOffsets;
    GLuint                          glDispatchIndirectBuffer = 0;
    GLuint                          glVAO                    = 0;
    uint32_t                        texUint                  = 0;
    vector<GLuint>                  glTextures;
    vector<GLuint>                  glImages;
    vector<GLuint>                  glSamplers;
    GLuint                          glProgram = 0;
    vector<bool>                    glEnabledAttribLocs;
    vector<bool>                    glCurrentAttribLocs;
    GLuint                          glReadFramebuffer = 0;
    GLuint                          glDrawFramebuffer = 0;
    GLuint                          glRenderbuffer    = 0;
    Viewport                        viewport;
    Rect                            scissor;
    RasterizerState                 rs;
    DepthStencilState               dss;
    BlendState                      bs;
    bool                            isCullFaceEnabled    = true;
    bool                            isStencilTestEnabled = false;
    unordered_map<String, uint32_t> texUnitCacheMap;
    GLES3ObjectCache                gfxStateCache;

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

private:
    bool _initialized{false};
};

class GLES3GPUSamplerRegistry final : public Object {
public:
    ~GLES3GPUSamplerRegistry() override {
        vector<GLuint> glSampelrs;
        for (const auto &pair : _cache) {
            glSampelrs.push_back(pair.second);
        }
        GL_CHECK(glDeleteSamplers(static_cast<GLsizei>(glSampelrs.size()), glSampelrs.data()));
    }

    GLuint getGLSampler(GLES3GPUSampler *gpuSampler);

private:
    unordered_map<GLES3GPUSampler *, GLuint> _cache;
};

class GLES3GPUFramebufferCacheMap final : public Object {
public:
    explicit GLES3GPUFramebufferCacheMap(GLES3GPUStateCache *cache) : _cache(cache) {}

    void registerExternal(GLuint glFramebuffer, const GLES3GPUTexture *gpuTexture, uint32_t mipLevel) {
        bool   isTexture  = gpuTexture->glTexture;
        GLuint glResource = isTexture ? gpuTexture->glTexture : gpuTexture->glRenderbuffer;
        auto & cacheMap   = isTexture ? _textureMap : _renderbufferMap;

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

    GLuint getFramebufferFromTexture(const GLES3GPUTexture *gpuTexture, const TextureSubresLayers &subres) {
        bool     isTexture  = gpuTexture->glTexture;
        GLuint   glResource = isTexture ? gpuTexture->glTexture : gpuTexture->glRenderbuffer;
        auto &   cacheMap   = isTexture ? _textureMap : _renderbufferMap;
        uint32_t mipLevel   = isTexture ? subres.mipLevel : 0;

        if (gpuTexture->swapchain) return gpuTexture->swapchain->glFramebuffer;
        CCASSERT(gpuTexture->glTexture || gpuTexture->glRenderbuffer, "Texture already destroyed?");

        if (cacheMap[glResource].empty()) cacheMap[glResource].resize(gpuTexture->mipLevel);

        if (!cacheMap[glResource][mipLevel].glFramebuffer) {
            GLuint glFramebuffer = 0U;
            GL_CHECK(glGenFramebuffers(1, &glFramebuffer));
            if (_cache->glDrawFramebuffer != glFramebuffer) {
                GL_CHECK(glBindFramebuffer(GL_DRAW_FRAMEBUFFER, glFramebuffer));
                _cache->glDrawFramebuffer = glFramebuffer;
            }

            const FormatInfo &info       = GFX_FORMAT_INFOS[static_cast<uint32_t>(gpuTexture->format)];
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

            cacheMap[glResource][mipLevel].glFramebuffer = glFramebuffer;
        }

        return cacheMap[glResource][mipLevel].glFramebuffer;
    }

    void onTextureDestroy(const GLES3GPUTexture *gpuTexture) {
        bool   isTexture  = gpuTexture->glTexture;
        GLuint glResource = isTexture ? gpuTexture->glTexture : gpuTexture->glRenderbuffer;
        auto & cacheMap   = isTexture ? _textureMap : _renderbufferMap;

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
        bool   isExternal{false};
    };
    using CacheMap = unordered_map<GLuint, vector<FramebufferRecord>>;
    CacheMap _renderbufferMap; // renderbuffer -> mip level -> framebuffer
    CacheMap _textureMap;      // texture -> mip level -> framebuffer
};

class GLES3GPUFramebufferHub final : public Object {
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
    unordered_map<GLES3GPUTexture *, vector<GLES3GPUFramebuffer *>> _framebuffers;
};

} // namespace gfx
} // namespace cc
