/****************************************************************************
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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

#include "math/Math.h"
#include <algorithm>
#include <cctype>
#include <cmath>
#include <cstring>

namespace cc {
namespace math {

const float PI = static_cast<float>(3.14159265358979323846264338327950288419716939937511);

const float PI_2 = math::PI * 2.0F;
const float PI_DIV2 = math::PI * 0.5F;
const float PI_DIV3 = math::PI / 3.0F;
const float PI_DIV4 = math::PI / 4.0F;
const float PI_DIV5 = math::PI / 5.0F;
const float PI_DIV6 = math::PI / 6.0F;
const float PI_DIV8 = math::PI / 8.0F;
const float PI_SQR = static_cast<float>(9.86960440108935861883449099987615113531369940724079);
const float PI_INV = static_cast<float>(0.31830988618379067153776752674502872406891929148091);
const float EPSILON = std::numeric_limits<float>::epsilon();
const float LOW_EPSILON = static_cast<float>(1e-04);
const float POS_INFINITY = std::numeric_limits<float>::infinity();
const float NEG_INFINITY = -std::numeric_limits<float>::infinity();

const float LN2 = std::log(2.0F);
const float LN10 = std::log(10.0F);
const float LN2_INV = 1.0F / LN2;
const float LN10_INV = 1.0F / LN10;
const float DEG_TO_RAD = static_cast<float>(0.01745329);
const float RAD_TO_DEG = static_cast<float>(57.29577);
const float MIN_FLOAT = 1.175494351e-38F;
const float MAX_FLOAT = 3.402823466e+38F;

} // namespace math
} // namespace cc
