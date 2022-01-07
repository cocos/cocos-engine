#include "cocos/core/geometry/Curve.h"
#include <vector>
namespace cc {
namespace geometry {

float OptimizedKey::evaluate(float tt) {
    const t = tt - time;
    return evalOptCurve(t, coefficient);
}

float evalOptCurve(float t, const std::vector<float> &coefs) {
    return (t * (t * (t * coefs[0] + coefs[1]) + coefs[2])) + coefs[3];
}
} // namespace geometry
} // namespace cc