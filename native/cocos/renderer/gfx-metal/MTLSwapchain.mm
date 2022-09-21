/****************************************************************************
 Copyright (c) 2021-2022 Xiamen Yaji Software Co., Ltd.

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
#if CC_PLATFORM == CC_PLATFORM_MACOS
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
#if CC_PLATFORM == CC_PLATFORM_MACOS
using CCView = NSView;
#else
using CCView = UIView;
#endif
}; // namespace

CCMTLSwapchain::CCMTLSwapchain() {
}

CCMTLSwapchain::~CCMTLSwapchain() {
    destroy();
}

void CCMTLSwapchain::doInit(const SwapchainInfo& info) {
    _gpuSwapchainObj = ccnew CCMTLGPUSwapChainObject;

    //----------------------acquire layer-----------------------------------
#if CC_EDITOR
    CAMetalLayer* layer = (CAMetalLayer*)info.windowHandle;
    if (!layer.device) {
        layer.device = MTLCreateSystemDefaultDevice();
    }
#else
    auto *view = (CCView *)info.windowHandle;
    CAMetalLayer *layer = static_cast<CAMetalLayer *>(view.layer);
#endif

    if (layer.pixelFormat == MTLPixelFormatInvalid) {
        layer.pixelFormat = MTLPixelFormatBGRA8Unorm;
    }
    layer.framebufferOnly = NO;
    //setDisplaySyncEnabled : physic device refresh rate.
    //setPresentsWithTransaction : Core Animation transactions update rate.
    auto syncModeFunc = [&](BOOL sync, BOOL transaction) {
#if CC_PLATFORM == CC_PLATFORM_MACOS
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
    Format colorFmt = Format::BGRA8;
    Format depthStencilFmt = Format::DEPTH_STENCIL;


    SwapchainTextureInfo textureInfo;
    textureInfo.swapchain = this;
    textureInfo.format = colorFmt;
    textureInfo.width = 1400;
    textureInfo.height = 800;
    
    for (size_t i = 0; i < DRAWABLE_COUNT; ++i) {
        _gpuSwapchainObj->colors[i] = ccnew CCMTLTexture();
        initTexture(textureInfo, _gpuSwapchainObj->colors[i]);
    }
    _colorTexture = _gpuSwapchainObj->colors[0];
    
    textureInfo.format = depthStencilFmt;
    _depthStencilTexture = ccnew CCMTLTexture;
    initTexture(textureInfo, _depthStencilTexture);

    CCMTLDevice::getInstance()->registerSwapchain(this);
}

void CCMTLSwapchain::doDestroy() {
    CCMTLDevice::getInstance()->unRegisterSwapchain(this);
    if (_gpuSwapchainObj) {
        _gpuSwapchainObj->mtlLayer = nil;
        for(size_t i = 0; i < DRAWABLE_COUNT; ++i) {
            CC_SAFE_DESTROY_NULL(_gpuSwapchainObj->colors[i]);
        };

        CC_SAFE_DELETE(_gpuSwapchainObj);
    }
    
    _colorTexture = nullptr;
    CC_SAFE_DESTROY_NULL(_depthStencilTexture);
}

void CCMTLSwapchain::doDestroySurface() {
    if (_gpuSwapchainObj) {
        _gpuSwapchainObj->mtlLayer = nil;
    }
}

void CCMTLSwapchain::doResize(uint32_t width, uint32_t height, SurfaceTransform /*transform*/) {
    _colorTexture->resize(1400, 800);
    _depthStencilTexture->resize(1400, 800);
}

CCMTLTexture* CCMTLSwapchain::colorTexture() {
    _colorTexture = _gpuSwapchainObj->colors[_gpuSwapchainObj->currentFrameIndex];
    return static_cast<CCMTLTexture*>(_colorTexture.get());
}

CCMTLTexture* CCMTLSwapchain::depthStencilTexture() {
    return static_cast<CCMTLTexture*>(_depthStencilTexture.get());
}

CAMetalLayer* CCMTLSwapchain::layer() {
    return _gpuSwapchainObj->mtlLayer;
}

void CCMTLSwapchain::release() {
}

void CCMTLSwapchain::acquire() {
    _gpuSwapchainObj->currentFrameIndex = _gpuSwapchainObj->currentFrameIndex++ % DRAWABLE_COUNT;
}

void CCMTLSwapchain::doCreateSurface(void* windowHandle) {
}

} // namespace gfx
} // namespace cc
