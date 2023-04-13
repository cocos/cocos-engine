#pragma once
#include "cocos/math/Vec4.h"
#include "cocos/renderer/pipeline/custom/RenderInterfaceFwd.h"

namespace cc {
namespace gfx {
class Device;
}
namespace render {

void setupQuadVertexBuffer(gfx::Device& device, const Vec4& viewport, float vbData[16]);
void updateRasterPassConstants(uint32_t width, uint32_t height, Setter& setter);

} // namespace render
} // namespace cc
