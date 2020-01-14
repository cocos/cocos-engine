#include "GLES2Std.h"
#include "GLES2Device.h"
#include "GLES2StateCache.h"
#include "GLES2Context.h"
#include "GLES2Window.h"
#include "GLES2Queue.h"
#include "GLES2CommandAllocator.h"
#include "GLES2CommandBuffer.h"
#include "GLES2Buffer.h"
#include "GLES2Texture.h"
#include "GLES2TextureView.h"
#include "GLES2Sampler.h"
#include "GLES2Shader.h"
#include "GLES2InputAssembler.h"
#include "GLES2RenderPass.h"
#include "GLES2Framebuffer.h"
#include "GLES2BindingLayout.h"
#include "GLES2PipelineLayout.h"
#include "GLES2PipelineState.h"

NS_CC_BEGIN

GLES2Device::GLES2Device()
{
}

GLES2Device::~GLES2Device()
{
}

bool GLES2Device::Initialize(const GFXDeviceInfo& info)
{
    api_ = GFXAPI::GLES2;
    width_ = info.width;
    height_ = info.height;
    native_width_ = info.native_width;
    native_height_ = info.native_height;
    window_handle_ = info.window_handle;

    state_cache = CC_NEW(GLES2StateCache);

    GFXContextInfo ctx_info;
    ctx_info.window_handle = window_handle_;
    ctx_info.shared_ctx = info.shared_ctx;

    context_ = CC_NEW(GLES2Context(this));
    if (!context_->Initialize(ctx_info))
    {
        Destroy();
        return false;
    }

    String extStr = (const char*)glGetString(GL_EXTENSIONS);
    extensions_ = StringUtil::Split(extStr, " ");

    features_[(int)GFXFeature::TEXTURE_FLOAT] = true;
    features_[(int)GFXFeature::TEXTURE_HALF_FLOAT] = true;
    features_[(int)GFXFeature::FORMAT_R11G11B10F] = true;
    features_[(int)GFXFeature::FORMAT_D24S8] = true;
    features_[(int)GFXFeature::MSAA] = true;

    if (CheckExtension("color_buffer_float"))
        features_[(int)GFXFeature::COLOR_FLOAT] = true;
    
    if (CheckExtension("color_buffer_half_float"))
        features_[(int)GFXFeature::COLOR_HALF_FLOAT] = true;
    
    if (CheckExtension("texture_float_linear"))
        features_[(int)GFXFeature::TEXTURE_FLOAT_LINEAR] = true;
    
    if (CheckExtension("texture_half_float_linear"))
        features_[(int)GFXFeature::TEXTURE_HALF_FLOAT_LINEAR] = true;
    

    use_vao_ = CheckExtension("GL_OES_depth_texture");
    use_draw_instanced_ = CheckExtension("draw_instanced_");
    use_instanced_arrays_ = CheckExtension("instanced_arrays");
    use_discard_framebuffer_ = CheckExtension("discard_framebuffer");

    String compressed_fmts;

    if (CheckExtension("compressed_ETC1"))
    {
        features_[(int)GFXFeature::FORMAT_ETC1] = true;
        compressed_fmts += "etc1 ";
    }

    features_[(int)GFXFeature::FORMAT_ETC2] = true;
    compressed_fmts += "etc2 ";

    if (CheckExtension("texture_compression_pvrtc"))
    {
        features_[(int)GFXFeature::FORMAT_PVRTC] = true;
        compressed_fmts += "pvrtc ";
    }

    if (CheckExtension("texture_compression_astc"))
    {
        features_[(int)GFXFeature::FORMAT_ASTC] = true;
        compressed_fmts += "astc ";
    }

    renderer_ = (const char*)glGetString(GL_RENDERER);
    vendor_ = (const char*)glGetString(GL_VENDOR);
    version_ = (const char*)glGetString(GL_VERSION);

    CC_LOG_INFO("RENDERER: %s", renderer_.c_str());
    CC_LOG_INFO("VENDOR: %s", vendor_.c_str());
    CC_LOG_INFO("VERSION: %s", version_.c_str());
    CC_LOG_INFO("SCREEN_SIZE: %d x %d", width_, height_);
    CC_LOG_INFO("NATIVE_SIZE: %d x %d", native_width_, native_height_);
    CC_LOG_INFO("USE_VAO: %s", use_vao_ ? "true" : "false");
    CC_LOG_INFO("COMPRESSED_FORMATS: %s", compressed_fmts.c_str());

    GFXWindowInfo window_info;
    window_info.color_fmt = context_->color_fmt();
    window_info.depth_stencil_fmt = context_->depth_stencil_fmt();
    window_info.is_offscreen = false;
    window_ = CreateGFXWindow(window_info);

    GFXQueueInfo queue_info;
    queue_info.type = GFXQueueType::GRAPHICS;
    queue_ = CreateGFXQueue(queue_info);

    GFXCommandAllocatorInfo cmd_alloc_info;
    cmd_allocator_ = CreateGFXCommandAllocator(cmd_alloc_info);

    return true;
}

