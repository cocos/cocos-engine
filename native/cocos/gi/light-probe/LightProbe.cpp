
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

#include "LightProbe.h"
#include "PolynomialSolver.h"
#include "math/Math.h"

namespace cc {
namespace gi {

void LightProbesData::build(const ccstd::vector<Vec3> &points) {
    Delaunay delaunay;
    delaunay.build(points);
    delaunay.getResults(_probes, _tetrahedrons);
}

int32_t LightProbesData::getInterpolationSHCoefficients(const Vec3 &position, int32_t tetIndex, ccstd::vector<Vec3> &coefficients) const {
    Vec4 weights{0.0F, 0.0F, 0.0F, 0.0F};
    tetIndex = getInterpolationWeights(position, tetIndex, weights);

    const auto &tetrahedron = _tetrahedrons[tetIndex];
    const auto &c0 = _probes[tetrahedron.vertex0].coefficients;
    const auto &c1 = _probes[tetrahedron.vertex1].coefficients;
    const auto &c2 = _probes[tetrahedron.vertex2].coefficients;

    if (tetrahedron.vertex3 >= 0) {
        const auto &c3 = _probes[tetrahedron.vertex3].coefficients;

        for (auto i = 0; i < coefficients.size(); i++) {
            coefficients[i] = c0[i] * weights.x + c1[i] * weights.y + c2[i] * weights.z + c3[i] * weights.w;
        }
    } else {
        for (auto i = 0; i < coefficients.size(); i++) {
            coefficients[i] = c0[i] * weights.x + c1[i] * weights.y + c2[i] * weights.z;
        }
    }

    return tetIndex;
}

int32_t LightProbesData::getInterpolationWeights(const Vec3 &position, int32_t tetIndex, Vec4 &weights) const {
    const auto tetrahedronCount = _tetrahedrons.size();
    if (tetIndex < 0 || tetIndex >= tetrahedronCount) {
        tetIndex = 0;
    }

    int32_t lastIndex = -1;
    int32_t nextIndex = -1;

    for (auto i = 0; i < tetrahedronCount; i++) {
        const auto &tetrahedron = _tetrahedrons[tetIndex];
        weights = getBarycentricCoord(position, tetrahedron);
        if (weights.x >= 0.0F && weights.y >= 0.0F && weights.z >= 0.0F && weights.w >= 0.0F) {
            break;
        }

        if (weights.x < weights.y && weights.x < weights.z && weights.x < weights.w) {
            nextIndex = tetrahedron.neighbours[0];
        } else if (weights.y < weights.z && weights.y < weights.w) {
            nextIndex = tetrahedron.neighbours[1];
        } else if (weights.z < weights.w) {
            nextIndex = tetrahedron.neighbours[2];
        } else {
            nextIndex = tetrahedron.neighbours[3];
        }

        // return directly due to numerical precision error
        if (lastIndex == nextIndex) {
            break;
        }

        lastIndex = tetIndex;
        tetIndex = nextIndex;
    }

    return tetIndex;
}

Vec3 LightProbesData::getTriangleBarycentricCoord(const Vec3 &p0, const Vec3 &p1, const Vec3 &p2, const Vec3 &position) {
    const auto v0 = p0 - p2;
    const auto v1 = p1 - p2;
    const auto v = position - p2;

    float invDeterminant = 1.0F / (v0.x * v1.y - v0.y * v1.x);
    float alpha = (v1.y * v.x - v1.x * v.y) * invDeterminant;
    float beta = (v0.x * v.y - v0.y * v.x) * invDeterminant;
    float gamma = 1.0F - alpha - beta;

    return Vec3(alpha, beta, gamma);
}

Vec4 LightProbesData::getBarycentricCoord(const Vec3 &position, const Tetrahedron &tetrahedron) const {
    if (tetrahedron.vertex3 >= 0) {
        return getTetrahedronBarycentricCoord(position, tetrahedron);
    } else {
        return getOuterCellBarycentricCoord(position, tetrahedron);
    }
}

Vec4 LightProbesData::getTetrahedronBarycentricCoord(const Vec3 &position, const Tetrahedron &tetrahedron) const {
    Vec3 result = position - _probes[tetrahedron.vertex3].position;
    result.transformMat3(result, tetrahedron.matrix);

    return Vec4(result.x, result.y, result.z, 1.0F - result.x - result.y - result.z);
}

Vec4 LightProbesData::getOuterCellBarycentricCoord(const Vec3 &position, const Tetrahedron &tetrahedron) const {
    const auto &p0 = _probes[tetrahedron.vertex0].position;
    const auto &p1 = _probes[tetrahedron.vertex1].position;
    const auto &p2 = _probes[tetrahedron.vertex2].position;

    Vec3 normal;
    const auto edge1 = p1 - p0;
    const auto edge2 = p2 - p0;
    Vec3::cross(edge1, edge2, &normal);
    float t = Vec3::dot(position - p0, normal);
    if (t < 0.0F) {
        // test tetrahedron in next iterator
        return Vec4(0.0F, 0.0F, 0.0F, -1.0F);
    }

    Vec3 coefficients;
    coefficients.transformMat3(position, tetrahedron.matrix);
    coefficients += tetrahedron.offset;

    if (tetrahedron.vertex3 == -1) {
        t = PolynomialSolver::getCubicUniqueRoot(coefficients.x, coefficients.y, coefficients.z);
    } else {
        t = PolynomialSolver::getQuadraticUniqueRoot(coefficients.x, coefficients.y, coefficients.z);
    }

    const auto v0 = p0 + _probes[tetrahedron.vertex0].normal * t;
    const auto v1 = p1 + _probes[tetrahedron.vertex1].normal * t;
    const auto v2 = p2 + _probes[tetrahedron.vertex2].normal * t;
    const auto result = getTriangleBarycentricCoord(v0, v1, v2, position);

    return Vec4(result.x, result.y, result.z, 0.0F);
}

void LightProbes::initialize(LightProbeInfo *info) {
    _enabled = info->isEnabled();
    _quality = info->getQuality();
    _reduceRinging = info->getReduceRinging();
    _showProbe = info->isShowProbe();
    _showWireframe = info->isShowWireframe();
    _showConvex = info->isShowConvex();
    _data = info->getData();
}

void LightProbeInfo::activate(LightProbes *resource) {
    _resource = resource;
    _resource->initialize(this);
}

} // namespace gi
} // namespace cc
