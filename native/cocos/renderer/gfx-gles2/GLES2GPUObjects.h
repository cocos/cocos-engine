#ifndef CC_GFXGLES2_GPU_OBJECTS_H_
#define CC_GFXGLES2_GPU_OBJECTS_H_

#include "gles2w.h"

namespace cc {
namespace gfx {

class GLES2GPUBuffer : public Object {
public:
    BufferUsage usage = BufferUsage::NONE;
    MemoryUsage memUsage = MemoryUsage::NONE;
    uint size = 0;
    uint stride = 0;
    uint count = 0;
    GLenum glTarget = 0;
    GLuint glBuffer = 0;
    uint8_t *buffer = nullptr;
    DrawInfoList indirects;
};
typedef vector<GLES2GPUBuffer *> GLES2GPUBufferList;

class GLES2GPUBufferView : public Object {
public:
    GLES2GPUBuffer *gpuBuffer = nullptr;
    uint offset = 0u;
    uint range = 0u;
};

class GLES2GPUTexture : public Object {
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

typedef vector<GLES2GPUTexture *> GLES2GPUTextureList;

class GLES2GPUSampler : public Object {
public:
    Filter minFilter = Filter::NONE;
    Filter magFilter = Filter::NONE;
    Filter mipFilter = Filter::NONE;
    Address addressU = Address::CLAMP;
    Address addressV = Address::CLAMP;
    Address addressW = Address::CLAMP;
    uint minLOD = 0;
    uint maxLOD = 1000;
    GLenum glMinFilter = 0;
    GLenum glMagFilter = 0;
    GLenum glWrapS = 0;
    GLenum glWrapT = 0;
    GLenum glWrapR = 0;
};

struct GLES2GPUInput {
    uint binding = 0;
    String name;
    Type type = Type::UNKNOWN;
    uint stride = 0;
    uint count = 0;
    uint size = 0;
    GLenum glType = 0;
    GLint glLoc = -1;
};
typedef vector<GLES2GPUInput> GLES2GPUInputList;

struct GLES2GPUUniform {
    uint binding = GFX_INVALID_BINDING;
    String name;
    Type type = Type::UNKNOWN;
    uint stride = 0;
    uint count = 0;
    uint size = 0;
    uint offset = 0;
    GLenum glType = 0;
    GLint glLoc = -1;
    uint8_t *buff = nullptr;

    GLES2GPUUniform() {}
    GLES2GPUUniform(const GLES2GPUUniform &rhs) {
        *this = rhs;
    }

    GLES2GPUUniform &operator=(const GLES2GPUUniform &rhs) {
        if (this != &rhs) {
            binding = rhs.binding;
            name = rhs.name;
            type = rhs.type;
            stride = rhs.stride;
            count = rhs.count;
            offset = rhs.offset;
            glType = rhs.glType;
            glLoc = rhs.glLoc;
            if (size != rhs.size) {
                size = rhs.size;
                CC_SAFE_FREE(buff);
                buff = (uint8_t *)CC_MALLOC(size);
            }
            if (buff && rhs.buff)
                memcpy(buff, rhs.buff, size);
        }
        return *this;
    }

    ~GLES2GPUUniform() {
        CC_SAFE_FREE(buff);
    }
};
typedef vector<GLES2GPUUniform> GLES2GPUUniformList;

struct GLES2GPUUniformBlock {
    uint set = 0;
    uint binding = 0;
    uint idx = 0;
    String name;
    uint size = 0;
    GLES2GPUUniformList glUniforms;
    GLES2GPUUniformList glActiveUniforms;
};
typedef vector<GLES2GPUUniformBlock> GLES2GPUUniformBlockList;

struct GLES2GPUUniformSampler {
    uint set = 0;
    uint binding = 0;
    String name;
    Type type = Type::UNKNOWN;
    uint count = 0u;

