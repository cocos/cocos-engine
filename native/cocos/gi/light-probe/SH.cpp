
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

#include "SH.h"
#include "base/Macros.h"

namespace cc {
namespace gi {

Vec3 LightProbeSampler::uniformSampleSphere(float u1, float u2) {
    float z = 1.0F - 2.0F * u1;
    float r = std::sqrtf(std::max(0.0F, 1.0F - z * z));
    float phi = 2.0F * math::PI * u2;

    float x = r * std::cosf(phi);
    float y = r * std::sinf(phi);

    return Vec3(x, y, z);
}

ccstd::vector<Vec3> LightProbeSampler::uniformSampleSphereAll(uint32_t uCount1, uint32_t uCount2) {
    CC_ASSERT(uCount1 > 0U && uCount2 > 0U);

    ccstd::vector<Vec3> samples;
    const auto uDelta1 = 1.0F / static_cast<float>(uCount1);
    const auto uDelta2 = 1.0F / static_cast<float>(uCount2);

    for (auto i = 0U; i < uCount1; i++) {
        const auto u1 = (static_cast<float>(i) + 0.5F) * uDelta1;

        for (auto j = 0U; j < uCount2; j++) {
            const auto u2 = (static_cast<float>(j) + 0.5F) * uDelta2;
            const auto sample = uniformSampleSphere(u1, u2);
            samples.push_back(sample);
        }
    }

    return samples;
}

ccstd::vector<SH::BasisFunction> SH::_basisFunctions = {
    [](const Vec3& v) -> float { return 0.282095F; },                             // 0.5F * std::sqrtf(math::PI_INV)
    [](const Vec3& v) -> float { return 0.488603F * v.y; },                       // 0.5F * std::sqrtf(3.0F * math::PI_INV) * v.y
    [](const Vec3& v) -> float { return 0.488603F * v.z; },                       // 0.5F * std::sqrtf(3.0F * math::PI_INV) * v.z
    [](const Vec3& v) -> float { return 0.488603F * v.x; },                       // 0.5F * std::sqrtf(3.0F * math::PI_INV) * v.x
    [](const Vec3& v) -> float { return 1.09255F * v.y * v.x; },                  // 0.5F * std::sqrtf(15.0F * math::PI_INV) * v.y * v.x
    [](const Vec3& v) -> float { return 1.09255F * v.y * v.z; },                  // 0.5F * std::sqrtf(15.0F * math::PI_INV) * v.y * v.z
    [](const Vec3& v) -> float { return 0.946175F * (v.z * v.z - 1.0F / 3.0F); }, // 0.75F * std::sqrtf(5.0F * math::PI_INV) * (v.z * v.z - 1.0F / 3.0F)
    [](const Vec3& v) -> float { return 1.09255F * v.z * v.x; },                  // 0.5F * std::sqrtf(15.0F * math::PI_INV) * v.z * v.x
    [](const Vec3& v) -> float { return 0.546274F * (v.x * v.x - v.y * v.y); },   // 0.25F * std::sqrtf(15.0F * math::PI_INV) * (v.x * v.x - v.y * v.y)
};

Vec3 SH::evaluate(const Vec3& sample, const ccstd::vector<Vec3>& coefficients) {
    Vec3 result{0.0F, 0.0F, 0.0F};

    const auto size = coefficients.size();
    for (auto i = 0; i < size; i++) {
        const Vec3& c = coefficients[i];
        result += c * evaluateBasis(i, sample);
    }

    return result;
}

ccstd::vector<Vec3> SH::project(const ccstd::vector<Vec3>& samples, const ccstd::vector<Vec3>& values) {
    CC_ASSERT(samples.size() > 0 && samples.size() == values.size());

    // integral using Monte Carlo method
    const auto basisCount = getBasisCount();
    const auto sampleCount = samples.size();
    const auto scale = 1.0F / (LightProbeSampler::uniformSpherePdf() * static_cast<float>(sampleCount));

    ccstd::vector<Vec3> coefficients;
    coefficients.reserve(basisCount);

    for (auto i = 0; i < basisCount; i++) {
        Vec3 coefficient{0.0F, 0.0F, 0.0F};

        for (auto k = 0; k < sampleCount; k++) {
            coefficient += values[k] * evaluateBasis(i, samples[k]);
        }

        coefficient *= scale;
        coefficients.push_back(coefficient);
    }

    return coefficients;
}

ccstd::vector<Vec3> SH::convolveCosine(const ccstd::vector<Vec3>& radianceCoefficients) {
    static const float cosTheta[3] = {0.8862268925F, 1.0233267546F, 0.4954159260F};
    ccstd::vector<Vec3> irradianceCoefficients;

    for (auto l = 0; l <= _lmax; l++) {
        for (auto m = -l; m <= l; m++) {
            auto i = toIndex(l, m);
            Vec3 coefficient = lambda(l) * cosTheta[l] * radianceCoefficients[i];
            irradianceCoefficients.push_back(coefficient);
        }
    }

    return irradianceCoefficients;
}

} // namespace gi
} // namespace cc
