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

namespace cc {
namespace gfx {

CCVKTexture::CCVKTexture() = default;

CCVKTexture::~CCVKTexture() {
    destroy();
}

void CCVKTexture::doInit(const TextureInfo & /*info*/) {
    _gpuTexture              = CC_NEW(CCVKGPUTexture);
    _gpuTexture->type        = _type;
    _gpuTexture->format      = _format;
    _gpuTexture->usage       = _usage;
    _gpuTexture->width       = _width;
    _gpuTexture->height      = _height;
    _gpuTexture->depth       = _depth;
    _gpuTexture->size        = _size;
    _gpuTexture->arrayLayers = _layerCount;
    _gpuTexture->mipLevels   = _levelCount;
    _gpuTexture->samples     = _samples;
    _gpuTexture->flags       = _flags;

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
    _gpuTextureView->type       = _type;
    _gpuTextureView->format     = _format;
    _gpuTextureView->baseLevel  = _baseLevel;
    _gpuTextureView->levelCount = _levelCount;
    _gpuTextureView->baseLayer  = _baseLayer;
    _gpuTextureView->layerCount = _layerCount;
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

void CCVKTexture::doResize(uint width, uint height, uint size) {
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

} // namespace gfx
} // namespace cc
