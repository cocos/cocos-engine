/****************************************************************************
 Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.

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

#include "core/assets/SimpleTexture.h"
#include "core/assets/ImageAsset.h"
#include "core/event/EventTypesToJS.h"
#include "core/platform/Macro.h"
#include "renderer/gfx-base/GFXDevice.h"

namespace cc {

namespace {

uint32_t getMipLevel(uint32_t width, uint32_t height) {
    uint32_t size  = std::max(width, height);
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

SimpleTexture::SimpleTexture()= default;
SimpleTexture::~SimpleTexture()= default;


bool SimpleTexture::destroy() {
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
    region.texExtent.width          = _textureWidth >> level;
    region.texExtent.height         = _textureHeight >> level;
    region.texSubres.mipLevel       = level;
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

    emit(EventTypesToJS::SIMPLE_TEXTURE_AFTER_ASSIGN_IMAGE, image);
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
    tryDestroyTexture();
    if (_mipmapLevel == 0) {
        return;
    }
    auto *device = getGFXDevice();
    if (!device) {
        return;
    }
    createTexture(device);
}

void SimpleTexture::createTexture(gfx::Device *device) {
    if (_width == 0 || _height == 0) {
        return;
    }

    auto flags = gfx::TextureFlagBit::NONE;
    if (_mipFilter != Filter::NONE && canGenerateMipmap(_width, _height)) {
        _mipmapLevel = getMipLevel(_width, _height);
        flags        = gfx::TextureFlagBit::GEN_MIPMAP;
    }

    auto textureCreateInfo = getGfxTextureCreateInfo(
        gfx::TextureUsageBit::SAMPLED | gfx::TextureUsageBit::TRANSFER_DST,
        getGFXFormat(),
        _mipmapLevel,
        flags);

    //cjh    if (!textureCreateInfo) {
    //        return;
    //    }

    auto *texture  = device->createTexture(textureCreateInfo);
    _textureWidth  = textureCreateInfo.width;
    _textureHeight = textureCreateInfo.height;

    _gfxTexture = texture;

    notifyTextureUpdated();
}

void SimpleTexture::tryDestroyTexture() {
    if (_gfxTexture != nullptr) {
        _gfxTexture->destroy();
        _gfxTexture = nullptr;

        notifyTextureUpdated();
    }
}

void SimpleTexture::notifyTextureUpdated() {
    emit(EventTypesToJS::SIMPLE_TEXTURE_GFX_TEXTURE_UPDATED, _gfxTexture.get());
}

} // namespace cc
