/****************************************************************************
 Copyright (c) 2010-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

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

#include "base/astc.h"
#include "platform/Image.h"

static const unsigned int MAGIC = 0x5CA1AB13;
static const astc_byte ASTC_HEADER_SIZE_X_BEGIN = 7;
static const astc_byte ASTC_HEADER_SIZE_Y_BEGIN = 10;

bool astcIsValid(const astc_byte *pHeader) {
    uint32_t magicval = static_cast<uint32_t>(pHeader[0]) +
                        static_cast<uint32_t>(pHeader[1]) * 256 +
                        static_cast<uint32_t>(pHeader[2]) * 65536 +
                        static_cast<uint32_t>(pHeader[3]) * 16777216;

    if (magicval != MAGIC) {
        return false;
    }

    int xdim = pHeader[ASTC_HEADER_MAGIC];
    int ydim = pHeader[ASTC_HEADER_MAGIC + 1];
    int zdim = pHeader[ASTC_HEADER_MAGIC + 2];
    return !((xdim < 3 || xdim > 6 || ydim < 3 || ydim > 6 || zdim < 3 || zdim > 6) &&
             (xdim < 4 || xdim == 7 || xdim == 9 || xdim == 11 || xdim > 12 ||
              ydim < 4 || ydim == 7 || ydim == 9 || ydim == 11 || ydim > 12 || zdim != 1));
}

int astcGetWidth(const astc_byte *pHeader) {
    int xsize = pHeader[ASTC_HEADER_SIZE_X_BEGIN] + (pHeader[ASTC_HEADER_SIZE_X_BEGIN + 1] * 256) + (pHeader[ASTC_HEADER_SIZE_X_BEGIN + 2] * 65536);
    return xsize;
}

int astcGetHeight(const astc_byte *pHeader) {
    int ysize = pHeader[ASTC_HEADER_SIZE_Y_BEGIN] + (pHeader[ASTC_HEADER_SIZE_Y_BEGIN + 1] * 256) + (pHeader[ASTC_HEADER_SIZE_Y_BEGIN + 2] * 65536);
    return ysize;
}
