#include "NativeUtils.h"
#include "cocos/renderer/gfx-base/GFXDevice.h"

namespace cc {
namespace render {

void setupQuadVertexBuffer(gfx::Device& device, const Vec4& viewport, float vbData[16]) {
    auto minX = static_cast<float>(viewport.x);
    auto maxX = static_cast<float>(viewport.x + viewport.z);
    auto minY = static_cast<float>(viewport.y);
    auto maxY = static_cast<float>(viewport.y + viewport.w);
    if (device.getCapabilities().screenSpaceSignY > 0) {
        std::swap(minY, maxY);
    }
    int n = 0;
    vbData[n++] = -1.0F;
    vbData[n++] = -1.0F;
    vbData[n++] = minX; // uv
    vbData[n++] = maxY;
    vbData[n++] = 1.0F;
    vbData[n++] = -1.0F;
    vbData[n++] = maxX;
    vbData[n++] = maxY;
    vbData[n++] = -1.0F;
    vbData[n++] = 1.0F;
    vbData[n++] = minX;
    vbData[n++] = minY;
    vbData[n++] = 1.0F;
    vbData[n++] = 1.0F;
    vbData[n++] = maxX;
    vbData[n++] = minY;
}

} // namespace render
} // namespace cc
