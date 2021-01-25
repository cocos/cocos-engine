#include "VKStd.h"

#include "VKCommands.h"
#include "VKGlobalBarrier.h"

namespace cc {
namespace gfx {

CCVKGlobalBarrier::CCVKGlobalBarrier(Device *device)
: GlobalBarrier(device) {
}

CCVKGlobalBarrier::~CCVKGlobalBarrier() {
    CC_SAFE_DELETE(_gpuBarrier);
}

bool CCVKGlobalBarrier::initialize(const GlobalBarrierInfo &info) {
    _info = info;

    _gpuBarrier = CC_NEW(CCVKGPUGlobalBarrier);
    _gpuBarrier->accessTypes.resize(info.prevAccesses.size() + info.nextAccesses.size());

    uint index = 0u;
    for (AccessType type : info.prevAccesses) {
        _gpuBarrier->accessTypes[index++] = THSVS_ACCESS_TYPES[(uint)type];
    }
    for (AccessType type : info.nextAccesses) {
        _gpuBarrier->accessTypes[index++] = THSVS_ACCESS_TYPES[(uint)type];
    }

    _gpuBarrier->barrier.prevAccessCount = info.prevAccesses.size();
    _gpuBarrier->barrier.pPrevAccesses   = _gpuBarrier->accessTypes.data();
    _gpuBarrier->barrier.nextAccessCount = info.nextAccesses.size();
    _gpuBarrier->barrier.pNextAccesses   = _gpuBarrier->accessTypes.data() + info.prevAccesses.size();

    thsvsGetVulkanMemoryBarrier(_gpuBarrier->barrier, &_gpuBarrier->srcStageMask, &_gpuBarrier->dstStageMask, &_gpuBarrier->vkBarrier);

    return true;
}

} // namespace gfx
} // namespace cc
