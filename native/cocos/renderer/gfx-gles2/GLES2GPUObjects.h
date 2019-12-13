#ifndef CC_GFXGLES2_GPU_OBJECTS_H_
#define CC_GFXGLES2_GPU_OBJECTS_H_

#include "gles2w.h"

NS_CC_BEGIN

class GLES2GPUBuffer : public Object {
 public:
  GFXBufferUsage usage = GFXBufferUsage::NONE;
  GFXMemoryUsage mem_usage = GFXMemoryUsage::NONE;
  uint size = 0;
  uint stride = 0;
  uint count = 0;
  GLenum gl_target = 0;
  GLuint gl_buffer = 0;
  uint8_t* buffer = nullptr;
  GFXIndirectBuffer indirect_buff;
};
typedef vector<GLES2GPUBuffer*>::type GLES2GPUBufferList;

class GLES2GPUTexture : public Object {
 public:
  GFXTextureType type = GFXTextureType::TEX2D;
  GFXTextureViewType view_type = GFXTextureViewType::TV2D;
  GFXFormat format = GFXFormat::UNKNOWN;
  GFXTextureUsage usage = GFXTextureUsageBit::NONE;
  uint width = 0;
  uint height = 0;
  uint depth = 1;
  uint size = 0;
  uint array_layer = 1;
  uint mip_level = 1;
  GFXSampleCount samples = GFXSampleCount::X1;
  GFXTextureFlags flags = GFXTextureFlagBit::NONE;
  bool is_pot = false;
  GLenum gl_target = 0;
  GLenum gl_internal_fmt = 0;
  GLenum gl_format = 0;
  GLenum gl_type = 0;
  GLenum gl_usage = 0;
  GLuint gl_texture = 0;
  GLenum gl_wrap_s = 0;
  GLenum gl_wrap_t = 0;
  GLenum gl_min_filter = 0;
  GLenum gl_mag_filter = 0;
};

class GLES2GPUTextureView : public Object {
 public:
  GLES2GPUTexture* gpu_texture = nullptr;
  GFXTextureViewType type = GFXTextureViewType::TV2D;
  GFXFormat format = GFXFormat::UNKNOWN;
  uint base_level = 0;
  uint level_count = 1;
};

typedef vector<GLES2GPUTextureView*>::type GLES2GPUTextureViewList;

class GLES2GPUSampler : public Object {
 public:
  GFXFilter min_filter = GFXFilter::NONE;
  GFXFilter mag_filter = GFXFilter::NONE;
  GFXFilter mip_filter = GFXFilter::NONE;
  GFXAddress address_u = GFXAddress::CLAMP;
  GFXAddress address_v = GFXAddress::CLAMP;
  GFXAddress address_w = GFXAddress::CLAMP;
  uint min_lod = 0;
  uint max_lod = 1000;
  GLenum gl_min_filter = 0;
  GLenum gl_mag_filter = 0;
  GLenum gl_wrap_s = 0;
  GLenum gl_wrap_t = 0;
  GLenum gl_wrap_r = 0;
};

struct GLES2GPUInput {
  uint binding;
  String name;
  GFXType type;
  uint stride;
  uint count;
  uint size;
  GLenum gl_type;
  GLint gl_loc;
};
typedef vector<GLES2GPUInput>::type GLES2GPUInputList;

struct GLES2GPUUniform
{
    uint binding = GFX_INVALID_BINDING;
    String name;
    GFXType type = GFXType::UNKNOWN;
    uint stride = 0;
    uint count = 0;
    uint size = 0;
    uint offset = 0;
    GLenum gl_type;
    GLint gl_loc = -1;
    uint8_t* buff = nullptr;

    GLES2GPUUniform() {}
    GLES2GPUUniform(const GLES2GPUUniform& rhs)
    {
        *this = rhs;
    }

    GLES2GPUUniform& operator =(const GLES2GPUUniform& rhs)
    {
        if(this != &rhs)
        {
            binding = rhs.binding;
            name = rhs.name;
            type = rhs.type;
            stride = rhs.stride;
            count = rhs.count;
            offset = rhs.offset;
            gl_type = rhs.gl_type;
            gl_loc = rhs.gl_loc;
            if(size != rhs.size)
            {
                size = rhs.size;
                CC_SAFE_FREE(buff);
                buff = (uint8_t*)CC_MALLOC(size);
            }
            if(buff && rhs.buff)
                memcpy(buff, rhs.buff, size);
        }
        return *this;
    }
    
