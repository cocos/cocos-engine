#ifndef CC_GFXGLES3_GPU_OBJECTS_H_
#define CC_GFXGLES3_GPU_OBJECTS_H_

#include "gles3w.h"

namespace cc {
namespace gfx {

class GLES3GPUBuffer : public Object {
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

class GLES3GPUTexture : public Object {
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

class GLES3GPUSampler : public Object {
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

struct GLES3GPUInput {
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

struct GLES3GPUUniform {
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

struct GLES3GPUUniformBlock {
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

struct GLES3GPUUniformSampler {
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

struct GLES3GPUShaderStage {
    GLES3GPUShaderStage(ShaderStageFlagBit t, String s, GLuint shader = 0)
    : type(t), source(s), glShader(shader) {}
    ShaderStageFlagBit type;
    String source;
    GLuint glShader = 0;
};
typedef vector<GLES3GPUShaderStage> GLES3GPUShaderStageList;

class GLES3GPUShader : public Object {
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

struct GLES3GPUAttribute {
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

class GLES3GPUInputAssembler : public Object {
public:
    AttributeList attributes;
    GLES3GPUBufferList gpuVertexBuffers;
    GLES3GPUBuffer *gpuIndexBuffer = nullptr;
    GLES3GPUBuffer *gpuIndirectBuffer = nullptr;
    GLES3GPUAttributeList glAttribs;
    GLenum glIndexType = 0;
    map<GLuint, GLuint> glVAOs;
};

class GLES3GPURenderPass : public Object {
public:
    ColorAttachmentList colorAttachments;
    DepthStencilAttachment depthStencilAttachment;
};

class GLES3GPUFramebuffer : public Object {
public:
    GLES3GPURenderPass *gpuRenderPass = nullptr;
    GLES3GPUTextureList gpuColorTextures;
    vector<GLint> colorMipmapLevels;
    GLES3GPUTexture *gpuDepthStencilTexture = nullptr;
    GLint depthStencilMipmapLevel = 0;
    GLuint glFramebuffer = 0;
    bool isOffscreen = false;
};

class GLES3GPUDescriptorSetLayout : public Object {
public:
    DescriptorSetLayoutBindingList bindings;
    vector<uint> dynamicBindings;

    vector<uint> descriptorIndices;
    uint descriptorCount = 0u;
};
typedef vector<GLES3GPUDescriptorSetLayout *> GLES3GPUDescriptorSetLayoutList;

class GLES3GPUPipelineLayout : public Object {
public:
    GLES3GPUDescriptorSetLayoutList setLayouts;
    vector<vector<int>> dynamicOffsetIndices;
    vector<uint> dynamicOffsetOffsets;
    uint dynamicOffsetCount;
};

class GLES3GPUPipelineState : public Object {
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

struct GLES3GPUDescriptor {
    DescriptorType type = DescriptorType::UNKNOWN;
    GLES3GPUBuffer *gpuBuffer = nullptr;
    GLES3GPUTexture *gpuTexture = nullptr;
    GLES3GPUSampler *gpuSampler = nullptr;
};
typedef vector<GLES3GPUDescriptor> GLES3GPUDescriptorList;

class GLES3GPUDescriptorSet : public Object {
public:
    GLES3GPUDescriptorList gpuDescriptors;
    const vector<uint> *descriptorIndices = nullptr;
};

class GLES3GPUFence : public Object {
public:
};

} // namespace gfx
} // namespace cc

#endif
