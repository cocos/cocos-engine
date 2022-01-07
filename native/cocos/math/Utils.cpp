#include "cocos/math/Utils.h"

#include <algorithm>
#include <cmath>
#include <random>
#include "math/Math.h"

namespace {
std::random_device                    rd;
std::uniform_real_distribution<float> uniformReal{0.0F, 1.0F};
} // namespace

namespace cc {

namespace mathutils {

float random() {
    return uniformReal(rd);
}

Vec3ElementType absMaxComponent(const Vec3 &v) {
    return absMax(absMax(v.x, v.y), v.z);
}

Vec3ElementType maxComponent(const Vec3 &v) {
    return std::max(std::max(v.x, v.y), v.z);
}

} // namespace mathutils

} // namespace cc