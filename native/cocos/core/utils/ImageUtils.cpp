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

#include "core/utils/ImageUtils.h"
#include "base/Log.h"
#include "renderer/gfx-base/GFXDef-common.h"
namespace {
uint8_t *convertRGB2RGBA(uint32_t length, uint8_t *src) {
    auto *dst = reinterpret_cast<uint8_t *>(malloc(length));
    for (uint32_t i = 0; i < length; i += 4) {
        dst[i]     = *src++;
        dst[i + 1] = *src++;
        dst[i + 2] = *src++;
        dst[i + 3] = 255;
    }
    return dst;
}

uint8_t *convertIA2RGBA(uint32_t length, uint8_t *src) {
    auto *dst = reinterpret_cast<uint8_t *>(malloc(length));
    for (uint32_t i = 0; i < length; i += 4) {
        dst[i]     = *src;
        dst[i + 1] = *src;
        dst[i + 2] = *src++;
        dst[i + 3] = *src++;
    }
    return dst;
}

uint8_t *convertI2RGBA(uint32_t length, uint8_t *src) {
    auto *dst = reinterpret_cast<uint8_t *>(malloc(length));
    for (uint32_t i = 0; i < length; i += 4) {
        dst[i]     = *src;
        dst[i + 1] = *src;
        dst[i + 2] = *src++;
        dst[i + 3] = 255;
    }
    return dst;
}
} // namespace

namespace cc {
void ImageUtils::convert2RGBA(Image *image) {
    if (!image->_isCompressed && image->_renderFormat != gfx::Format::RGBA8) {
        image->_dataLen = image->_width * image->_height * 4;
        uint8_t *dst    = nullptr;
        uint32_t length = static_cast<uint32_t>(image->_dataLen);
        uint8_t *src    = image->_data;
        switch (image->_renderFormat) {
            case gfx::Format::A8:
            case gfx::Format::LA8:
                dst = convertIA2RGBA(length, src);
                break;
            case gfx::Format::L8:
            case gfx::Format::R8:
            case gfx::Format::R8I:
                dst = convertI2RGBA(length, src);
                break;
            case gfx::Format::RGB8:
                dst = convertRGB2RGBA(length, src);
                break;
            default:
                CC_LOG_INFO("cannot convert to RGBA: unknown image format");
                break;
        }
        if (dst != image->_data) free(image->_data);
        image->_data         = dst;
        image->_renderFormat = gfx::Format::RGBA8;
    }
}

} // namespace cc