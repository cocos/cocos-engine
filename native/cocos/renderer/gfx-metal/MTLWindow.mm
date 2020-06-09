#include "MTLStd.h"
#include "MTLWindow.h"
#include "MTLRenderPass.h"
#include "MTLTexture.h"
#include "MTLDevice.h"

NS_CC_BEGIN

CCMTLWindow::CCMTLWindow(GFXDevice *device) : GFXWindow(device) {}
CCMTLWindow::~CCMTLWindow() { destroy(); }

bool CCMTLWindow::initialize(const GFXWindowInfo &info) {
    _title = info.title;
    _left = info.left;
    _top = info.top;
    _width = info.width;
    _height = info.height;
    _nativeWidth = _width;
    _nativeHeight = _height;
    _colorFmt = info.colorFmt;
    _depthStencilFmt = info.depthStencilFmt;
    _isOffscreen = info.isOffscreen;
    _isFullscreen = info.isFullscreen;
    
    GFXRenderPassInfo renderPassInfo;
    
    GFXColorAttachment colorAttachment;
    
    // FIXME: use `_isOffscreen` to determine if it is the default window(created by device).
    // Main window uses MTKView, its color attchment pixel format is BGRA.
    if (_isOffscreen)
        colorAttachment.format = info.colorFmt;
    else
        colorAttachment.format = GFXFormat::BGRA8;
    
    colorAttachment.loadOp = GFXLoadOp::LOAD;
    colorAttachment.storeOp = GFXStoreOp::STORE;
    colorAttachment.sampleCount = 1;
    colorAttachment.beginLayout = GFXTextureLayout::COLOR_ATTACHMENT_OPTIMAL;
    colorAttachment.endLayout = GFXTextureLayout::COLOR_ATTACHMENT_OPTIMAL;
    renderPassInfo.colorAttachments.emplace_back(colorAttachment);
    
    GFXDepthStencilAttachment &depthStencilAttachment = renderPassInfo.depthStencilAttachment;
    renderPassInfo.depthStencilAttachment.format = GFXFormat::D24S8;
    depthStencilAttachment.depthLoadOp = GFXLoadOp::CLEAR;
    depthStencilAttachment.depthStoreOp = GFXStoreOp::STORE;
    depthStencilAttachment.stencilLoadOp = GFXLoadOp::CLEAR;
    depthStencilAttachment.stencilStoreOp = GFXStoreOp::STORE;
    depthStencilAttachment.sampleCount = 1;
    depthStencilAttachment.beginLayout = GFXTextureLayout::DEPTH_STENCIL_ATTACHMENT_OPTIMAL;
    depthStencilAttachment.endLayout = GFXTextureLayout::DEPTH_STENCIL_ATTACHMENT_OPTIMAL;
    
    _renderPass = _device->createRenderPass(renderPassInfo);
    
    // Create texture & texture views
    if (_isOffscreen) {
        if (_colorFmt != GFXFormat::UNKNOWN) {
            GFXTextureInfo colorTexInfo;
            colorTexInfo.type = GFXTextureType::TEX2D;
            colorTexInfo.usage = GFXTextureUsageBit::COLOR_ATTACHMENT | GFXTextureUsageBit::SAMPLED;
            colorTexInfo.format = _colorFmt;
            colorTexInfo.width = _width;
            colorTexInfo.height = _height;
            colorTexInfo.depth = 1;
            colorTexInfo.arrayLayer = 1;
            colorTexInfo.mipLevel = 1;
            _colorTex = _device->createTexture(colorTexInfo);
            
            if (_colorTex) {
                id<MTLTexture> mtlTexture = static_cast<CCMTLTexture*>(_colorTex)->getMTLTexture();
                static_cast<CCMTLRenderPass*>(_renderPass)->setColorAttachment(0, mtlTexture, 0);
            }
        }
        if (_depthStencilFmt != GFXFormat::UNKNOWN) {
            GFXTextureInfo depthStecnilTexInfo;
            depthStecnilTexInfo.type = GFXTextureType::TEX2D;
            depthStecnilTexInfo.usage = GFXTextureUsageBit::DEPTH_STENCIL_ATTACHMENT | GFXTextureUsageBit::SAMPLED;
            depthStecnilTexInfo.format = _depthStencilFmt;
            depthStecnilTexInfo.width = _width;
            depthStecnilTexInfo.height = _height;
            depthStecnilTexInfo.depth = 1;
            depthStecnilTexInfo.arrayLayer = 1;
            depthStecnilTexInfo.mipLevel = 1;
            _depthStencilTex = _device->createTexture(depthStecnilTexInfo);
            
            if (_depthStencilTex) {
                id<MTLTexture> mtlTexture = static_cast<CCMTLTexture*>(_depthStencilTex)->getMTLTexture();
                static_cast<CCMTLRenderPass*>(_renderPass)->setDepthStencilAttachment(mtlTexture, 0);
            }
        }
    }

    GFXFramebufferInfo fboInfo;
    fboInfo.renderPass = _renderPass;
    fboInfo.colorTextures.push_back(_colorTex);
    fboInfo.depthStencilTexture = _depthStencilTex;
    fboInfo.isOffscreen = _isOffscreen;
    _framebuffer = _device->createFramebuffer(fboInfo);
    
    return true;
}

void CCMTLWindow::destroy() {
    CC_SAFE_DESTROY(_renderPass);
    CC_SAFE_DESTROY(_colorTex);
    CC_SAFE_DESTROY(_depthStencilTex);
    CC_SAFE_DESTROY(_framebuffer);
}

void CCMTLWindow::resize(uint width, uint height) {
    
}

NS_CC_END
