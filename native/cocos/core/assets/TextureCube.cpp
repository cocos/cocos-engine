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

#include "core/assets/TextureCube.h"
#include "core/assets/ImageAsset.h"
#include "renderer/gfx-base/GFXTexture.h"

namespace cc {

namespace {

using ForEachFaceCallback = std::function<void(ImageAsset *face, TextureCube::FaceIndex faceIndex)>;
/**
 * @param {Mipmap} mipmap
 * @param {(face: ImageAsset) => void} callback
 */
void forEachFace(const ITextureCubeMipmap &mipmap, const ForEachFaceCallback &callback) {
    callback(mipmap.front, TextureCube::FaceIndex::FRONT);
    callback(mipmap.back, TextureCube::FaceIndex::BACK);
    callback(mipmap.left, TextureCube::FaceIndex::LEFT);
    callback(mipmap.right, TextureCube::FaceIndex::RIGHT);
    callback(mipmap.top, TextureCube::FaceIndex::TOP);
    callback(mipmap.bottom, TextureCube::FaceIndex::BOTTOM);
}

} // namespace

/* static */
TextureCube *TextureCube::fromTexture2DArray(const std::vector<Texture2D *> &textures) {
    size_t                          nMipmaps = textures.size() / 6;
    std::vector<ITextureCubeMipmap> mipmaps;
    mipmaps.reserve(nMipmaps);
    for (size_t i = 0; i < nMipmaps; i++) {
        size_t x = i * 6;

        ITextureCubeMipmap mipmap;
        mipmap.front  = textures[x + static_cast<uint32_t>(FaceIndex::FRONT)]->getImage(),
        mipmap.back   = textures[x + static_cast<uint32_t>(FaceIndex::BACK)]->getImage(),
        mipmap.left   = textures[x + static_cast<uint32_t>(FaceIndex::LEFT)]->getImage(),
        mipmap.right  = textures[x + static_cast<uint32_t>(FaceIndex::RIGHT)]->getImage(),
        mipmap.top    = textures[x + static_cast<uint32_t>(FaceIndex::TOP)]->getImage(),
        mipmap.bottom = textures[x + static_cast<uint32_t>(FaceIndex::BOTTOM)]->getImage(),

        mipmaps.emplace_back(mipmap);
    }
    auto *out = new TextureCube();
    out->setMipmaps(mipmaps);
    return out;
}

TextureCube::~TextureCube() = default;

void TextureCube::setMipmaps(const std::vector<ITextureCubeMipmap> &value) {
    _mipmaps = value;
    setMipmapLevel(static_cast<uint32_t>(_mipmaps.size()));
    if (!_mipmaps.empty()) {
        ImageAsset *imageAsset = _mipmaps[0].front;
        reset({
            imageAsset->getWidth(),
            imageAsset->getHeight(),
            imageAsset->getFormat(),
            static_cast<uint32_t>(_mipmaps.size()),
        });

        for (size_t level = 0, len = _mipmaps.size(); level < len; ++level) {
            forEachFace(_mipmaps[level], [this, level](ImageAsset *face, TextureCube::FaceIndex faceIndex) {
                assignImage(face, static_cast<uint32_t>(level), static_cast<uint32_t>(faceIndex));
            });
            ;
        }

    } else {
        reset({
            0,
            0,
            cc::nullopt,
            static_cast<uint32_t>(_mipmaps.size()),
        });
    }
}

void TextureCube::reset(const ITextureCubeCreateInfo &info) {
    _width  = info.width;
    _height = info.height;
    setGFXFormat(info.format);
    setMipmapLevel(info.mipmapLevel.has_value() ? info.mipmapLevel.value() : 1);
    tryReset();
}

void TextureCube::releaseTexture() {
    _mipmaps.clear();
}

void TextureCube::updateMipmaps(uint32_t firstLevel, uint32_t count) {
    if (firstLevel >= _mipmaps.size()) {
        return;
    }

    auto nUpdate = static_cast<uint32_t>(std::min(
        count == 0 ? _mipmaps.size() : count,
        _mipmaps.size() - firstLevel));

    for (uint32_t i = 0; i < nUpdate; ++i) {
        uint32_t level = firstLevel + i;
        forEachFace(_mipmaps[level], [this, level](auto face, auto faceIndex) {
            assignImage(face, level, static_cast<uint32_t>(faceIndex));
        });
    }
}

void TextureCube::initialize() {
    setMipmaps(_mipmaps);
}

void TextureCube::onLoaded() {
    initialize();
}

bool TextureCube::destroy() {
    _mipmaps.clear();
    return Super::destroy();
}

cc::any TextureCube::serialize(const cc::any & /*ctxForExporting*/) {
    //cjh TODO:    if (EDITOR || TEST) {
    //        return {
    //            base: super._serialize(ctxForExporting),
    //            rgbe: this.isRGBE,
    //            mipmaps: this._mipmaps.map((mipmap) => ((ctxForExporting && ctxForExporting._compressUuid) ? {
    //                front: EditorExtends.UuidUtils.compressUuid(mipmap.front._uuid, true),
    //                back: EditorExtends.UuidUtils.compressUuid(mipmap.back._uuid, true),
    //                left: EditorExtends.UuidUtils.compressUuid(mipmap.left._uuid, true),
    //                right: EditorExtends.UuidUtils.compressUuid(mipmap.right._uuid, true),
    //                top: EditorExtends.UuidUtils.compressUuid(mipmap.top._uuid, true),
    //                bottom: EditorExtends.UuidUtils.compressUuid(mipmap.bottom._uuid, true),
    //            } : {
    //                front: mipmap.front._uuid,
    //                back: mipmap.back._uuid,
    //                left: mipmap.left._uuid,
    //                right: mipmap.right._uuid,
    //                top: mipmap.top._uuid,
    //                bottom: mipmap.bottom._uuid,
    //            })),
    //        };
    //    }
    return nullptr;
}

void TextureCube::deserialize(const cc::any &serializedData, const cc::any &handle) {
    const auto *data = cc::any_cast<ITextureCubeSerializeData>(&serializedData);
    if (data == nullptr) {
        return;
    }
    Super::deserialize(data->base, handle);
    isRGBE = data->rgbe;

    _mipmaps.resize(data->mipmaps.size());
    for (size_t i = 0; i < data->mipmaps.size(); ++i) {
        // Prevent resource load failed
        ITextureCubeMipmap mipmap;
        mipmap.front  = new ImageAsset(),
        mipmap.back   = new ImageAsset(),
        mipmap.left   = new ImageAsset(),
        mipmap.right  = new ImageAsset(),
        mipmap.top    = new ImageAsset(),
        mipmap.bottom = new ImageAsset();
        _mipmaps[i]   = mipmap;
        //        auto* mipmap = data->mipmaps[i];

        //cjh TODO: what's handle.result??        const imageAssetClassId = js._getClassId(ImageAsset);
        //
        //        handle.result.push(this._mipmaps[i], `front`, mipmap.front, imageAssetClassId);
        //        handle.result.push(this._mipmaps[i], `back`, mipmap.back, imageAssetClassId);
        //        handle.result.push(this._mipmaps[i], `left`, mipmap.left, imageAssetClassId);
        //        handle.result.push(this._mipmaps[i], `right`, mipmap.right, imageAssetClassId);
        //        handle.result.push(this._mipmaps[i], `top`, mipmap.top, imageAssetClassId);
        //        handle.result.push(this._mipmaps[i], `bottom`, mipmap.bottom, imageAssetClassId);
    }
}

gfx::TextureInfo TextureCube::getGfxTextureCreateInfo(gfx::TextureUsageBit usage, gfx::Format format, uint32_t levelCount, gfx::TextureFlagBit flags) {
    gfx::TextureInfo texInfo;
    texInfo.type       = gfx::TextureType::CUBE;
    texInfo.width      = _width;
    texInfo.height     = _height;
    texInfo.layerCount = 6;
    texInfo.usage      = usage;
    texInfo.format     = format;
    texInfo.levelCount = levelCount;
    texInfo.flags      = flags;
    return texInfo;
}

void TextureCube::initDefault(const cc::optional<std::string> &uuid) {
    Super::initDefault(uuid);

    auto *imageAsset = new ImageAsset();
    imageAsset->initDefault(cc::nullopt);

    ITextureCubeMipmap mipmap;

    mipmap.front  = imageAsset;
    mipmap.back   = imageAsset;
    mipmap.top    = imageAsset;
    mipmap.bottom = imageAsset;
    mipmap.left   = imageAsset;
    mipmap.right  = imageAsset;

    setMipmaps({mipmap});
}

bool TextureCube::validate() const {
    if (_mipmaps.empty()) {
        return false;
    }

    return std::all_of(_mipmaps.begin(),
                       _mipmaps.end(),
                       [&](const ITextureCubeMipmap &mipmap) {
                           return (mipmap.top && mipmap.bottom && mipmap.front && mipmap.back && mipmap.left && mipmap.right);
                       });
}

} // namespace cc
