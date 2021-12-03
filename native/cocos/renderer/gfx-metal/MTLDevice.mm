/****************************************************************************
 Copyright (c) 2019-2021 Xiamen Yaji Software Co., Ltd.

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

#import "MTLStd.h"

#import "MTLBuffer.h"
#import "MTLCommandBuffer.h"
#import "MTLConfig.h"
#import "MTLDescriptorSet.h"
#import "MTLDescriptorSetLayout.h"
#import "MTLDevice.h"
#import "MTLFramebuffer.h"
#import "MTLGPUObjects.h"
#import "MTLInputAssembler.h"
#import "MTLPipelineLayout.h"
#import "MTLPipelineState.h"
#import "MTLQueryPool.h"
#import "MTLQueue.h"
#import "MTLRenderPass.h"
#import "MTLSampler.h"
#import "MTLSemaphore.h"
#import "MTLShader.h"
#import "MTLSwapchain.h"
#import "MTLTexture.h"
#import "cocos/bindings/event/CustomEventTypes.h"
#import "cocos/bindings/event/EventDispatcher.h"

namespace cc {
namespace gfx {

CCMTLDevice *CCMTLDevice::_instance = nullptr;

CCMTLDevice *CCMTLDevice::getInstance() {
    return CCMTLDevice::_instance;
}

CCMTLDevice::CCMTLDevice() {
    _api        = API::METAL;
    _deviceName = "Metal";

    _caps.supportQuery     = true;
    _caps.clipSpaceMinZ    = 0.0f;
    _caps.screenSpaceSignY = -1.0f;
    _caps.clipSpaceSignY   = 1.0f;

    CCMTLDevice::_instance = this;
}

CCMTLDevice::~CCMTLDevice() {
    CCMTLDevice::_instance = nullptr;
}

bool CCMTLDevice::doInit(const DeviceInfo &info) {
    _gpuDeviceObj      = CC_NEW(CCMTLGPUDeviceObject);
    _inFlightSemaphore = CC_NEW(CCMTLSemaphore(MAX_FRAMES_IN_FLIGHT));
    _currentFrameIndex = 0;

    id<MTLDevice> mtlDevice = MTLCreateSystemDefaultDevice();
    _mtlDevice              = mtlDevice;

    _mtlFeatureSet            = mu::highestSupportedFeatureSet(mtlDevice);
    const auto gpuFamily      = mu::getGPUFamily(MTLFeatureSet(_mtlFeatureSet));
    _indirectDrawSupported    = mu::isIndirectDrawSupported(gpuFamily);
    _caps.maxVertexAttributes = mu::getMaxVertexAttributes(gpuFamily);
    _caps.maxTextureUnits = _caps.maxVertexTextureUnits = mu::getMaxEntriesInTextureArgumentTable(gpuFamily);
    _maxSamplerUnits                                    = mu::getMaxEntriesInSamplerStateArgumentTable(gpuFamily);
    _caps.maxTextureSize                                = mu::getMaxTexture2DWidthHeight(gpuFamily);
    _caps.maxCubeMapTextureSize                         = mu::getMaxCubeMapTextureWidthHeight(gpuFamily);
    _caps.maxColorRenderTargets                         = mu::getMaxColorRenderTarget(gpuFamily);
    _caps.uboOffsetAlignment                            = mu::getMinBufferOffsetAlignment(gpuFamily);
    _caps.maxComputeWorkGroupInvocations                = mu::getMaxThreadsPerGroup(gpuFamily);
    _caps.maxVertexUniformVectors                       = 255; //no explicit limit on vertex stage.
    _maxBufferBindingIndex                              = mu::getMaxEntriesInBufferArgumentTable(gpuFamily);
    _icbSuppored                                        = mu::isIndirectCommandBufferSupported(MTLFeatureSet(_mtlFeatureSet));
    _isSamplerDescriptorCompareFunctionSupported        = mu::isSamplerDescriptorCompareFunctionSupported(gpuFamily);

    for (int i = 0; i < MAX_FRAMES_IN_FLIGHT; ++i) {
        _gpuStagingBufferPools[i] = CC_NEW(CCMTLGPUStagingBufferPool(mtlDevice));
    }

    _features[toNumber(Feature::COLOR_FLOAT)]               = mu::isColorBufferFloatSupported(gpuFamily);
    _features[toNumber(Feature::COLOR_HALF_FLOAT)]          = mu::isColorBufferHalfFloatSupported(gpuFamily);
    _features[toNumber(Feature::TEXTURE_FLOAT_LINEAR)]      = mu::isLinearTextureSupported(gpuFamily);
    _features[toNumber(Feature::TEXTURE_HALF_FLOAT_LINEAR)] = mu::isLinearTextureSupported(gpuFamily);

    String compressedFormats;
    if (mu::isPVRTCSuppported(gpuFamily)) {
        _features[toNumber(Feature::FORMAT_PVRTC)] = true;
        compressedFormats += "pvrtc ";
    }
    if (mu::isEAC_ETCCSuppported(gpuFamily)) {
        _features[toNumber(Feature::FORMAT_ETC2)] = true;
        compressedFormats += "etc2 ";
    }
    if (mu::isASTCSuppported(gpuFamily)) {
        _features[toNumber(Feature::FORMAT_ASTC)] = true;
        compressedFormats += "astc ";
    }
    if (mu::isBCSupported(gpuFamily)) {
        _features[toNumber(Feature::FORMAT_ASTC)] = true;
        compressedFormats += "dxt ";
    }

    _features[toNumber(Feature::TEXTURE_FLOAT)]            = true;
    _features[toNumber(Feature::TEXTURE_HALF_FLOAT)]       = true;
    _features[toNumber(Feature::FORMAT_R11G11B10F)]        = true;
    _features[toNumber(Feature::FORMAT_SRGB)]              = true;
    _features[toNumber(Feature::INSTANCED_ARRAYS)]         = true;
    _features[toNumber(Feature::MULTIPLE_RENDER_TARGETS)]  = true;
    _features[toNumber(Feature::BLEND_MINMAX)]             = true;
    _features[toNumber(Feature::ELEMENT_INDEX_UINT)]       = true;
    _features[toNumber(Feature::COMPUTE_SHADER)]           = true;
    _features[toNumber(Feature::INPUT_ATTACHMENT_BENEFIT)] = true;

    _features[toNumber(Feature::FORMAT_RGB8)] = false;

    QueueInfo queueInfo;
    queueInfo.type = QueueType::GRAPHICS;
    _queue         = createQueue(queueInfo);

    QueryPoolInfo queryPoolInfo{QueryType::OCCLUSION, DEFAULT_MAX_QUERY_OBJECTS, true};
    _queryPool = createQueryPool(queryPoolInfo);

    CommandBufferInfo cmdBuffInfo;
    cmdBuffInfo.type  = CommandBufferType::PRIMARY;
    cmdBuffInfo.queue = _queue;
    _cmdBuff          = createCommandBuffer(cmdBuffInfo);

    //    _memoryAlarmListenerId = EventDispatcher::addCustomEventListener(EVENT_MEMORY_WARNING, std::bind(&CCMTLDevice::onMemoryWarning, this));

    CCMTLGPUGarbageCollectionPool::getInstance()->initialize(std::bind(&CCMTLDevice::currentFrameIndex, this));

    CC_LOG_INFO("Metal Feature Set: %s", mu::featureSetToString(MTLFeatureSet(_mtlFeatureSet)).c_str());

    return true;
}

void CCMTLDevice::doDestroy() {
    //    if (_memoryAlarmListenerId != 0) {
    //        EventDispatcher::removeCustomEventListener(EVENT_MEMORY_WARNING, _memoryAlarmListenerId);
    //        _memoryAlarmListenerId = 0;
    //    }

    CC_DELETE(_gpuDeviceObj);

    if (_autoreleasePool) {
        [(NSAutoreleasePool *)_autoreleasePool drain];
        _autoreleasePool = nullptr;
    }
    
    CC_SAFE_DESTROY(_queryPool)
    CC_SAFE_DESTROY(_queue);
    CC_SAFE_DESTROY(_cmdBuff);

    CCMTLGPUGarbageCollectionPool::getInstance()->flush();

    if (_inFlightSemaphore) {
        // has present ? syncSuccess : no need to wait;
        _inFlightSemaphore->trySyncAll(1000);
    }

    CC_SAFE_DELETE(_inFlightSemaphore);

    for (int i = 0; i < MAX_FRAMES_IN_FLIGHT; ++i) {
        CC_SAFE_DELETE(_gpuStagingBufferPools[i]);
        _gpuStagingBufferPools[i] = nullptr;
    }

    cc::gfx::mu::clearUtilResource();
    
    CC_DESTROY(CCMTLTexture::getDefaultTexture());
    CC_DELETE(CCMTLSampler::getDefaultSampler());

    CCASSERT(!_memoryStatus.bufferSize, "Buffer memory leaked");
    CCASSERT(!_memoryStatus.textureSize, "Texture memory leaked");
}

void CCMTLDevice::acquire(Swapchain *const *swapchains, uint32_t count) {
    _inFlightSemaphore->wait();

    for (CCMTLSwapchain *swapchain : _swapchains) {
        swapchain->acquire();
    }

    if (!_autoreleasePool) {
        _autoreleasePool = [[NSAutoreleasePool alloc] init];
        //        CC_LOG_INFO("POOL: %p ALLOCED", _autoreleasePool);
    }
    // Clear queue stats
    CCMTLQueue *queue                  = static_cast<CCMTLQueue *>(_queue);
    queue->gpuQueueObj()->numDrawCalls = 0;
    queue->gpuQueueObj()->numInstances = 0;
    queue->gpuQueueObj()->numTriangles = 0;
}

void CCMTLDevice::present() {
    CCMTLQueue *queue = (CCMTLQueue *)_queue;
    _numDrawCalls     = queue->gpuQueueObj()->numDrawCalls;
    _numInstances     = queue->gpuQueueObj()->numInstances;
    _numTriangles     = queue->gpuQueueObj()->numTriangles;

    //hold this pointer before update _currentFrameIndex
    _currentBufferPoolId = _currentFrameIndex;
    _currentFrameIndex   = (_currentFrameIndex + 1) % MAX_FRAMES_IN_FLIGHT;

    std::vector<id<CAMetalDrawable>> releaseQ;
    for (auto *swapchain : _swapchains) {
        auto drawable = swapchain->currentDrawable();
        if (drawable) {
            releaseQ.push_back([drawable retain]);
        }
        swapchain->release();
    }

    // present drawable
    {
        id<MTLCommandBuffer> cmdBuffer = [queue->gpuQueueObj()->mtlCommandQueue commandBufferWithUnretainedReferences];
        [cmdBuffer enqueue];

        for (auto drawable : releaseQ) {
            [cmdBuffer presentDrawable:drawable];
            [drawable release];
        }
        [cmdBuffer addCompletedHandler:^(id<MTLCommandBuffer> commandBuffer) {
            onPresentCompleted();
        }];
        [cmdBuffer commit];
    }
    
    if (_autoreleasePool) {
        //        CC_LOG_INFO("POOL: %p RELEASED", _autoreleasePool);
        [(NSAutoreleasePool *)_autoreleasePool drain];
        _autoreleasePool = nullptr;
    }
}

void CCMTLDevice::onPresentCompleted() {
    if (_currentBufferPoolId >= 0 && _currentBufferPoolId < MAX_FRAMES_IN_FLIGHT) {
        CCMTLGPUStagingBufferPool *bufferPool = _gpuStagingBufferPools[_currentBufferPoolId];
        if (bufferPool) {
            bufferPool->reset();
            CCMTLGPUGarbageCollectionPool::getInstance()->clear(_currentBufferPoolId);
        }
    }
    _inFlightSemaphore->signal();
}

Queue *CCMTLDevice::createQueue() {
    return CC_NEW(CCMTLQueue);
}

QueryPool *CCMTLDevice::createQueryPool() {
    return CC_NEW(CCMTLQueryPool);
}

CommandBuffer *CCMTLDevice::createCommandBuffer(const CommandBufferInfo &info, bool /*hasAgent*/) {
    return CC_NEW(CCMTLCommandBuffer);
}

