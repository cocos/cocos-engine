#include "VKStd.h"

#include "VKGPUObjects.h"
#include "VKQueue.h"
#include "VKTextureBarrier.h"

namespace cc {
namespace gfx {

CCVKTextureBarrier::CCVKTextureBarrier(Device *device)
: TextureBarrier(device) {
}

CCVKTextureBarrier::~CCVKTextureBarrier() {
    CC_SAFE_DELETE(_gpuBarrier);
}

bool CCVKTextureBarrier::initialize(const TextureBarrierInfo &info) {
    _info = info;

    _gpuBarrier = CC_NEW(CCVKGPUTextureBarrier);
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

    _gpuBarrier->barrier.prevLayout = _gpuBarrier->barrier.nextLayout = THSVS_IMAGE_LAYOUT_OPTIMAL;
    _gpuBarrier->barrier.discardContents                              = info.discardContents;
    _gpuBarrier->barrier.subresourceRange.baseMipLevel                = 0u;
    _gpuBarrier->barrier.subresourceRange.levelCount                  = VK_REMAINING_MIP_LEVELS;
    _gpuBarrier->barrier.subresourceRange.baseArrayLayer              = 0u;
    _gpuBarrier->barrier.subresourceRange.layerCount                  = VK_REMAINING_ARRAY_LAYERS;
    _gpuBarrier->barrier.srcQueueFamilyIndex = info.srcQueue
                                                   ? ((CCVKQueue *)info.srcQueue)->gpuQueue()->queueFamilyIndex
                                                   : VK_QUEUE_FAMILY_IGNORED;
    _gpuBarrier->barrier.dstQueueFamilyIndex = info.dstQueue
                                                   ? ((CCVKQueue *)info.dstQueue)->gpuQueue()->queueFamilyIndex
                                                   : VK_QUEUE_FAMILY_IGNORED;

    thsvsGetVulkanImageMemoryBarrier(_gpuBarrier->barrier, &_gpuBarrier->srcStageMask, &_gpuBarrier->dstStageMask, &_gpuBarrier->vkBarrier);

    return true;
}

} // namespace gfx
} // namespace cc
