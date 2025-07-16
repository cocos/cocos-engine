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

#include "core/assets/TextureCube.h"
#include "core/assets/ImageAsset.h"
#include "core/assets/Texture2D.h"
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
TextureCube *TextureCube::fromTexture2DArray(const ccstd::vector<Texture2D *> &textures) {
    size_t nMipmaps = textures.size() / 6;
    ccstd::vector<ITextureCubeMipmap> mipmaps;
    mipmaps.reserve(nMipmaps);
    for (size_t i = 0; i < nMipmaps; i++) {
        size_t x = i * 6;

        ITextureCubeMipmap mipmap;
        mipmap.front = textures[x + static_cast<uint32_t>(FaceIndex::FRONT)]->getImage(),
        mipmap.back = textures[x + static_cast<uint32_t>(FaceIndex::BACK)]->getImage(),
        mipmap.left = textures[x + static_cast<uint32_t>(FaceIndex::LEFT)]->getImage(),
        mipmap.right = textures[x + static_cast<uint32_t>(FaceIndex::RIGHT)]->getImage(),
        mipmap.top = textures[x + static_cast<uint32_t>(FaceIndex::TOP)]->getImage(),
        mipmap.bottom = textures[x + static_cast<uint32_t>(FaceIndex::BOTTOM)]->getImage(),

        mipmaps.emplace_back(mipmap);
    }
    auto *out = ccnew TextureCube();
    out->setMipmaps(mipmaps);
    return out;
}

TextureCube::TextureCube() = default;

TextureCube::~TextureCube() = default;

void TextureCube::setMipmaps(const ccstd::vector<ITextureCubeMipmap> &value) {
    _mipmaps = value;

    auto cubeMaps = ccstd::vector<ITextureCubeMipmap>{};
    if (value.size() == 1) {
        const auto &cubeMipmap = value.at(0);
        const auto &front = cubeMipmap.front->extractMipmaps();
        const auto &back = cubeMipmap.back->extractMipmaps();
        const auto &left = cubeMipmap.left->extractMipmaps();
        const auto &right = cubeMipmap.right->extractMipmaps();
        const auto &top = cubeMipmap.top->extractMipmaps();
        const auto &bottom = cubeMipmap.bottom->extractMipmaps();

        if (front.size() != back.size() ||
            front.size() != left.size() ||
            front.size() != right.size() ||
            front.size() != top.size() ||
            front.size() != bottom.size()) {
            assert("different faces should have the same mipmap level");
            this->setMipmapParams({});
            return;
        }

        const auto level = front.size();

        for (auto i = 0U; i < level; i++) {
            const auto cubeMap = ITextureCubeMipmap{
                front[i],
                back[i],
                left[i],
                right[i],
                top[i],
                bottom[i],
            };
            cubeMaps.emplace_back(cubeMap);
        }
    } else if (value.size() > 1) {
        for (const auto &mipmap : value) {
            const auto cubeMap = ITextureCubeMipmap{
                mipmap.front->extractMipmap0(),
                mipmap.back->extractMipmap0(),
                mipmap.left->extractMipmap0(),
                mipmap.right->extractMipmap0(),
                mipmap.top->extractMipmap0(),
                mipmap.bottom->extractMipmap0(),
            };
            cubeMaps.emplace_back(cubeMap);
        }
    }

    setMipmapParams(cubeMaps);
}

void TextureCube::setMipmapParams(const ccstd::vector<ITextureCubeMipmap> &value) {
    _generatedMipmaps = value;
    setMipmapLevel(static_cast<uint32_t>(_generatedMipmaps.size()));
    if (!_generatedMipmaps.empty()) {
        ImageAsset *imageAsset = _generatedMipmaps[0].front;
        reset({imageAsset->getWidth(),
               imageAsset->getHeight(),
               imageAsset->getFormat(),
               static_cast<uint32_t>(_generatedMipmaps.size()),
               _baseLevel,
               _maxLevel});

        for (size_t level = 0, len = _generatedMipmaps.size(); level < len; ++level) {
            forEachFace(_generatedMipmaps[level], [this, level](ImageAsset *face, TextureCube::FaceIndex faceIndex) {
                assignImage(face, static_cast<uint32_t>(level), static_cast<uint32_t>(faceIndex));
            });
        }

    } else {
        reset({0,
               0,
               ccstd::nullopt,
               static_cast<uint32_t>(_generatedMipmaps.size()),
               _baseLevel,
               _maxLevel});
    }
}

