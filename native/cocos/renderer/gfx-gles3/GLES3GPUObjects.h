#ifndef CC_GFXGLES3_GPU_OBJECTS_H_
#define CC_GFXGLES3_GPU_OBJECTS_H_

#include "gles3w.h"

namespace cc {
namespace gfx {

class GLES3GPUBuffer final : public Object {
public:
    BufferUsage usage = BufferUsage::NONE;
    MemoryUsage memUsage = MemoryUsage::NONE;
    uint size = 0;
    uint stride = 0;
    uint count = 0;
    GLenum glTarget = 0;
    GLuint glBuffer = 0;
    GLuint glOffset = 0;
    uint8_t *buffer = nullptr;
    DrawInfoList indirects;
};
typedef vector<GLES3GPUBuffer *> GLES3GPUBufferList;

class GLES3GPUTexture final : public Object {
public:
    TextureType type = TextureType::TEX2D;
    Format format = Format::UNKNOWN;
    TextureUsage usage = TextureUsageBit::NONE;
    uint width = 0;
    uint height = 0;
    uint depth = 1;
    uint size = 0;
    uint arrayLayer = 1;
    uint mipLevel = 1;
    SampleCount samples = SampleCount::X1;
    TextureFlags flags = TextureFlagBit::NONE;
    bool isPowerOf2 = false;
    GLenum glTarget = 0;
    GLenum glInternelFmt = 0;
    GLenum glFormat = 0;
    GLenum glType = 0;
    GLenum glUsage = 0;
    GLuint glTexture = 0;
    GLenum glWrapS = 0;
    GLenum glWrapT = 0;
    GLenum glMinFilter = 0;
    GLenum glMagFilter = 0;
};

typedef vector<GLES3GPUTexture *> GLES3GPUTextureList;

class GLES3GPUSampler final : public Object {
public:
    Filter minFilter = Filter::NONE;
    Filter magFilter = Filter::NONE;
    Filter mipFilter = Filter::NONE;
    Address addressU = Address::CLAMP;
    Address addressV = Address::CLAMP;
    Address addressW = Address::CLAMP;
    uint minLOD = 0;
    uint maxLOD = 1000;
    GLuint glSampler = 0;
    GLenum glMinFilter = 0;
    GLenum glMagFilter = 0;
    GLenum glWrapS = 0;
    GLenum glWrapT = 0;
    GLenum glWrapR = 0;
};

struct GLES3GPUInput final {
    uint binding = 0;
    String name;
    Type type = Type::UNKNOWN;
    uint stride = 0;
    uint count = 0;
    uint size = 0;
    GLenum glType = 0;
    GLint glLoc = -1;
};
typedef vector<GLES3GPUInput> GLES3GPUInputList;

struct GLES3GPUUniform final {
    uint binding = GFX_INVALID_BINDING;
    String name;
    Type type = Type::UNKNOWN;
    uint stride = 0;
    uint count = 0;
    uint size = 0;
    uint offset = 0;
    GLenum glType = 0;
    GLint glLoc = -1;
};
typedef vector<GLES3GPUUniform> GLES3GPUUniformList;

struct GLES3GPUUniformBlock final {
    uint set = GFX_INVALID_BINDING;
    uint binding = GFX_INVALID_BINDING;
    uint idx = 0;
    String name;
    uint size = 0;
    uint glBinding = GFX_INVALID_BINDING;
    GLES3GPUUniformList glUniforms;
    GLES3GPUUniformList glActiveUniforms;
};
typedef vector<GLES3GPUUniformBlock> GLES3GPUUniformBlockList;

struct GLES3GPUUniformSampler final {
    uint set = 0;
    uint binding = 0;
    String name;
    Type type = Type::UNKNOWN;
    uint count = 0u;