Buffer *CCMTLDevice::createBuffer() {
    return CC_NEW(CCMTLBuffer);
}

Texture *CCMTLDevice::createTexture() {
    return CC_NEW(CCMTLTexture);
}

Shader *CCMTLDevice::createShader() {
    return CC_NEW(CCMTLShader);
}

InputAssembler *CCMTLDevice::createInputAssembler() {
    return CC_NEW(CCMTLInputAssembler);
}

RenderPass *CCMTLDevice::createRenderPass() {
    return CC_NEW(CCMTLRenderPass);
}

Framebuffer *CCMTLDevice::createFramebuffer() {
    return CC_NEW(CCMTLFramebuffer);
}

DescriptorSet *CCMTLDevice::createDescriptorSet() {
    return CC_NEW(CCMTLDescriptorSet);
}

DescriptorSetLayout *CCMTLDevice::createDescriptorSetLayout() {
    return CC_NEW(CCMTLDescriptorSetLayout);
}

PipelineLayout *CCMTLDevice::createPipelineLayout() {
    return CC_NEW(CCMTLPipelineLayout);
}

PipelineState *CCMTLDevice::createPipelineState() {
    return CC_NEW(CCMTLPipelineState);
}

Sampler *CCMTLDevice::createSampler(const SamplerInfo &info) {
    return new CCMTLSampler(info);
}

