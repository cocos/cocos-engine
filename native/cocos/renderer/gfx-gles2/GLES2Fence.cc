#include "GLES2Std.h"
#include "GLES2Fence.h"
#include "GLES2Device.h"
#include "GLES2GPUObjects.h"

namespace cc {

GLES2Fence::GLES2Fence(GFXDevice *device)
: GFXFence(device) {
}

GLES2Fence::~GLES2Fence() {
}

bool GLES2Fence::initialize(const GFXFenceInfo &info) {
    _gpuFence = CC_NEW(GLES2GPUFence);
    if (!_gpuFence) {
        CC_LOG_ERROR("GLES2Fence: CC_NEW GLES2GPUFence failed.");
        return false;
    }

    // TODO

    _status = GFXStatus::SUCCESS;
    return true;
}

void GLES2Fence::destroy() {
    if (_gpuFence) {
        // TODO

        CC_DELETE(_gpuFence);
        _gpuFence = nullptr;
    }
    _status = GFXStatus::UNREADY;
}

void GLES2Fence::wait() {
    // TODO
}

void GLES2Fence::reset() {
    // TODO
}

}
