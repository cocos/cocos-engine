#include "GLES3Std.h"
#include "GLES3Fence.h"
#include "GLES3Device.h"
#include "GLES3GPUObjects.h"

namespace cc {
namespace gfx {

GLES3Fence::GLES3Fence(Device *device)
: Fence(device) {
}

GLES3Fence::~GLES3Fence() {
}

bool GLES3Fence::initialize(const FenceInfo &info) {
    _gpuFence = CC_NEW(GLES3GPUFence);
    if (!_gpuFence) {
        CC_LOG_ERROR("GLES2Fence: CC_NEW GLES3GPUFence failed.");
        return false;
    }

    // TODO

    return true;
}

void GLES3Fence::destroy() {
    if (_gpuFence) {
        // TODO

        CC_DELETE(_gpuFence);
        _gpuFence = nullptr;
    }
}

void GLES3Fence::wait() {
    // TODO
}

void GLES3Fence::reset() {
    // TODO
}

} // namespace gfx
} // namespace cc
