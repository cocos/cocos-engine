
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

#include "Delaunay.h"
#include "math/Mat3.h"
#include "base/Log.h"
#include "core/platform/Debug.h"
#include <algorithm>

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

Tetrahedron::Tetrahedron(const Delaunay *delaunay, int32_t v0, int32_t v1, int32_t v2, int32_t v3/* = -1*/)
: vertex0(v0), vertex1(v1), vertex2(v2), vertex3(v3) {

    // inner tetrahedron
    if (v3 != -1) {
        const auto &probes = delaunay->getProbes();
        const auto &p0 = probes[vertex0].position;
        const auto &p1 = probes[vertex1].position;
        const auto &p2 = probes[vertex2].position;
        const auto &p3 = probes[vertex3].position;
        sphere.init(p0, p1, p2, p3);
    }
}

void Delaunay::build(const ccstd::vector<Vec3> &points) {
    reset();
    
    const auto pointCount = points.size();
    if (pointCount < 4) {
        debug::warnID(17000);
        return ;
    }
    
    _probes.reserve(pointCount);
    for (const auto &point : points) {
        _probes.emplace_back(point);
    }
    
    tetrahedralize();
    computeAdjacency();
    computeMatrices();
}

void Delaunay::reset() {
    _probes.clear();
    _tetrahedrons.clear();
}

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
        [probeCount](Tetrahedron &tetrahedron){
            int32_t vertexIndex = probeCount;
            return (tetrahedron.contain(vertexIndex) ||
                    tetrahedron.contain(vertexIndex + 1) ||
                    tetrahedron.contain(vertexIndex + 2) ||
                    tetrahedron.contain(vertexIndex + 3));
            
        }), _tetrahedrons.end());
    
    // remove all additional points in the super tetrahedron
    _probes.erase(_probes.begin() + probeCount, _probes.end());

    reorder(center);
}

Vec3 Delaunay::initTetrahedron() {
    constexpr float MIN_FLOAT = std::numeric_limits<float>::min();
    constexpr float MAX_FLOAT = std::numeric_limits<float>::max();
    
    Vec3 minPos = {MAX_FLOAT, MAX_FLOAT, MAX_FLOAT};
    Vec3 maxPos = {MIN_FLOAT, MIN_FLOAT, MIN_FLOAT};
    
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
    
    int32_t index = static_cast<int32_t>(_probes.size());
    _probes.emplace_back(p0);
    _probes.emplace_back(p1);
    _probes.emplace_back(p2);
    _probes.emplace_back(p3);
    
    _tetrahedrons.emplace_back(this, index, index + 1, index + 2, index + 3);

    return center;
}

void Delaunay::addProbe(int32_t vertexIndex) {
    ccstd::vector<Triangle> triangles;
    const auto &probe = _probes[vertexIndex];
    
    for (auto i = 0; i < _tetrahedrons.size(); i++) {
        auto &tetrahedron = _tetrahedrons[i];
        if (tetrahedron.isInCircumSphere(probe.position)) {
            tetrahedron.invalid = true;
            
            triangles.push_back(Triangle(i, 0, tetrahedron.vertex1, tetrahedron.vertex3, tetrahedron.vertex2));
            triangles.push_back(Triangle(i, 1, tetrahedron.vertex0, tetrahedron.vertex2, tetrahedron.vertex3));
            triangles.push_back(Triangle(i, 2, tetrahedron.vertex0, tetrahedron.vertex3, tetrahedron.vertex1));
            triangles.push_back(Triangle(i, 3, tetrahedron.vertex0, tetrahedron.vertex1, tetrahedron.vertex2));
        }
    }
    
    for (auto i = 0; i < triangles.size(); i++) {
        for (auto k = i + 1; k < triangles.size(); k++) {
            if (triangles[i].isSame(triangles[k])) {
                triangles[i].invalid = true;
                triangles[k].invalid = true;
            }
        }
    }
    
    // remove all duplicated triangles.
    triangles.erase(std::remove_if(triangles.begin(), triangles.end(),
                                   [](Triangle &triangle){ return triangle.invalid; }), triangles.end());
    // remove containing tetrahedron
    _tetrahedrons.erase(std::remove_if(_tetrahedrons.begin(), _tetrahedrons.end(),
                                       [](Tetrahedron &tetrahedron){ return tetrahedron.invalid; }), _tetrahedrons.end());
    
    for (const auto &triangle : triangles) {
        _tetrahedrons.emplace_back(this, triangle.vertex0, triangle.vertex1, triangle.vertex2, vertexIndex);
    }
}