    vector<int> units;
    GLenum glType = 0;
    GLint glLoc = -1;
};
typedef vector<GLES3GPUUniformSampler> GLES3GPUUniformSamplerList;

struct GLES3GPUShaderStage final {
    GLES3GPUShaderStage(ShaderStageFlagBit t, String s, GLuint shader = 0)
    : type(t), source(s), glShader(shader) {}
    ShaderStageFlagBit type;
    String source;
    GLuint glShader = 0;
};
typedef vector<GLES3GPUShaderStage> GLES3GPUShaderStageList;

class GLES3GPUShader final : public Object {
public:
    String name;
    UniformBlockList blocks;
    UniformSamplerList samplers;
    GLuint glProgram = 0;
    GLES3GPUShaderStageList gpuStages;
    GLES3GPUInputList glInputs;
    GLES3GPUUniformBlockList glBlocks;
    GLES3GPUUniformSamplerList glSamplers;
};

struct GLES3GPUAttribute final {
    String name;
    GLuint glBuffer = 0;
    GLenum glType = 0;
    uint size = 0;
    uint count = 0;
    uint stride = 1;
    uint componentCount = 1;
    bool isNormalized = false;
    bool isInstanced = false;
    uint offset = 0;
};
typedef vector<GLES3GPUAttribute> GLES3GPUAttributeList;

class GLES3GPUInputAssembler final : public Object {
public:
    AttributeList attributes;
    GLES3GPUBufferList gpuVertexBuffers;
    GLES3GPUBuffer *gpuIndexBuffer = nullptr;
    GLES3GPUBuffer *gpuIndirectBuffer = nullptr;
    GLES3GPUAttributeList glAttribs;
    GLenum glIndexType = 0;
    map<GLuint, GLuint> glVAOs;
};

class GLES3GPURenderPass final : public Object {
public:
    ColorAttachmentList colorAttachments;
    DepthStencilAttachment depthStencilAttachment;
};

class GLES3GPUFramebuffer final : public Object {
public:
    GLES3GPURenderPass *gpuRenderPass = nullptr;
    GLES3GPUTextureList gpuColorTextures;
    vector<GLint> colorMipmapLevels;
    GLES3GPUTexture *gpuDepthStencilTexture = nullptr;
    GLint depthStencilMipmapLevel = 0;
    GLuint glFramebuffer = 0;
    bool isOffscreen = false;
};

class GLES3GPUDescriptorSetLayout final : public Object {
public:
    DescriptorSetLayoutBindingList bindings;
    vector<uint> dynamicBindings;

    vector<uint> bindingIndices;
    vector<uint> descriptorIndices;
    uint descriptorCount = 0u;
};
typedef vector<GLES3GPUDescriptorSetLayout *> GLES3GPUDescriptorSetLayoutList;

class GLES3GPUPipelineLayout final : public Object {
public:
    GLES3GPUDescriptorSetLayoutList setLayouts;

    // helper storages
    vector<vector<int>> dynamicOffsetIndices;
    vector<uint> dynamicOffsetOffsets;
    vector<uint> dynamicOffsets;
    uint dynamicOffsetCount;
};

class GLES3GPUPipelineState final : public Object {
public:
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

struct GLES3GPUDescriptor final {
    DescriptorType type = DescriptorType::UNKNOWN;
    GLES3GPUBuffer *gpuBuffer = nullptr;
    GLES3GPUTexture *gpuTexture = nullptr;
    GLES3GPUSampler *gpuSampler = nullptr;
};
typedef vector<GLES3GPUDescriptor> GLES3GPUDescriptorList;

class GLES3GPUDescriptorSet final : public Object {
public:
    GLES3GPUDescriptorList gpuDescriptors;
    const vector<uint> *descriptorIndices = nullptr;
};

class GLES3GPUFence final : public Object {
public:
};

struct GLES3ObjectCache final {
    size_t numClearColors = 0u;
    GLES3GPURenderPass *gpuRenderPass = nullptr;
    GLES3GPUFramebuffer *gpuFramebuffer = nullptr;
    GLES3GPUPipelineState *gpuPipelineState = nullptr;
    GLES3GPUInputAssembler *gpuInputAssembler = nullptr;
    bool reverseCW = false;
    GLenum glPrimitive = 0;
    GLenum invalidAttachments[GFX_MAX_ATTACHMENTS];
};

class GLES3GPUStateCache final : public Object {
public:
    GLuint glArrayBuffer = 0;
    GLuint glElementArrayBuffer = 0;
    GLuint glUniformBuffer = 0;
    vector<GLuint> glBindUBOs;
    vector<GLuint> glBindUBOOffsets;
    GLuint glVAO = 0;
    uint texUint = 0;
    vector<GLuint> glTextures;
    vector<GLuint> glSamplers;
    GLuint glProgram = 0;
    vector<bool> glEnabledAttribLocs;
    vector<bool> glCurrentAttribLocs;
    GLuint glFramebuffer = 0;
    GLuint glReadFBO = 0;
    Viewport viewport;
    Rect scissor;
    RasterizerState rs;
    DepthStencilState dss;
    BlendState bs;
    bool isCullFaceEnabled = true;
    bool isStencilTestEnabled = false;
    map<String, uint> texUnitCacheMap;
    GLES3ObjectCache gfxStateCache;

