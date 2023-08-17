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

#include "core/assets/ImageAsset.h"

#include "platform/Image.h"

#include "base/Log.h"

namespace cc {

ImageAsset::~ImageAsset() {
    if (_needFreeData && _data) {
        free(_data);
    }
}

void ImageAsset::setNativeAsset(const ccstd::any &obj) {
    if (obj.has_value()) {
        auto **pImage = const_cast<Image **>(ccstd::any_cast<Image *>(&obj));
        if (pImage != nullptr) {
            Image *image = *pImage;
            image->takeData(&_data);
            _needFreeData = true;

            _width = image->getWidth();
            _height = image->getHeight();
            _format = static_cast<PixelFormat>(image->getRenderFormat());
            _url = image->getFilePath();
            _mipmapLevelDataSize = image->getMipmapLevelDataSize();
        } else {
            const auto *imageSource = ccstd::any_cast<IMemoryImageSource>(&obj);
            if (imageSource != nullptr) {
                _arrayBuffer = imageSource->data;
                _data = const_cast<uint8_t *>(_arrayBuffer->getData());
                _width = imageSource->width;
                _height = imageSource->height;
                _format = imageSource->format;
                _mipmapLevelDataSize = imageSource->mipmapLevelDataSize;
            } else {
                CC_LOG_WARNING("ImageAsset::setNativeAsset, unknown type!");
            }
        }
    }
}

IntrusivePtr<ImageAsset> ImageAsset::extractMipmap0() {
    auto *res = new ImageAsset;

    res->_data = nullptr;
    res->_needFreeData = false;
    res->_width = _width;
    res->_height = _height;
    res->_format = _format;
    res->_uuid = _uuid;
    res->_data = _data;

    return res;
}

std::vector<IntrusivePtr<ImageAsset>> ImageAsset::extractMipmaps() {
    std::vector<IntrusivePtr<ImageAsset>> res{};

    if (!_mipmapLevelDataSize.empty()) {
        size_t offset = 0UL;
        auto height = _height;
        auto width = _width;
        for (auto mipmapSize : _mipmapLevelDataSize) {
            auto *mipmap = new ImageAsset;
            mipmap->_data = _data + offset;
            mipmap->_needFreeData = false;
            mipmap->_width = width;
            mipmap->_height = height;
            mipmap->_format = _format;
            mipmap->_uuid = _uuid;

            offset += mipmapSize;
            width = std::max(width >> 1, 1U);
            height = std::max(height >> 1, 1U);
            res.emplace_back(mipmap);
        }
    } else {
        res.emplace_back(this);
    }
    return res;
}

const uint8_t *ImageAsset::getData() const {
    return _data;
}

uint32_t ImageAsset::getWidth() const {
    return _width;
}

uint32_t ImageAsset::getHeight() const {
    return _height;
}

PixelFormat ImageAsset::getFormat() const {
    return _format;
}

const std::vector<uint32_t> &ImageAsset::getMipmapLevelDataSize() const {
    return _mipmapLevelDataSize;
}

bool ImageAsset::isCompressed() const {
    return (_format >= PixelFormat::RGB_ETC1 && _format <= PixelFormat::RGBA_ASTC_12X12) || (_format >= PixelFormat::RGB_A_PVRTC_2BPPV1 && _format <= PixelFormat::RGBA_ETC1);
}

const ccstd::string &ImageAsset::getUrl() const {
    return _url;
}

} // namespace cc
