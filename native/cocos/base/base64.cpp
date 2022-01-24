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

#include "base/base64.h"

#include <cstdio>
#include <cstdlib>
#include <string>
#include <vector>

namespace cc {

std::string alphabet{"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"};

int doBase64Decode(const unsigned char *input, unsigned int inputLen, unsigned char *output, unsigned int *outputLen) {
    static std::vector<char> inalphabet(256);
    static std::vector<char> decoder(256);
    int                      i;
    int                      bits;
    int                      c = 0;
    int                      charCount;
    int                      errors    = 0;
    unsigned int             inputIdx  = 0;
    unsigned int             outputIdx = 0;
    int                      length    = static_cast<int>(alphabet.length());
    for (i = length - 1; i >= 0; i--) {
        inalphabet[alphabet[i]] = 1;
        decoder[alphabet[i]]    = i;
    }

    charCount = 0;
    bits      = 0;
    for (inputIdx = 0; inputIdx < inputLen; inputIdx++) {
        c = input[inputIdx];
        if (c == '=') {
            break;
        }

        if (c > 255 || !inalphabet[c]) {
            continue;
        }

        bits += decoder[c];
        ++charCount;
        if (charCount == 4) {
            output[outputIdx++] = (bits >> 16);
            output[outputIdx++] = ((bits >> 8) & 0xff);
            output[outputIdx++] = (bits & 0xff);
            bits                = 0;
            charCount           = 0;
        } else {
            bits <<= 6;
        }
    }

    if (c == '=') {
        switch (charCount) {
            case 1:
#if (CC_PLATFORM != CC_PLATFORM_BADA)
                fprintf(stderr, "base64Decode: encoding incomplete: at least 2 bits missing");
#endif
                ++errors;
                break;
            case 2:
                output[outputIdx++] = (bits >> 10);
                break;
            case 3:
                output[outputIdx++] = (bits >> 16);
                output[outputIdx++] = ((bits >> 8) & 0xff);
                break;
        }
    } else if (inputIdx < inputLen) {
        if (charCount) {
#if (CC_PLATFORM != CC_PLATFORM_BADA)
            fprintf(stderr, "base64 encoding incomplete: at least %d bits truncated",
                    ((4 - charCount) * 6));
#endif
            ++errors;
        }
    }

    *outputLen = outputIdx;
    return errors;
}

void doBase64Encode(const unsigned char *input, unsigned int inputLen, char *output) {
    unsigned int charCount;
    unsigned int bits;
    unsigned int inputIdx  = 0;
    unsigned int outputIdx = 0;

    charCount = 0;
    bits      = 0;
    for (inputIdx = 0; inputIdx < inputLen; inputIdx++) {
        bits |= input[inputIdx];

        charCount++;
        if (charCount == 3) {
            output[outputIdx++] = alphabet[(bits >> 18) & 0x3f];
            output[outputIdx++] = alphabet[(bits >> 12) & 0x3f];
            output[outputIdx++] = alphabet[(bits >> 6) & 0x3f];
            output[outputIdx++] = alphabet[bits & 0x3f];
            bits                = 0;
            charCount           = 0;
        } else {
            bits <<= 8;
        }
    }

    if (charCount) {
        if (charCount == 1) {
            bits <<= 8;
        }

        output[outputIdx++] = alphabet[(bits >> 18) & 0x3f];
        output[outputIdx++] = alphabet[(bits >> 12) & 0x3f];
        if (charCount > 1) {
            output[outputIdx++] = alphabet[(bits >> 6) & 0x3f];
        } else {
            output[outputIdx++] = '=';
        }
        output[outputIdx++] = '=';
    }

    output[outputIdx++] = 0;
}

int base64Decode(const unsigned char *in, unsigned int inLength, unsigned char **out) {
    unsigned int outLength = 0;

    //should be enough to store 6-bit buffers in 8-bit buffers
    *out = static_cast<unsigned char *>(malloc(inLength / 4 * 3 + 1));
    if (*out) {
        int ret = doBase64Decode(in, inLength, *out, &outLength);

        if (ret > 0) {
            free(*out);
            *out      = nullptr;
            outLength = 0;
        }
    }
    return static_cast<int>(outLength);
}

int base64Encode(const unsigned char *in, unsigned int inLength, char **out) {
    unsigned int outLength = (inLength + 2) / 3 * 4;

    //should be enough to store 8-bit buffers in 6-bit buffers
    *out = static_cast<char *>(malloc(outLength + 1));
    if (*out) {
        doBase64Encode(in, inLength, *out);
    }
    return static_cast<int>(outLength);
}

} // namespace cc
