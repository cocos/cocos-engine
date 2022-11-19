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

#import "MTLCommandBuffer.h"
#import "MTLDevice.h"
#import "MTLFramebuffer.h"
#import "MTLGPUObjects.h"
#import "MTLQueryPool.h"
#import "MTLSemaphore.h"
#import "MTLSwapchain.h"

namespace cc {
namespace gfx {

CCMTLQueryPool::CCMTLQueryPool() {
    _typedID = generateObjectID<decltype(this)>();
}

CCMTLQueryPool::~CCMTLQueryPool() {
    destroy();
}

void CCMTLQueryPool::doInit(const QueryPoolInfo& info) {
    id<MTLDevice> mtlDevice = id<MTLDevice>(CCMTLDevice::getInstance()->getMTLDevice());
    _gpuQueryPool = ccnew CCMTLGPUQueryPool;
    _gpuQueryPool->type = _type;
    _gpuQueryPool->maxQueryObjects = _maxQueryObjects;
    _gpuQueryPool->forceWait = _forceWait;
    _gpuQueryPool->visibilityResultBuffer = [mtlDevice newBufferWithLength:_maxQueryObjects * sizeof(uint64_t) options:MTLResourceStorageModeShared];
    _gpuQueryPool->semaphore = ccnew CCMTLSemaphore(1);
}

void CCMTLQueryPool::doDestroy() {
    if (_gpuQueryPool) {
        if (_gpuQueryPool->semaphore) {
            _gpuQueryPool->semaphore->syncAll();
            CC_SAFE_DELETE(_gpuQueryPool->semaphore);
        }

        id<MTLBuffer> mtlBuffer = _gpuQueryPool->visibilityResultBuffer;
        _gpuQueryPool->visibilityResultBuffer = nil;

        auto destroyFunc = [mtlBuffer]() {
            if (mtlBuffer) {
                [mtlBuffer release];
            }
        };
        CCMTLGPUGarbageCollectionPool::getInstance()->collect(destroyFunc);

        CC_SAFE_DELETE(_gpuQueryPool);
    }
}

} // namespace gfx
} // namespace cc
