#include "MTLStd.h"
#include "MTLWindow.h"

NS_CC_BEGIN

CCMTLWindow::CCMTLWindow(GFXDevice* device) : GFXWindow(device) {}
CCMTLWindow::~CCMTLWindow() { destroy(); }

bool CCMTLWindow::Initialize(const GFXWindowInfo& info)
{
    title_ = info.title;
    left_ = info.left;
    top_ = info.top;
    width_ = info.width;
    height_ = info.height;
    native_width_ = width_;
    native_height_ = height_;
    color_fmt_ = info.color_fmt;
    depth_stencil_fmt_ = info.depth_stencil_fmt;
    is_offscreen_ = info.is_offscreen;
    is_fullscreen_ = info.is_fullscreen;
    
    GFXRenderPassInfo render_pass_info;
    
    GFXColorAttachment color_attachment;
    color_attachment.format = GFXFormat::BGRA8UN;
    color_attachment.load_op = GFXLoadOp::CLEAR;
    color_attachment.store_op = GFXStoreOp::STORE;
    color_attachment.sample_count = 1;
    color_attachment.begin_layout = GFXTextureLayout::COLOR_ATTACHMENT_OPTIMAL;
    color_attachment.end_layout = GFXTextureLayout::COLOR_ATTACHMENT_OPTIMAL;
    render_pass_info.color_attachments.emplace_back(color_attachment);
    
    GFXDepthStencilAttachment& depth_stencil_attachment = render_pass_info.depth_stencil_attachment;
    render_pass_info.depth_stencil_attachment.format = GFXFormat::D24S8;
    depth_stencil_attachment.depth_load_op = GFXLoadOp::DISCARD;
    depth_stencil_attachment.depth_store_op = GFXStoreOp::DISCARD;
    depth_stencil_attachment.stencil_load_op = GFXLoadOp::DISCARD;
    depth_stencil_attachment.stencil_store_op = GFXStoreOp::DISCARD;
    depth_stencil_attachment.sample_count = 1;
    depth_stencil_attachment.begin_layout = GFXTextureLayout::DEPTH_STENCIL_ATTACHMENT_OPTIMAL;
    depth_stencil_attachment.end_layout = GFXTextureLayout::DEPTH_STENCIL_ATTACHMENT_OPTIMAL;
    
    render_pass_ = device_->createRenderPass(render_pass_info);
    
    // Create texture & texture views
    if (is_offscreen_) {
        if (color_fmt_ != GFXFormat::UNKNOWN) {
            GFXTextureInfo color_tex_info;
            color_tex_info.type = GFXTextureType::TEX2D;
            color_tex_info.usage = GFXTextureUsageBit::COLOR_ATTACHMENT | GFXTextureUsageBit::SAMPLED;
            color_tex_info.format = color_fmt_;
            color_tex_info.width = width_;
            color_tex_info.height = height_;
            color_tex_info.depth = 1;
            color_tex_info.array_layer = 1;
            color_tex_info.mip_level = 1;
            color_texture_ = device_->createTexture(color_tex_info);
            
            GFXTextureViewInfo color_tex_view_info;
            color_tex_view_info.type = GFXTextureViewType::TV2D;
            color_tex_view_info.format = color_fmt_;
            color_tex_view_info.base_level = 0;
            color_tex_view_info.level_count = 1;
            color_tex_view_info.base_layer = 0;
            color_tex_view_info.layer_count = 1;
            color_tex_view_ = device_->createTextureView(color_tex_view_info);
        }
        if (depth_stencil_fmt_ != GFXFormat::UNKNOWN) {
            GFXTextureInfo depth_stecnil_tex_info;
            depth_stecnil_tex_info.type = GFXTextureType::TEX2D;
            depth_stecnil_tex_info.usage = GFXTextureUsageBit::DEPTH_STENCIL_ATTACHMENT | GFXTextureUsageBit::SAMPLED;
            depth_stecnil_tex_info.format = depth_stencil_fmt_;
            depth_stecnil_tex_info.width = width_;
            depth_stecnil_tex_info.height = height_;
            depth_stecnil_tex_info.depth = 1;
            depth_stecnil_tex_info.array_layer = 1;
            depth_stecnil_tex_info.mip_level = 1;
            depth_stencil_texture_ = device_->createTexture(depth_stecnil_tex_info);
            
            GFXTextureViewInfo depth_stecnil_tex_view_info;
            depth_stecnil_tex_view_info.type = GFXTextureViewType::TV2D;
            depth_stecnil_tex_view_info.format = color_fmt_;
            depth_stecnil_tex_view_info.base_level = 0;
            depth_stecnil_tex_view_info.level_count = 1;
            depth_stecnil_tex_view_info.base_layer = 0;
            depth_stecnil_tex_view_info.layer_count = 1;
            depth_stencil_tex_view_ = device_->createTextureView(depth_stecnil_tex_view_info);
        }
    }

    GFXFramebufferInfo fbo_info;
    fbo_info.render_pass = render_pass_;
    fbo_info.color_views.push_back(color_tex_view_);
    fbo_info.depth_stencil_view = depth_stencil_tex_view_;
    fbo_info.is_offscreen = is_offscreen_;
    framebuffer_ = device_->createFramebuffer(fbo_info);
    
    return true;
}

void CCMTLWindow::destroy()
{
    CC_SAFE_DESTROY(render_pass_);
    CC_SAFE_DESTROY(color_tex_view_);
    CC_SAFE_DESTROY(color_texture_);
    CC_SAFE_DESTROY(depth_stencil_tex_view_);
    CC_SAFE_DESTROY(depth_stencil_texture_);
    CC_SAFE_DESTROY(framebuffer_);
}

void CCMTLWindow::Resize(uint width, uint height)
{
    
}

NS_CC_END
