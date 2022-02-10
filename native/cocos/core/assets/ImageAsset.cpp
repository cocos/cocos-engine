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

#include "core/assets/ImageAsset.h"

#include "platform/Image.h"

#include "base/Log.h"

namespace cc {

ImageAsset::~ImageAsset() {
    if (_needFreeData && _data) {
        free(_data);
    }
}

void ImageAsset::setNativeAsset(const cc::any &obj) {
    if (obj.has_value()) {
        auto **pImage = const_cast<Image **>(cc::any_cast<Image *>(&obj));
        if (pImage != nullptr) {
            Image *image = *pImage;
            image->takeData(&_data);
            _needFreeData = true;

            _width  = image->getWidth();
            _height = image->getHeight();
            _format = static_cast<PixelFormat>(image->getRenderFormat());
            _url    = image->getFilePath();
        } else {
            const auto *imageSource = cc::any_cast<IMemoryImageSource>(&obj);
            if (imageSource != nullptr) {
                _arrayBuffer = imageSource->data;
                _data        = const_cast<uint8_t *>(_arrayBuffer->getData());
                _width       = imageSource->width;
                _height      = imageSource->height;
                _format      = imageSource->format;
            } else {
                CC_LOG_WARNING("ImageAsset::setNativeAsset, unknown type!");
            }
        }
    }
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

bool ImageAsset::isCompressed() const {
    return (_format >= PixelFormat::RGB_ETC1 && _format <= PixelFormat::RGBA_ASTC_12X12) || (_format >= PixelFormat::RGB_A_PVRTC_2BPPV1 && _format <= PixelFormat::RGBA_ETC1);
}

std::string ImageAsset::getUrl() const {
    return _url;
}

} // namespace cc