void Delaunay::reorder(const Vec3 &center) {
    // The tetrahedron in the middle is placed at the front of the vector
    std::sort(_tetrahedrons.begin(), _tetrahedrons.end(), [center](Tetrahedron &a, Tetrahedron &b){
        return a.sphere.center.distanceSquared(center) <= b.sphere.center.distanceSquared(center);
    });
}

void Delaunay::computeAdjacency() {
    ccstd::vector<Triangle> triangles;
    ccstd::vector<Edge> edges;
    Vec3 normal;
    
    const auto tetrahedronCount = _tetrahedrons.size();
    triangles.reserve(tetrahedronCount * 4);
    
    for (auto i = 0; i < _tetrahedrons.size(); i++) {
        const auto &tetrahedron = _tetrahedrons[i];
        
        triangles.push_back(Triangle(i, 0, tetrahedron.vertex1, tetrahedron.vertex3, tetrahedron.vertex2));
        triangles.push_back(Triangle(i, 1, tetrahedron.vertex0, tetrahedron.vertex2, tetrahedron.vertex3));
        triangles.push_back(Triangle(i, 2, tetrahedron.vertex0, tetrahedron.vertex3, tetrahedron.vertex1));
        triangles.push_back(Triangle(i, 3, tetrahedron.vertex0, tetrahedron.vertex1, tetrahedron.vertex2));
    }
    
    for (auto i = 0; i < triangles.size(); i++) {
        for (auto k = i + 1; k < triangles.size(); k++) {
            if (triangles[i].isSame(triangles[k])) {
                // update adjacency between tetrahedrons
                _tetrahedrons[triangles[i].tetrahedron].neighbours[triangles[i].index] = triangles[k].tetrahedron;
                _tetrahedrons[triangles[k].tetrahedron].neighbours[triangles[k].index] = triangles[i].tetrahedron;
                triangles[i].isHullSurface = false;
                triangles[k].isHullSurface = false;
                break;
            }
        }
        
        if (triangles[i].isHullSurface) {
            auto &probe0 = _probes[triangles[i].vertex0];
            auto &probe1 = _probes[triangles[i].vertex1];
            auto &probe2 = _probes[triangles[i].vertex2];
            
            auto edge1 = probe1.position - probe0.position;
            auto edge2 = probe2.position - probe0.position;
            Vec3::cross(edge1, edge2, &normal);

            // accumulate weighted normal
            probe0.normal += normal;
            probe1.normal += normal;
            probe2.normal += normal;
            
            // create an outer cell
            Tetrahedron tetrahedron(this, triangles[i].vertex0, triangles[i].vertex1, triangles[i].vertex2);
            
            // update adjacency between tetrahedron and outer cell
            tetrahedron.neighbours[3] = triangles[i].tetrahedron;
            _tetrahedrons[triangles[i].tetrahedron].neighbours[triangles[i].index] = static_cast<int32_t>(_tetrahedrons.size());
            _tetrahedrons.push_back(tetrahedron);
        }
    }
    
    // start from outer cell index
    for (auto i = tetrahedronCount; i < _tetrahedrons.size(); i++) {
        const auto &tetrahedron = _tetrahedrons[i];
        
        edges.push_back(Edge(i, 0, tetrahedron.vertex1, tetrahedron.vertex2));
        edges.push_back(Edge(i, 1, tetrahedron.vertex2, tetrahedron.vertex0));
        edges.push_back(Edge(i, 2, tetrahedron.vertex0, tetrahedron.vertex1));
    }

    for (auto i = 0; i < edges.size(); i++) {
        for (auto k = i + 1; k < edges.size(); k++) {
            if (edges[i].isSame(edges[k])) {
                // update adjacency between outer cells
                _tetrahedrons[edges[i].tetrahedron].neighbours[edges[i].index] = edges[k].tetrahedron;
                _tetrahedrons[edges[k].tetrahedron].neighbours[edges[k].index] = edges[i].tetrahedron;
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
        if (tetrahedron.vertex3 != -1) {
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
    
    Vec3 A = p[0] - p[2];
    Vec3 Ap = v[0] - v[2];
    Vec3 B = p[1] - p[2];
    Vec3 Bp = v[1] - v[2];
    Vec3 P2 = p[2];
    Vec3 Cp = -v[2];
    
    float m[12];
    
    m[0] = Ap.y * Bp.z - Ap.z * Bp.y;
    m[3] = -Ap.x * Bp.z + Ap.z * Bp.x;
    m[6] = Ap.x * Bp.y - Ap.y * Bp.x;
    m[9] = A.x * Bp.y * Cp.z
            -A.y * Bp.x * Cp.z
            +Ap.x * B.y * Cp.z
            -Ap.y * B.x * Cp.z
            +A.z * Bp.x * Cp.y
            -A.z * Bp.y * Cp.x
            +Ap.z * B.x * Cp.y
            -Ap.z * B.y * Cp.x
            -A.x * Bp.z * Cp.y
            +A.y * Bp.z * Cp.x
            -Ap.x * B.z * Cp.y
            +Ap.y * B.z * Cp.x;
    m[9] -= P2.x * m[0] + P2.y * m[3] + P2.z * m[6];
    
    m[1] = Ap.y * B.z + A.y * Bp.z - Ap.z * B.y - A.z * Bp.y;
    m[4] = -A.x * Bp.z - Ap.x * B.z + A.z * Bp.x + Ap.z * B.x;
    m[7] = A.x * Bp.y - A.y * Bp.x + Ap.x * B.y - Ap.y * B.x;
    m[10] = A.x * B.y * Cp.z
            -A.y * B.x * Cp.z
            -A.x * B.z * Cp.y
            +A.y * B.z * Cp.x
            +A.z * B.x * Cp.y
            -A.z * B.y * Cp.x;
    m[10] -= P2.x * m[1] + P2.y * m[4] + P2.z * m[7];
    
    m[2] = -A.z * B.y + A.y * B.z;
    m[5] = -A.x * B.z + A.z * B.x;
    m[8] = A.x * B.y - A.y * B.x;
    m[11] = 0.0F;
    m[11] -= P2.x * m[2] + P2.y * m[5] + P2.z * m[8];
    
    float a = Ap.x * Bp.y * Cp.z
            -Ap.y * Bp.x * Cp.z
            +Ap.z * Bp.x * Cp.y
            -Ap.z * Bp.y * Cp.x
            +Ap.y * Bp.z * Cp.x
            -Ap.x * Bp.z * Cp.y;
    
    if (std::abs(a) > mathutils::EPSILON) {
        // t^3 + p * t^2 + q * t + r = 0
        for (auto k = 0; k < 12; k++) {
            m[k] /= a;
        }
    } else {
        // set last vertex index of outer cell to -2
        // p * t^2 + q * t + r = 0
        tetrahedron.vertex3 = -2;
    }
    
    // transpose the matrix
    tetrahedron.matrix.set(m[0], m[4], m[8], m[1], m[5], m[9], m[2], m[6], m[10]);
    
    // last column of mat3x4
    tetrahedron.offset.set(m[3], m[7], m[11]);
}

} // namespace gi
} // namespace cc
