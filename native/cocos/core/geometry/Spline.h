/****************************************************************************
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.
 
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

#include "base/std/container/vector.h"
#include "core/geometry/Enums.h"
#include "math/Vec3.h"

namespace cc {
namespace geometry {

enum class SplineMode {
    /**
     * Broken line:
     * Each knot is connected with a straight line from the beginning to the end to form a curve. At least two knots.
     */
    LINEAR = 0,

    /**
     * Piecewise Bezier curve:
     * Every four knots form a curve. Total knots number must be a multiple of 4.
     * Each curve passes only the first and fourth knots, and does not pass through the middle two control knots.
     * 
     * If you need a whole continuous curve:
     * (1) Suppose the four knots of the previous curve are A, B, C, D
     * (2) The four knots of the next curve must be D, E, F, G
     * (3) C and E need to be symmetrical about D
     */
    BEZIER = 1,

    /**
     * Catmull Rom curve:
     * All knots(including start & end knots) form a whole continuous curve. At least two knots.
     * The whole curve passes through all knots.
     */
    CATMULL_ROM = 2
};

constexpr uint32_t SPLINE_WHOLE_INDEX = 0xffffffff;

/**
 * @en
 * Basic Geometry: Spline.
 * @zh
 * 基础几何 Spline。
 */

class Spline final : public ShapeBase {
public:
    explicit Spline(SplineMode mode = SplineMode::CATMULL_ROM, ccstd::vector<Vec3> knots = {});

    Spline(const Spline &) = default;
    Spline(Spline &&) = default;
    ~Spline() override = default;
    Spline &operator=(const Spline &) = default;
    Spline &operator=(Spline &&) = default;

    static Spline *create(SplineMode mode, const ccstd::vector<Vec3> &knots = {});
    static Spline *clone(const Spline &s);
    static Spline *copy(Spline *out, const Spline &s);

    inline void setMode(SplineMode mode) { _mode = mode; }
    inline SplineMode getMode() const { return _mode; }
    inline void setKnots(const ccstd::vector<Vec3> &knots) { _knots = knots; }
    inline const ccstd::vector<Vec3> &getKnots() const { return _knots; }
    inline void clearKnots() { _knots.clear(); }
    inline uint32_t getKnotCount() const { return static_cast<uint32_t>(_knots.size()); }
    inline void addKnot(const Vec3 &knot) { _knots.push_back(knot); }
    void setModeAndKnots(SplineMode mode, const ccstd::vector<Vec3> &knots);
    void insertKnot(uint32_t index, const Vec3 &knot);
    void removeKnot(uint32_t index);
    void setKnot(uint32_t index, const Vec3 &knot);
    const Vec3 &getKnot(uint32_t index) const;
    Vec3 &getKnot(uint32_t index);

    // get a point at t with repect to the `index` segment of curve or the whole curve.
    Vec3 getPoint(float t, uint32_t index = SPLINE_WHOLE_INDEX) const;

    // get num points from 0 to 1 uniformly with repect to the `index` segment of curve or the whole curve
    ccstd::vector<Vec3> getPoints(uint32_t num, uint32_t index = SPLINE_WHOLE_INDEX) const;

private:
    uint32_t getSegments() const;
    static Vec3 calcLinear(const Vec3 &v0, const Vec3 &v1, float t);
    static Vec3 calcBezier(const Vec3 &v0, const Vec3 &v1, const Vec3 &v2, const Vec3 &v3, float t);
    static Vec3 calcCatmullRom(const Vec3 &v0, const Vec3 &v1, const Vec3 &v2, const Vec3 &v3, float t);

    SplineMode _mode{SplineMode::CATMULL_ROM};
    ccstd::vector<Vec3> _knots; // control points of the curve.
};

} // namespace geometry
} // namespace cc
