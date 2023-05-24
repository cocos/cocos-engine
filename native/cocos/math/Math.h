/****************************************************************************
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
#pragma once

#include <cmath>
#include <cstdint>
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

#define CC_FLOAT_CMP_PRECISION (0.00001F)

template <typename T>
inline T sgn(T x) {
    return (x < T(0) ? T(-1) : (x > T(0) ? T(1) : T(0)));
}

template <typename T>
inline bool isPowerOfTwo(T n) {
    return (n & (n - 1)) == 0;
}

inline bool isEqualF(float lhs, float rhs, float precision = 0.000001F) {
    const bool hasInf = std::isinf(lhs) || std::isinf(rhs);
    return !hasInf && (std::fabs(lhs - rhs) <= (std::fmax(std::fmax(std::fabs(lhs), std::fabs(rhs)), 1.0F) * precision));
}

inline bool isNotEqualF(float lhs, float rhs, float precision = 0.000001F) { // same as !isEqualF
    const bool hasInf = std::isinf(lhs) || std::isinf(rhs);
    return hasInf || (std::fabs(lhs - rhs) > (std::fmax(std::fmax(std::fabs(lhs), std::fabs(rhs)), 1.0F) * precision));
}

inline bool isNotZeroF(float v, float precision = 0.000001F) { // same as isNotEqualF(v, 0.0F)
    return std::isinf(v) || (std::fabs(v) > (std::fmax(std::fabs(v), 1.0F) * precision));
}

} // namespace math
} // namespace cc
