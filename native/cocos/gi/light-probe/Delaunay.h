
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
#include "base/Macros.h"
#include "base/std/container/array.h"
#include "base/std/container/vector.h"
#include "core/geometry/AABB.h"
#include "math/Utils.h"
#include "math/Vec3.h"

namespace cc {
namespace gi {

class Delaunay;

struct Vertex {
    Vec3 position;
    Vec3 normal;
    ccstd::vector<Vec3> coefficients;

    Vertex() = default;
    explicit Vertex(const Vec3 &pos)
    : position(pos) {
    }
};

struct Edge {
    int32_t tetrahedron{-1}; // tetrahedron index this edge belongs to
    int32_t index{-1};       // index in triangle's three edges of an outer cell
    int32_t vertex0{-1};
    int32_t vertex1{-1};

    Edge() = default;
    Edge(int32_t tet, int32_t i, int32_t v0, int32_t v1)
    : tetrahedron(tet), index(i), vertex0(v0), vertex1(v1) {
    }

    inline bool isSame(const Edge &other) const {
        return ((vertex0 == other.vertex0 && vertex1 == other.vertex1) ||
                (vertex0 == other.vertex1 && vertex1 == other.vertex0));
    }
};

struct Triangle {
    bool invalid{false};
    bool isOuterFace{true};
    int32_t tetrahedron{-1}; // tetrahedron index this triangle belongs to
    int32_t index{-1};       // index in tetrahedron's four triangles
    int32_t vertex0{-1};
    int32_t vertex1{-1};
    int32_t vertex2{-1};
    int32_t vertex3{-1}; // tetrahedron's last vertex index used to compute normal direction

    Triangle() = default;
    Triangle(int32_t tet, int32_t i, int32_t v0, int32_t v1, int32_t v2, int32_t v3)
    : tetrahedron(tet), index(i), vertex0(v0), vertex1(v1), vertex2(v2), vertex3(v3) {
    }

    inline bool isSame(const Triangle &other) const {
        return ((vertex0 == other.vertex0 && vertex1 == other.vertex1 && vertex2 == other.vertex2) ||
                (vertex0 == other.vertex0 && vertex1 == other.vertex2 && vertex2 == other.vertex1) ||
                (vertex0 == other.vertex1 && vertex1 == other.vertex0 && vertex2 == other.vertex2) ||
                (vertex0 == other.vertex1 && vertex1 == other.vertex2 && vertex2 == other.vertex0) ||
                (vertex0 == other.vertex2 && vertex1 == other.vertex0 && vertex2 == other.vertex1) ||
                (vertex0 == other.vertex2 && vertex1 == other.vertex1 && vertex2 == other.vertex0));
    }
};

struct CircumSphere {
    Vec3 center;
    float radiusSquared{0.0F};

    CircumSphere() = default;
    void init(const Vec3 &p0, const Vec3 &p1, const Vec3 &p2, const Vec3 &p3);
};

/**
 * inner tetrahedron or outer cell structure
 */
struct Tetrahedron {
    bool invalid{false};
    int32_t vertex0{-1};
    int32_t vertex1{-1};
    int32_t vertex2{-1};
    int32_t vertex3{-1}; // -1 means outer cell, otherwise inner tetrahedron
    ccstd::array<int32_t, 4> neighbours{-1, -1, -1, -1};

    Mat3 matrix;
    Vec3 offset;         // only valid in outer cell
    CircumSphere sphere; // only valid in inner tetrahedron

    // inner tetrahedron or outer cell constructor
    Tetrahedron(const Delaunay *delaunay, int32_t v0, int32_t v1, int32_t v2, int32_t v3 = -1);
    Tetrahedron() = default;

    inline bool isInCircumSphere(const Vec3 &point) const {
        return point.distanceSquared(sphere.center) < sphere.radiusSquared - mathutils::EPSILON;
    }

    inline bool contain(int32_t vertexIndex) const {
        return (vertex0 == vertexIndex || vertex1 == vertexIndex ||
                vertex2 == vertexIndex || vertex3 == vertexIndex);
    }

    inline bool isInnerTetrahedron() const {
        return vertex3 >= 0;
    }

    inline bool isOuterCell() const {
        return vertex3 < 0; // -1 or -2
    }
};

class Delaunay {
public:
    Delaunay() = default;
    ~Delaunay() = default;

    inline const ccstd::vector<Vertex> &getProbes() const { return _probes; }
    inline const ccstd::vector<Tetrahedron> &getTetrahedrons() const { return _tetrahedrons; }

    void build(const ccstd::vector<Vec3> &points);

private:
    void reset();
    void tetrahedralize(); // Bowyer-Watson algorithm
    Vec3 initTetrahedron();
    void addProbe(int32_t vertexIndex);
    void reorder(const Vec3 &center);
    void computeAdjacency();
    void computeMatrices();
    void computeTetrahedronMatrix(Tetrahedron &tetrahedron);
    void computeOuterCellMatrix(Tetrahedron &tetrahedron);

    ccstd::vector<Vertex> _probes;
    ccstd::vector<Tetrahedron> _tetrahedrons;

    CC_DISALLOW_COPY_MOVE_ASSIGN(Delaunay);
};

} // namespace gi
} // namespace cc
