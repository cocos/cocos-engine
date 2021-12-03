/****************************************************************************
 Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/
#import "../gfx-base/GFXDef-common.h"
#import "MTLSwapchain.h"
#if CC_PLATFORM == CC_PLATFORM_MAC_OSX
    #import <AppKit/NSView.h>
#else
    #import <UIKit/UIView.h>
#endif

#import "MTLGPUObjects.h"
#import "MTLDevice.h"
#import "MTLGPUObjects.h"
namespace cc {
namespace gfx {

namespace {
#if CC_PLATFORM == CC_PLATFORM_MAC_OSX
    using CCView = NSView;
#else
    using CCView = UIView;
#endif
};

CCMTLSwapchain::CCMTLSwapchain() {
}

CCMTLSwapchain::~CCMTLSwapchain() {
    destroy();
}

void CCMTLSwapchain::doInit(const SwapchainInfo &info) {
    _gpuSwapchainObj = CC_NEW(CCMTLGPUSwapChainObject);

    //----------------------acquire layer-----------------------------------
    auto* view = (CCView*)info.windowHandle;
    CAMetalLayer *layer = static_cast<CAMetalLayer *>(view.layer);

    if (layer.pixelFormat == MTLPixelFormatInvalid) {
        layer.pixelFormat = MTLPixelFormatBGRA8Unorm;
    }
    layer.framebufferOnly = NO;
    //setDisplaySyncEnabled : physic device refresh rate.
    //setPresentsWithTransaction : Core Animation transactions update rate.
    auto syncModeFunc = [&](BOOL sync, BOOL transaction) {
#if CC_PLATFORM == CC_PLATFORM_MAC_OSX
        [layer setDisplaySyncEnabled:sync];
#endif
        [layer setPresentsWithTransaction:transaction];
    };
    switch (_vsyncMode) {
        case VsyncMode::OFF:
            syncModeFunc(NO, NO);
            break;
        case VsyncMode::ON:
            syncModeFunc(YES, YES);
        case VsyncMode::RELAXED:
        case VsyncMode::MAILBOX:
        case VsyncMode::HALF:
            syncModeFunc(YES, NO);
        default:
            break;
    }
    _gpuSwapchainObj->mtlLayer = layer;

//    MTLPixelFormatBGRA8Unorm
//    MTLPixelFormatBGRA8Unorm_sRGB
//    MTLPixelFormatRGBA16Float
//    MTLPixelFormatRGB10A2Unorm (macOS only)
//    MTLPixelFormatBGR10A2Unorm (macOS only)
//    MTLPixelFormatBGRA10_XR
//    MTLPixelFormatBGRA10_XR_sRGB
//    MTLPixelFormatBGR10_XR
//    MTLPixelFormatBGR10_XR_sRGB
    Format colorFmt        = Format::BGRA8;
    Format depthStencilFmt = Format::DEPTH_STENCIL;

    _colorTexture = CC_NEW(CCMTLTexture);
    _depthStencilTexture = CC_NEW(CCMTLTexture);

    SwapchainTextureInfo textureInfo;
    textureInfo.swapchain = this;
    textureInfo.format    = colorFmt;
    textureInfo.width     = info.width;
    textureInfo.height    = info.height;
    initTexture(textureInfo, _colorTexture);

    textureInfo.format = depthStencilFmt;
    initTexture(textureInfo, _depthStencilTexture);

    CCMTLDevice::getInstance()->registerSwapchain(this);
}

void CCMTLSwapchain::doDestroy(){
    CCMTLDevice::getInstance()->unRegisterSwapchain(this);
    if(_gpuSwapchainObj) {
        _gpuSwapchainObj->currentDrawable = nil;
        _gpuSwapchainObj->mtlLayer = nil;

        CC_SAFE_DELETE(_gpuSwapchainObj);
    }

    if(_colorTexture) {
        CC_SAFE_DESTROY(_colorTexture);
    }

    if(_depthStencilTexture) {
        CC_SAFE_DESTROY(_depthStencilTexture);
    }
}

void CCMTLSwapchain::doDestroySurface() {
    if(_gpuSwapchainObj) {
        _gpuSwapchainObj->currentDrawable = nil;
        _gpuSwapchainObj->mtlLayer = nil;
    }
}

void CCMTLSwapchain::doResize(uint32_t width, uint32_t height, SurfaceTransform /*transform*/) {
    _colorTexture->resize(width, height);
    _depthStencilTexture->resize(width, height);
}

CCMTLTexture* CCMTLSwapchain::colorTexture() {
    return static_cast<CCMTLTexture*>(_colorTexture);
}

CCMTLTexture* CCMTLSwapchain::depthStencilTexture() {
    return static_cast<CCMTLTexture*>(_depthStencilTexture);
}

id<CAMetalDrawable> CCMTLSwapchain::currentDrawable() {
    return _gpuSwapchainObj->currentDrawable;
}

void CCMTLSwapchain::release() {
    _gpuSwapchainObj->currentDrawable = nil;
    static_cast<CCMTLTexture*>(_colorTexture)->update();
}

void CCMTLSwapchain::acquire() {
    // hang on here if next drawable not available
    while(!_gpuSwapchainObj->currentDrawable) {
        _gpuSwapchainObj->currentDrawable = [_gpuSwapchainObj->mtlLayer nextDrawable] ;
        static_cast<CCMTLTexture*>(_colorTexture)->update();
    }
}

void CCMTLSwapchain::doCreateSurface(void *windowHandle) {

}

}
}
