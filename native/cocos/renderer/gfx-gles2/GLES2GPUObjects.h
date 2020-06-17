#ifndef CC_GFXGLES2_GPU_OBJECTS_H_
#define CC_GFXGLES2_GPU_OBJECTS_H_

#include "gles2w.h"

namespace cc {
namespace gfx {

class GLES2GPUBuffer : public Object {
public:
    GFXBufferUsage usage = GFXBufferUsage::NONE;
    GFXMemoryUsage memUsage = GFXMemoryUsage::NONE;
    uint size = 0;
    uint stride = 0;
    uint count = 0;
    GLenum glTarget = 0;
    GLuint glBuffer = 0;
    uint8_t *buffer = nullptr;
    GFXDrawInfoList indirects;
};
typedef vector<GLES2GPUBuffer *> GLES2GPUBufferList;

class GLES2GPUTexture : public Object {
public:
    GFXTextureType type = GFXTextureType::TEX2D;
    GFXFormat format = GFXFormat::UNKNOWN;
    GFXTextureUsage usage = GFXTextureUsageBit::NONE;
    uint width = 0;
    uint height = 0;
    uint depth = 1;
    uint size = 0;
    uint arrayLayer = 1;
    uint mipLevel = 1;
    GFXSampleCount samples = GFXSampleCount::X1;
    GFXTextureFlags flags = GFXTextureFlagBit::NONE;
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
    GFXFilter minFilter = GFXFilter::NONE;
    GFXFilter magFilter = GFXFilter::NONE;
    GFXFilter mipFilter = GFXFilter::NONE;
    GFXAddress addressU = GFXAddress::CLAMP;
    GFXAddress addressV = GFXAddress::CLAMP;
    GFXAddress addressW = GFXAddress::CLAMP;
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
    GFXType type = GFXType::UNKNOWN;
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
    GFXType type = GFXType::UNKNOWN;
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
    uint binding = 0;
    uint idx = 0;
    String name;
    uint size = 0;
    GLES2GPUUniformList glUniforms;
    GLES2GPUUniformList glActiveUniforms;
};
typedef vector<GLES2GPUUniformBlock> GLES2GPUUniformBlockList;

struct GLES2GPUUniformSampler {
    uint binding = 0;
    String name;
    GFXType type = GFXType::UNKNOWN;
    vector<int> units;
    GLenum glType = 0;
    GLint glLoc = -1;
};
typedef vector<GLES2GPUUniformSampler> GLES2GPUUniformSamplerList;

struct GLES2GPUShaderStage {
    GLES2GPUShaderStage(GFXShaderType t, String s, GFXShaderMacroList m, GLuint shader = 0)
    : type(t), source(s), macros(m), glShader(shader) {}
    GFXShaderType type;
    String source;
    GFXShaderMacroList macros;
    GLuint glShader = 0;
};
typedef vector<GLES2GPUShaderStage> GLES2GPUShaderStageList;

class GLES2GPUShader : public Object {
public:
    String name;
    GFXUniformBlockList blocks;
    GFXUniformSamplerList samplers;
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
    GFXAttributeList attributes;
    GLES2GPUBufferList gpuVertexBuffers;
    GLES2GPUBuffer *gpuIndexBuffer = nullptr;
    GLES2GPUBuffer *gpuIndirectBuffer = nullptr;
    GLES2GPUAttributeList glAttribs;
    GLenum glIndexType = 0;
    map<GLuint, GLuint> glVAOs;
};

class GLES2GPURenderPass : public Object {
public:
    GFXColorAttachmentList colorAttachments;
    GFXDepthStencilAttachment depthStencilAttachment;
};

class GLES2GPUFramebuffer : public Object {
public:
    GLES2GPURenderPass *gpuRenderPass = nullptr;
    GLES2GPUTextureList gpuColorTextures;
    GLES2GPUTexture *gpuDepthStencilTexture = nullptr;
    bool isOffscreen = false;
    GLuint glFramebuffer = 0;
};

class GLES2GPUPipelineLayout : public Object {
public:
};

class GLES2GPUPipelineState : public Object {
public:
    GLenum glPrimitive = GL_TRIANGLES;
    GLES2GPUShader *gpuShader = nullptr;
    GFXRasterizerState rs;
    GFXDepthStencilState dss;
    GFXBlendState bs;
    GFXDynamicStateList dynamicStates;
    GLES2GPUPipelineLayout *gpuLayout = nullptr;
    GLES2GPURenderPass *gpuRenderPass = nullptr;
};

struct GLES2GPUBinding {
    uint binding = GFX_INVALID_BINDING;
    GFXBindingType type = GFXBindingType::UNKNOWN;
    String name;
    GLES2GPUBuffer *gpuBuffer = nullptr;
    GLES2GPUTexture *gpuTexture = nullptr;
    GLES2GPUSampler *gpuSampler = nullptr;
};
typedef vector<GLES2GPUBinding> GLES2GPUBindingList;

class GLES2GPUBindingLayout : public Object {
public:
    GLES2GPUBindingList gpuBindings;
};

class GLES2GPUFence : public Object {
public:
};

} // namespace gfx
} // namespace cc

#endif
