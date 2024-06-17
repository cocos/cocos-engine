/****************************************************************************
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

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

#include "core/assets/SimpleTexture.h"
#include "core/assets/ImageAsset.h"
#include "core/platform/Debug.h"
#include "core/platform/Macro.h"
#include "renderer/gfx-base/GFXDevice.h"

namespace cc {

namespace {

uint32_t getMipLevel(uint32_t width, uint32_t height) {
    uint32_t size = std::max(width, height);
    uint32_t level = 0;
    while (size) {
        size >>= 1;
        level++;
    }
    return level;
}

bool isPOT(uint32_t n) { return n && (n & (n - 1)) == 0; }

bool canGenerateMipmap(uint32_t w, uint32_t h) {
    return isPOT(w) && isPOT(h);
}

} // namespace

SimpleTexture::SimpleTexture() = default;
SimpleTexture::~SimpleTexture() = default;

bool SimpleTexture::destroy() {
    tryDestroyTextureView();
    tryDestroyTexture();
    return Super::destroy();
}

void SimpleTexture::updateImage() {
    updateMipmaps(0, 0);
}

void SimpleTexture::uploadDataWithArrayBuffer(const ArrayBuffer &source, uint32_t level /* = 0 */, uint32_t arrayIndex /* = 0 */) {
    uploadData(source.getData(), level, arrayIndex);
}

void SimpleTexture::uploadData(const uint8_t *source, uint32_t level /* = 0 */, uint32_t arrayIndex /* = 0 */) {
    if (!_gfxTexture || _mipmapLevel <= level) {
        return;
    }

    auto *gfxDevice = getGFXDevice();
    if (!gfxDevice) {
        return;
    }

    gfx::BufferTextureCopy region;
    region.texExtent.width = _textureWidth >> level;
    region.texExtent.height = _textureHeight >> level;
    region.texSubres.mipLevel = level;
    region.texSubres.baseArrayLayer = arrayIndex;

    const uint8_t *buffers[1]{source};
    gfxDevice->copyBuffersToTexture(buffers, _gfxTexture, &region, 1);
}

void SimpleTexture::assignImage(ImageAsset *image, uint32_t level, uint32_t arrayIndex /* = 0 */) {
    const uint8_t *data = image->getData();
    if (!data) {
        return;
    }

    uploadData(data, level, arrayIndex);
    checkTextureLoaded();

    emit<AfterAssignImage>(image);
}

void SimpleTexture::checkTextureLoaded() {
    textureReady();
}

void SimpleTexture::textureReady() {
    _loaded = true;
    //cjh    this.emit('load');
}

void SimpleTexture::setMipmapLevel(uint32_t value) {
    _mipmapLevel = value < 1 ? 1 : value;
}

void SimpleTexture::tryReset() {
    tryDestroyTextureView();
    tryDestroyTexture();
    if (_mipmapLevel == 0) {
        return;
    }
    auto *device = getGFXDevice();
    if (!device) {
        return;
    }
    createTexture(device);
    _gfxTextureView = createTextureView(device);
}

void SimpleTexture::createTexture(gfx::Device *device) {
    if (_width == 0 || _height == 0) {
        return;
    }

    auto flags = gfx::TextureFlagBit::NONE;
    auto usage = gfx::TextureUsageBit::SAMPLED | gfx::TextureUsageBit::TRANSFER_DST;
    if (_mipFilter != Filter::NONE && canGenerateMipmap(_width, _height)) {
        _mipmapLevel = getMipLevel(_width, _height);
        if (!isUsingOfflineMipmaps() && !isCompressed()) {
            flags = gfx::TextureFlagBit::GEN_MIPMAP;
        }
    }

    const auto gfxFormat = getGFXFormat();
    if (hasFlag(gfx::Device::getInstance()->getFormatFeatures(gfxFormat), gfx::FormatFeatureBit::RENDER_TARGET)) {
        usage |= gfx::TextureUsageBit::COLOR_ATTACHMENT;
    }

    auto textureCreateInfo = getGfxTextureCreateInfo(
        usage,
        gfxFormat,
        _mipmapLevel,
        flags);

    //cjh    if (!textureCreateInfo) {
    //        return;
    //    }

    auto *texture = device->createTexture(textureCreateInfo);
    _textureWidth = textureCreateInfo.width;
    _textureHeight = textureCreateInfo.height;

    _gfxTexture = texture;

    notifyTextureUpdated();
}

gfx::Texture *SimpleTexture::createTextureView(gfx::Device *device) {
    if (!_gfxTexture) {
        return nullptr;
    }
    const uint32_t maxLevel = _maxLevel < _mipmapLevel ? _maxLevel : _mipmapLevel - 1;
    auto textureViewCreateInfo = getGfxTextureViewCreateInfo(
        _gfxTexture,
        getGFXFormat(),
        _baseLevel,
        maxLevel - _baseLevel + 1);

    //TODO(minggo)
    //    if (!textureViewCreateInfo) {
    //        return;
    //    }

    return device->createTexture(textureViewCreateInfo);
}

void SimpleTexture::tryDestroyTexture() {
    if (_gfxTexture != nullptr) {
        _gfxTexture->destroy();
        _gfxTexture = nullptr;

        notifyTextureUpdated();
    }
}

void SimpleTexture::tryDestroyTextureView() {
    if (_gfxTextureView != nullptr) {
        _gfxTextureView->destroy();
        _gfxTextureView = nullptr;

        //TODO(minggo): should notify JS if the performance is low.
    }
}

void SimpleTexture::setMipRange(uint32_t baseLevel, uint32_t maxLevel) {
    debug::assertID(baseLevel <= maxLevel, 3124);

    setMipRangeInternal(baseLevel, maxLevel);

    auto *device = getGFXDevice();
    if (!device) {
        return;
    }
    // create a new texture view before the destruction of the previous one to bypass the bug that
    // vulkan destroys textureview in use. This is a temporary solution, should be fixed later.
    gfx::Texture *textureView = createTextureView(device);
    tryDestroyTextureView();
    _gfxTextureView = textureView;
}

bool SimpleTexture::isUsingOfflineMipmaps() {
    return false;
}

void SimpleTexture::setMipRangeInternal(uint32_t baseLevel, uint32_t maxLevel) {
    _baseLevel = baseLevel < 1 ? 0 : baseLevel;
    _maxLevel = _maxLevel < 1 ? 0 : maxLevel;
}

void SimpleTexture::notifyTextureUpdated() {
    emit<TextureUpdated>(_gfxTexture.get());
}

} // namespace cc