void TextureCube::setMipmapAtlas(const TextureCubeMipmapAtlasInfo &value) {
    if (value.layout.empty()) {
        return;
    }
    _mipmapAtlas = value;
    const ITextureCubeMipmap &atlas = _mipmapAtlas.atlas;
    const ccstd::vector<MipmapAtlasLayoutInfo> &layouts = _mipmapAtlas.layout;
    setMipmapLevel(static_cast<uint32_t>(layouts.size()));

    const MipmapAtlasLayoutInfo &lv0Layout = layouts[0];
    const ImageAsset *imageAsset = atlas.front;

    reset({lv0Layout.width,
           lv0Layout.height,
           imageAsset->getFormat(),
           static_cast<uint32_t>(layouts.size()),
           _baseLevel,
           _maxLevel});

    const uint32_t pixelSize = gfx::GFX_FORMAT_INFOS[static_cast<uint32_t>(imageAsset->getFormat())].size;

    for (size_t level = 0; level < layouts.size(); level++) {
        const MipmapAtlasLayoutInfo &layoutInfo = layouts[level];
        uint32_t currentSize = layoutInfo.width * layoutInfo.height * pixelSize;

        //Upload 6 sides by level
        forEachFace(atlas, [this, currentSize, lv0Layout, layoutInfo, level, pixelSize](ImageAsset *face, TextureCube::FaceIndex faceIndex) {
            auto *buffer = ccnew uint8_t[currentSize];
            memset(buffer, 0, currentSize);
            const uint8_t *data = face->getData();
            //Splitting Atlas
            if (level == 0) {
                memcpy(buffer, data, currentSize);
            } else {
                uint32_t bufferOffset = 0;
                uint32_t dateOffset = lv0Layout.width * lv0Layout.height * pixelSize;
                uint32_t leftOffset = layoutInfo.left * pixelSize;
                for (size_t j = 0; j < layoutInfo.height; j++) {
                    memcpy(buffer + bufferOffset, data + dateOffset + leftOffset, layoutInfo.width * pixelSize);
                    bufferOffset += layoutInfo.width * pixelSize;
                    dateOffset += lv0Layout.width * pixelSize;
                }
            }
            auto *tempAsset = ccnew ImageAsset();
            tempAsset->addRef();
            auto *arrayBuffer = ccnew ArrayBuffer(buffer, static_cast<uint32_t>(currentSize));
            IMemoryImageSource source{arrayBuffer, face->isCompressed(), layoutInfo.width, layoutInfo.height, face->getFormat()};
            tempAsset->setNativeAsset(source);

            assignImage(tempAsset, static_cast<uint32_t>(level), static_cast<uint32_t>(faceIndex));
            CC_SAFE_DELETE_ARRAY(buffer);
            tempAsset->release();
            tempAsset = nullptr;
        });
    }
}

void TextureCube::setMipmapsForJS(const ccstd::vector<ITextureCubeMipmap> &value) {
    _mipmaps = value;
}

void TextureCube::setMipmapAtlasForJS(const TextureCubeMipmapAtlasInfo &value) {
    _mipmapAtlas = value;
}

void TextureCube::setImage(const ITextureCubeMipmap *value) {
    if (value != nullptr) {
        setMipmaps({*value});
    } else {
        setMipmaps({});
    }
}

void TextureCube::reset(const ITextureCubeCreateInfo &info) {
    _width = info.width;
    _height = info.height;
    setGFXFormat(info.format);

    uint32_t mipLevels = info.mipmapLevel.has_value() ? info.mipmapLevel.value() : 1;
    setMipmapLevel(mipLevels);

    uint32_t minLod = info.baseLevel.has_value() ? info.baseLevel.value() : 0;
    uint32_t maxLod = info.maxLevel.has_value() ? info.maxLevel.value() : 1000;
    setMipRange(minLod, maxLod);

    tryReset();
}

void TextureCube::releaseTexture() {
    destroy();
}