    void initialize(size_t texUnits, size_t bufferBindings, size_t vertexAttributes) {
        glBindUBOs.resize(bufferBindings, 0u);
        glBindUBOOffsets.resize(bufferBindings, 0u);
        glTextures.resize(texUnits, 0u);
        glSamplers.resize(texUnits, 0u);
        glEnabledAttribLocs.resize(vertexAttributes, false);
        glCurrentAttribLocs.resize(vertexAttributes, false);
    }

    void reset() {
        glArrayBuffer = 0;
        glElementArrayBuffer = 0;
        glUniformBuffer = 0;
        glBindUBOs.assign(glBindUBOs.size(), 0u);
        glBindUBOOffsets.assign(glBindUBOOffsets.size(), 0u);
        glVAO = 0;
        texUint = 0;
        glTextures.assign(glTextures.size(), 0u);
        glSamplers.assign(glSamplers.size(), 0u);
        glProgram = 0;
        glEnabledAttribLocs.assign(glEnabledAttribLocs.size(), 0u);
        glCurrentAttribLocs.assign(glCurrentAttribLocs.size(), 0u);
        glFramebuffer = 0;
        glReadFBO = 0;
        isCullFaceEnabled = true;
        isStencilTestEnabled = false;

        viewport = Viewport();
        scissor = Rect();
        rs = RasterizerState();
        dss = DepthStencilState();
        bs = BlendState();

        gfxStateCache.numClearColors = 0u;
        gfxStateCache.gpuRenderPass = nullptr;
        gfxStateCache.gpuFramebuffer = nullptr;
        gfxStateCache.gpuPipelineState = nullptr;
        gfxStateCache.gpuInputAssembler = nullptr;
        gfxStateCache.glPrimitive = 0u;
        gfxStateCache.reverseCW = false;
    }
};

constexpr size_t chunkSize = 16 * 1024 * 1024; // 16M per block by default
class GLES3GPUStagingBufferPool final : public Object {
public:
    ~GLES3GPUStagingBufferPool() {
        for (Buffer &buffer : _pool) {
            CC_FREE(buffer.mappedData);
        }
        _pool.clear();
    }

    uint8_t *alloc(size_t size) {
        size_t bufferCount = _pool.size();
        Buffer *buffer = nullptr;
        for (size_t idx = 0u; idx < bufferCount; idx++) {
            Buffer *cur = &_pool[idx];
            if (chunkSize - cur->curOffset >= size) {
                buffer = cur;
                break;
            }
        }
        if (!buffer) {
            _pool.resize(bufferCount + 1);
            buffer = &_pool.back();
            buffer->mappedData = (uint8_t *)CC_MALLOC(chunkSize);
        }
        uint8_t *data = buffer->mappedData + buffer->curOffset;
        buffer->curOffset += size;
        return data;
    }

    void reset() {
        for (Buffer &buffer : _pool) {
            buffer.curOffset = 0u;
        }
    }

private:
    struct Buffer {
        uint8_t *mappedData = nullptr;
        size_t curOffset = 0u;
    };
    vector<Buffer> _pool;
};

} // namespace gfx
} // namespace cc

#endif
