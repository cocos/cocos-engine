/****************************************************************************
 Copyright (c) 2020-2021 Xiamen Yaji Software Co., Ltd.

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

#include "WGPUSwapchain.h"
#include "WGPUDevice.h"
#include "WGPUObject.h"
#include "WGPUTexture.h"

namespace cc {
namespace gfx {

CCWGPUSwapchain::CCWGPUSwapchain(CCWGPUDevice* device) {
    _device = device;
}

CCWGPUSwapchain::~CCWGPUSwapchain() {
    _device = nullptr;
}

void CCWGPUSwapchain::doInit(const SwapchainInfo& info) {
    WGPUSurfaceDescriptorFromCanvasHTMLSelector canvDesc = {};
    canvDesc.chain.sType                                 = WGPUSType_SurfaceDescriptorFromCanvasHTMLSelector;
    canvDesc.selector                                    = "canvas";

    WGPUSurfaceDescriptor surfDesc = {};
    surfDesc.nextInChain           = reinterpret_cast<WGPUChainedStruct*>(&canvDesc);
    WGPUSurface surface            = wgpuInstanceCreateSurface(nullptr, &surfDesc);

    WGPUPresentMode presentMode;
    switch (info.vsyncMode) {
        case VsyncMode::OFF:
            presentMode = WGPUPresentMode_Immediate;
            break;
        case VsyncMode::ON:
            presentMode = WGPUPresentMode_Fifo;
            break;
        case VsyncMode::RELAXED:
            presentMode = WGPUPresentMode_Fifo;
            break;
        case VsyncMode::MAILBOX:
            presentMode = WGPUPresentMode_Mailbox;
            break;
        case VsyncMode::HALF:
            presentMode = WGPUPresentMode_Force32;
            break;
        default:
            presentMode = WGPUPresentMode_Fifo;
    }

    auto*                   device = CCWGPUDevice::getInstance();
    WGPUSwapChainDescriptor swapChainDesc;
    swapChainDesc.nextInChain = nullptr;
    swapChainDesc.label       = "defaultSwapChain";
    swapChainDesc.usage       = WGPUTextureUsage_RenderAttachment;
    swapChainDesc.format      = WGPUTextureFormat_BGRA8Unorm;
    swapChainDesc.width       = info.width;
    swapChainDesc.height      = info.height;
    swapChainDesc.presentMode = presentMode;

    CCWGPUDeviceObject* gpuDeviceObj = device->gpuDeviceObject();
    WGPUSwapChain       swapChain    = wgpuDeviceCreateSwapChain(gpuDeviceObj->wgpuDevice, surface, &swapChainDesc);
    _gpuSwapchainObj                 = CC_NEW(CCWGPUSwapchainObject);
    _gpuSwapchainObj->wgpuSwapChain  = swapChain;
    _gpuSwapchainObj->wgpuSurface    = surface;

    SwapchainTextureInfo textureInfo = {
        .swapchain = this,
        .format    = Format::BGRA8,
        .width     = info.width,
        .height    = info.height,
    };

    _colorTexture = _gpuSwapchainObj->swapchainColor = CC_NEW(CCWGPUTexture);
    initTexture(textureInfo, _gpuSwapchainObj->swapchainColor);
    textureInfo.format   = Format::DEPTH_STENCIL;
    _depthStencilTexture = _gpuSwapchainObj->swapchainDepthStencil = CC_NEW(CCWGPUTexture);
    initTexture(textureInfo, _gpuSwapchainObj->swapchainDepthStencil);

    // TODO: wgpuInstance

    device->registerSwapchain(this);
}

void CCWGPUSwapchain::doDestroy() {
    // wgpuSurfaceRelease(_gpuSwapchainObj->wgpuSurface);
    // wgpuSwapChainRelease(_gpuSwapchainObj->wgpuSwapChain);

    CCWGPUDevice::getInstance()->unRegisterSwapchain(this);

    CC_DELETE(_gpuSwapchainObj->swapchainColor);
    CC_DELETE(_gpuSwapchainObj->swapchainDepthStencil);
    CC_DELETE(_gpuSwapchainObj);
}

void CCWGPUSwapchain::doResize(uint32_t width, uint32_t height, SurfaceTransform transform) {
    _colorTexture->resize(width, height);
    _depthStencilTexture->resize(height, height);
}

CCWGPUTexture* CCWGPUSwapchain::getColorTexture() {
    return static_cast<CCWGPUTexture*>(_colorTexture);
}

CCWGPUTexture* CCWGPUSwapchain::getDepthStencilTexture() {
    return static_cast<CCWGPUTexture*>(_depthStencilTexture);
}

void CCWGPUSwapchain::update() {
    static_cast<CCWGPUTexture*>(_colorTexture)->gpuTextureObject()->selfView = wgpuSwapChainGetCurrentTextureView(_gpuSwapchainObj->wgpuSwapChain);
}

void CCWGPUSwapchain::doDestroySurface() {
}

void CCWGPUSwapchain::doCreateSurface(void* windowHandle) {
}

} // namespace gfx
} // namespace cc