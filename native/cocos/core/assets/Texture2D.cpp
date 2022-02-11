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

#include "core/assets/Texture2D.h"

#include <sstream>

#include "base/Log.h"
#include "core/assets/ImageAsset.h"

namespace cc {

Texture2D::Texture2D()  = default;
Texture2D::~Texture2D() = default;

void Texture2D::syncMipmapsForJS(const std::vector<IntrusivePtr<ImageAsset>> &value) {
    _mipmaps = value;
}

void Texture2D::setMipmaps(const std::vector<IntrusivePtr<ImageAsset>> &value) {
    _mipmaps = value;
    setMipmapLevel(static_cast<uint32_t>(_mipmaps.size()));
    if (!_mipmaps.empty()) {
        ImageAsset *         imageAsset = _mipmaps[0];
        ITexture2DCreateInfo info;
        info.width       = imageAsset->getWidth();
        info.height      = imageAsset->getHeight();
        info.format      = imageAsset->getFormat();
        info.mipmapLevel = static_cast<uint32_t>(_mipmaps.size());
        reset(info);

        for (size_t i = 0, len = _mipmaps.size(); i < len; ++i) {
            assignImage(_mipmaps[i], static_cast<uint32_t>(i));
        }

    } else {
        ITexture2DCreateInfo info;
        info.width       = 0;
        info.height      = 0;
        info.mipmapLevel = static_cast<uint32_t>(_mipmaps.size());
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
    _width  = info.width;
    _height = info.height;
    setGFXFormat(info.format);
    setMipmapLevel(info.mipmapLevel.has_value() ? info.mipmapLevel.value() : 1);
    tryReset();
}

void Texture2D::create(uint32_t width, uint32_t height, PixelFormat format /* = PixelFormat::RGBA8888*/, uint32_t mipmapLevel /* = 1*/) {
    reset({
        width,
        height,
        format,
        mipmapLevel,
    });
}

std::string Texture2D::toString() const {
    std::string ret;
    if (!_mipmaps.empty()) {
        ret = _mipmaps[0]->getUrl();
    }
    return ret;
}

void Texture2D::updateMipmaps(uint32_t firstLevel, uint32_t count) {
    if (firstLevel >= _mipmaps.size()) {
        return;
    }

    const auto nUpdate = static_cast<uint32_t>(std::min(
        (count == 0 ? _mipmaps.size() : count),
        (_mipmaps.size() - firstLevel)));

    for (uint32_t i = 0; i < nUpdate; ++i) {
        uint32_t level = firstLevel + i;
        assignImage(_mipmaps[level], level);
    }
}

HTMLElement *Texture2D::getHtmlElementObj() { //NOLINT
    return nullptr;                           //cjh TODO: remove this?
}

bool Texture2D::destroy() {
    _mipmaps.clear();
    return Super::destroy();
}

std::string Texture2D::description() const {
    std::stringstream ret;
    std::string       url;
    if (!_mipmaps.empty()) {
        url = _mipmaps[0]->getUrl();
    }
    ret << "<cc.Texture2D | Name = " << url << " | Dimension" << _width << " x " << _height << ">";
    return ret.str();
}

void Texture2D::releaseTexture() {
    destroy();
}

cc::any Texture2D::serialize(const cc::any & /*ctxForExporting*/) {
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

void Texture2D::deserialize(const cc::any &serializedData, const cc::any &handle) {
    const auto *data = cc::any_cast<ITexture2DSerializeData>(&serializedData);
    if (data == nullptr) {
        CC_LOG_WARNING("serializedData is not ITexture2DSerializeData");
        return;
    }
    Super::deserialize(data->base, handle);

    _mipmaps.resize(data->mipmaps.size());
    for (size_t i = 0; i < data->mipmaps.size(); ++i) {
        // Prevent resource load failed
        _mipmaps[i] = new ImageAsset();
        if (data->mipmaps[i].empty()) {
            continue;
        }
        std::string mipmapUUID = data->mipmaps[i];
        //cjh TODO:        handle.result.push(this._mipmaps, `${i}`, mipmapUUID, js._getClassId(ImageAsset));
    }
}

gfx::TextureInfo Texture2D::getGfxTextureCreateInfo(gfx::TextureUsageBit usage, gfx::Format format, uint32_t levelCount, gfx::TextureFlagBit flags) {
    gfx::TextureInfo texInfo;
    texInfo.type       = gfx::TextureType::TEX2D;
    texInfo.width      = _width;
    texInfo.height     = _height;
    texInfo.usage      = usage;
    texInfo.format     = format;
    texInfo.levelCount = levelCount;
    texInfo.flags      = flags;
    return texInfo;
}

void Texture2D::initDefault(const cc::optional<std::string> &uuid) {
    Super::initDefault(uuid);
    auto *imageAsset = new ImageAsset();
    imageAsset->initDefault(cc::nullopt);
    setImage(imageAsset);
}

void Texture2D::setImage(ImageAsset *value) {
    std::vector<IntrusivePtr<ImageAsset>> mipmaps;
    if (value != nullptr) {
        mipmaps.emplace_back(value);
    }
    setMipmaps(mipmaps);
}

bool Texture2D::validate() const {
    return !_mipmaps.empty();
}

} // namespace cc
