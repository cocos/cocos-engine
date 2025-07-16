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

#include "WGPUTexture.h"
#include <webgpu/webgpu.h>
#include "WGPUDevice.h"
#include "WGPUObject.h"
#include "WGPUSwapchain.h"
#include "WGPUUtils.h"

namespace cc {
namespace gfx {

namespace {
CCWGPUTexture *dftCommonTexture = nullptr;
CCWGPUTexture *dftStorageTexture = nullptr;

void generatePlaneViews(CCWGPUTexture *texture) {
    if (texture->getFormat() == Format::DEPTH_STENCIL) {
        auto *gpuTextureObj = texture->gpuTextureObject();
        WGPUTextureViewDescriptor depthView = {
            .nextInChain = nullptr,
            .label = nullptr,
            .format = WGPUTextureFormat_Depth24Plus,
            .dimension = WGPUTextureViewDimension_2D,
            .baseMipLevel = 0,
            .mipLevelCount = 1,
            .baseArrayLayer = 0,
            .arrayLayerCount = 1,
            .aspect = WGPUTextureAspect_DepthOnly,
        };
        gpuTextureObj->planeViews.emplace_back(wgpuTextureCreateView(gpuTextureObj->wgpuTexture, &depthView));

        WGPUTextureViewDescriptor stencilView = {
            .nextInChain = nullptr,
            .label = nullptr,
            .format = WGPUTextureFormat_Stencil8,
            .dimension = WGPUTextureViewDimension_2D,
            .baseMipLevel = 0,
            .mipLevelCount = 1,
            .baseArrayLayer = 0,
            .arrayLayerCount = 1,
            .aspect = WGPUTextureAspect_StencilOnly,
        };
        gpuTextureObj->planeViews.emplace_back(wgpuTextureCreateView(gpuTextureObj->wgpuTexture, &stencilView));
    }
}

} // namespace

using namespace emscripten;

CCWGPUTexture::CCWGPUTexture() : Texture() {
    _gpuTextureObj = ccnew CCWGPUTextureObject;
}

CCWGPUTexture::~CCWGPUTexture() {
    doDestroy();
}

void CCWGPUTexture::doInit(const TextureInfo &info) {
    uint8_t depthOrArrayLayers = info.depth;
    if (info.type == TextureType::CUBE) {
        depthOrArrayLayers = 6;
    }

    WGPUTextureDescriptor descriptor = {
        .nextInChain = nullptr,
        .label = nullptr,
        .usage = toWGPUTextureUsage(info.usage),
        .dimension = toWGPUTextureDimension(info.type),
        .size = {info.width, info.height, depthOrArrayLayers},
        .format = toWGPUTextureFormat(info.format),
        .mipLevelCount = info.levelCount,
        .sampleCount = toWGPUSampleCount(info.samples),
    };

    if (hasFlag(info.flags, TextureFlags::GEN_MIPMAP)) {
        descriptor.usage |= WGPUTextureUsage_RenderAttachment;
    }

    _gpuTextureObj->wgpuTexture = wgpuDeviceCreateTexture(CCWGPUDevice::getInstance()->gpuDeviceObject()->wgpuDevice, &descriptor);
    CCWGPUDevice::getInstance()->getMemoryStatus().textureSize += _size;

    WGPUTextureViewDescriptor texViewDesc = {
        .nextInChain = nullptr,
        .label = nullptr,
        .format = descriptor.format,
        .dimension = toWGPUTextureViewDimension(info.type),
        .baseMipLevel = 0,
        .mipLevelCount = _info.levelCount,
        .baseArrayLayer = 0,
        .arrayLayerCount = _info.layerCount,
        .aspect = WGPUTextureAspect_All,
    };
    _gpuTextureObj->selfView = wgpuTextureCreateView(_gpuTextureObj->wgpuTexture, &texViewDesc);

    generatePlaneViews(this);
    _internalChanged = true;
} // namespace gfx

void CCWGPUTexture::doInit(const TextureViewInfo &info) {
    WGPUTextureViewDescriptor descriptor = {
        .nextInChain = nullptr,
        .label = nullptr,
        .format = toWGPUTextureFormat(info.format),
        .dimension = toWGPUTextureViewDimension(info.type),
        .baseMipLevel = info.baseLevel,
        .mipLevelCount = info.levelCount,
        .baseArrayLayer = info.baseLayer,
        .arrayLayerCount = info.layerCount,
        .aspect = textureAspectTrait(info.format),
    };

    auto *ccTexture = static_cast<CCWGPUTexture *>(info.texture);
    WGPUTexture wgpuTexture = ccTexture->gpuTextureObject()->wgpuTexture;
    _gpuTextureObj->selfView = _gpuTextureObj->wgpuTextureView = wgpuTextureCreateView(wgpuTexture, &descriptor);

    generatePlaneViews(this);

    _internalChanged = true;
}

void CCWGPUTexture::doInit(const SwapchainTextureInfo &info) {
    if (_swapchain) {
        printf("swapchain %d, %d\n", info.width, info.height);
        auto *swapchain = static_cast<CCWGPUSwapchain *>(_swapchain);
        if (info.format == Format::DEPTH || info.format == Format::DEPTH_STENCIL) {
            WGPUTextureDescriptor descriptor = {
                .nextInChain = nullptr,
                .label = nullptr,
                .usage = WGPUTextureUsage_RenderAttachment,
                .dimension = WGPUTextureDimension_2D,
                .size = {info.width, info.height, 1},
                .format = toWGPUTextureFormat(info.format),
                .mipLevelCount = 1,
                .sampleCount = 1,
            };
            _gpuTextureObj->wgpuTexture = wgpuDeviceCreateTexture(CCWGPUDevice::getInstance()->gpuDeviceObject()->wgpuDevice, &descriptor);
            CCWGPUDevice::getInstance()->getMemoryStatus().textureSize += _size;

            WGPUTextureAspect aspect = info.format == Format::DEPTH ? WGPUTextureAspect_DepthOnly : WGPUTextureAspect_All;
            WGPUTextureViewDescriptor texViewDesc = {
                .nextInChain = nullptr,
                .label = nullptr,
                .format = descriptor.format,
                .dimension = WGPUTextureViewDimension_2D,
                .baseMipLevel = 0,
                .mipLevelCount = 1,
                .baseArrayLayer = 0,
                .arrayLayerCount = 1,
                .aspect = aspect,
            };
            _gpuTextureObj->selfView = wgpuTextureCreateView(_gpuTextureObj->wgpuTexture, &texViewDesc);

            generatePlaneViews(this);
        } else {
            _gpuTextureObj->selfView = wgpuSwapChainGetCurrentTextureView(swapchain->gpuSwapchainObject()->wgpuSwapChain);
        }
        _internalChanged = true;
    }
}

void *CCWGPUTexture::getPlaneView(uint32_t plane) {
    if (_info.format == Format::DEPTH_STENCIL || _viewInfo.format == Format::DEPTH_STENCIL) {
        return _gpuTextureObj->planeViews[plane];
    }
    return _gpuTextureObj->selfView;
}

void CCWGPUTexture::doDestroy() {
    if (_gpuTextureObj) {
        if (_gpuTextureObj->wgpuTexture) {
            CCWGPUDevice::getInstance()->moveToTrash(_gpuTextureObj->wgpuTexture);
            CCWGPUDevice::getInstance()->getMemoryStatus().textureSize -= _size;
        }
        if (_gpuTextureObj->wgpuTextureView) {
            wgpuTextureViewRelease(_gpuTextureObj->wgpuTextureView);
        }
        if (_gpuTextureObj->selfView && !_isTextureView) {
            wgpuTextureViewRelease(_gpuTextureObj->selfView);
        }
        if (!_gpuTextureObj->planeViews.empty()) {
            for (auto view : _gpuTextureObj->planeViews) {
                wgpuTextureViewRelease(view);
            }
        }
        delete _gpuTextureObj;
        _gpuTextureObj = nullptr;
    }
    _internalChanged = true;
}

void CCWGPUTexture::doResize(uint32_t width, uint32_t height, uint32_t size) {
    printf("tex rsz\n");
    if (_isTextureView) {
        printf("Resize is not support on texture view!");
        return;
    }
    // swapchain color tex using canvas
    if (_swapchain && _info.format != Format::DEPTH && _info.format != Format::DEPTH_STENCIL) {
        auto *swapchain = static_cast<CCWGPUSwapchain *>(_swapchain);
        _gpuTextureObj->selfView = wgpuSwapChainGetCurrentTextureView(swapchain->gpuSwapchainObject()->wgpuSwapChain);
        return;
    }
    if (_gpuTextureObj->wgpuTexture) {
        CCWGPUDevice::getInstance()->moveToTrash(_gpuTextureObj->wgpuTexture);
    }
    if (_gpuTextureObj->wgpuTextureView) {
        wgpuTextureViewRelease(_gpuTextureObj->wgpuTextureView);
    }
    if (_gpuTextureObj->selfView) {
        wgpuTextureViewRelease(_gpuTextureObj->selfView);
    }

    CCWGPUDevice::getInstance()->getMemoryStatus().textureSize -= _size;
    CCWGPUDevice::getInstance()->getMemoryStatus().textureSize += size;

    uint8_t depthOrArrayLayers = _info.depth;
    if (_info.type == TextureType::CUBE) {
        depthOrArrayLayers = 6;
    }
    WGPUTextureDescriptor descriptor = {
        .nextInChain = nullptr,
        .label = nullptr,
        .usage = toWGPUTextureUsage(_info.usage),
        .dimension = toWGPUTextureDimension(_info.type),
        .size = {width, height, depthOrArrayLayers},
        .format = toWGPUTextureFormat(_info.format),
        .mipLevelCount = _info.levelCount,
        .sampleCount = toWGPUSampleCount(_info.samples),
    };
    _gpuTextureObj->wgpuTexture = wgpuDeviceCreateTexture(CCWGPUDevice::getInstance()->gpuDeviceObject()->wgpuDevice, &descriptor);

    WGPUTextureViewDescriptor texViewDesc = {
        .nextInChain = nullptr,
        .label = nullptr,
        .format = descriptor.format,
        .dimension = toWGPUTextureViewDimension(_info.type),
        .baseMipLevel = 0,
        .mipLevelCount = _info.levelCount,
        .baseArrayLayer = 0,
        .arrayLayerCount = _info.layerCount,
        .aspect = WGPUTextureAspect_All,
    };
    _gpuTextureObj->selfView = wgpuTextureCreateView(_gpuTextureObj->wgpuTexture, &texViewDesc);

    _internalChanged = true;
}

void CCWGPUTexture::stamp() {
    _internalChanged = false;
}

CCWGPUTexture *CCWGPUTexture::defaultCommonTexture() {
    if (!dftCommonTexture) {
        TextureInfo info = {
            .type = TextureType::TEX2D,
            .usage = TextureUsageBit::SAMPLED,
            .format = Format::RGBA8,
            .width = 2,
            .height = 2,
            .flags = TextureFlagBit::NONE,
            .layerCount = 1,
            .levelCount = 1,
            .samples = SampleCount::X1,
            .depth = 1,
            .externalRes = nullptr,
        };
        dftCommonTexture = ccnew CCWGPUTexture;
        dftCommonTexture->initialize(info);
    }

    return dftCommonTexture;
}

CCWGPUTexture *CCWGPUTexture::defaultStorageTexture() {
    if (!dftStorageTexture) {
        TextureInfo info = {
            .type = TextureType::TEX2D,
            .usage = TextureUsageBit::STORAGE,
            .format = Format::RGBA8,
            .width = 2,
            .height = 2,
            .flags = TextureFlagBit::NONE,
            .layerCount = 1,
            .levelCount = 1,
            .samples = SampleCount::X1,
            .depth = 1,
            .externalRes = nullptr,
        };
        dftStorageTexture = ccnew CCWGPUTexture;
        dftStorageTexture->initialize(info);
    }

    return dftStorageTexture;
}

CCWGPUSwapchain *CCWGPUTexture::swapchain() {
    return static_cast<CCWGPUSwapchain *>(_swapchain);
}

} // namespace gfx
} // namespace cc
