
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

#include "Delaunay.h"
#include <algorithm>
#include "base/Log.h"
#include "core/platform/Debug.h"
#include "math/Mat3.h"
#define CC_USE_TETGEN 1
#if CC_USE_TETGEN
    #include "tetgen.h"
#endif

namespace cc {
namespace gi {

void CircumSphere::init(const Vec3 &p0, const Vec3 &p1, const Vec3 &p2, const Vec3 &p3) {
    // calculate circumsphere of 4 points in R^3 space.
    Mat3 mat(p1.x - p0.x, p1.y - p0.y, p1.z - p0.z,
             p2.x - p0.x, p2.y - p0.y, p2.z - p0.z,
             p3.x - p0.x, p3.y - p0.y, p3.z - p0.z);

    mat.inverse();
    mat.transpose();

    Vec3 n(((p1.x + p0.x) * (p1.x - p0.x) + (p1.y + p0.y) * (p1.y - p0.y) + (p1.z + p0.z) * (p1.z - p0.z)) * 0.5F,
           ((p2.x + p0.x) * (p2.x - p0.x) + (p2.y + p0.y) * (p2.y - p0.y) + (p2.z + p0.z) * (p2.z - p0.z)) * 0.5F,
           ((p3.x + p0.x) * (p3.x - p0.x) + (p3.y + p0.y) * (p3.y - p0.y) + (p3.z + p0.z) * (p3.z - p0.z)) * 0.5F);

    center.transformMat3(n, mat);
    radiusSquared = p0.distanceSquared(center);
}

Tetrahedron::Tetrahedron(const Delaunay *delaunay, int32_t v0, int32_t v1, int32_t v2, int32_t v3 /* = -1*/)
: vertex0(v0), vertex1(v1), vertex2(v2), vertex3(v3) {
    // inner tetrahedron
    if (v3 >= 0) {
        const auto &probes = delaunay->_probes;
        const auto &p0 = probes[vertex0].position;
        const auto &p1 = probes[vertex1].position;
        const auto &p2 = probes[vertex2].position;
        const auto &p3 = probes[vertex3].position;
        sphere.init(p0, p1, p2, p3);
    }
}

ccstd::vector<Tetrahedron> Delaunay::build() {
    reset();
    tetrahedralize();
    computeAdjacency();
    computeMatrices();

    return std::move(_tetrahedrons);
}

void Delaunay::reset() {
    _tetrahedrons.clear();
    _triangles.clear();
    _edges.clear();
}

#if CC_USE_TETGEN
void Delaunay::tetrahedralize() {
    tetgenio in;
    tetgenio out;

    in.numberofpoints = static_cast<int32_t>(_probes.size());
    in.pointlist = new REAL[_probes.size() * 3];

    constexpr float minFloat = std::numeric_limits<float>::min();
    constexpr float maxFloat = std::numeric_limits<float>::max();

    Vec3 minPos = {maxFloat, maxFloat, maxFloat};
    Vec3 maxPos = {minFloat, minFloat, minFloat};

    for (auto i = 0; i < _probes.size(); i++) {
        const auto &position = _probes[i].position;

        in.pointlist[i * 3 + 0] = position.x;
        in.pointlist[i * 3 + 1] = position.y;
        in.pointlist[i * 3 + 2] = position.z;

        minPos.x = std::min(minPos.x, position.x);
        maxPos.x = std::max(maxPos.x, position.x);

        minPos.y = std::min(minPos.y, position.y);
        maxPos.y = std::max(maxPos.y, position.y);

        minPos.z = std::min(minPos.z, position.z);
        maxPos.z = std::max(maxPos.z, position.z);
    }

    const Vec3 center = (maxPos + minPos) * 0.5F;

    tetgenbehavior options;
    options.neighout = 0;
    options.quiet = 1;
    ::tetrahedralize(&options, &in, &out);

    for (auto i = 0; i < out.numberoftetrahedra; i++) {
        _tetrahedrons.emplace_back(this, out.tetrahedronlist[i * 4], out.tetrahedronlist[i * 4 + 1], out.tetrahedronlist[i * 4 + 2], out.tetrahedronlist[i * 4 + 3]);
    }

    reorder(center);
}
#else
void Delaunay::tetrahedralize() {
    // get probe count first
    const auto probeCount = _probes.size();

    // init a super tetrahedron containing all probes
    const auto center = initTetrahedron();

    for (auto i = 0; i < probeCount; i++) {
        addProbe(i);
    }

    // remove all tetrahedrons which contain the super tetrahedron's vertices
    _tetrahedrons.erase(std::remove_if(_tetrahedrons.begin(), _tetrahedrons.end(),
                                       [probeCount](Tetrahedron &tetrahedron) {
                                           auto vertexIndex = static_cast<int32_t>(probeCount);
                                           return (tetrahedron.contain(vertexIndex) ||
                                                   tetrahedron.contain(vertexIndex + 1) ||
                                                   tetrahedron.contain(vertexIndex + 2) ||
                                                   tetrahedron.contain(vertexIndex + 3));
                                       }),
                        _tetrahedrons.end());

    // remove all additional points in the super tetrahedron
    _probes.erase(_probes.begin() + probeCount, _probes.end());

    reorder(center);
}
#endif

Vec3 Delaunay::initTetrahedron() {
    constexpr float minFloat = std::numeric_limits<float>::min();
    constexpr float maxFloat = std::numeric_limits<float>::max();

    Vec3 minPos = {maxFloat, maxFloat, maxFloat};
    Vec3 maxPos = {minFloat, minFloat, minFloat};

    for (const auto &probe : _probes) {
        const auto &position = probe.position;
        minPos.x = std::min(minPos.x, position.x);
        maxPos.x = std::max(maxPos.x, position.x);

        minPos.y = std::min(minPos.y, position.y);
        maxPos.y = std::max(maxPos.y, position.y);

        minPos.z = std::min(minPos.z, position.z);
        maxPos.z = std::max(maxPos.z, position.z);
    }

    const Vec3 center = (maxPos + minPos) * 0.5F;
    const Vec3 extent = maxPos - minPos;
    float offset = std::max({extent.x, extent.y, extent.z}) * 10.0F;

    Vec3 p0 = center + Vec3(0.0F, offset, 0.0F);
    Vec3 p1 = center + Vec3(-offset, -offset, -offset);
    Vec3 p2 = center + Vec3(-offset, -offset, offset);
    Vec3 p3 = center + Vec3(offset, -offset, 0.0F);

    auto index = static_cast<int32_t>(_probes.size());
    _probes.emplace_back(p0);
    _probes.emplace_back(p1);
    _probes.emplace_back(p2);
    _probes.emplace_back(p3);

    _tetrahedrons.emplace_back(this, index, index + 1, index + 2, index + 3);

    return center;
}

void Delaunay::addTriangle(uint32_t index, int32_t tet, int32_t i, int32_t v0, int32_t v1, int32_t v2, int32_t v3) {
    if (index < static_cast<uint32_t>(_triangles.size())) {
        _triangles[index].set(tet, i, v0, v1, v2, v3);
    } else {
        _triangles.emplace_back(tet, i, v0, v1, v2, v3);
    }
}

void Delaunay::addEdge(uint32_t index, int32_t tet, int32_t i, int32_t v0, int32_t v1) {
    if (index < static_cast<uint32_t>(_edges.size())) {
        _edges[index].set(tet, i, v0, v1);
    } else {
        _edges.emplace_back(tet, i, v0, v1);
    }
}

void Delaunay::addProbe(int32_t vertexIndex) {
    const auto &probe = _probes[vertexIndex];
    const auto position = probe.position;

    auto triangleIndex = 0;
    for (auto i = 0; i < static_cast<int32_t>(_tetrahedrons.size()); i++) {
        auto &tetrahedron = _tetrahedrons[i];
        if (tetrahedron.isInCircumSphere(position)) {
            tetrahedron.invalid = true;

            addTriangle(triangleIndex, i, 0, tetrahedron.vertex1, tetrahedron.vertex3, tetrahedron.vertex2, tetrahedron.vertex0);
            addTriangle(triangleIndex + 1, i, 1, tetrahedron.vertex0, tetrahedron.vertex2, tetrahedron.vertex3, tetrahedron.vertex1);
            addTriangle(triangleIndex + 2, i, 2, tetrahedron.vertex0, tetrahedron.vertex3, tetrahedron.vertex1, tetrahedron.vertex2);
            addTriangle(triangleIndex + 3, i, 3, tetrahedron.vertex0, tetrahedron.vertex1, tetrahedron.vertex2, tetrahedron.vertex3);
            triangleIndex += 4;
        }
    }

    for (auto i = 0; i < triangleIndex; i++) {
        if (_triangles[i].invalid) {
            continue;
        }

        for (auto k = i + 1; k < triangleIndex; k++) {
            if (_triangles[i].isSame(_triangles[k])) {
                _triangles[i].invalid = true;
                _triangles[k].invalid = true;
                break;
            }
        }
    }

    // remove containing tetrahedron
    _tetrahedrons.erase(std::remove_if(_tetrahedrons.begin(), _tetrahedrons.end(),
                                       [](Tetrahedron &tetrahedron) { return tetrahedron.invalid; }),
                        _tetrahedrons.end());

    for (auto i = 0; i < triangleIndex; i++) {
        const auto &triangle = _triangles[i];
        if (!triangle.invalid) {
            _tetrahedrons.emplace_back(this, triangle.vertex0, triangle.vertex1, triangle.vertex2, vertexIndex);
        }
    }
}

void Delaunay::reorder(const Vec3 &center) {
    // The tetrahedron in the middle is placed at the front of the vector
    std::sort(_tetrahedrons.begin(), _tetrahedrons.end(), [center](Tetrahedron &a, Tetrahedron &b) {
        return a.sphere.center.distanceSquared(center) < b.sphere.center.distanceSquared(center);
    });
}

void Delaunay::computeAdjacency() {
    Vec3 normal;

    const auto tetrahedronCount = static_cast<int32_t>(_tetrahedrons.size());

    auto triangleIndex = 0;
    for (auto i = 0; i < static_cast<int32_t>(_tetrahedrons.size()); i++) {
        const auto &tetrahedron = _tetrahedrons[i];

        addTriangle(triangleIndex, i, 0, tetrahedron.vertex1, tetrahedron.vertex3, tetrahedron.vertex2, tetrahedron.vertex0);
        addTriangle(triangleIndex + 1, i, 1, tetrahedron.vertex0, tetrahedron.vertex2, tetrahedron.vertex3, tetrahedron.vertex1);
        addTriangle(triangleIndex + 2, i, 2, tetrahedron.vertex0, tetrahedron.vertex3, tetrahedron.vertex1, tetrahedron.vertex2);
        addTriangle(triangleIndex + 3, i, 3, tetrahedron.vertex0, tetrahedron.vertex1, tetrahedron.vertex2, tetrahedron.vertex3);
        triangleIndex += 4;
    }

    for (auto i = 0; i < triangleIndex; i++) {
        if (!_triangles[i].isOuterFace) {
            continue;
        }

        for (auto k = i + 1; k < triangleIndex; k++) {
            if (_triangles[i].isSame(_triangles[k])) {
                // update adjacency between tetrahedrons
                _tetrahedrons[_triangles[i].tetrahedron].neighbours[_triangles[i].index] = _triangles[k].tetrahedron;
                _tetrahedrons[_triangles[k].tetrahedron].neighbours[_triangles[k].index] = _triangles[i].tetrahedron;
                _triangles[i].isOuterFace = false;
                _triangles[k].isOuterFace = false;
                break;
            }
        }

        if (_triangles[i].isOuterFace) {
            auto &probe0 = _probes[_triangles[i].vertex0];
            auto &probe1 = _probes[_triangles[i].vertex1];
            auto &probe2 = _probes[_triangles[i].vertex2];
            auto &probe3 = _probes[_triangles[i].vertex3];

            auto edge1 = probe1.position - probe0.position;
            auto edge2 = probe2.position - probe0.position;
            Vec3::cross(edge1, edge2, &normal);

            auto edge3 = probe3.position - probe0.position;
            auto negative = normal.dot(edge3);
            if (negative > 0.0F) {
                normal.negate();
            }

            // accumulate weighted normal
            probe0.normal += normal;
            probe1.normal += normal;
            probe2.normal += normal;

            // create an outer cell with normal facing out
            auto v0 = _triangles[i].vertex0;
            auto v1 = negative > 0.0F ? _triangles[i].vertex2 : _triangles[i].vertex1;
            auto v2 = negative > 0.0F ? _triangles[i].vertex1 : _triangles[i].vertex2;
            Tetrahedron tetrahedron(this, v0, v1, v2);

            // update adjacency between tetrahedron and outer cell
            tetrahedron.neighbours[3] = _triangles[i].tetrahedron;
            _tetrahedrons[_triangles[i].tetrahedron].neighbours[_triangles[i].index] = static_cast<int32_t>(_tetrahedrons.size());
            _tetrahedrons.push_back(tetrahedron);
        }
    }

    // start from outer cell index
    auto edgeIndex = 0;
    for (auto i = tetrahedronCount; i < static_cast<int32_t>(_tetrahedrons.size()); i++) {
        const auto &tetrahedron = _tetrahedrons[i];

        addEdge(edgeIndex, i, 0, tetrahedron.vertex1, tetrahedron.vertex2);
        addEdge(edgeIndex + 1, i, 1, tetrahedron.vertex2, tetrahedron.vertex0);
        addEdge(edgeIndex + 2, i, 2, tetrahedron.vertex0, tetrahedron.vertex1);
        edgeIndex += 3;
    }

    for (auto i = 0; i < edgeIndex; i++) {
        for (auto k = i + 1; k < edgeIndex; k++) {
            if (_edges[i].isSame(_edges[k])) {
                // update adjacency between outer cells
                _tetrahedrons[_edges[i].tetrahedron].neighbours[_edges[i].index] = _edges[k].tetrahedron;
                _tetrahedrons[_edges[k].tetrahedron].neighbours[_edges[k].index] = _edges[i].tetrahedron;
            }
        }
    }

    // normalize all convex hull probes' normal
    for (auto &probe : _probes) {
        if (!probe.normal.isZero()) {
            probe.normal.normalize();
        }
    }
}

void Delaunay::computeMatrices() {
    for (auto &tetrahedron : _tetrahedrons) {
        if (tetrahedron.vertex3 >= 0) {
            computeTetrahedronMatrix(tetrahedron);
        } else {
            computeOuterCellMatrix(tetrahedron);
        }
    }
}

void Delaunay::computeTetrahedronMatrix(Tetrahedron &tetrahedron) {
    const auto &p0 = _probes[tetrahedron.vertex0].position;
    const auto &p1 = _probes[tetrahedron.vertex1].position;
    const auto &p2 = _probes[tetrahedron.vertex2].position;
    const auto &p3 = _probes[tetrahedron.vertex3].position;

    tetrahedron.matrix.set(
        p0.x - p3.x, p1.x - p3.x, p2.x - p3.x,
        p0.y - p3.y, p1.y - p3.y, p2.y - p3.y,
        p0.z - p3.z, p1.z - p3.z, p2.z - p3.z);

    tetrahedron.matrix.inverse();
    tetrahedron.matrix.transpose();
}

void Delaunay::computeOuterCellMatrix(Tetrahedron &tetrahedron) {
    Vec3 v[3];
    Vec3 p[3];

    v[0] = _probes[tetrahedron.vertex0].normal;
    v[1] = _probes[tetrahedron.vertex1].normal;
    v[2] = _probes[tetrahedron.vertex2].normal;

    p[0] = _probes[tetrahedron.vertex0].position;
    p[1] = _probes[tetrahedron.vertex1].position;
    p[2] = _probes[tetrahedron.vertex2].position;

    Vec3 a = p[0] - p[2];
    Vec3 ap = v[0] - v[2];
    Vec3 b = p[1] - p[2];
    Vec3 bp = v[1] - v[2];
    Vec3 p2 = p[2];
    Vec3 cp = -v[2];

    float m[12];

    m[0] = ap.y * bp.z - ap.z * bp.y;
    m[3] = -ap.x * bp.z + ap.z * bp.x;
    m[6] = ap.x * bp.y - ap.y * bp.x;
    m[9] = a.x * bp.y * cp.z - a.y * bp.x * cp.z + ap.x * b.y * cp.z - ap.y * b.x * cp.z + a.z * bp.x * cp.y - a.z * bp.y * cp.x + ap.z * b.x * cp.y - ap.z * b.y * cp.x - a.x * bp.z * cp.y + a.y * bp.z * cp.x - ap.x * b.z * cp.y + ap.y * b.z * cp.x;
    m[9] -= p2.x * m[0] + p2.y * m[3] + p2.z * m[6];

    m[1] = ap.y * b.z + a.y * bp.z - ap.z * b.y - a.z * bp.y;
    m[4] = -a.x * bp.z - ap.x * b.z + a.z * bp.x + ap.z * b.x;
    m[7] = a.x * bp.y - a.y * bp.x + ap.x * b.y - ap.y * b.x;
    m[10] = a.x * b.y * cp.z - a.y * b.x * cp.z - a.x * b.z * cp.y + a.y * b.z * cp.x + a.z * b.x * cp.y - a.z * b.y * cp.x;
    m[10] -= p2.x * m[1] + p2.y * m[4] + p2.z * m[7];

    m[2] = -a.z * b.y + a.y * b.z;
    m[5] = -a.x * b.z + a.z * b.x;
    m[8] = a.x * b.y - a.y * b.x;
    m[11] = 0.0F;
    m[11] -= p2.x * m[2] + p2.y * m[5] + p2.z * m[8];

    // coefficient of t^3
    float c = ap.x * bp.y * cp.z - ap.y * bp.x * cp.z + ap.z * bp.x * cp.y - ap.z * bp.y * cp.x + ap.y * bp.z * cp.x - ap.x * bp.z * cp.y;

    if (std::abs(c) > mathutils::EPSILON) {
        // t^3 + p * t^2 + q * t + r = 0
        for (float &k : m) {
            k /= c;
        }
    } else {
        // set last vertex index of outer cell to -2
        // p * t^2 + q * t + r = 0
        tetrahedron.vertex3 = -2;
    }

    // transpose the matrix
    tetrahedron.matrix.set(m[0], m[1], m[2], m[3], m[4], m[5], m[6], m[7], m[8]);

    // last column of mat3x4
    tetrahedron.offset.set(m[9], m[10], m[11]);
}

} // namespace gi
} // namespace cc