void TextureCube::updateMipmaps(uint32_t firstLevel, uint32_t count) {
    if (firstLevel >= _generatedMipmaps.size()) {
        return;
    }

    auto nUpdate = static_cast<uint32_t>(std::min(
        count == 0 ? _generatedMipmaps.size() : count,
        _generatedMipmaps.size() - firstLevel));

    for (uint32_t i = 0; i < nUpdate; ++i) {
        uint32_t level = firstLevel + i;
        forEachFace(_generatedMipmaps[level], [this, level](auto face, auto faceIndex) {
            assignImage(face, level, static_cast<uint32_t>(faceIndex));
        });
    }
}

bool TextureCube::isUsingOfflineMipmaps() {
    return _mipmapMode == MipmapMode::BAKED_CONVOLUTION_MAP;
}

void TextureCube::initialize() {
    if (_mipmapMode == MipmapMode::BAKED_CONVOLUTION_MAP) {
        setMipmapAtlas(_mipmapAtlas);
    } else {
        setMipmaps(_mipmaps);
    }
}

void TextureCube::onLoaded() {
    initialize();
}

bool TextureCube::destroy() {
    _mipmaps.clear();
    _generatedMipmaps.clear();
    _mipmapAtlas.layout.clear();
    return Super::destroy();
}

ccstd::any TextureCube::serialize(const ccstd::any & /*ctxForExporting*/) {
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

void TextureCube::deserialize(const ccstd::any &serializedData, const ccstd::any &handle) {
    const auto *data = ccstd::any_cast<TextureCubeSerializeData>(&serializedData);
    if (data == nullptr) {
        return;
    }
    Super::deserialize(data->base, handle);
    isRGBE = data->rgbe;
    _mipmapMode = data->mipmapMode;

    _mipmaps.resize(data->mipmaps.size());
    for (size_t i = 0; i < data->mipmaps.size(); ++i) {
        // Prevent resource load failed
        ITextureCubeMipmap mipmap;
        mipmap.front = ccnew ImageAsset(),
        mipmap.back = ccnew ImageAsset(),
        mipmap.left = ccnew ImageAsset(),
        mipmap.right = ccnew ImageAsset(),
        mipmap.top = ccnew ImageAsset(),
        mipmap.bottom = ccnew ImageAsset();
        _mipmaps[i] = mipmap;
        //        auto* mipmap = data->mipmaps[i];

        //cjh TODO: what's handle.result??        const imageAssetClassId = js.getClassId(ImageAsset);
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
    texInfo.type = gfx::TextureType::CUBE;
    texInfo.width = _width;
    texInfo.height = _height;
    texInfo.layerCount = 6;
    texInfo.usage = usage;
    texInfo.format = format;
    texInfo.levelCount = levelCount;
    texInfo.flags = flags;
    return texInfo;
}

gfx::TextureViewInfo TextureCube::getGfxTextureViewCreateInfo(gfx::Texture *texture, gfx::Format format, uint32_t baseLevel, uint32_t levelCount) {
    gfx::TextureViewInfo texViewInfo;
    texViewInfo.type = gfx::TextureType::CUBE;
    texViewInfo.baseLayer = 0;
    texViewInfo.layerCount = 6;
    texViewInfo.texture = texture;
    texViewInfo.format = format;
    texViewInfo.baseLevel = baseLevel;
    texViewInfo.levelCount = levelCount;
    return texViewInfo;
}

void TextureCube::initDefault(const ccstd::optional<ccstd::string> &uuid) {
    Super::initDefault(uuid);

    auto *imageAsset = ccnew ImageAsset();
    imageAsset->initDefault(ccstd::nullopt);

    ITextureCubeMipmap mipmap;

    mipmap.front = imageAsset;
    mipmap.back = imageAsset;
    mipmap.top = imageAsset;
    mipmap.bottom = imageAsset;
    mipmap.left = imageAsset;
    mipmap.right = imageAsset;

    setMipmaps({mipmap});
}

bool TextureCube::validate() const {
    if (_mipmapMode == MipmapMode::BAKED_CONVOLUTION_MAP) {
        if (_mipmapAtlas.layout.empty()) {
            return false;
        }
        return (_mipmapAtlas.atlas.top && _mipmapAtlas.atlas.bottom && _mipmapAtlas.atlas.front && _mipmapAtlas.atlas.back && _mipmapAtlas.atlas.left && _mipmapAtlas.atlas.right);
    }
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
