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

#include "math/Utils.h"

#include <algorithm>
#include <cmath>
#include <random>
#include "math/Math.h"

namespace {
std::random_device rd;
std::uniform_real_distribution<float> uniformReal{0.0F, 1.0F};
} // namespace

namespace cc {

namespace mathutils {

float random() {
    return uniformReal(rd);
}

float absMaxComponent(const Vec3 &v) {
    return absMax(absMax(v.x, v.y), v.z);
}

float maxComponent(const Vec3 &v) {
    return std::max(std::max(v.x, v.y), v.z);
}

uint16_t floatToHalf(float fval) {
    union {
        float f;
        unsigned int ui;
    } u = {fval};
    unsigned int ui = u.ui;

    int s = (ui >> 16) & 0x8000; // NOLINT
    int em = ui & 0x7fffffff;    // NOLINT

    /* bias exponent and round to nearest; 112 is relative exponent bias (127-15) */
    int h = (em - (112 << 23) + (1 << 12)) >> 13;

    /* underflow: flush to zero; 113 encodes exponent -14 */
    h = (em < (113 << 23)) ? 0 : h;

    /* overflow: infinity; 143 encodes exponent 16 */
    h = (em >= (143 << 23)) ? 0x7c00 : h;

    /* NaN; note that we convert all types of NaN to qNaN */
    h = (em > (255 << 23)) ? 0x7e00 : h;

    return static_cast<uint16_t>(s | h);
}

float halfToFloat(uint16_t hval) {
    union {
        float f;
        unsigned int ui;
    } u;

    int s = (hval >> 15) & 0x00000001;
    int em = hval & 0x00007fff;
    int m = 0;

    if (em > 0) {
        /* normalized */
        if (em > 30 << 10) {
            /* overflow: infinity */
            em = 255 << 23;
        } else {
            em = (em + (112 << 10)) << 13;
        }
    } else {
        /* denormalized */
        if (em > 25 << 10) {
            /* underflow: flush to zero */
            em = 0;
        } else {
            em = (em + (113 << 10)) >> 1;
        }
    }

    u.ui = ((s << 31)) | em | m; // NOLINT
    return u.f;
}

} // namespace mathutils

} // namespace cc
