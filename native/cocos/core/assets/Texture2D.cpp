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

#include "core/assets/Texture2D.h"

#include <sstream>

#include "base/Log.h"
#include "core/assets/ImageAsset.h"

namespace cc {

Texture2D::Texture2D() = default;
Texture2D::~Texture2D() = default;

void Texture2D::syncMipmapsForJS(const ccstd::vector<IntrusivePtr<ImageAsset>> &value) {
    _mipmaps = value;
}

void Texture2D::setMipmaps(const ccstd::vector<IntrusivePtr<ImageAsset>> &value) {
    _mipmaps = value;

    auto mipmaps = ccstd::vector<IntrusivePtr<ImageAsset>>{};

    if (value.size() == 1) {
        const auto images = value[0]->extractMipmaps();
        std::copy(std::cbegin(images), std::cend(images), std::back_inserter(mipmaps));
    } else if (value.size() > 1) {
        for (const auto &image : value) {
            mipmaps.emplace_back(image->extractMipmap0());
        }
    }

    setMipmapParams(mipmaps);
}

void Texture2D::setMipmapParams(const ccstd::vector<IntrusivePtr<ImageAsset>> &value) {
    _generatedMipmaps = value;
    setMipmapLevel(static_cast<uint32_t>(_generatedMipmaps.size()));
    if (!_generatedMipmaps.empty()) {
        ImageAsset *imageAsset = _generatedMipmaps[0];
        ITexture2DCreateInfo info;
        info.width = imageAsset->getWidth();
        info.height = imageAsset->getHeight();
        info.format = imageAsset->getFormat();
        info.mipmapLevel = static_cast<uint32_t>(_generatedMipmaps.size());
        info.baseLevel = _baseLevel;
        info.maxLevel = _maxLevel;
        reset(info);

        for (size_t i = 0, len = _generatedMipmaps.size(); i < len; ++i) {
            assignImage(_generatedMipmaps[i], static_cast<uint32_t>(i));
        }

    } else {
        ITexture2DCreateInfo info;
        info.width = 0;
        info.height = 0;
        info.mipmapLevel = static_cast<uint32_t>(_generatedMipmaps.size());
        info.baseLevel = _baseLevel;
        info.maxLevel = _maxLevel;
        reset(info);
    }
}

void Texture2D::initialize() {
    setMipmaps(_mipmaps);
}

void Texture2D::onLoaded() {
    initialize();
}

void Texture2D::reset(const ITexture2DCreateInfo &info) {
    _width = info.width;
    _height = info.height;
    setGFXFormat(info.format);

    const uint32_t mipLevels = info.mipmapLevel.has_value() ? info.mipmapLevel.value() : 1;
    setMipmapLevel(mipLevels);

    const uint32_t minLod = info.baseLevel.has_value() ? info.baseLevel.value() : 0;
    const uint32_t maxLod = info.maxLevel.has_value() ? info.maxLevel.value() : 1000;
    setMipRange(minLod, maxLod);

    tryReset();
}

void Texture2D::create(uint32_t width, uint32_t height, PixelFormat format /* = PixelFormat::RGBA8888*/, uint32_t mipmapLevel /* = 1*/, uint32_t baseLevel, uint32_t maxLevel) {
    reset({width,
           height,
           format,
           mipmapLevel,
           baseLevel,
           maxLevel});
}

ccstd::string Texture2D::toString() const {
    ccstd::string ret;
    if (!_mipmaps.empty()) {
        ret = _mipmaps[0]->getUrl();
    }
    return ret;
}

void Texture2D::updateMipmaps(uint32_t firstLevel, uint32_t count) {
    if (firstLevel >= _generatedMipmaps.size()) {
        return;
    }

    const auto nUpdate = static_cast<uint32_t>(std::min(
        (count == 0 ? _generatedMipmaps.size() : count),
        (_generatedMipmaps.size() - firstLevel)));

    for (uint32_t i = 0; i < nUpdate; ++i) {
        const uint32_t level = firstLevel + i;
        assignImage(_generatedMipmaps[level], level);
    }
}

bool Texture2D::destroy() {
    _mipmaps.clear();
    _generatedMipmaps.clear();
    return Super::destroy();
}

ccstd::string Texture2D::description() const {
    std::stringstream ret;
    ccstd::string url;
    if (!_mipmaps.empty()) {
        url = _mipmaps[0]->getUrl();
    }
    ret << "<cc.Texture2D | Name = " << url << " | Dimension" << _width << " x " << _height << ">";
    return ret.str();
}

void Texture2D::releaseTexture() {
    destroy();
}

ccstd::any Texture2D::serialize(const ccstd::any & /*ctxForExporting*/) {
    //    if (EDITOR || TEST) {
    //        return {
    //            base: super._serialize(ctxForExporting),
    //            mipmaps: this._mipmaps.map((mipmap) => {
    //                if (!mipmap || !mipmap._uuid) {
    //                    return null;
    //                }
    //                if (ctxForExporting && ctxForExporting._compressUuid) {
    //                    // ctxForExporting.dependsOn('_textureSource', texture); TODO
    //                    return EditorExtends.UuidUtils.compressUuid(mipmap._uuid, true);
    //                }
    //                return mipmap._uuid;
    //            }),
    //        };
    //    }
    return nullptr;
}

void Texture2D::deserialize(const ccstd::any &serializedData, const ccstd::any &handle) {
    const auto *data = ccstd::any_cast<ITexture2DSerializeData>(&serializedData);
    if (data == nullptr) {
        CC_LOG_WARNING("serializedData is not ITexture2DSerializeData");
        return;
    }
    Super::deserialize(data->base, handle);

    _mipmaps.resize(data->mipmaps.size());
    for (size_t i = 0; i < data->mipmaps.size(); ++i) {
        // Prevent resource load failed
        _mipmaps[i] = ccnew ImageAsset();
        if (data->mipmaps[i].empty()) {
            continue;
        }
        ccstd::string mipmapUUID = data->mipmaps[i];
        //cjh TODO:        handle.result.push(this._mipmaps, `${i}`, mipmapUUID, js.getClassId(ImageAsset));
    }
}

gfx::TextureInfo Texture2D::getGfxTextureCreateInfo(gfx::TextureUsageBit usage, gfx::Format format, uint32_t levelCount, gfx::TextureFlagBit flags) {
    gfx::TextureInfo texInfo;
    texInfo.type = gfx::TextureType::TEX2D;
    texInfo.width = _width;
    texInfo.height = _height;
    texInfo.usage = usage;
    texInfo.format = format;
    texInfo.levelCount = levelCount;
    texInfo.flags = flags;
    return texInfo;
}

gfx::TextureViewInfo Texture2D::getGfxTextureViewCreateInfo(gfx::Texture *texture, gfx::Format format, uint32_t baseLevel, uint32_t levelCount) {
    gfx::TextureViewInfo texViewInfo;
    texViewInfo.type = gfx::TextureType::TEX2D;
    texViewInfo.texture = texture;
    texViewInfo.format = format;
    texViewInfo.baseLevel = baseLevel;
    texViewInfo.levelCount = levelCount;
    return texViewInfo;
}

void Texture2D::initDefault(const ccstd::optional<ccstd::string> &uuid) {
    Super::initDefault(uuid);
    auto *imageAsset = ccnew ImageAsset();
    imageAsset->initDefault(ccstd::nullopt);
    setImage(imageAsset);
}

void Texture2D::setImage(ImageAsset *value) {
    ccstd::vector<IntrusivePtr<ImageAsset>> mipmaps;
    if (value != nullptr) {
        mipmaps.emplace_back(value);
    }
    setMipmaps(mipmaps);
}

bool Texture2D::validate() const {
    return !_mipmaps.empty();
}

} // namespace cc