    ~GLES2GPUUniform()
    {
        CC_SAFE_FREE(buff);
    }
};
typedef vector<GLES2GPUUniform>::type GLES2GPUUniformList;

struct GLES2GPUUniformBlock {
  uint binding;
  uint idx;
  String name;
  uint size;
  GLES2GPUUniformList uniforms;
  GLES2GPUUniformList active_uniforms;
};
typedef vector<GLES2GPUUniformBlock>::type GLES2GPUUniformBlockList;

struct GLES2GPUUniformSampler {
  uint binding;
  String name;
  GFXType type;
  vector<int>::type units;
  GLenum gl_type;
  GLint gl_loc;
};
typedef vector<GLES2GPUUniformSampler>::type GLES2GPUUniformSamplerList;

struct GLES2GPUShaderStage {
  GFXShaderType type;
  String source;
  GFXShaderMacroList macros;
  GLuint gl_shader = 0;
};
typedef vector<GLES2GPUShaderStage>::type GLES2GPUShaderStageList;

class GLES2GPUShader : public Object {
public:
  String name;
  GFXUniformBlockList blocks;
  GFXUniformSamplerList samplers;
  GLuint gl_program = 0;
  GLES2GPUShaderStageList gpu_stages;
  GLES2GPUInputList gpu_inputs;
  GLES2GPUUniformBlockList gpu_blocks;
  GLES2GPUUniformSamplerList gpu_samplers;
};

struct GLES2GPUAttribute {
  String name;
  GLuint gl_buffer = 0;
  GLenum gl_type = 0;
  uint size = 0;
  uint count = 0;
  uint stride = 1;
  uint component_count = 1;
  bool is_normalized = false;
  bool is_instanced = false;
  uint offset = 0;
};
typedef vector<GLES2GPUAttribute>::type GLES2GPUAttributeList;

class GLES2GPUInputAssembler : public Object {
 public:
  GFXAttributeList attribs;
  GLES2GPUBufferList gpu_vertex_buffers;
  GLES2GPUBuffer* gpu_index_buffer = nullptr;
  GLES2GPUBuffer* gpu_indirect_buffer = nullptr;
  GLES2GPUAttributeList gpu_attribs;
  GLenum gl_index_type;
  map<GLuint, GLuint>::type gl_vaos;
};

class GLES2GPURenderPass : public Object {
 public:
  GFXColorAttachmentList color_attachments;
  GFXDepthStencilAttachment depth_stencil_attachment;
};

class GLES2GPUFramebuffer : public Object {
 public:
  GLES2GPURenderPass* gpu_render_pass = nullptr;
  GLES2GPUTextureViewList gpu_color_views;
  GLES2GPUTextureView* gpu_depth_stencil_view = nullptr;
  bool is_offscreen = false;
  GLuint gl_fbo = 0;
};

class GLES2GPUPipelineLayout : public Object {
 public:
};

class GLES2GPUPipelineState : public Object {
 public:
  GLenum gl_primitive = GL_TRIANGLES;
  GLES2GPUShader* gpu_shader = nullptr;
  GFXRasterizerState rs;
  GFXDepthStencilState dss;
  GFXBlendState bs;
  GFXDynamicStateList dynamic_states;
  GLES2GPUPipelineLayout* gpu_layout = nullptr;
  GLES2GPURenderPass* gpu_render_pass = nullptr;
};

struct GLES2GPUBinding {
  uint binding = GFX_INVALID_BINDING;
  GFXBindingType type = GFXBindingType::UNKNOWN;
  String name;
  GLES2GPUBuffer* gpu_buffer = nullptr;
  GLES2GPUTextureView* gpu_tex_view = nullptr;
  GLES2GPUSampler* gpu_sampler = nullptr;
};
typedef vector<GLES2GPUBinding>::type GLES2GPUBindingList;

class GLES2GPUBindingLayout : public Object {
 public:
  GLES2GPUBindingList gpu_bindings;
};

NS_CC_END

#endif