    vector<int> units;
    GLenum glType = 0;
    GLint glLoc = -1;
};
typedef vector<GLES2GPUUniformSampler> GLES2GPUUniformSamplerList;

struct GLES2GPUShaderStage {
    GLES2GPUShaderStage(ShaderStageFlagBit t, String s, GLuint shader = 0)
    : type(t), source(s), glShader(shader) {}
    ShaderStageFlagBit type;
    String source;
    GLuint glShader = 0;
};
typedef vector<GLES2GPUShaderStage> GLES2GPUShaderStageList;

class GLES2GPUShader : public Object {
public:
    String name;
    UniformBlockList blocks;
    UniformSamplerList samplers;
    GLuint glProgram = 0;
    GLES2GPUShaderStageList gpuStages;
    GLES2GPUInputList glInputs;
    GLES2GPUUniformBlockList glBlocks;
    GLES2GPUUniformSamplerList glSamplers;
};

struct GLES2GPUAttribute {
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
typedef vector<GLES2GPUAttribute> GLES2GPUAttributeList;

class GLES2GPUInputAssembler : public Object {
public:
    AttributeList attributes;
    GLES2GPUBufferList gpuVertexBuffers;
    GLES2GPUBuffer *gpuIndexBuffer = nullptr;
    GLES2GPUBuffer *gpuIndirectBuffer = nullptr;
    GLES2GPUAttributeList glAttribs;
    GLenum glIndexType = 0;
    map<GLuint, GLuint> glVAOs;
};

class GLES2GPURenderPass : public Object {
public:
    ColorAttachmentList colorAttachments;
    DepthStencilAttachment depthStencilAttachment;
};

class GLES2GPUFramebuffer : public Object {
public:
    GLES2GPURenderPass *gpuRenderPass = nullptr;
    GLES2GPUTextureList gpuColorTextures;
    GLES2GPUTexture *gpuDepthStencilTexture = nullptr;
    GLuint glFramebuffer = 0;
    bool isOffscreen = false;
};

class GLES2GPUDescriptorSetLayout : public Object {
public:
    DescriptorSetLayoutBindingList bindings;
    vector<uint> dynamicBindings;

    vector<uint> bindingIndices;
    vector<uint> descriptorIndices;
    uint descriptorCount = 0u;
};
typedef vector<GLES2GPUDescriptorSetLayout *> GLES2GPUDescriptorSetLayoutList;

class GLES2GPUPipelineLayout : public Object {
public:
    GLES2GPUDescriptorSetLayoutList setLayouts;
    vector<vector<int>> dynamicOffsetIndices;
    uint dynamicOffsetCount;
};

class GLES2GPUPipelineState : public Object {
public:
    GLenum glPrimitive = GL_TRIANGLES;
    GLES2GPUShader *gpuShader = nullptr;
    RasterizerState rs;
    DepthStencilState dss;
    BlendState bs;
    DynamicStateList dynamicStates;
    GLES2GPUPipelineLayout *gpuLayout = nullptr;
    GLES2GPURenderPass *gpuRenderPass = nullptr;
    GLES2GPUPipelineLayout *gpuPipelineLayout = nullptr;
};

struct GLES2GPUDescriptor {
    DescriptorType type = DescriptorType::UNKNOWN;
    GLES2GPUBuffer *gpuBuffer = nullptr;
    GLES2GPUBufferView *gpuBufferView = nullptr;
    GLES2GPUTexture *gpuTexture = nullptr;
    GLES2GPUSampler *gpuSampler = nullptr;
};
typedef vector<GLES2GPUDescriptor> GLES2GPUDescriptorList;

class GLES2GPUDescriptorSet : public Object {
public:
    GLES2GPUDescriptorList gpuDescriptors;
    const vector<uint> *descriptorIndices = nullptr;
};

class GLES2GPUFence : public Object {
public:
};

class GLES2GPUStateCache : public Object {
public:
    GLuint glArrayBuffer = 0;
    GLuint glElementArrayBuffer = 0;
    GLuint glUniformBuffer = 0;
    GLuint glVAO = 0;
    uint texUint = 0;
    vector<GLuint> glTextures;
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
    BlendTargetList bt;
    bool isCullFaceEnabled = true;
    bool isStencilTestEnabled = false;
    map<String, uint> texUnitCacheMap;

    void initialize(size_t texUnits, size_t vertexAttributes) {
        bt.resize(1);
        bs.targets.push_back(bt[0]);
        glTextures.resize(texUnits, 0u);
        glEnabledAttribLocs.resize(vertexAttributes, false);
        glCurrentAttribLocs.resize(vertexAttributes, false);
    }
};

constexpr size_t chunkSize = 16 * 1024 * 1024; // 16M per block by default
class GLES2GPUStagingBufferPool : public Object {
public:
    ~GLES2GPUStagingBufferPool() {
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
