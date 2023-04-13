/****************************************************************************
 Copyright (c) 2019-2023 Xiamen Yaji Software Co., Ltd.

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

#include "base/Utils.h"

#include "GFXSwapchain.h"
#include "GFXTexture.h"
#include "base/std/hash/hash.h"

namespace cc {
namespace gfx {

Texture::Texture()
: GFXObject(ObjectType::TEXTURE) {
}

Texture::~Texture() = default;

ccstd::hash_t Texture::computeHash(const TextureInfo &info) {
    return Hasher<TextureInfo>()(info);
}

ccstd::hash_t Texture::computeHash(const TextureViewInfo &info) {
    return Hasher<TextureViewInfo>()(info);
}

ccstd::hash_t Texture::computeHash(const Texture *texture) {
    ccstd::hash_t hash = texture->isTextureView() ? computeHash(texture->getViewInfo()) : computeHash(texture->getInfo());
    if (texture->_swapchain) {
        ccstd::hash_combine(hash, texture->_swapchain->getObjectID());
        ccstd::hash_combine(hash, texture->_swapchain->getGeneration());
    }
    return hash;
}

void Texture::initialize(const TextureInfo &info) {
    _info = info;
    _size = formatSize(_info.format, _info.width, _info.height, _info.depth);
    _hash = computeHash(info);

    _viewInfo.texture = this;
    _viewInfo.format = _info.format;
    _viewInfo.type = _info.type;
    _viewInfo.baseLayer = 0;
    _viewInfo.layerCount = _info.layerCount;
    _viewInfo.baseLevel = 0;
    _viewInfo.levelCount = _info.levelCount;

    doInit(info);
}

void Texture::initialize(const TextureViewInfo &info) {
    _info = info.texture->getInfo();
    _viewInfo = info;

    _isTextureView = true;
    _size = formatSize(_info.format, _info.width, _info.height, _info.depth);
    _hash = computeHash(info);

    doInit(info);
}

uint32_t getLevelCount(uint32_t width, uint32_t height) {
    return static_cast<uint32_t>(std::floor(std::log2(std::max(width, height)))) + 1;
}

void Texture::resize(uint32_t width, uint32_t height) {
    if (_info.width != width || _info.height != height) {
        if (_info.levelCount == getLevelCount(_info.width, _info.height)) {
            _info.levelCount = getLevelCount(width, height);
        } else if (_info.levelCount > 1) {
            _info.levelCount = std::min(_info.levelCount, getLevelCount(width, height));
        }

        uint32_t size = formatSize(_info.format, width, height, _info.depth);
        doResize(width, height, size);

        _info.width = width;
        _info.height = height;
        _size = size;
        _hash = computeHash(this);
    }
}

void Texture::destroy() {
    doDestroy();

    _info = TextureInfo();
    _viewInfo = TextureViewInfo();

    _isTextureView = false;
    _hash = _size = 0;
}

///////////////////////////// Swapchain Specific /////////////////////////////

void Texture::initialize(const SwapchainTextureInfo &info, Texture *out) {
    updateTextureInfo(info, out);
    out->doInit(info);
}

void Texture::updateTextureInfo(const SwapchainTextureInfo &info, Texture *out) {
    out->_info.type = TextureType::TEX2D;
    out->_info.format = info.format;
    out->_info.width = info.width;
    out->_info.height = info.height;
    out->_info.layerCount = 1;
    out->_info.levelCount = 1;
    out->_info.depth = 1;
    out->_info.samples = SampleCount::ONE;
    out->_info.flags = TextureFlagBit::NONE;
    out->_info.usage = GFX_FORMAT_INFOS[toNumber(info.format)].hasDepth
                           ? TextureUsageBit::DEPTH_STENCIL_ATTACHMENT
                           : TextureUsageBit::COLOR_ATTACHMENT;
    out->_swapchain = info.swapchain;
    out->_size = formatSize(info.format, info.width, info.height, 1);
    out->_hash = computeHash(out);

    out->_viewInfo.texture = out;
    out->_viewInfo.format = out->_info.format;
    out->_viewInfo.type = out->_info.type;
    out->_viewInfo.baseLayer = 0;
    out->_viewInfo.layerCount = out->_info.layerCount;
    out->_viewInfo.baseLevel = 0;
    out->_viewInfo.levelCount = out->_info.levelCount;
}

} // namespace gfx
} // namespace cc
