/****************************************************************************
 Copyright (c) 2019-2021 Xiamen Yaji Software Co., Ltd.

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

#include "base/CoreStd.h"

#include "GFXDevice.h"
#include "GFXObject.h"
#include "GFXTexture.h"

namespace cc {
namespace gfx {

Texture::Texture()
: GFXObject(ObjectType::TEXTURE) {
}

Texture::~Texture() = default;

uint Texture::computeHash(const TextureInfo &info) {
    uint seed = 10;
    seed ^= static_cast<uint>(info.type) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
    seed ^= static_cast<uint>(info.usage) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
    seed ^= static_cast<uint>(info.format) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
    seed ^= (info.width) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
    seed ^= (info.height) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
    seed ^= static_cast<uint>(info.flags) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
    seed ^= (info.layerCount) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
    seed ^= (info.levelCount) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
    seed ^= static_cast<uint>(info.samples) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
    seed ^= (info.depth) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
    return seed;
}

void Texture::initialize(const TextureInfo &info) {
    _type       = info.type;
    _usage      = info.usage;
    _format     = info.format;
    _width      = info.width;
    _height     = info.height;
    _depth      = info.depth;
    _layerCount = info.layerCount;
    _levelCount = info.levelCount;
    _samples    = info.samples;
    _flags      = info.flags;
    _size       = formatSize(_format, _width, _height, _depth);

    doInit(info);
}

void Texture::initialize(const TextureViewInfo &info) {
    _isTextureView = true;

    _type          = info.texture->getType();
    _format        = info.format;
    _baseLayer     = info.baseLayer;
    _layerCount    = info.layerCount;
    _baseLevel     = info.baseLevel;
    _levelCount    = info.levelCount;
    _usage         = info.texture->getUsage();
    _width         = info.texture->getWidth();
    _height        = info.texture->getHeight();
    _depth         = info.texture->getDepth();
    _samples       = info.texture->getSamples();
    _flags         = info.texture->getFlags();
    _size          = formatSize(_format, _width, _height, _depth);
    _isTextureView = true;

    doInit(info);
}

void Texture::destroy() {
    doDestroy();

    _format = Format::UNKNOWN;
    _width = _height = _depth = _size = 0;
}

void Texture::resize(uint width, uint height) {
    if (_width != width || _height != height) {
        uint size = formatSize(_format, width, height, _depth);
        doResize(width, height, size);

        _width  = width;
        _height = height;
        _size   = size;

        resizeObjectID();
    }
}

} // namespace gfx
} // namespace cc
