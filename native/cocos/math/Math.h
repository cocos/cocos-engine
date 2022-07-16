/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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
#pragma once

#include <cstdint>
#include <cstdlib>
#include "base/Macros.h"

namespace cc {
namespace math {

extern CC_DLL const float PI;
extern CC_DLL const float PI_2;
extern CC_DLL const float PI_DIV2;
extern CC_DLL const float PI_DIV3;
extern CC_DLL const float PI_DIV4;
extern CC_DLL const float PI_DIV5;
extern CC_DLL const float PI_DIV6;
extern CC_DLL const float PI_DIV8;
extern CC_DLL const float PI_SQR;
extern CC_DLL const float PI_INV;
extern CC_DLL const float EPSILON;
extern CC_DLL const float LOW_EPSILON;
extern CC_DLL const float POS_INFINITY;
extern CC_DLL const float NEG_INFINITY;
extern CC_DLL const float LN2;
extern CC_DLL const float LN10;
extern CC_DLL const float LN2_INV;
extern CC_DLL const float LN10_INV;
extern CC_DLL const float DEG_TO_RAD;
extern CC_DLL const float RAD_TO_DEG;
extern CC_DLL const float MIN_FLOAT;
extern CC_DLL const float MAX_FLOAT;

template <typename T>
inline T sgn(T x) {
    return (x < T(0) ? T(-1) : (x > T(0) ? T(1) : T(0)));
}

template <typename T>
inline bool isPowerOfTwo(T n) {
    return (n & (n - 1)) == 0;
}

inline bool isEqualF(float lhs, float rhs, float precision = 0.000001F) {
    return (std::abs(lhs - rhs) < precision);
}

inline bool isNotEqualF(float lhs, float rhs, float precision = 0.000001F) {
    return (std::abs(lhs - rhs) > precision);
}

inline bool isNotZeroF(float v, float precision = 0.000001F) {
    return (std::abs(v) > precision);
}

} // namespace math
} // namespace cc