void GLES2Device::Destroy()
{
    CC_SAFE_DESTROY(cmd_allocator_);
    CC_SAFE_DESTROY(queue_);
    CC_SAFE_DESTROY(window_);
    CC_SAFE_DESTROY(context_);
    CC_SAFE_DELETE(state_cache);
}

void GLES2Device::Resize(uint width, uint height)
{
    width_ = width;
    height_ = height;
    window_->Resize(width, height);
}

void GLES2Device::Present()
{
    ((GLES2CommandAllocator*)cmd_allocator_)->ReleaseCmds();
    GLES2Queue* queue = (GLES2Queue*)queue_;
    num_draw_calls_ += queue->num_draw_calls_;
    num_tris_ += queue->num_tris_;

    context_->Present();

    // Clear queue stats
    queue->num_draw_calls_ = 0;
    queue->num_tris_ = 0;
}

GFXWindow* GLES2Device::CreateGFXWindow(const GFXWindowInfo& info)
{
    GFXWindow* gfx_window = CC_NEW(GLES2Window(this));
    if (gfx_window->Initialize(info))
        return gfx_window;

    CC_SAFE_DESTROY(gfx_window);
    return nullptr;
}

GFXQueue* GLES2Device::CreateGFXQueue(const GFXQueueInfo& info)
{
    GFXQueue* gfx_queue = CC_NEW(GLES2Queue(this));
    if (gfx_queue->Initialize(info))
        return gfx_queue;

    CC_SAFE_DESTROY(gfx_queue);
    return nullptr;
}

GFXCommandAllocator* GLES2Device::CreateGFXCommandAllocator(const GFXCommandAllocatorInfo& info)
{
    GFXCommandAllocator* gfx_cmd_allocator = CC_NEW(GLES2CommandAllocator(this));
    if (gfx_cmd_allocator->Initialize(info))
        return gfx_cmd_allocator;

    CC_SAFE_DESTROY(gfx_cmd_allocator);

    return nullptr;
}

GFXCommandBuffer* GLES2Device::CreateGFXCommandBuffer(const GFXCommandBufferInfo& info)
{
    GFXCommandBuffer* gfx_cmd_buff = CC_NEW(GLES2CommandBuffer(this));
    if (gfx_cmd_buff->Initialize(info))
        return gfx_cmd_buff;

    CC_SAFE_DESTROY(gfx_cmd_buff);
    return nullptr;
}

GFXBuffer* GLES2Device::CreateGFXBuffer(const GFXBufferInfo& info)
{
    GFXBuffer* gfx_buffer = CC_NEW(GLES2Buffer(this));
    if (gfx_buffer->Initialize(info))
        return gfx_buffer;

    CC_SAFE_DESTROY(gfx_buffer);
    return nullptr;
}

