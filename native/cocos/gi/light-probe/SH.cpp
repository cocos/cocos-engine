
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

#include "SH.h"
#include "base/Macros.h"

namespace cc {
namespace gi {

Vec3 LightProbeSampler::uniformSampleSphere(float u1, float u2) {
    float z = 1.0F - 2.0F * u1;
    float r = std::sqrt(std::max(0.0F, 1.0F - z * z));
    float phi = 2.0F * math::PI * u2;

    float x = r * std::cos(phi);
    float y = r * std::sin(phi);

    return Vec3(x, y, z);
}

ccstd::vector<Vec3> LightProbeSampler::uniformSampleSphereAll(uint32_t sampleCount) {
    CC_ASSERT_GT(sampleCount, 0U);

    const auto uCount1 = static_cast<uint32_t>(std::sqrt(sampleCount));
    const auto uCount2 = uCount1;

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

ccstd::vector<SH::BasisFunction> SH::basisFunctions = {
    [](const Vec3& /*v*/) -> float { return 0.282095F; },                         // 0.5F * std::sqrt(math::PI_INV)
    [](const Vec3& v) -> float { return 0.488603F * v.y; },                       // 0.5F * std::sqrt(3.0F * math::PI_INV) * v.y
    [](const Vec3& v) -> float { return 0.488603F * v.z; },                       // 0.5F * std::sqrt(3.0F * math::PI_INV) * v.z
    [](const Vec3& v) -> float { return 0.488603F * v.x; },                       // 0.5F * std::sqrt(3.0F * math::PI_INV) * v.x
    [](const Vec3& v) -> float { return 1.09255F * v.y * v.x; },                  // 0.5F * std::sqrt(15.0F * math::PI_INV) * v.y * v.x
    [](const Vec3& v) -> float { return 1.09255F * v.y * v.z; },                  // 0.5F * std::sqrt(15.0F * math::PI_INV) * v.y * v.z
    [](const Vec3& v) -> float { return 0.946175F * (v.z * v.z - 1.0F / 3.0F); }, // 0.75F * std::sqrt(5.0F * math::PI_INV) * (v.z * v.z - 1.0F / 3.0F)
    [](const Vec3& v) -> float { return 1.09255F * v.z * v.x; },                  // 0.5F * std::sqrt(15.0F * math::PI_INV) * v.z * v.x
    [](const Vec3& v) -> float { return 0.546274F * (v.x * v.x - v.y * v.y); },   // 0.25F * std::sqrt(15.0F * math::PI_INV) * (v.x * v.x - v.y * v.y)
};

ccstd::vector<float> SH::basisOverPI = {
    0.0897936F, // 0.282095 / Math.PI
    0.155527F,  // 0.488603 / Math.PI
    0.155527F,  // 0.488603 / Math.PI
    0.155527F,  // 0.488603 / Math.PI
    0.347769F,  // 1.09255 / Math.PI
    0.347769F,  // 1.09255 / Math.PI
    0.301177F,  // 0.946175 / Math.PI
    0.347769F,  // 1.09255 / Math.PI
    0.173884F,  // 0.546274 / Math.PI
};

void SH::updateUBOData(Float32Array& data, int32_t offset, ccstd::vector<Vec3>& coefficients) {
    // cc_sh_linear_const_r
    data[offset++] = coefficients[3].x * basisOverPI[3];
    data[offset++] = coefficients[1].x * basisOverPI[1];
    data[offset++] = coefficients[2].x * basisOverPI[2];
    data[offset++] = coefficients[0].x * basisOverPI[0] - coefficients[6].x * basisOverPI[6] / 3.0F;

    // cc_sh_linear_const_g
    data[offset++] = coefficients[3].y * basisOverPI[3];
    data[offset++] = coefficients[1].y * basisOverPI[1];
    data[offset++] = coefficients[2].y * basisOverPI[2];
    data[offset++] = coefficients[0].y * basisOverPI[0] - coefficients[6].y * basisOverPI[6] / 3.0F;

    // cc_sh_linear_const_b
    data[offset++] = coefficients[3].z * basisOverPI[3];
    data[offset++] = coefficients[1].z * basisOverPI[1];
    data[offset++] = coefficients[2].z * basisOverPI[2];
    data[offset++] = coefficients[0].z * basisOverPI[0] - coefficients[6].z * basisOverPI[6] / 3.0F;

    // cc_sh_quadratic_r
    data[offset++] = coefficients[4].x * basisOverPI[4];
    data[offset++] = coefficients[5].x * basisOverPI[5];
    data[offset++] = coefficients[6].x * basisOverPI[6];
    data[offset++] = coefficients[7].x * basisOverPI[7];

    // cc_sh_quadratic_g
    data[offset++] = coefficients[4].y * basisOverPI[4];
    data[offset++] = coefficients[5].y * basisOverPI[5];
    data[offset++] = coefficients[6].y * basisOverPI[6];
    data[offset++] = coefficients[7].y * basisOverPI[7];

    // cc_sh_quadratic_b
    data[offset++] = coefficients[4].z * basisOverPI[4];
    data[offset++] = coefficients[5].z * basisOverPI[5];
    data[offset++] = coefficients[6].z * basisOverPI[6];
    data[offset++] = coefficients[7].z * basisOverPI[7];

    // cc_sh_quadratic_a
    data[offset++] = coefficients[8].x * basisOverPI[8];
    data[offset++] = coefficients[8].y * basisOverPI[8];
    data[offset++] = coefficients[8].z * basisOverPI[8];
    data[offset++] = 0.0;
}

Vec3 SH::shaderEvaluate(const Vec3& normal, ccstd::vector<Vec3>& coefficients) {
    const Vec4 linearConstR = {
        coefficients[3].x * basisOverPI[3],
        coefficients[1].x * basisOverPI[1],
        coefficients[2].x * basisOverPI[2],
        coefficients[0].x * basisOverPI[0] - coefficients[6].x * basisOverPI[6] / 3.0F};

    const Vec4 linearConstG = {
        coefficients[3].y * basisOverPI[3],
        coefficients[1].y * basisOverPI[1],
        coefficients[2].y * basisOverPI[2],
        coefficients[0].y * basisOverPI[0] - coefficients[6].y * basisOverPI[6] / 3.0F};

    const Vec4 linearConstB = {
        coefficients[3].z * basisOverPI[3],
        coefficients[1].z * basisOverPI[1],
        coefficients[2].z * basisOverPI[2],
        coefficients[0].z * basisOverPI[0] - coefficients[6].z * basisOverPI[6] / 3.0F};

    const Vec4 quadraticR = {
        coefficients[4].x * basisOverPI[4],
        coefficients[5].x * basisOverPI[5],
        coefficients[6].x * basisOverPI[6],
        coefficients[7].x * basisOverPI[7]};

    const Vec4 quadraticG = {
        coefficients[4].y * basisOverPI[4],
        coefficients[5].y * basisOverPI[5],
        coefficients[6].y * basisOverPI[6],
        coefficients[7].y * basisOverPI[7]};

    const Vec4 quadraticB = {
        coefficients[4].z * basisOverPI[4],
        coefficients[5].z * basisOverPI[5],
        coefficients[6].z * basisOverPI[6],
        coefficients[7].z * basisOverPI[7]};

    const Vec3 quadraticA = {
        coefficients[8].x * basisOverPI[8],
        coefficients[8].y * basisOverPI[8],
        coefficients[8].z * basisOverPI[8]};

    Vec3 result{0.0F, 0.0F, 0.0F};
    Vec4 normal4{normal.x, normal.y, normal.z, 1.0F};

    // calculate linear and const terms
    result.x = linearConstR.dot(normal4);
    result.y = linearConstG.dot(normal4);
    result.z = linearConstB.dot(normal4);

    // calculate quadratic terms
    Vec4 n14{normal.x * normal.y, normal.y * normal.z, normal.z * normal.z, normal.z * normal.x};
    float n5 = normal.x * normal.x - normal.y * normal.y;

    result.x += quadraticR.dot(n14);
    result.y += quadraticG.dot(n14);
    result.z += quadraticB.dot(n14);
    result += quadraticA * n5;

    return result;
}

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
    CC_ASSERT(!samples.empty() && samples.size() == values.size());

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
    static const float COS_THETA[3] = {0.8862268925F, 1.0233267546F, 0.4954159260F};
    ccstd::vector<Vec3> irradianceCoefficients;

    for (auto l = 0; l <= LMAX; l++) {
        for (auto m = -l; m <= l; m++) {
            auto i = toIndex(l, m);
            Vec3 coefficient = lambda(l) * COS_THETA[l] * radianceCoefficients[i];
            irradianceCoefficients.push_back(coefficient);
        }
    }

    return irradianceCoefficients;
}

} // namespace gi
} // namespace cc
