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

#include "core/geometry/Spline.h"
#include <cmath>
#include "base/Log.h"
#include "base/Macros.h"
#include "base/memory/Memory.h"
#include "math/Utils.h"

namespace cc {
namespace geometry {

Spline::Spline(SplineMode mode /*= SplineMode::CATMULL_ROM*/, ccstd::vector<Vec3> knots /*= {}*/)
: ShapeBase(ShapeEnum::SHAPE_SPLINE), _mode(mode), _knots(std::move(knots)) {
}

Spline *Spline::create(SplineMode mode, const ccstd::vector<Vec3> &knots /*= {}*/) {
    return ccnew Spline(mode, knots);
}

Spline *Spline::clone(const Spline &s) {
    return ccnew Spline(s._mode, s._knots);
}

Spline *Spline::copy(Spline *out, const Spline &s) {
    out->_mode = s._mode;
    out->_knots = s._knots;

    return out;
}

void Spline::setModeAndKnots(SplineMode mode, const ccstd::vector<Vec3> &knots) {
    _mode = mode;
    _knots = knots;
}

void Spline::insertKnot(uint32_t index, const Vec3 &knot) {
    if (index >= static_cast<uint32_t>(_knots.size())) {
        _knots.push_back(knot);
        return;
    }

    _knots.insert(_knots.begin() + index, knot);
}

void Spline::removeKnot(uint32_t index) {
    CC_ASSERT(index < static_cast<uint32_t>(_knots.size()));

    _knots.erase(_knots.begin() + index);
}

void Spline::setKnot(uint32_t index, const Vec3 &knot) {
    CC_ASSERT(index < static_cast<uint32_t>(_knots.size()));

    _knots[index] = knot;
}

const Vec3 &Spline::getKnot(uint32_t index) const {
    CC_ASSERT(index < static_cast<uint32_t>(_knots.size()));

    return _knots[index];
}
Vec3 &Spline::getKnot(uint32_t index) {
    CC_ASSERT(index < static_cast<uint32_t>(_knots.size()));

    return _knots[index];
}

Vec3 Spline::getPoint(float t, uint32_t index /*= SPLINE_WHOLE_INDEX*/) const {
    t = mathutils::clamp(t, 0.0F, 1.0F);

    const auto segments = getSegments();
    if (segments == 0) {
        return Vec3(0.0F, 0.0F, 0.0F);
    }

    if (index == SPLINE_WHOLE_INDEX) {
        const auto deltaT = 1.0F / static_cast<float>(segments);

        index = static_cast<uint32_t>(t / deltaT);
        t = std::fmod(t, deltaT) / deltaT;
    }

    if (index >= segments) {
        return _knots.back();
    }

    switch (_mode) {
        case SplineMode::LINEAR:
            return calcLinear(_knots[index], _knots[index + 1], t);
        case SplineMode::BEZIER:
            return calcBezier(_knots[index * 4], _knots[index * 4 + 1], _knots[index * 4 + 2], _knots[index * 4 + 3], t);
        case SplineMode::CATMULL_ROM: {
            const auto v0 = index > 0 ? _knots[index - 1] : _knots[index];
            const auto v3 = index + 2 < static_cast<uint32_t>(_knots.size()) ? _knots[index + 2] : _knots[index + 1];
            return calcCatmullRom(v0, _knots[index], _knots[index + 1], v3, t);
        }
        default:
            return Vec3(0.0F, 0.0F, 0.0F);
    }
}

ccstd::vector<Vec3> Spline::getPoints(uint32_t num, uint32_t index /*= SPLINE_WHOLE_INDEX*/) const {
    if (num == 0U) {
        return {};
    }

    if (num == 1U) {
        auto point = getPoint(0.0F, index);
        return {point};
    }

    ccstd::vector<Vec3> points;
    const float deltaT = 1.0F / (static_cast<float>(num) - 1.0F);

    for (auto i = 0; i < num; i++) {
        const auto t = static_cast<float>(i) * deltaT;
        const auto point = getPoint(t, index);

        points.push_back(point);
    }

    return points;
}

uint32_t Spline::getSegments() const {
    const auto count = static_cast<uint32_t>(_knots.size());
    switch (_mode) {
        case SplineMode::LINEAR:
        case SplineMode::CATMULL_ROM:
            if (count < 2) {
                CC_LOG_WARNING("Spline error: less than 2 knots.");
                return 0;
            }

            return count - 1;
        case SplineMode::BEZIER:
            if (count < 4 || count % 4 != 0) {
                CC_LOG_WARNING("Spline error: less than 4 knots or not a multiple of 4.");
                return 0;
            }

            return count / 4;
        default:
            CC_ABORT();
            return 0;
    }
}

Vec3 Spline::calcLinear(const Vec3 &v0, const Vec3 &v1, float t) {
    const auto result = v0 * (1.0F - t) + v1 * t;

    return result;
}

Vec3 Spline::calcBezier(const Vec3 &v0, const Vec3 &v1, const Vec3 &v2, const Vec3 &v3, float t) {
    const auto s = 1.0F - t;
    const auto result = v0 * s * s * s +
                        v1 * 3.0F * t * s * s +
                        v2 * 3.0F * t * t * s +
                        v3 * t * t * t;

    return result;
}

Vec3 Spline::calcCatmullRom(const Vec3 &v0, const Vec3 &v1, const Vec3 &v2, const Vec3 &v3, float t) {
    const auto t2 = t * t;
    const auto t3 = t2 * t;
    const auto result = v0 * (-0.5F * t3 + t2 - 0.5F * t) +
                        v1 * (1.5F * t3 - 2.5F * t2 + 1.0F) +
                        v2 * (-1.5F * t3 + 2.0F * t2 + 0.5F * t) +
                        v3 * (0.5F * t3 - 0.5F * t2);

    return result;
}

} // namespace geometry
} // namespace cc
