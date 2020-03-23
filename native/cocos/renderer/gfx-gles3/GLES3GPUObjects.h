#ifndef CC_GFXGLES3_GPU_OBJECTS_H_
#define CC_GFXGLES3_GPU_OBJECTS_H_

#include "gles3w.h"

NS_CC_BEGIN

class GLES3GPUBuffer : public Object {
 public:
  GFXBufferUsage usage = GFXBufferUsage::NONE;
  GFXMemoryUsage memUsage = GFXMemoryUsage::NONE;
  uint size = 0;
  uint stride = 0;
  uint count = 0;
  GLenum glTarget = 0;
  GLuint glBuffer = 0;
  uint8_t* buffer = nullptr;
  GFXDrawInfoList indirects;
};
typedef vector<GLES3GPUBuffer*>::type GLES3GPUBufferList;

class GLES3GPUTexture : public Object {
 public:
  GFXTextureType type = GFXTextureType::TEX2D;
  GFXTextureViewType viewType = GFXTextureViewType::TV2D;
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

class GLES3GPUTextureView : public Object {
 public:
  GLES3GPUTexture* gpuTexture = nullptr;
  GFXTextureViewType type = GFXTextureViewType::TV2D;
  GFXFormat format = GFXFormat::UNKNOWN;
  uint baseLevel = 0;
  uint levelCount = 1;
};

typedef vector<GLES3GPUTextureView*>::type GLES3GPUTextureViewList;

class GLES3GPUSampler : public Object {
 public:
  GFXFilter minFilter = GFXFilter::NONE;
  GFXFilter magFilter = GFXFilter::NONE;
  GFXFilter mipFilter = GFXFilter::NONE;
  GFXAddress addressU = GFXAddress::CLAMP;
  GFXAddress addressV = GFXAddress::CLAMP;
  GFXAddress addressW = GFXAddress::CLAMP;
  uint minLOD = 0;
  uint maxLOD = 1000;
  GLuint gl_sampler = 0;
  GLenum glMinFilter = 0;
  GLenum glMagFilter = 0;
  GLenum glWrapS = 0;
  GLenum glWrapT = 0;
  GLenum glWrapR = 0;
};

struct GLES3GPUInput {
  uint binding = 0;
  String name;
  GFXType type = GFXType::UNKNOWN;
  uint stride = 0;
  uint count = 0;
  uint size = 0;
  GLenum glType = 0;
  GLint glLoc = -1;
};
typedef vector<GLES3GPUInput>::type GLES3GPUInputList;

struct GLES3GPUUniform {
  uint binding = GFX_INVALID_BINDING;
  String name;
    GFXType type = GFXType::UNKNOWN;
  uint stride = 0;
  uint count = 0;
  uint size = 0;
  uint offset = 0;
  GLenum glType = 0;
  GLint glLoc = -1;
};
typedef vector<GLES3GPUUniform>::type GLES3GPUUniformList;

struct GLES3GPUUniformBlock {
  uint binding = 0;
  uint idx = 0;
  String name;
  uint size = 0;
  GLES3GPUUniformList glUniforms;
  GLES3GPUUniformList glActiveUniforms;
};
typedef vector<GLES3GPUUniformBlock>::type GLES3GPUUniformBlockList;

struct GLES3GPUUniformSampler {
  uint binding = 0;
  String name;
  GFXType type = GFXType::UNKNOWN;
  vector<int>::type units;
  GLenum glType = 0;
  GLint glLoc = -1;
};
typedef vector<GLES3GPUUniformSampler>::type GLES3GPUUniformSamplerList;

struct GLES3GPUShaderStage {
  GLES3GPUShaderStage(GFXShaderType t, String s, GFXShaderMacroList m, GLuint shader = 0)
    : type(t)
    , source(s)
    , macros(m)
    , glShader(shader)
    {}
  GFXShaderType type;
  String source;
  GFXShaderMacroList macros;
  GLuint glShader = 0;
};
typedef vector<GLES3GPUShaderStage>::type GLES3GPUShaderStageList;

class GLES3GPUShader : public Object {
public:
  String name;
  GFXUniformBlockList blocks;
  GFXUniformSamplerList samplers;
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
typedef vector<GLES3GPUAttribute>::type GLES3GPUAttributeList;

class GLES3GPUInputAssembler : public Object {
 public:
  GFXAttributeList attributes;
  GLES3GPUBufferList gpuVertexBuffers;
  GLES3GPUBuffer* gpuIndexBuffer = nullptr;
  GLES3GPUBuffer* gpuIndirectBuffer = nullptr;
  GLES3GPUAttributeList glAttribs;
  GLenum glIndexType = 0;
  map<GLuint, GLuint>::type glVAOs;
};

class GLES3GPURenderPass : public Object {
 public:
  GFXColorAttachmentList colorAttachments;
  GFXDepthStencilAttachment depthStencilAttachment;
};

class GLES3GPUFramebuffer : public Object {
 public:
  GLES3GPURenderPass* gpuRenderPass = nullptr;
  GLES3GPUTextureViewList gpuColorViews;
  GLES3GPUTextureView* gpuDepthStencilView = nullptr;
  bool isOffscreen = false;
  GLuint glFramebuffer = 0;
};

class GLES3GPUPipelineLayout : public Object {
 public:
};

class GLES3GPUPipelineState : public Object {
 public:
  GLenum glPrimitive = GL_TRIANGLES;
  GLES3GPUShader* gpuShader = nullptr;
  GFXRasterizerState rs;
  GFXDepthStencilState dss;
  GFXBlendState bs;
  GFXDynamicStateList dynamicStates;
  GLES3GPUPipelineLayout* gpuLayout = nullptr;
  GLES3GPURenderPass* gpuRenderPass = nullptr;
};

struct GLES3GPUBinding {
  uint binding = GFX_INVALID_BINDING;
  GFXBindingType type = GFXBindingType::UNKNOWN;
  String name;
  GLES3GPUBuffer* gpuBuffer = nullptr;
  GLES3GPUTextureView* gpuTexView = nullptr;
  GLES3GPUSampler* gpuSampler = nullptr;
};
typedef vector<GLES3GPUBinding>::type GLES3GPUBindingList;

class GLES3GPUBindingLayout : public Object {
 public:
  GLES3GPUBindingList gpuBindings;
};

NS_CC_END

#endif