Swapchain *CCMTLDevice::createSwapchain() {
    return new CCMTLSwapchain();
}

void CCMTLDevice::copyBuffersToTexture(const uint8_t *const *buffers, Texture *texture, const BufferTextureCopy *regions, uint count) {
    // This assumes the default command buffer will get submitted every frame,
    // which is true for now but may change in the future. This approach gives us
    // the wiggle room to leverage immediate update vs. copy-upload strategies without
    // breaking compatibilities. When we reached some conclusion on this subject,
    // getting rid of this interface all together may become a better option.
    static_cast<CCMTLCommandBuffer *>(_cmdBuff)->copyBuffersToTexture(buffers, texture, regions, count);
}

void CCMTLDevice::copyTextureToBuffers(Texture *src, uint8_t *const *buffers, const BufferTextureCopy *region, uint count) {
    static_cast<CCMTLCommandBuffer *>(_cmdBuff)->copyTextureToBuffers(src, buffers, region, count);
}

void CCMTLDevice::getQueryPoolResults(QueryPool *queryPool) {
    auto *             mtlQueryPool = static_cast<CCMTLQueryPool *>(queryPool);
    CCMTLGPUQueryPool *gpuQueryPool = mtlQueryPool->gpuQueryPool();
    auto               queryCount   = static_cast<uint32_t>(mtlQueryPool->_ids.size());
    CCASSERT(queryCount <= mtlQueryPool->getMaxQueryObjects(), "Too many query commands.");

    gpuQueryPool->semaphore->wait();
    uint64_t *results = queryCount > 0U ? static_cast<uint64_t *>(gpuQueryPool->visibilityResultBuffer.contents) : nullptr;

    std::unordered_map<uint32_t, uint64_t> mapResults;
    for (auto queryId = 0U; queryId < queryCount; queryId++) {
        uint32_t id   = mtlQueryPool->_ids[queryId];
        auto     iter = mapResults.find(id);
        if (iter != mapResults.end()) {
            iter->second += results[queryId];
        } else {
            mapResults[id] = results[queryId];
        }
    }

    {
        std::lock_guard<std::mutex> lock(mtlQueryPool->_mutex);
        mtlQueryPool->_results = std::move(mapResults);
    }
}

void CCMTLDevice::onMemoryWarning() {
    for (int i = 0; i < MAX_FRAMES_IN_FLIGHT; ++i) {
        _gpuStagingBufferPools[i]->shrinkSize();
    }
}

} // namespace gfx
} // namespace cc
