#include "MTLStd.h"
#include "MTLWindow.h"
#include "MTLRenderPass.h"
#include "MTLTextureView.h"
#include "MTLDevice.h"

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
    
    GFXDepthStencilAttachment& depthStencilAttachment = renderPassInfo.depthStencilAttachment;
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
            
            GFXTextureViewInfo colorTexViewInfo;
            colorTexViewInfo.texture = _colorTex;
            colorTexViewInfo.type = GFXTextureViewType::TV2D;
            colorTexViewInfo.format = _colorFmt;
            colorTexViewInfo.baseLevel = 0;
            colorTexViewInfo.levelCount = 1;
            colorTexViewInfo.baseLayer = 0;
            colorTexViewInfo.layerCount = 1;
            _colorTexView = _device->createTextureView(colorTexViewInfo);
            
            if (_colorTexView)
            {
                id<MTLTexture> mtlTexture = static_cast<CCMTLTextureView*>(_colorTexView)->getMTLTexture();
                static_cast<CCMTLRenderPass*>(_renderPass)->setDepthStencilAttachment(mtlTexture);
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
            
            GFXTextureViewInfo depthStecnilTexViewInfo;
            depthStecnilTexViewInfo.texture = _depthStencilTex;
            depthStecnilTexViewInfo.type = GFXTextureViewType::TV2D;
            depthStecnilTexViewInfo.format = _depthStencilFmt;
            depthStecnilTexViewInfo.baseLevel = 0;
            depthStecnilTexViewInfo.levelCount = 1;
            depthStecnilTexViewInfo.baseLayer = 0;
            depthStecnilTexViewInfo.layerCount = 1;
            _depthStencilTexView = _device->createTextureView(depthStecnilTexViewInfo);
            if (_depthStencilTexView)
            {
                id<MTLTexture> mtlTexture = static_cast<CCMTLTextureView*>(_depthStencilTexView)->getMTLTexture();
                static_cast<CCMTLRenderPass*>(_renderPass)->setDepthStencilAttachment(mtlTexture);
            }
        }
    }

    GFXFramebufferInfo fboInfo;
    fboInfo.renderPass = _renderPass;
    fboInfo.colorViews.push_back(_colorTexView);
    fboInfo.depthStencilView = _depthStencilTexView;
    fboInfo.isOffscreen = _isOffscreen;
    _framebuffer = _device->createFramebuffer(fboInfo);
    
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
