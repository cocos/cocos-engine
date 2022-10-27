/****************************************************************************
Copyright (c) 2019-2022 Xiamen Yaji Software Co., Ltd.

http://www.cocos.com

Permission is hereby granted, free of charge, to any person obtaining a copy
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

#include "gfx-metal/MTLTransientPool.h"
#include "gfx-metal/MTLDevice.h"
#include "gfx-metal/MTLBuffer.h"
#include "gfx-metal/MTLTexture.h"

namespace cc {
namespace gfx {
CCMTLTransientPool::CCMTLTransientPool() {
    _typedID = generateObjectID<decltype(this)>();
}

CCMTLTransientPool::~CCMTLTransientPool() {

}

void CCMTLTransientPool::initAllocator(const TransientPoolInfo &info) {
    AllocatorInfo allocatorInfo = {};
    allocatorInfo.blockSize = info.blockSize;
    _allocator = std::make_unique<Allocator>(allocatorInfo);
    _allocator->setBlockImpl(this);
}

bool CCMTLTransientPool::allocateBlock() {
    auto device = (id<MTLDevice>)CCMTLDevice::getInstance()->getMTLDevice();

    MTLHeapDescriptor* heapDescriptor = [[MTLHeapDescriptor alloc] init];
    heapDescriptor.size = _info.blockSize;
    heapDescriptor.storageMode = MTLStorageModePrivate;  // no CPU and GPU coherency
    heapDescriptor.cpuCacheMode = MTLCPUCacheModeDefaultCache;
    
    if (@available(ios 13, macos 10.15, *)) {
        heapDescriptor.type = MTLHeapTypePlacement;
        heapDescriptor.hazardTrackingMode = MTLHazardTrackingModeTracked;
    }
    
    id<MTLHeap> heap = [device newHeapWithDescriptor:heapDescriptor];
    [heapDescriptor release];

    if (heap == nil) {
        return false;
    }
    _heaps.emplace_back(heap);
    return true;
}

void CCMTLTransientPool::freeBlock(uint32_t index) {
    [_heaps[index] release];
    _heaps[index] = nil;
}

void CCMTLTransientPool::doInit(const TransientPoolInfo &info) {
    initAllocator(info);
}

void CCMTLTransientPool::doInitBuffer(Buffer *buffer) {
    auto *mtlBuffer = static_cast<CCMTLBuffer *>(buffer);

    MTLSizeAndAlign sizeAndAlign = mtlBuffer->getSizeAndAlign();
    Allocator::Handle handle = _allocator->allocate(sizeAndAlign.size, sizeAndAlign.align);
    auto *allocation = _allocator->getAllocation(handle);

    mtlBuffer->initFromHeap(_heaps[allocation->blockIndex], sizeAndAlign.size, allocation->offset);
    mtlBuffer->setAllocation(handle);
}

void CCMTLTransientPool::doResetBuffer(Buffer *buffer) {
    auto *mtlBuffer = static_cast<CCMTLBuffer *>(buffer);
    _allocator->free(mtlBuffer->getAllocation());
    mtlBuffer->setAllocation(Allocator::INVALID_HANDLE);
}

void CCMTLTransientPool::doInitTexture(Texture *texture) {
    auto *mtlTexture = static_cast<CCMTLTexture *>(texture);
    
    MTLSizeAndAlign sizeAndAlign = mtlTexture->getSizeAndAlign();
    Allocator::Handle handle = _allocator->allocate(sizeAndAlign.size, sizeAndAlign.align);
    auto *allocation = _allocator->getAllocation(handle);
    
    mtlTexture->initFromHeap(_heaps[allocation->blockIndex], allocation->offset);
    mtlTexture->setAllocation(handle);
}

void CCMTLTransientPool::doResetTexture(Texture *texture) {
    auto *mtlTexture = static_cast<CCMTLTexture *>(texture);
    _allocator->free(mtlTexture->getAllocation());
    mtlTexture->setAllocation(Allocator::INVALID_HANDLE);
}

} // namespace gfx
} // namespace cc
