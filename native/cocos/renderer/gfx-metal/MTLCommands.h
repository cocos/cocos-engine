#pragma once

namespace cc {
namespace gfx {

struct CCMTLDepthBias {
    float depthBias = 0.0f;
    float slopeScale = 0.0f;
    float clamp = 0.0f;
};

struct CCMTLDepthBounds {
    float minBounds = 0.0f;
    float maxBounds = 0.0f;
};

} // namespace gfx
} // namespace cc