GFXTexture* GLES2Device::CreateGFXTexture(const GFXTextureInfo& info)
{
    GFXTexture* gfx_texture = CC_NEW(GLES2Texture(this));
    if (gfx_texture->Initialize(info))
        return gfx_texture;

    CC_SAFE_DESTROY(gfx_texture);
    return nullptr;
}

GFXTextureView* GLES2Device::CreateGFXTextureView(const GFXTextureViewInfo& info)
{
    GFXTextureView* gfx_tex_view = CC_NEW(GLES2TextureView(this));
    if (gfx_tex_view->Initialize(info))
        return gfx_tex_view;

    CC_SAFE_DESTROY(gfx_tex_view);
    return nullptr;
}

GFXSampler* GLES2Device::CreateGFXSampler(const GFXSamplerInfo& info)
{
    GFXSampler* gfx_sampler = CC_NEW(GLES2Sampler(this));
    if (gfx_sampler->Initialize(info))
        return gfx_sampler;

    CC_SAFE_DESTROY(gfx_sampler);
    return nullptr;
}

GFXShader* GLES2Device::CreateGFXShader(const GFXShaderInfo& info)
{
    GFXShader* gfx_shader = CC_NEW(GLES2Shader(this));
    if (gfx_shader->Initialize(info))
        return gfx_shader;

    CC_SAFE_DESTROY(gfx_shader);
    return nullptr;
}

GFXInputAssembler* GLES2Device::CreateGFXInputAssembler(const GFXInputAssemblerInfo& info)
{
    GFXInputAssembler* gfx_input_assembler = CC_NEW(GLES2InputAssembler(this));
    if (gfx_input_assembler->Initialize(info))
        return gfx_input_assembler;

    CC_SAFE_DESTROY(gfx_input_assembler);
    return nullptr;
}

GFXRenderPass* GLES2Device::CreateGFXRenderPass(const GFXRenderPassInfo& info)
{
    GFXRenderPass* gfx_render_pass = CC_NEW(GLES2RenderPass(this));
    if (gfx_render_pass->Initialize(info))
        return gfx_render_pass;

    CC_SAFE_DESTROY(gfx_render_pass);
    return nullptr;
}

GFXFramebuffer* GLES2Device::CreateGFXFramebuffer(const GFXFramebufferInfo& info)
{
    GFXFramebuffer* gfx_framebuffer = CC_NEW(GLES2Framebuffer(this));
    if (gfx_framebuffer->Initialize(info))
        return gfx_framebuffer;

    CC_SAFE_DESTROY(gfx_framebuffer);
    return nullptr;
}

GFXBindingLayout* GLES2Device::CreateGFXBindingLayout(const GFXBindingLayoutInfo& info)
{
    GFXBindingLayout* gfx_binding_layout = CC_NEW(GLES2BindingLayout(this));
    if (gfx_binding_layout->Initialize(info))
        return gfx_binding_layout;

    CC_SAFE_DESTROY(gfx_binding_layout);
    return nullptr;
}

GFXPipelineState* GLES2Device::CreateGFXPipelineState(const GFXPipelineStateInfo& info)
{
    GFXPipelineState* pipelineState = CC_NEW(GLES2PipelineState(this));
    if (pipelineState->Initialize(info))
        return pipelineState;

    CC_SAFE_DESTROY(pipelineState);
    return nullptr;
}

GFXPipelineLayout* GLES2Device::CreateGFXPipelieLayout(const GFXPipelineLayoutInfo& info)
{
    GFXPipelineLayout* layout = CC_NEW(GLES2PipelineLayout(this));
    if (layout->Initialize(info))
        return layout;

    CC_SAFE_DESTROY(layout);
    return nullptr;
}

void GLES2Device::CopyBuffersToTexture(GFXBuffer *src, GFXTexture *dst, const GFXBufferTextureCopyList &regions)
{
    GLES2CmdFuncCopyBuffersToTexture(this, &((GLES2Buffer*)src)->gpu_buffer()->buffer, 1, ((GLES2Texture*)dst)->gpu_texture(), regions);
}

NS_CC_END
