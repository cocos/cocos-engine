/****************************************************************************
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

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

CCWGPUSwapchain::CCWGPUSwapchain(CCWGPUDevice *device) {
    _device = device;
}

CCWGPUSwapchain::~CCWGPUSwapchain() {
    _device = nullptr;
    doDestroy();
}

void CCWGPUSwapchain::doInit(const SwapchainInfo &info) {
    printf("swapchain init %d, %d\n", info.width, info.height);
    // WGPUSurfaceDescriptorFromCanvasHTMLSelector canvDesc = {};
    // canvDesc.chain.sType = WGPUSType_SurfaceDescriptorFromCanvasHTMLSelector;
    // canvDesc.selector = "canvas";

    // WGPUSurfaceDescriptor surfDesc = {};
    // surfDesc.nextInChain = reinterpret_cast<WGPUChainedStruct *>(&canvDesc);
    // WGPUSurface surface = wgpuInstanceCreateSurface(nullptr, &surfDesc);

    auto *device = CCWGPUDevice::getInstance();
    CCWGPUDeviceObject *gpuDeviceObj = device->gpuDeviceObject();
    auto surface = gpuDeviceObj->instance.wgpuSurface;
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

    WGPUSwapChainDescriptor swapChainDesc;
    swapChainDesc.nextInChain = nullptr;
    swapChainDesc.label = "defaultSwapChain";
    swapChainDesc.usage = WGPUTextureUsage_RenderAttachment;
    swapChainDesc.format = WGPUTextureFormat_BGRA8Unorm;
    swapChainDesc.width = info.width;
    swapChainDesc.height = info.height;
    swapChainDesc.presentMode = presentMode;

    WGPUSwapChain swapChain = wgpuDeviceCreateSwapChain(gpuDeviceObj->wgpuDevice, surface, &swapChainDesc);
    _gpuSwapchainObj = ccnew CCWGPUSwapchainObject;
    _gpuSwapchainObj->wgpuSwapChain = swapChain;
    _gpuSwapchainObj->wgpuSurface = surface;

    SwapchainTextureInfo textureInfo = {
        .swapchain = this,
        .format = Format::BGRA8,
        .width = info.width,
        .height = info.height,
    };

    printf("swapchain init %d, %d\n", info.width, info.height);

    printf("swapchain tex init %d, %d\n", textureInfo.width, textureInfo.height);

    _colorTexture = _gpuSwapchainObj->swapchainColor = ccnew CCWGPUTexture;
    initTexture(textureInfo, _gpuSwapchainObj->swapchainColor);
    textureInfo.format = Format::DEPTH_STENCIL;
    _depthStencilTexture = _gpuSwapchainObj->swapchainDepthStencil = ccnew CCWGPUTexture;
    initTexture(textureInfo, _gpuSwapchainObj->swapchainDepthStencil);

    // TODO: wgpuInstance

    device->registerSwapchain(this);
}

void CCWGPUSwapchain::doDestroy() {
    wgpuSwapChainRelease(_gpuSwapchainObj->wgpuSwapChain);

    CCWGPUDevice::getInstance()->unRegisterSwapchain(this);

    if (_gpuSwapchainObj) {
        delete _gpuSwapchainObj->swapchainColor;
        delete _gpuSwapchainObj->swapchainDepthStencil;
        delete _gpuSwapchainObj;
        _gpuSwapchainObj = nullptr;
    }
}

void CCWGPUSwapchain::doResize(uint32_t width, uint32_t height, SurfaceTransform transform) {
    _colorTexture->resize(width, height);
    _depthStencilTexture->resize(width, height);
}

void CCWGPUSwapchain::update() {
    auto swapchainView = static_cast<CCWGPUTexture *>(_colorTexture.get())->gpuTextureObject()->selfView;
    wgpuTextureViewRelease(swapchainView);
    static_cast<CCWGPUTexture *>(_colorTexture.get())->gpuTextureObject()->selfView = wgpuSwapChainGetCurrentTextureView(_gpuSwapchainObj->wgpuSwapChain);
}

void CCWGPUSwapchain::doDestroySurface() {
}

void CCWGPUSwapchain::doCreateSurface(void *windowHandle) {
}

} // namespace gfx
} // namespace cc