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

#include "core/assets/TextureBase.h"
#include "base/StringUtil.h"
#include "cocos/core/platform/Debug.h"
#include "core/utils/IDGenerator.h"

#include "renderer/gfx-base/GFXDevice.h"
#include "renderer/pipeline/Define.h"

#include "base/std/hash/hash.h"

namespace cc {

namespace {
IDGenerator idGenerator("Tex");
}

TextureBase::TextureBase() {
    // Id for generate hash in material
    _id = idGenerator.getNewId();
    _gfxDevice = getGFXDevice();
    ccstd::hash_t seed = 666;
    ccstd::hash_range(seed, _id.begin(), _id.end());
    _textureHash = seed;
}

TextureBase::~TextureBase() = default;

void TextureBase::setWrapMode(WrapMode wrapS, WrapMode wrapT, WrapMode wrapR) {
    _wrapS = wrapS;
    _samplerInfo.addressU = static_cast<gfx::Address>(wrapS),

    _wrapT = wrapT;
    _samplerInfo.addressV = static_cast<gfx::Address>(wrapT),

    _wrapR = wrapR;
    _samplerInfo.addressW = static_cast<gfx::Address>(wrapR);

    if (_gfxDevice != nullptr) {
        _gfxSampler = _gfxDevice->getSampler(_samplerInfo);
    }

    notifySamplerUpdated();
}

void TextureBase::setWrapMode(WrapMode wrapS, WrapMode wrapT) {
    setWrapMode(wrapS, wrapT, wrapS); // wrap modes should be as consistent as possible for performance
}

void TextureBase::setFilters(Filter minFilter, Filter magFilter) {
    _minFilter = minFilter;
    _samplerInfo.minFilter = static_cast<gfx::Filter>(minFilter);
    _magFilter = magFilter;
    _samplerInfo.magFilter = static_cast<gfx::Filter>(magFilter);

    if (_gfxDevice != nullptr) {
        _gfxSampler = _gfxDevice->getSampler(_samplerInfo);
    }

    notifySamplerUpdated();
}

void TextureBase::setMipFilter(Filter mipFilter) {
    _mipFilter = mipFilter;
    _samplerInfo.mipFilter = static_cast<gfx::Filter>(mipFilter);

    if (_gfxDevice != nullptr) {
        _gfxSampler = _gfxDevice->getSampler(_samplerInfo);
    }

    notifySamplerUpdated();
}

void TextureBase::setAnisotropy(uint32_t anisotropy) {
    _anisotropy = anisotropy;
    _samplerInfo.maxAnisotropy = anisotropy;

    if (_gfxDevice != nullptr) {
        _gfxSampler = _gfxDevice->getSampler(_samplerInfo);
    }

    notifySamplerUpdated();
}

bool TextureBase::destroy() {
    const bool destroyed = Super::destroy();
    //cjh TODO:    if (destroyed && legacyCC.director.root?.batcher2D) {
    //        legacyCC.director.root.batcher2D._releaseDescriptorSetCache(this._textureHash);
    //    }
    return destroyed;
}

gfx::Sampler *TextureBase::getGFXSampler() const {
    if (_gfxSampler == nullptr) {
        if (_gfxDevice != nullptr) {
            const_cast<TextureBase *>(this)->_gfxSampler = _gfxDevice->getSampler(_samplerInfo);
        } else {
            debug::errorID(9302);
        }
    }
    return _gfxSampler;
}

ccstd::any TextureBase::serialize(const ccstd::any & /*ctxForExporting*/) {
    //cjh TODO:    if (EDITOR || TEST) {
    //        return `${this._minFilter},${this._magFilter},${
    //            this._wrapS},${this._wrapT},${
    //            this._mipFilter},${this._anisotropy}`;
    //    }
    return ccstd::string("");
}

void TextureBase::deserialize(const ccstd::any &serializedData, const ccstd::any & /*handle*/) {
    const auto *pData = ccstd::any_cast<const ccstd::string>(&serializedData);
    if (pData == nullptr) {
        return;
    }
    const ccstd::string &data = *pData;
    auto fields = StringUtil::split(data, ",");
    fields.insert(fields.begin(), "");

    if (fields.size() >= 5) {
        // decode filters
        setFilters(static_cast<Filter>(atoi(fields[1].c_str())), static_cast<Filter>(atoi(fields[2].c_str())));
        // decode wraps
        setWrapMode(static_cast<WrapMode>(atoi(fields[3].c_str())), static_cast<WrapMode>(atoi(fields[4].c_str())));
    }

    if (fields.size() >= 7) {
        setMipFilter(static_cast<Filter>(atoi(fields[5].c_str())));
        setAnisotropy(atoi(fields[6].c_str()));
    }
}

gfx::Device *TextureBase::getGFXDevice() {
    return gfx::Device::getInstance();
}

gfx::Format TextureBase::getGFXFormat() const {
    return getGFXPixelFormat(_format);
}

void TextureBase::setGFXFormat(const ccstd::optional<PixelFormat> &format) {
    _format = format.has_value() ? format.value() : PixelFormat::RGBA8888;
}

gfx::Format TextureBase::getGFXPixelFormat(PixelFormat format) {
    if (format == PixelFormat::RGBA_ETC1) {
        format = PixelFormat::RGB_ETC1;
    } else if (format == PixelFormat::RGB_A_PVRTC_4BPPV1) {
        format = PixelFormat::RGB_PVRTC_4BPPV1;
    } else if (format == PixelFormat::RGB_A_PVRTC_2BPPV1) {
        format = PixelFormat::RGB_PVRTC_2BPPV1;
    }
    return static_cast<gfx::Format>(format);
}

bool TextureBase::isCompressed() const {
    return (_format >= PixelFormat::RGB_ETC1 && _format <= PixelFormat::RGBA_ASTC_12X12) || (_format >= PixelFormat::RGB_A_PVRTC_2BPPV1 && _format <= PixelFormat::RGBA_ETC1);
}

void TextureBase::notifySamplerUpdated() {
    // emit(EventTypesToJS::TEXTURE_BASE_GFX_SAMPLER_UPDATED, _gfxSampler);
    emit<SamplerUpdated>(_gfxSampler);
}

} // namespace cc
