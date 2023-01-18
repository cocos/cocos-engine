#pragma once
#include "cocos/math/Vec4.h"

namespace cc {
namespace gfx {
class Device;
}
namespace render {

void setupQuadVertexBuffer(gfx::Device& device, const Vec4& viewport, float vbData[16]);

} // namespace render
} // namespace cc
