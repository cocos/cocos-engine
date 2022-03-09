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

#include "WGPUTexture.h"
#include <webgpu/webgpu.h>
#include "WGPUDevice.h"
#include "WGPUObject.h"
#include "WGPUSwapchain.h"
#include "WGPUUtils.h"

namespace cc {
namespace gfx {

namespace anoymous {
CCWGPUTexture *defaultCommonTexture  = nullptr;
CCWGPUTexture *defaultStorageTexture = nullptr;
} // namespace anoymous

using namespace emscripten;

CCWGPUTexture::CCWGPUTexture() : wrapper<Texture>(val::object()) {
    _gpuTextureObj = CC_NEW(CCWGPUTextureObject);
}

void CCWGPUTexture::doInit(const TextureInfo &info) {
    uint8_t depthOrArrayLayers = info.depth;
    if (info.type == TextureType::CUBE) {
        depthOrArrayLayers = 6;
    }
    WGPUTextureDescriptor descriptor = {
        .nextInChain   = nullptr,
        .label         = nullptr,
        .usage         = toWGPUTextureUsage(info.usage),
        .dimension     = toWGPUTextureDimension(info.type),
        .size          = {info.width, info.height, depthOrArrayLayers},
        .format        = toWGPUTextureFormat(info.format),
        .mipLevelCount = info.levelCount,
        .sampleCount   = toWGPUSampleCount(info.samples),
    };

    _gpuTextureObj->wgpuTexture = wgpuDeviceCreateTexture(CCWGPUDevice::getInstance()->gpuDeviceObject()->wgpuDevice, &descriptor);

    WGPUTextureViewDescriptor texViewDesc = {
        .nextInChain     = nullptr,
        .label           = nullptr,
        .format          = descriptor.format,
        .dimension       = toWGPUTextureViewDimension(info.type),
        .baseMipLevel    = 0,
        .mipLevelCount   = _info.levelCount,
        .baseArrayLayer  = 0,
        .arrayLayerCount = _info.layerCount,
        .aspect          = WGPUTextureAspect_All,
    };
    _gpuTextureObj->selfView = wgpuTextureCreateView(_gpuTextureObj->wgpuTexture, &texViewDesc);

    _internalChanged = true;
} // namespace gfx

void CCWGPUTexture::doInit(const TextureViewInfo &info) {
    WGPUTextureViewDescriptor descriptor = {
        .nextInChain     = nullptr,
        .label           = nullptr,
        .format          = toWGPUTextureFormat(info.format),
        .dimension       = toWGPUTextureViewDimension(info.type),
        .baseMipLevel    = info.baseLevel,
        .mipLevelCount   = info.levelCount,
        .baseArrayLayer  = info.baseLayer,
        .arrayLayerCount = info.layerCount,
        .aspect          = textureAspectTrait(info.format),
    };

    auto *      ccTexture    = static_cast<CCWGPUTexture *>(info.texture);
    WGPUTexture wgpuTexture  = ccTexture->gpuTextureObject()->wgpuTexture;
    _gpuTextureObj->selfView = _gpuTextureObj->wgpuTextureView = wgpuTextureCreateView(wgpuTexture, &descriptor);
    _internalChanged                                           = true;
}

void CCWGPUTexture::doInit(const SwapchainTextureInfo &info) {
    if (_swapchain) {
        auto *swapchain = static_cast<CCWGPUSwapchain *>(_swapchain);
        if (info.format == Format::DEPTH || info.format == Format::DEPTH_STENCIL) {
            WGPUTextureDescriptor descriptor = {
                .nextInChain   = nullptr,
                .label         = nullptr,
                .usage         = WGPUTextureUsage_RenderAttachment,
                .dimension     = WGPUTextureDimension_2D,
                .size          = {info.width, info.height, 1},
                .format        = toWGPUTextureFormat(info.format),
                .mipLevelCount = 1,
                .sampleCount   = 1,
            };
            _gpuTextureObj->wgpuTexture = wgpuDeviceCreateTexture(CCWGPUDevice::getInstance()->gpuDeviceObject()->wgpuDevice, &descriptor);

            WGPUTextureAspect         aspect      = info.format == Format::DEPTH ? WGPUTextureAspect_DepthOnly : WGPUTextureAspect_All;
            WGPUTextureViewDescriptor texViewDesc = {
                .nextInChain     = nullptr,
                .label           = nullptr,
                .format          = descriptor.format,
                .dimension       = WGPUTextureViewDimension_2D,
                .baseMipLevel    = 0,
                .mipLevelCount   = 1,
                .baseArrayLayer  = 0,
                .arrayLayerCount = 1,
                .aspect          = aspect,
            };
            _gpuTextureObj->selfView = wgpuTextureCreateView(_gpuTextureObj->wgpuTexture, &texViewDesc);
        } else {
            _gpuTextureObj->selfView = wgpuSwapChainGetCurrentTextureView(swapchain->gpuSwapchainObject()->wgpuSwapChain);
        }
        _internalChanged = true;
    }
}

void CCWGPUTexture::doDestroy() {
    if (_gpuTextureObj) {
        if (_gpuTextureObj->wgpuTexture) {
            wgpuTextureDestroy(_gpuTextureObj->wgpuTexture);
            wgpuTextureRelease(_gpuTextureObj->wgpuTexture);
        }
        if (_gpuTextureObj->wgpuTextureView) {
            wgpuTextureViewRelease(_gpuTextureObj->wgpuTextureView);
        }
        if (_gpuTextureObj->selfView) {
            wgpuTextureViewRelease(_gpuTextureObj->selfView);
        }
        CC_DELETE(_gpuTextureObj);
    }
    _internalChanged = true;
}

void CCWGPUTexture::doResize(uint32_t width, uint32_t height, uint32_t size) {
    printf("tex rsz\n");
    if (_isTextureView) {
        printf("Resize is not support on texture view!");
        return;
    }
    if (_gpuTextureObj->wgpuTexture) {
        wgpuTextureDestroy(_gpuTextureObj->wgpuTexture);
        wgpuTextureRelease(_gpuTextureObj->wgpuTexture);
    }
    if (_gpuTextureObj->wgpuTextureView) {
        wgpuTextureViewRelease(_gpuTextureObj->wgpuTextureView);
    }
    if (_gpuTextureObj->selfView) {
        wgpuTextureViewRelease(_gpuTextureObj->selfView);
    }

    uint8_t depthOrArrayLayers = _info.depth;
    if (_info.type == TextureType::CUBE) {
        depthOrArrayLayers = 6;
    }
    WGPUTextureDescriptor descriptor = {
        .nextInChain   = nullptr,
        .label         = nullptr,
        .usage         = toWGPUTextureUsage(_info.usage),
        .dimension     = toWGPUTextureDimension(_info.type),
        .size          = {_info.width, _info.height, depthOrArrayLayers},
        .format        = toWGPUTextureFormat(_info.format),
        .mipLevelCount = _info.levelCount,
        .sampleCount   = toWGPUSampleCount(_info.samples),
    };
    _gpuTextureObj->wgpuTexture = wgpuDeviceCreateTexture(CCWGPUDevice::getInstance()->gpuDeviceObject()->wgpuDevice, &descriptor);

    WGPUTextureViewDescriptor texViewDesc = {
        .nextInChain     = nullptr,
        .label           = nullptr,
        .format          = descriptor.format,
        .dimension       = toWGPUTextureViewDimension(_info.type),
        .baseMipLevel    = 0,
        .mipLevelCount   = _info.levelCount,
        .baseArrayLayer  = 0,
        .arrayLayerCount = _info.layerCount,
        .aspect          = WGPUTextureAspect_All,
    };
    _gpuTextureObj->selfView = wgpuTextureCreateView(_gpuTextureObj->wgpuTexture, &texViewDesc);

    _internalChanged = true;
}

void CCWGPUTexture::stamp() {
    _internalChanged = false;
}

CCWGPUTexture *CCWGPUTexture::defaultCommonTexture() {
    if (!anoymous::defaultCommonTexture) {
        TextureInfo info = {
            .type        = TextureType::TEX2D,
            .usage       = TextureUsageBit::SAMPLED,
            .format      = Format::RGBA8,
            .width       = 2,
            .height      = 2,
            .flags       = TextureFlagBit::NONE,
            .layerCount  = 1,
            .levelCount  = 1,
            .samples     = SampleCount::ONE,
            .depth       = 1,
            .externalRes = nullptr,
        };
        anoymous::defaultCommonTexture = CC_NEW(CCWGPUTexture);
        anoymous::defaultCommonTexture->initialize(info);
    }

    return anoymous::defaultCommonTexture;
}

CCWGPUTexture *CCWGPUTexture::defaultStorageTexture() {
    if (!anoymous::defaultStorageTexture) {
        TextureInfo info = {
            .type        = TextureType::TEX2D,
            .usage       = TextureUsageBit::STORAGE,
            .format      = Format::RGBA8,
            .width       = 2,
            .height      = 2,
            .flags       = TextureFlagBit::NONE,
            .layerCount  = 1,
            .levelCount  = 1,
            .samples     = SampleCount::ONE,
            .depth       = 1,
            .externalRes = nullptr,
        };
        anoymous::defaultStorageTexture = CC_NEW(CCWGPUTexture);
        anoymous::defaultStorageTexture->initialize(info);
    }

    return anoymous::defaultStorageTexture;
}

CCWGPUSwapchain *CCWGPUTexture::swapchain() {
    return static_cast<CCWGPUSwapchain *>(_swapchain);
}

} // namespace gfx
} // namespace cc
