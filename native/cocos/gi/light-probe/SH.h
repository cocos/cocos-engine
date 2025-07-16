
/****************************************************************************
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

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
#include <functional>
#include "base/std/container/vector.h"
#include "core/TypedArray.h"
#include "math/Math.h"
#include "math/Vec3.h"

namespace cc {
namespace gi {

#define SH_BASIS_COUNT 9

class LightProbeSampler {
public:
    /**
     *  generate one sample from sphere uniformly
     */
    static Vec3 uniformSampleSphere(float u1, float u2);

    /**
     *  generate ucount1 * ucount2 samples from sphere uniformly
     */
    static ccstd::vector<Vec3> uniformSampleSphereAll(uint32_t sampleCount);

    /**
     *  probability density function of uniform distribution on spherical surface
     */
    static inline float uniformSpherePdf() { return 1.0F / (4.0F * math::PI); }
};

/**
 * Spherical Harmonics utility class
 */
class SH {
public:
    using BasisFunction = std::function<float(const Vec3& v)>;

    /**
     * update ubo data by coefficients
     */
    static void updateUBOData(Float32Array& data, int32_t offset, ccstd::vector<Vec3>& coefficients);

    /**
     * recreate a function from sh coefficients, which is same as SHEvaluate in shader
     */
    static Vec3 shaderEvaluate(const Vec3& normal, ccstd::vector<Vec3>& coefficients);

    /**
     * recreate a function from sh coefficients
     */
    static Vec3 evaluate(const Vec3& sample, const ccstd::vector<Vec3>& coefficients);

    /**
     * project a function to sh coefficients
     */
    static ccstd::vector<Vec3> project(const ccstd::vector<Vec3>& samples, const ccstd::vector<Vec3>& values);

    /**
     * calculate irradiance's sh coefficients from radiance's sh coefficients directly
     */
    static ccstd::vector<Vec3> convolveCosine(const ccstd::vector<Vec3>& radianceCoefficients);

    /**
     * return basis function count
     */
    static inline uint32_t getBasisCount() {
        return SH_BASIS_COUNT;
    }

    /**
     * evaluate from a basis function
     */
    static inline float evaluateBasis(uint32_t index, const Vec3& sample) {
        CC_ASSERT(index < getBasisCount());
        const auto& func = basisFunctions[index];

        return func(sample);
    }

    static inline void reduceRinging(ccstd::vector<Vec3>& coefficients, float lambda) {
        if (lambda == 0.0F) {
            return;
        }

        for (int32_t l = 0; l <= LMAX; ++l) {
            auto level = static_cast<float>(l);
            float scale = 1.0F / (1.0F + lambda * level * level * (level + 1) * (level + 1));
            for (int32_t m = -l; m <= l; ++m) {
                const int32_t i = toIndex(l, m);
                coefficients[i] *= scale;
            }
        }
    }

private:
    static inline float lambda(int32_t l) {
        return std::sqrt((4.0F * math::PI) / (2.0F * static_cast<float>(l) + 1.0F));
    }

    static inline int32_t toIndex(int32_t l, int32_t m) {
        return l * l + l + m;
    }

    static constexpr int32_t LMAX = 2;
    static ccstd::vector<BasisFunction> basisFunctions;
    static ccstd::vector<float> basisOverPI;
};

} // namespace gi
} // namespace cc
