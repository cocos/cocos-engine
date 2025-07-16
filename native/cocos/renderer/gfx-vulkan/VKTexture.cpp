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

#include "VKTexture.h"
#include "VKCommandBuffer.h"
#include "VKCommands.h"
#include "VKDevice.h"
#include "VKSwapchain.h"
#include "profiler/Profiler.h"

namespace cc {
namespace gfx {

CCVKTexture::CCVKTexture() {
    _typedID = generateObjectID<decltype(this)>();
}

CCVKTexture::~CCVKTexture() {
    destroy();
}

void CCVKTexture::doInit(const TextureInfo & /*info*/) {
    createTexture(_info.width, _info.height, _size);

    _viewInfo.planeCount = _info.format == Format::DEPTH_STENCIL ? 2 : 1;
    createTextureView();
}

void CCVKTexture::doInit(const TextureViewInfo &info) {
    _gpuTexture = static_cast<CCVKTexture *>(info.texture)->gpuTexture();

    createTextureView();
}

void CCVKTexture::createTexture(uint32_t width, uint32_t height, uint32_t size, bool initGPUTexture) {
    _gpuTexture = ccnew CCVKGPUTexture;
    _gpuTexture->width = width;
    _gpuTexture->height = height;
    _gpuTexture->size = size;

    if (_swapchain != nullptr) {
        _gpuTexture->swapchain = static_cast<CCVKSwapchain *>(_swapchain)->gpuSwapchain();
        _gpuTexture->memoryAllocated = false;
    }

    _gpuTexture->type = _info.type;
    _gpuTexture->format = _info.format;
    _gpuTexture->usage = _info.usage;
    _gpuTexture->depth = _info.depth;
    _gpuTexture->arrayLayers = _info.layerCount;
    _gpuTexture->mipLevels = _info.levelCount;
    _gpuTexture->samples = _info.samples;
    _gpuTexture->flags = _info.flags;

    bool hasExternalFlag = hasFlag(_gpuTexture->flags, TextureFlagBit::EXTERNAL_NORMAL);
    if (hasExternalFlag) {
        _gpuTexture->externalVKImage = reinterpret_cast<VkImage>(_info.externalRes);
    }

    if (initGPUTexture) {
        _gpuTexture->init();
    }
}

void CCVKTexture::createTextureView(bool initGPUTextureView) {
    _gpuTextureView = ccnew CCVKGPUTextureView;
    _gpuTextureView->gpuTexture = _gpuTexture;
    _gpuTextureView->type = _viewInfo.type;
    _gpuTextureView->format = _viewInfo.format;
    _gpuTextureView->baseLevel = _viewInfo.baseLevel;
    _gpuTextureView->levelCount = _viewInfo.levelCount;
    _gpuTextureView->baseLayer = _viewInfo.baseLayer;
    _gpuTextureView->layerCount = _viewInfo.layerCount;
    _gpuTextureView->basePlane = _viewInfo.basePlane;
    _gpuTextureView->planeCount = _viewInfo.planeCount;

    if (initGPUTextureView) {
        _gpuTextureView->init();
    }
}

void CCVKTexture::doDestroy() {
    _gpuTexture = nullptr;
    _gpuTextureView = nullptr;
}

void CCVKTexture::doResize(uint32_t width, uint32_t height, uint32_t size) {
    if (!width || !height) return;
    createTexture(width, height, size);

    // Hold reference to keep the old textureView alive during DescriptorHub::update.
    IntrusivePtr<CCVKGPUTextureView> oldTextureView = _gpuTextureView;
    createTextureView();
    CCVKDevice::getInstance()->gpuDescriptorHub()->update(oldTextureView, _gpuTextureView);
}

///////////////////////////// Swapchain Specific /////////////////////////////

void CCVKTexture::doInit(const SwapchainTextureInfo & /*info*/) {
    createTexture(_info.width, _info.height, _size, false);
    createTextureView(false);
}

void CCVKGPUTexture::init() {
    cmdFuncCCVKCreateTexture(CCVKDevice::getInstance(), this);

    if (memoryAllocated) {
        CCVKDevice::getInstance()->getMemoryStatus().textureSize += size;
        CC_PROFILE_MEMORY_INC(Texture, size);
    }
}

void CCVKGPUTexture::shutdown() {
    if (memoryAllocated) {
        CCVKDevice::getInstance()->getMemoryStatus().textureSize -= size;
        CC_PROFILE_MEMORY_DEC(Texture, size);
    }

    CCVKDevice::getInstance()->gpuBarrierManager()->cancel(this);
    if (!hasFlag(flags, TextureFlagBit::EXTERNAL_NORMAL)) {
        CCVKDevice::getInstance()->gpuRecycleBin()->collect(this);
    }
}

void CCVKGPUTextureView::init() {
    cmdFuncCCVKCreateTextureView(CCVKDevice::getInstance(), this);
}

void CCVKGPUTextureView::shutdown() {
    CCVKDevice::getInstance()->gpuDescriptorHub()->disengage(this);
    CCVKDevice::getInstance()->gpuRecycleBin()->collect(this);
}

} // namespace gfx
} // namespace cc
