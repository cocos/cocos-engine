
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
    ccstd::vector<Vec3> coefficients;
    Vec3 position;
    Vec3 normal;

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
    : tetrahedron(tet), index(i) {
        if (v0 < v1) {
            vertex0 = v0;
            vertex1 = v1;
        } else {
            vertex0 = v1;
            vertex1 = v0;
        }
    }

    inline void set(int32_t tet, int32_t i, int32_t v0, int32_t v1) {
        tetrahedron = tet;
        index = i;

        if (v0 < v1) {
            vertex0 = v0;
            vertex1 = v1;
        } else {
            vertex0 = v1;
            vertex1 = v0;
        }
    }

    inline bool isSame(const Edge &other) const {
        return (vertex0 == other.vertex0 && vertex1 == other.vertex1);
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
    : tetrahedron(tet), index(i), vertex3(v3) {
        if (v0 < v1 && v0 < v2) {
            vertex0 = v0;
            if (v1 < v2) {
                vertex1 = v1;
                vertex2 = v2;
            } else {
                vertex1 = v2;
                vertex2 = v1;
            }
        } else if (v1 < v0 && v1 < v2) {
            vertex0 = v1;
            if (v0 < v2) {
                vertex1 = v0;
                vertex2 = v2;
            } else {
                vertex1 = v2;
                vertex2 = v0;
            }
        } else {
            vertex0 = v2;
            if (v0 < v1) {
                vertex1 = v0;
                vertex2 = v1;
            } else {
                vertex1 = v1;
                vertex2 = v0;
            }
        }
    }

    inline void set(int32_t tet, int32_t i, int32_t v0, int32_t v1, int32_t v2, int32_t v3) {
        invalid = false;
        isOuterFace = true;

        tetrahedron = tet;
        index = i;
        vertex3 = v3;

        if (v0 < v1 && v0 < v2) {
            vertex0 = v0;
            if (v1 < v2) {
                vertex1 = v1;
                vertex2 = v2;
            } else {
                vertex1 = v2;
                vertex2 = v1;
            }
        } else if (v1 < v0 && v1 < v2) {
            vertex0 = v1;
            if (v0 < v2) {
                vertex1 = v0;
                vertex2 = v2;
            } else {
                vertex1 = v2;
                vertex2 = v0;
            }
        } else {
            vertex0 = v2;
            if (v0 < v1) {
                vertex1 = v0;
                vertex2 = v1;
            } else {
                vertex1 = v1;
                vertex2 = v0;
            }
        }
    }

    inline bool isSame(const Triangle &other) const {
        return (vertex0 == other.vertex0 && vertex1 == other.vertex1 && vertex2 == other.vertex2);
    }
};

struct CircumSphere {
    float radiusSquared{0.0F};
    Vec3 center;

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
    explicit Delaunay(ccstd::vector<Vertex> &probes) : _probes(probes) {}
    ~Delaunay() = default;

    ccstd::vector<Tetrahedron> build();

private:
    void reset();
    void tetrahedralize(); // Bowyer-Watson algorithm
    Vec3 initTetrahedron();
    void addTriangle(uint32_t index, int32_t tet, int32_t i, int32_t v0, int32_t v1, int32_t v2, int32_t v3);
    void addEdge(uint32_t index, int32_t tet, int32_t i, int32_t v0, int32_t v1);
    void addProbe(int32_t vertexIndex);
    void reorder(const Vec3 &center);
    void computeAdjacency();
    void computeMatrices();
    void computeTetrahedronMatrix(Tetrahedron &tetrahedron);
    void computeOuterCellMatrix(Tetrahedron &tetrahedron);

    ccstd::vector<Vertex> &_probes;
    ccstd::vector<Tetrahedron> _tetrahedrons;

    ccstd::vector<Triangle> _triangles;
    ccstd::vector<Edge> _edges;

    CC_DISALLOW_COPY_MOVE_ASSIGN(Delaunay);
    friend class Tetrahedron;
};

} // namespace gi
} // namespace cc
