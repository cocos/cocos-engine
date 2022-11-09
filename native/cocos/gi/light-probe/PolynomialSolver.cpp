
/****************************************************************************
 Copyright (c) 2022 Xiamen Yaji Software Co., Ltd.

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

#include "PolynomialSolver.h"
#include <cmath>
#include "base/std/container/vector.h"
#include "math/Math.h"

namespace cc {
namespace gi {

float PolynomialSolver::getQuadraticUniqueRoot(float b, float c, float d) {
    // quadratic case
    if (b != 0.0F) {
        // the discriminant should be 0
        return -c / (2.0F * b);
    }

    // linear case
    if (c != 0.0F) {
        return -d / c;
    }

    // never reach here
    return 0.0F;
}

float PolynomialSolver::getCubicUniqueRoot(float b, float c, float d) {
    ccstd::vector<float> roots;

    // let x = y - b / 3, convert equation to: y^3 + 3 * p * y + 2 * q = 0
    // where p = c / 3 - b^2 / 9, q = d / 2 + b^3 / 27 - b * c / 6
    const auto offset = -b / 3.0F;
    const auto p = c / 3.0F - (b * b) / 9.0F;
    const auto q = d / 2.0F + (b * b * b) / 27.0F - (b * c) / 6.0F;
    const auto delta = p * p * p + q * q; // discriminant

    if (delta > 0.0F) {
        // only one real root
        const auto sqrtDelta = std::sqrt(delta);
        roots.push_back(std::cbrt(-q + sqrtDelta) + std::cbrt(-q - sqrtDelta));
    } else if (delta < 0.0F) {
        // three different real roots
        const auto angle = std::acos(-q * std::sqrt(-p) / (p * p)) / 3.0F;
        roots.push_back(2.0F * std::sqrt(-p) * std::cos(angle));
        roots.push_back(2.0F * std::sqrt(-p) * std::cos(angle + 2.0F * math::PI / 3.0F));
        roots.push_back(2.0F * std::sqrt(-p) * std::cos(angle + 4.0F * math::PI / 3.0F));
    } else {
        // three real roots, at least two equal roots
        if (q == 0.0F) {
            roots.push_back(0.0F);
        } else {
            const auto root = std::cbrt(q);
            roots.push_back(root);
            roots.push_back(-2.0F * root);
        }
    }

    // return the unique positive root
    for (float root : roots) {
        if (root + offset >= 0.0F) {
            return root + offset;
        }
    }

    // never reach here
    return 0.0;
}

} // namespace gi
} // namespace cc
