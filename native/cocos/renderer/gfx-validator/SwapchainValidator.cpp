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

#include "SwapchainValidator.h"
#include "ValidationUtils.h"
#include "gfx-base/GFXDef.h"
#include "gfx-validator/DeviceValidator.h"
#include "gfx-validator/TextureValidator.h"

namespace cc {
namespace gfx {

SwapchainValidator::SwapchainValidator(Swapchain *actor)
: Agent<Swapchain>(actor) {
    _typedID = actor->getTypedID();
    _preRotationEnabled = static_cast<SwapchainValidator *>(actor)->_preRotationEnabled;
}

SwapchainValidator::~SwapchainValidator() {
    DeviceResourceTracker<Swapchain>::erase(this);
    CC_SAFE_DELETE(_actor);
}

void SwapchainValidator::doInit(const SwapchainInfo &info) {
    CC_ASSERT(!isInited());
    _inited = true;

    /////////// execute ///////////

    _actor->initialize(info);

    auto *colorTexture = ccnew TextureValidator(_actor->getColorTexture());
    colorTexture->renounceOwnership();
    _colorTexture = colorTexture;
    DeviceResourceTracker<Texture>::push(_colorTexture.get());

    auto *depthStencilTexture = ccnew TextureValidator(_actor->getDepthStencilTexture());
    depthStencilTexture->renounceOwnership();
    _depthStencilTexture = depthStencilTexture;
    DeviceResourceTracker<Texture>::push(_depthStencilTexture.get());

    SwapchainTextureInfo textureInfo;
    textureInfo.swapchain = this;
    textureInfo.format = _actor->getColorTexture()->getFormat();
    textureInfo.width = _actor->getWidth();
    textureInfo.height = _actor->getHeight();
    initTexture(textureInfo, _colorTexture);

    textureInfo.format = _actor->getDepthStencilTexture()->getFormat();
    initTexture(textureInfo, _depthStencilTexture);

    _transform = _actor->getSurfaceTransform();
}

void SwapchainValidator::doDestroy() {
    CC_ASSERT(isInited());
    _inited = false;

    /////////// execute ///////////
    _depthStencilTexture = nullptr;
    _colorTexture = nullptr;

    _actor->destroy();
}

void SwapchainValidator::updateInfo() {
    _generation = _actor->getGeneration();
    SwapchainTextureInfo textureInfo;
    textureInfo.swapchain = this;
    textureInfo.format = _actor->getColorTexture()->getFormat();
    textureInfo.width = _actor->getWidth();
    textureInfo.height = _actor->getHeight();
    updateTextureInfo(textureInfo, _colorTexture);

    textureInfo.format = _actor->getDepthStencilTexture()->getFormat();
    updateTextureInfo(textureInfo, _depthStencilTexture);

    _transform = _actor->getSurfaceTransform();
}

void SwapchainValidator::doResize(uint32_t width, uint32_t height, SurfaceTransform transform) {
    CC_ASSERT(isInited());

    _actor->resize(width, height, transform);

    updateInfo();
}

void SwapchainValidator::doDestroySurface() {
    CC_ASSERT(isInited());

    _actor->destroySurface();
}

void SwapchainValidator::doCreateSurface(void *windowHandle) {
    CC_ASSERT(isInited());

    _actor->createSurface(windowHandle);

    updateInfo();
}

} // namespace gfx
} // namespace cc
