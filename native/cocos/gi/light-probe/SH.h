
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

#pragma once

#include <functional>
#include <cmath>
#include "base/std/container/vector.h"
#include "math/Vec3.h"
#include "math/Math.h"

namespace cc {
namespace gi {

#define SH_BASIS_FAST_COUNT   4
#define SH_BASIS_NORMAL_COUNT 9

enum class LightProbeQuality {
    Fast = 0,   // 4 basis functions of L0 & L1
    Normal = 1, // 9 basis functions of L0 & L1 & L2
};

class LightProbeSampler {
public:
    /**
     *  generate one sample from sphere uniformly
     */
    static Vec3 uniformSampleSphere(float u1, float u2);

    /**
     *  generate ucount1 * ucount2 samples from sphere uniformly
     */
    static ccstd::vector<Vec3> uniformSampleSphereAll(uint32_t uCount1, uint32_t uCount2);

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
     * recreate a function from sh coefficients
     */
    static Vec3 evaluate(LightProbeQuality quality, const Vec3& sample, const ccstd::vector<Vec3>& coefficients);

    /**
     * project a function to sh coefficients
     */
    static ccstd::vector<Vec3> project(LightProbeQuality quality, const ccstd::vector<Vec3>& samples, const ccstd::vector<Vec3>& values);

    /**
     * calculate irradiance's sh coefficients from radiance's sh coefficients directly
     */
    static ccstd::vector<Vec3> convolveCosine(LightProbeQuality quality, const ccstd::vector<Vec3>& radianceCoefficients);

    /**
     * return band count: lmax = 1 or lmax = 2
     */
    static inline int32_t getBandCount(LightProbeQuality quality) {
        return (quality == LightProbeQuality::Normal ? 2 : 1);
    }

    /**
     * return basis function count
     */
    static inline uint32_t getBasisCount(LightProbeQuality quality) {
        static const uint32_t BASIS_COUNTS[] = {SH_BASIS_FAST_COUNT, SH_BASIS_NORMAL_COUNT};
        return BASIS_COUNTS[static_cast<uint32_t>(quality)];
    }

    /**
     * evaluate from a basis function
     */
    static inline float evaluateBasis(LightProbeQuality quality, uint32_t index, const Vec3& sample) {
        CC_ASSERT(index < getBasisCount(quality));
        const auto& func = _basisFunctions[index];

        return func(sample);
    }

private:
    static inline float lambda(int32_t l) {
        return std::sqrtf((4.0F * math::PI) / (2.0F * static_cast<float>(l) + 1.0F));
    }

    static inline int32_t toIndex(int32_t l, int32_t m) {
        return l * l + l + m;
    }

    static ccstd::vector<BasisFunction> _basisFunctions;
};

} // namespace gi
} // namespace cc
