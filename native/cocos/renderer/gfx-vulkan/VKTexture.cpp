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

#include "VKStd.h"

#include "VKCommandBuffer.h"
#include "VKCommands.h"
#include "VKDevice.h"
#include "VKTexture.h"
#include "gfx-base/GFXDef.h"
#include "gfx-vulkan/VKSwapchain.h"

namespace cc {
namespace gfx {

CCVKTexture::CCVKTexture() {
    _typedID = generateObjectID<decltype(this)>();
}

CCVKTexture::~CCVKTexture() {
    destroy();
}

void CCVKTexture::doInit(const TextureInfo & /*info*/) {
    _gpuTexture              = CC_NEW(CCVKGPUTexture);
    _gpuTexture->type        = _info.type;
    _gpuTexture->format      = _info.format;
    _gpuTexture->usage       = _info.usage;
    _gpuTexture->width       = _info.width;
    _gpuTexture->height      = _info.height;
    _gpuTexture->depth       = _info.depth;
    _gpuTexture->arrayLayers = _info.layerCount;
    _gpuTexture->mipLevels   = _info.levelCount;
    _gpuTexture->samples     = _info.samples;
    _gpuTexture->flags       = _info.flags;
    _gpuTexture->size        = _size;

    cmdFuncCCVKCreateTexture(CCVKDevice::getInstance(), _gpuTexture);

    if (!_gpuTexture->memoryless) {
        CCVKDevice::getInstance()->getMemoryStatus().textureSize += _size;
    }

    _gpuTextureView = CC_NEW(CCVKGPUTextureView);
    createTextureView();
}

void CCVKTexture::doInit(const TextureViewInfo &info) {
    _gpuTexture = static_cast<CCVKTexture *>(info.texture)->gpuTexture();

    _gpuTextureView = CC_NEW(CCVKGPUTextureView);
    createTextureView();
}

void CCVKTexture::createTextureView() {
    _gpuTextureView->gpuTexture = _gpuTexture;
    _gpuTextureView->type       = _viewInfo.type;
    _gpuTextureView->format     = _viewInfo.format;
    _gpuTextureView->baseLevel  = _viewInfo.baseLevel;
    _gpuTextureView->levelCount = _viewInfo.levelCount;
    _gpuTextureView->baseLayer  = _viewInfo.baseLayer;
    _gpuTextureView->layerCount = _viewInfo.layerCount;
    cmdFuncCCVKCreateTextureView(CCVKDevice::getInstance(), _gpuTextureView);
}

void CCVKTexture::doDestroy() {
    if (_gpuTextureView) {
        CCVKDevice::getInstance()->gpuRecycleBin()->collect(_gpuTextureView);
        CCVKDevice::getInstance()->gpuDescriptorHub()->disengage(_gpuTextureView);
        CC_DELETE(_gpuTextureView);
        _gpuTextureView = nullptr;
    }

    if (_gpuTexture) {
        if (!_isTextureView) {
            if (!_gpuTexture->memoryless) {
                CCVKDevice::getInstance()->getMemoryStatus().textureSize -= _size;
            }
            CCVKDevice::getInstance()->gpuRecycleBin()->collect(_gpuTexture);
            CCVKDevice::getInstance()->gpuBarrierManager()->cancel(_gpuTexture);
            CC_DELETE(_gpuTexture);
        }
        _gpuTexture = nullptr;
    }
}

void CCVKTexture::doResize(uint32_t width, uint32_t height, uint32_t size) {
    if (!width || !height) return;

    if (!_gpuTexture->memoryless) {
        CCVKDevice::getInstance()->getMemoryStatus().textureSize -= _size;
    }

    CCVKDevice::getInstance()->gpuRecycleBin()->collect(_gpuTextureView);
    CCVKDevice::getInstance()->gpuRecycleBin()->collect(_gpuTexture);

    _gpuTexture->width  = width;
    _gpuTexture->height = height;
    _gpuTexture->size   = size;
    cmdFuncCCVKCreateTexture(CCVKDevice::getInstance(), _gpuTexture);

    if (!_gpuTexture->memoryless) {
        CCVKDevice::getInstance()->getMemoryStatus().textureSize += size;
    }

    cmdFuncCCVKCreateTextureView(CCVKDevice::getInstance(), _gpuTextureView);
}

///////////////////////////// Swapchain Specific /////////////////////////////

void CCVKTexture::doInit(const SwapchainTextureInfo & /*info*/) {
    _gpuTexture              = CC_NEW(CCVKGPUTexture);
    _gpuTexture->type        = _info.type;
    _gpuTexture->format      = _info.format;
    _gpuTexture->usage       = _info.usage;
    _gpuTexture->width       = _info.width;
    _gpuTexture->height      = _info.height;
    _gpuTexture->depth       = _info.depth;
    _gpuTexture->arrayLayers = _info.layerCount;
    _gpuTexture->mipLevels   = _info.levelCount;
    _gpuTexture->flags       = _info.flags;
    _gpuTexture->samples     = _info.samples;
    _gpuTexture->size        = _size;

    _gpuTexture->swapchain  = static_cast<CCVKSwapchain *>(_swapchain)->gpuSwapchain();
    _gpuTexture->memoryless = true;

    _gpuTextureView             = CC_NEW(CCVKGPUTextureView);
    _gpuTextureView->gpuTexture = _gpuTexture;
    _gpuTextureView->type       = _viewInfo.type;
    _gpuTextureView->format     = _viewInfo.format;
    _gpuTextureView->baseLevel  = _viewInfo.baseLevel;
    _gpuTextureView->levelCount = _viewInfo.levelCount;
    _gpuTextureView->baseLayer  = _viewInfo.baseLayer;
    _gpuTextureView->layerCount = _viewInfo.layerCount;
}

} // namespace gfx
} // namespace cc
