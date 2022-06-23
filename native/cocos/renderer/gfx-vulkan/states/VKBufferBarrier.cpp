/****************************************************************************
 Copyright (c) 2020-2022 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is h>ereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#include "VKBufferBarrier.h"
#include "../VKGPUObjects.h"
#include "../VKQueue.h"
#include "gfx-base/GFXDef-common.h"
#include "gfx-vulkan/thsvs_simpler_vulkan_synchronization.h"

namespace cc {
namespace gfx {

CCVKBufferBarrier::CCVKBufferBarrier(const BufferBarrierInfo &info) : BufferBarrier(info) {
    _typedID = generateObjectID<decltype(this)>();

    _gpuBarrier = ccnew CCVKGPUBufferBarrier;
    getAccessTypes(info.prevAccesses, _gpuBarrier->prevAccesses);
    getAccessTypes(info.nextAccesses, _gpuBarrier->nextAccesses);

    _gpuBarrier->barrier.prevAccessCount = utils::toUint(_gpuBarrier->prevAccesses.size());
    _gpuBarrier->barrier.pPrevAccesses = _gpuBarrier->prevAccesses.data();
    _gpuBarrier->barrier.nextAccessCount = utils::toUint(_gpuBarrier->nextAccesses.size());
    _gpuBarrier->barrier.pNextAccesses = _gpuBarrier->nextAccesses.data();

    _gpuBarrier->barrier.offset = info.offset;
    _gpuBarrier->barrier.size = info.size;
    _gpuBarrier->barrier.srcQueueFamilyIndex = info.srcQueue
                                                   ? static_cast<CCVKQueue *>(info.srcQueue)->gpuQueue()->queueFamilyIndex
                                                   : VK_QUEUE_FAMILY_IGNORED;
    _gpuBarrier->barrier.dstQueueFamilyIndex = info.dstQueue
                                                   ? static_cast<CCVKQueue *>(info.dstQueue)->gpuQueue()->queueFamilyIndex
                                                   : VK_QUEUE_FAMILY_IGNORED;

    thsvsGetVulkanBufferMemoryBarrier(_gpuBarrier->barrier, &_gpuBarrier->srcStageMask, &_gpuBarrier->dstStageMask, &_gpuBarrier->vkBarrier);
}

CCVKBufferBarrier::~CCVKBufferBarrier() {
    CC_SAFE_DELETE(_gpuBarrier);
}

} // namespace gfx
} // namespace cc
