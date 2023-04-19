/****************************************************************************
Copyright (c) 2019-2022 Xiamen Yaji Software Co., Ltd.

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

#include "BitScan.h"

#ifdef _MSC_VER
    #include <intrin.h>
#endif

namespace cc {

uint8_t bitScan(uint32_t bitMap) {
#ifdef _MSC_VER
    unsigned long pos;
    if (_BitScanForward(&pos, bitMap)) {
        return static_cast<uint8_t>(pos);
    }
    return UINT8_MAX;
#elif defined __GNUC__ || defined __clang__
    return static_cast<uint8_t>(__builtin_ffs(bitMap)) - 1U;
#else
    uint8_t pos = 0;
    uint32_t bit = 1;
    do {
        if (bitMap & bit) {
            return pos;
        }
        bit <<= 1;
    } while (pos++ < 31);
    return UINT8_MAX;
#endif
}
uint8_t bitScanReverse(uint32_t bitMap) {
#ifdef _MSC_VER
    unsigned long pos;
    if (_BitScanReverse(&pos, bitMap)) {
        return static_cast<uint8_t>(pos);
    }
#elif defined __GNUC__ || defined __clang__
    if (bitMap) {
        return 31 - static_cast<uint8_t>(__builtin_clz(bitMap));
    }
#else
    uint8_t pos = 31;
    uint32_t bit = 1UL << 31;
    do {
        if (bitMap & bit) {
            return pos;
        }
        bit >>= 1;
    } while (pos-- > 0);
#endif
    return UINT8_MAX;
}

uint8_t bitScan(uint64_t bitMap) {
#ifdef _MSC_VER
    unsigned long pos;
    if (_BitScanForward64(&pos, bitMap)) {
        return static_cast<uint8_t>(pos);
    }
    return UINT8_MAX;
#elif defined __GNUC__ || defined __clang__
    return static_cast<uint8_t>(__builtin_ffsll(bitMap)) - 1U;
#else
    uint8_t pos = 0;
    uint64_t bit = 1;
    do {
        if (bitMap & bit) {
            return pos;
        }
        bit <<= 1;
    } while (pos++ < 63);
    return UINT8_MAX;
#endif
}

uint8_t bitScanReverse(uint64_t bitMap) {
#ifdef _MSC_VER
    unsigned long pos;
    if (_BitScanReverse64(&pos, bitMap)) {
        return static_cast<uint8_t>(pos);
    }
#elif defined __GNUC__ || defined __clang__
    if (bitMap) {
        return 63 - static_cast<uint8_t>(__builtin_clzll(bitMap));
    }
#else
    uint8_t pos = 63;
    uint64_t bit = 1UL << 63;
    do {
        if (bitMap & bit) {
            return pos;
        }
        bit >>= 1;
    } while (pos-- > 0);
#endif
    return UINT8_MAX;
}

} // namespace cc
