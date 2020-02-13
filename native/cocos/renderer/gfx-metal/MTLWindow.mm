#include "MTLStd.h"
#include "MTLWindow.h"
#include "MTLRenderPass.h"

NS_CC_BEGIN

CCMTLWindow::CCMTLWindow(GFXDevice* device) : GFXWindow(device) {}
CCMTLWindow::~CCMTLWindow() { destroy(); }

bool CCMTLWindow::initialize(const GFXWindowInfo& info)
{
    _title = info.title;
    _left = info.left;
    _top = info.top;
    _width = info.width;
    _height = info.height;
    _nativeWidth = _width;
    _nativeHeight = _height;
    _colorFmt = info.color_fmt;
    _depthStencilFmt = info.depth_stencil_fmt;
    _isOffscreen = info.is_offscreen;
    _isFullscreen = info.is_fullscreen;
    
    GFXRenderPassInfo render_pass_info;
    
    GFXColorAttachment color_attachment;
    
    // FIXME: use `_isOffscreen` to determine if it is the default window(created by device).
    // As metal only supports GFXFormat::BGRA8UN for color attachment.
    if (_isOffscreen)
        color_attachment.format = info.color_fmt;
    else
        color_attachment.format = GFXFormat::BGRA8UN;
    
    color_attachment.load_op = GFXLoadOp::CLEAR;
    color_attachment.store_op = GFXStoreOp::STORE;
    color_attachment.sample_count = 1;
    color_attachment.begin_layout = GFXTextureLayout::COLOR_ATTACHMENT_OPTIMAL;
    color_attachment.end_layout = GFXTextureLayout::COLOR_ATTACHMENT_OPTIMAL;
    render_pass_info.color_attachments.emplace_back(color_attachment);
    
    GFXDepthStencilAttachment& depth_stencil_attachment = render_pass_info.depth_stencil_attachment;
    render_pass_info.depth_stencil_attachment.format = GFXFormat::D24S8;
    depth_stencil_attachment.depth_load_op = GFXLoadOp::CLEAR;
    depth_stencil_attachment.depth_store_op = GFXStoreOp::STORE;
    depth_stencil_attachment.stencil_load_op = GFXLoadOp::CLEAR;
    depth_stencil_attachment.stencil_store_op = GFXStoreOp::STORE;
    depth_stencil_attachment.sample_count = 1;
    depth_stencil_attachment.begin_layout = GFXTextureLayout::DEPTH_STENCIL_ATTACHMENT_OPTIMAL;
    depth_stencil_attachment.end_layout = GFXTextureLayout::DEPTH_STENCIL_ATTACHMENT_OPTIMAL;
    
    _renderPass = _device->createRenderPass(render_pass_info);
    
    // Create texture & texture views
    if (_isOffscreen) {
        if (_colorFmt != GFXFormat::UNKNOWN) {
            GFXTextureInfo color_tex_info;
            color_tex_info.type = GFXTextureType::TEX2D;
            color_tex_info.usage = GFXTextureUsageBit::COLOR_ATTACHMENT | GFXTextureUsageBit::SAMPLED;
            color_tex_info.format = _colorFmt;
            color_tex_info.width = _width;
            color_tex_info.height = _height;
            color_tex_info.depth = 1;
            color_tex_info.array_layer = 1;
            color_tex_info.mip_level = 1;
            _colorTex = _device->createTexture(color_tex_info);
            
            GFXTextureViewInfo color_tex_view_info;
            color_tex_view_info.texture = _colorTex;
            color_tex_view_info.type = GFXTextureViewType::TV2D;
            color_tex_view_info.format = _colorFmt;
            color_tex_view_info.base_level = 0;
            color_tex_view_info.level_count = 1;
            color_tex_view_info.base_layer = 0;
            color_tex_view_info.layer_count = 1;
            _colorTexView = _device->createTextureView(color_tex_view_info);
            
            static_cast<CCMTLRenderPass*>(_renderPass)->setColorAttachment(_colorTexView);
        }
        if (_depthStencilFmt != GFXFormat::UNKNOWN) {
            GFXTextureInfo depth_stecnil_tex_info;
            depth_stecnil_tex_info.type = GFXTextureType::TEX2D;
            depth_stecnil_tex_info.usage = GFXTextureUsageBit::DEPTH_STENCIL_ATTACHMENT | GFXTextureUsageBit::SAMPLED;
            depth_stecnil_tex_info.format = _depthStencilFmt;
            depth_stecnil_tex_info.width = _width;
            depth_stecnil_tex_info.height = _height;
            depth_stecnil_tex_info.depth = 1;
            depth_stecnil_tex_info.array_layer = 1;
            depth_stecnil_tex_info.mip_level = 1;
            _depthStencilTex = _device->createTexture(depth_stecnil_tex_info);
            
            GFXTextureViewInfo depth_stecnil_tex_view_info;
            depth_stecnil_tex_view_info.texture = _depthStencilTex;
            depth_stecnil_tex_view_info.type = GFXTextureViewType::TV2D;
            depth_stecnil_tex_view_info.format = _colorFmt;
            depth_stecnil_tex_view_info.base_level = 0;
            depth_stecnil_tex_view_info.level_count = 1;
            depth_stecnil_tex_view_info.base_layer = 0;
            depth_stecnil_tex_view_info.layer_count = 1;
            _depthStencilTexView = _device->createTextureView(depth_stecnil_tex_view_info);
            
            static_cast<CCMTLRenderPass*>(_renderPass)->setDepthStencilAttachment(_depthStencilTexView);
        }
    }

    GFXFramebufferInfo fbo_info;
    fbo_info.render_pass = _renderPass;
    fbo_info.color_views.push_back(_colorTexView);
    fbo_info.depth_stencil_view = _depthStencilTexView;
    fbo_info.is_offscreen = _isOffscreen;
    _framebuffer = _device->createFramebuffer(fbo_info);
    
    return true;
}

void CCMTLWindow::destroy()
{
    CC_SAFE_DESTROY(_renderPass);
    CC_SAFE_DESTROY(_colorTexView);
    CC_SAFE_DESTROY(_colorTex);
    CC_SAFE_DESTROY(_depthStencilTexView);
    CC_SAFE_DESTROY(_depthStencilTex);
    CC_SAFE_DESTROY(_framebuffer);
}

void CCMTLWindow::resize(uint width, uint height)
{
    
}

NS_CC_END
