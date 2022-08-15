/****************************************************************************
 Copyright (c) 2010-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2022 Xiamen Yaji Software Co., Ltd.

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

#include "base/etc2.h"
#include <stdint.h>
#include <string.h>

static const char kMagic[] = {'P', 'K', 'M', ' ', '2', '0'};

static const etc2_uint32 ETC2_PKM_FORMAT_OFFSET = 6;
static const etc2_uint32 ETC2_PKM_ENCODED_WIDTH_OFFSET = 8;
static const etc2_uint32 ETC2_PKM_ENCODED_HEIGHT_OFFSET = 10;
static const etc2_uint32 ETC2_PKM_WIDTH_OFFSET = 12;
static const etc2_uint32 ETC2_PKM_HEIGHT_OFFSET = 14;

static etc2_uint32 readBEUint16(const etc2_byte *pIn) {
    return (pIn[0] << 8) | pIn[1];
}

// Check if a PKM header is correctly formatted.

etc2_bool etc2_pkm_is_valid(const etc2_byte *pHeader) {
    if (memcmp(pHeader, kMagic, sizeof(kMagic))) {
        return false;
    }
    etc2_uint32 format = readBEUint16(pHeader + ETC2_PKM_FORMAT_OFFSET);
    etc2_uint32 encodedWidth = readBEUint16(pHeader + ETC2_PKM_ENCODED_WIDTH_OFFSET);
    etc2_uint32 encodedHeight = readBEUint16(pHeader + ETC2_PKM_ENCODED_HEIGHT_OFFSET);
    etc2_uint32 width = readBEUint16(pHeader + ETC2_PKM_WIDTH_OFFSET);
    etc2_uint32 height = readBEUint16(pHeader + ETC2_PKM_HEIGHT_OFFSET);
    return (format == ETC2_RGB_NO_MIPMAPS || format == ETC2_RGBA_NO_MIPMAPS) &&
           encodedWidth >= width && encodedWidth - width < 4 &&
           encodedHeight >= height && encodedHeight - height < 4;
}

// Read the image width from a PKM header

etc2_uint32 etc2_pkm_get_width(const etc2_byte *pHeader) {
    return readBEUint16(pHeader + ETC2_PKM_WIDTH_OFFSET);
}

// Read the image height from a PKM header

etc2_uint32 etc2_pkm_get_height(const etc2_byte *pHeader) {
    return readBEUint16(pHeader + ETC2_PKM_HEIGHT_OFFSET);
}

etc2_uint32 etc2_pkm_get_format(const uint8_t *pHeader) {
    return readBEUint16(pHeader + ETC2_PKM_FORMAT_OFFSET);
}
